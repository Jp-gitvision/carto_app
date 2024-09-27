const mongoose = require("mongoose");

const MONGODB_URL = "mongodb+srv://CDA:VC2JJBQSvRLVI6PN@cluster0.tbauvrw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

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
