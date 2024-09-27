import React from 'react';
import Map from '../components/Map'; // Ajustez le chemin relatif selon le besoin

const Home = () => {
    const center = [46.2276, 2.2137]; // Coordonnées pour centrer la carte sur la France
    const zoom = 6; // Niveau de zoom ajusté pour voir toute la France

    return (
        <div className="home">
            <Map center={center} zoom={zoom} />
            {/* Autres composants si nécessaire */}
        </div>
    );
};

export default Home;
