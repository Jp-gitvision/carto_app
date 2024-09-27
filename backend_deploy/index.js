const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const bcrypt = require('bcrypt');
const fs = require('fs');
const csv = require('csv-parser');
const User = require('./schema/User');
const passportSetup = require("./passport");
const authRoute = require("./routes/auth");
const pool = require('./db');
const app = express();

const port = process.env.PORT || 4000; // Default to 4000 if PORT is not set

const MONGODB_URL = "mongodb+srv://CDA:VC2JJBQSvRLVI6PN@cluster0.tbauvrw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

// Ajout d'une route de test pour vérifier le bon fonctionnement du serveur
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(express.json());
app.use(session({
  secret: 'lama',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: ["http://localhost:3000",
      "http://15.237.160.124:3000"
    ],
    methods: "GET,POST,PUT",
    credentials: true,
  })
);

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  writeConcern: {
    w: "majority",
    wtimeout: 5000
  }
};

mongoose.connect(MONGODB_URL, options)
  .then(() => console.log("DB connected"))
  .catch((err) => {
    console.log(err);
  });

app.use("/auth", authRoute);

app.post('/inscription', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).send('All fields are required');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.status(201).send('User created successfully');
  } catch (error) {
    res.status(500).send('Error creating user');
  }
});

app.post('/login-simple', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('All fields are required');
  }

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).send('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).send('Invalid credentials');
    }

    req.login(user, (err) => {
      if (err) {
        return res.status(500).send('Error logging in');
      }
      return res.send('Connexion réussie!');
    });
  } catch (error) {
    return res.status(500).send('Server error');
  }
});

