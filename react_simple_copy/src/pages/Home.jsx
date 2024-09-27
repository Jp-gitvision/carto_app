import React, { useState, useEffect } from 'react';
import Map from '../components/Map'; // Ajustez le chemin relatif selon le besoin
import { ResponsiveContainer, BarChart, Bar, Tooltip, YAxis, XAxis, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';

const COLORS = ['#12274B', '#005a8e', '#2A7ABF', '#4C97D2'];

const Home = () => {
    const [data, setData] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [selectedCityData, setSelectedCityData] = useState(null);
    const [chartTitle, setChartTitle] = useState('en France');
    const center = [46.2276, 2.2137]; // Coordonnées pour centrer la carte sur la France
    const zoom = 6; // Niveau de zoom ajusté pour voir toute la France

    const fetchData = async (url, title) => {
        try {
            const response = await axios.get(url);
            const ageDistribution = response.data;

            const totalPopulation = ageDistribution.femmes_65_79 + ageDistribution.femmes_80_plus + ageDistribution.hommes_65_79 + ageDistribution.hommes_80_plus;

            const chartData = [
                { name: "F(65-79)", total: ageDistribution.femmes_65_79, percentage: (ageDistribution.femmes_65_79 / totalPopulation) * 100 },
                { name: "F(80+)", total: ageDistribution.femmes_80_plus, percentage: (ageDistribution.femmes_80_plus / totalPopulation) * 100 },
                { name: "H(65-79)", total: ageDistribution.hommes_65_79, percentage: (ageDistribution.hommes_65_79 / totalPopulation) * 100 },
                { name: "H(80+)", total: ageDistribution.hommes_80_plus, percentage: (ageDistribution.hommes_80_plus / totalPopulation) * 100 }
            ];

            setData(chartData);
            setChartTitle(title);
        } catch (error) {
            console.error('Error fetching data:', error);
            setData([]);
        }
    };

    useEffect(() => {
        fetchData('http://localhost:4000/api/age-distribution', 'en France'); // Charger les données de toute la France au montage
        // fetchData('http://13.39.109.183:4000/api/age-distribution', 'en France');
    }, []);

    const handleRegionClick = (region) => {
        setSelectedRegion(region);
        setSelectedCityData(null); // Reset city selection
        fetchData(`http://localhost:4000/api/age-distribution/${region}`, `en ${region}`);
        // fetchData(`http://13.39.109.183:4000/api/age-distribution/${region}`, `en ${region}`);
    };

    const handleCityClick = (cityData) => {
        setSelectedCityData(cityData);
        const totalPopulation = cityData.femmes_65_79 + cityData.femmes_80_plus + cityData.hommes_65_79 + cityData.hommes_80_plus;

        const chartData = [
            { name: "F(65-79)", total: cityData.femmes_65_79, percentage: (cityData.femmes_65_79 / totalPopulation) * 100 },
            { name: "F(80+)", total: cityData.femmes_80_plus, percentage: (cityData.femmes_80_plus / totalPopulation) * 100 },
            { name: "H(65-79)", total: cityData.hommes_65_79, percentage: (cityData.hommes_65_79 / totalPopulation) * 100 },
            { name: "H(80+)", total: cityData.hommes_80_plus, percentage: (cityData.hommes_80_plus / totalPopulation) * 100 }
        ];

        setData(chartData);
        setChartTitle('dans le rayon de 50km');
    };

    return (
        <div className="home">
            <div className="home-content">
                <Map center={center} zoom={zoom} onRegionClick={handleRegionClick} onCityClick={handleCityClick} />
                <div className="charts">
                    <div className="chart-container">
                        <h2>
                            Nombre homme et femme par tranche d'âge {chartTitle}
                        </h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <XAxis dataKey="name" />
                                <YAxis tickFormatter={(value) => new Intl.NumberFormat('fr').format(value)} />
                                <Tooltip />
                                <Bar dataKey="total" fill="#005a8e" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="chart-container">
                        <h2>
                            Répartition en % homme et femme par tranche d'âge {chartTitle}
                        </h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={data}
                                    dataKey="percentage"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={110}
                                    fill="#8884d8"
                                    label={({ name, percentage }) => `${name}: ${percentage.toFixed(2)}%`}
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
