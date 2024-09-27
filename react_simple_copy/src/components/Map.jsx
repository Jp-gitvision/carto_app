import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { API } from '../services/API';

const Map = ({ center, zoom, onRegionClick, onCityClick }) => {
    const customerIcon = new Icon({
        iconUrl: '/img/gps.png',
        iconSize: [28, 28],
    });
    const [regions, setRegions] = useState([]);
    const [geojsonData, setGeojsonData] = useState(null);
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [villes, setVilles] = useState([]);

    useEffect(() => {
        const getdataregion = async () => {
            try {
                const response = await API.get("/api/personnes-agees-par-regions", {
                    withCredentials: true,
                });
                const responseData = await response.data;
                setRegions(responseData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        getdataregion();
    }, []);

    useEffect(() => {
        fetch("/departements.geojson")
            .then(response => response.json())
            .then(data => setGeojsonData(data))
            .catch(error => console.error('Erreur lors de la récupération du fichier GeoJSON:', error));
    }, []);

    const handleRegionClick = async (regionName) => {
        try {
            setSelectedRegion(regionName);
            const response = await API.get(`/api/villes-par-regions/${regionName}`, {
                withCredentials: true,
            });
            const responseData = await response.data;
            setVilles(responseData);
            onRegionClick(regionName);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleCityClick = async (cityName) => {
        try {
            const response = await API.get(`/api/age-distribution-ville-radius/${cityName}`, {
                withCredentials: true,
            });
            const responseData = await response.data;
            onCityClick(responseData); // Pass data to parent component
        } catch (error) {
            console.error('Error fetching city data:', error);
        }
    };

    return (
        <div style={{ height: '100vh', width: '100%' }}>
            <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {geojsonData && (
                    <GeoJSON
                        data={geojsonData}
                        style={() => ({
                            color: 'white',
                            weight: 2,
                            opacity: 1,
                            dashArray: '3',
                            fillOpacity: 0.7,
                            fillColor: '#1396D9'
                        })}
                        onEachFeature={(feature, layer) => {
                            layer.on({
                                mouseover: (e) => {
                                    const layer = e.target;
                                    layer.setStyle({
                                        dashArray: "",
                                        fillColor: "#BD0026",
                                        fillOpacity: 0.7,
                                        weight: 2,
                                        opacity: 1,
                                        color: "white",
                                    });
                                },
                                mouseout: (e) => {
                                    const layer = e.target;
                                    layer.setStyle({
                                        fillOpacity: 0.7,
                                        opacity: 1,
                                        weight: 2,
                                        dashArray: "3",
                                        color: 'white',
                                        fillColor: '#1396D9'
                                    });
                                },
                                click: () => {
                                    handleRegionClick(feature.properties.name);
                                }
                            });
                        }}
                    />
                )}

                <MarkerClusterGroup>
                    {selectedRegion && villes.length > 0 ? (
                        villes.map(ville => (
                            <Marker icon={customerIcon} key={ville.nom} position={[ville.latitude, ville.longitude]}>
                                <Popup>
                                    {ville.nom} <br />
                                    F65-79ans : {ville.femmes_65_79} <br />
                                    F+80ans : {ville.femmes_80_plus} <br />
                                    H65-79ans : {ville.hommes_65_79} <br />
                                    H+80ans: {ville.hommes_80_plus} <br />
                                    <button onClick={() => handleCityClick(ville.nom)}>Calculer les prospects dans un rayon de 50km</button>
                                </Popup>
                            </Marker>
                        ))
                    ) : (
                        Object.keys(regions).map(region => (
                            <Marker 
                                icon={customerIcon}
                                key={region}
                                position={[regions[region].latitude, regions[region].longitude]}
                                eventHandlers={{
                                    click: () => {
                                        handleRegionClick(region);
                                    },
                                }}
                            >
                                <Popup>
                                    Région : {region} <br />
                                    F65-79ans : {regions[region].femmes_65_79} <br />
                                    F+80ans : {regions[region].femmes_80_plus} <br />
                                    H65-79ans : {regions[region].hommes_65_79} <br />
                                    H+80ans: {regions[region].hommes_80_plus} <br />
                                </Popup>
                            </Marker>
                        ))
                    )}
                </MarkerClusterGroup>
            </MapContainer>
        </div>
    );
};

export default Map;