app.get('/api/personnes-agees-par-regions', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM `database-personne-age`');
    const regions = {};

    rows.forEach((data) => {
      const region = data.NREG;
      if (!regions[region]) {
        regions[region] = {
          femmes_65_79: 0,
          femmes_80_plus: 0,
          hommes_65_79: 0,
          hommes_80_plus: 0,
          latitudeSum: 0,
          longitudeSum: 0,
          count: 0,
        };
      }
      regions[region].femmes_65_79 += parseInt(data['F65-79'], 10);
      regions[region].femmes_80_plus += parseInt(data['F80+'], 10);
      regions[region].hommes_65_79 += parseInt(data['H65-79'], 10);
      regions[region].hommes_80_plus += parseInt(data['H80+'], 10);
      regions[region].latitudeSum += parseFloat(data.latitude);
      regions[region].longitudeSum += parseFloat(data.longitude);
      regions[region].count += 1;
    });

    const regionsData = {};
    for (const region in regions) {
      if (regions.hasOwnProperty(region)) {
        const regionData = regions[region];
        regionsData[region] = {
          femmes_65_79: regionData.femmes_65_79,
          femmes_80_plus: regionData.femmes_80_plus,
          hommes_65_79: regionData.hommes_65_79,
          hommes_80_plus: regionData.hommes_80_plus,
          latitude: regionData.latitudeSum / regionData.count,
          longitude: regionData.longitudeSum / regionData.count
        };
      }
    }

    res.json(regionsData);
  } catch (err) {
    console.error('Error occurred:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

app.get('/api/villes-par-regions/:nomRegion', async (req, res) => {
  const nomRegion = req.params.nomRegion;

  try {
    const [rows] = await pool.query(
      'SELECT `NCOM` as nom, `F65-79` as femmes_65_79, `F80+` as femmes_80_plus, `H65-79` as hommes_65_79, `H80+` as hommes_80_plus, `latitude`, `longitude` FROM `database-personne-age` WHERE `NREG` = ?',
      [nomRegion]
    );

    const villes = rows.map(data => ({
      nom: data.nom,
      femmes_65_79: data.femmes_65_79,
      femmes_80_plus: data.femmes_80_plus,
      hommes_65_79: data.hommes_65_79,
      hommes_80_plus: data.hommes_80_plus,
      latitude: parseFloat(data.latitude),
      longitude: parseFloat(data.longitude)
    }));

    res.json(villes);
  } catch (err) {
    console.error('Error occurred:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

app.get('/api/regions-coordinates', (req, res) => {
  const results = {};

  fs.createReadStream('/Users/jujupeneau/Desktop/Wildcodeschool_Data_engineer/projet/Lama_dev_login/my-react-passport-app/public/data/age_insee_with_coordinates_cleaned.csv')
    .pipe(csv())
    .on('data', (data) => {
      const region = data.NREG;
      if (!results[region]) {
        results[region] = [];
      }
      results[region].push([parseFloat(data.latitude), parseFloat(data.longitude)]);
    })
    .on('end', () => {
      res.json(results);
    });
});

app.get('/api/age-distribution', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM `database-personne-age`');
    let femmes_65_79 = 0;
    let femmes_80_plus = 0;
    let hommes_65_79 = 0;
    let hommes_80_plus = 0;

    rows.forEach((data) => {
      femmes_65_79 += parseInt(data['F65-79'], 10);
      femmes_80_plus += parseInt(data['F80+'], 10);
      hommes_65_79 += parseInt(data['H65-79'], 10);
      hommes_80_plus += parseInt(data['H80+'], 10);
    });

    const ageDistribution = {
      femmes_65_79,
      femmes_80_plus,
      hommes_65_79,
      hommes_80_plus
    };

    res.json(ageDistribution);
  } catch (err) {
    console.error('Error occurred:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

app.get('/api/age-distribution/:region', async (req, res) => {
  const { region } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM `database-personne-age` WHERE NREG = ?', [region]);
    let femmes_65_79 = 0;
    let femmes_80_plus = 0;
    let hommes_65_79 = 0;
    let hommes_80_plus = 0;

    rows.forEach((data) => {
      femmes_65_79 += parseInt(data['F65-79'], 10);
      femmes_80_plus += parseInt(data['F80+'], 10);
      hommes_65_79 += parseInt(data['H65-79'], 10);
      hommes_80_plus += parseInt(data['H80+'], 10);
    });

    const ageDistribution = {
      femmes_65_79,
      femmes_80_plus,
      hommes_65_79,
      hommes_80_plus
    };

    res.json(ageDistribution);
  } catch (err) {
    console.error('Error occurred:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

app.get('/api/age-distribution-ville/:ville', async (req, res) => {
  const { ville } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM `database-personne-age` WHERE NCOM = ?', [ville]);
    let femmes_65_79 = 0;
    let femmes_80_plus = 0;
    let hommes_65_79 = 0;
    let hommes_80_plus = 0;

    rows.forEach((data) => {
      femmes_65_79 += parseInt(data['F65-79'], 10);
      femmes_80_plus += parseInt(data['F80+'], 10);
      hommes_65_79 += parseInt(data['H65-79'], 10);
      hommes_80_plus += parseInt(data['H80+'], 10);
    });

    const ageDistribution = {
      femmes_65_79,
      femmes_80_plus,
      hommes_65_79,
      hommes_80_plus
    };

    res.json(ageDistribution);
  } catch (err) {
    console.error('Error occurred:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

const haversine = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon1 - lon2);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

app.get('/api/age-distribution-ville-radius/:ville', async (req, res) => {
  const { ville } = req.params;

  try {
    console.log(`Fetching data for city: ${ville}`);
    const [clickedCityRows] = await pool.query('SELECT * FROM `database-personne-age` WHERE NCOM = ?', [ville]);

    if (clickedCityRows.length === 0) {
      console.log('City not found');
      return res.status(404).json({ error: 'City not found' });
    }

    const clickedCity = clickedCityRows[0];
    const clickedCityLat = parseFloat(clickedCity.latitude);
    const clickedCityLon = parseFloat(clickedCity.longitude);

    console.log(`City coordinates: ${clickedCityLat}, ${clickedCityLon}`);

    const [allCitiesRows] = await pool.query('SELECT * FROM `database-personne-age`');

    let femmes_65_79 = 0;
    let femmes_80_plus = 0;
    let hommes_65_79 = 0;
    let hommes_80_plus = 0;

    allCitiesRows.forEach((city) => {
      const cityLat = parseFloat(city.latitude);
      const cityLon = parseFloat(city.longitude);

      const distance = haversine(clickedCityLat, clickedCityLon, cityLat, cityLon);

      if (distance <= 50) {
        femmes_65_79 += parseInt(city['F65-79'], 10);
        femmes_80_plus += parseInt(city['F80+'], 10);
        hommes_65_79 += parseInt(city['H65-79'], 10);
        hommes_80_plus += parseInt(city['H80+'], 10);
      }
    });

    const ageDistribution = {
      femmes_65_79,
      femmes_80_plus,
      hommes_65_79,
      hommes_80_plus
    };

    console.log(`Data for city ${ville}:`, ageDistribution);
    res.json(ageDistribution);
  } catch (err) {
    console.error('Error occurred:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}!`);
});
