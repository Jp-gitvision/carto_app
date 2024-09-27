// src/components/RegionMarkers.jsx
import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import RegionMarker from './RegionMarker';

// Composant pour afficher tous les marqueurs des régions
const RegionMarkers = ({ regions, selectedRegion, setSelectedRegion, handleRegionClick }) => {
  const map = useMap();

  // useEffect pour zoomer sur la région sélectionnée
  useEffect(() => {
    if (selectedRegion && regions[selectedRegion]) {
      map.setView([regions[selectedRegion].latitude, regions[selectedRegion].longitude], 10);
    }
  }, [selectedRegion, regions, map]); // Dépend de selectedRegion, regions, et map

  // useEffect pour écouter les événements de zoom et réinitialiser la région sélectionnée si on dézoome trop
  useEffect(() => {
    const handleZoom = () => {
      const currentZoom = map.getZoom();
      if (currentZoom < 10) {
        setSelectedRegion(null);
      }
    };
    map.on('zoomend', handleZoom);
    return () => {
      map.off('zoomend', handleZoom);
    };
  }, [map, setSelectedRegion]); // Dépend de map et setSelectedRegion

  return (
    <>
      {Object.keys(regions).map((regionName) => (
        <RegionMarker
          key={regionName}
          region={{ ...regions[regionName], name: regionName }}
          data={regions[regionName]}
          onClick={() => handleRegionClick(regionName)}
        />
      ))}
    </>
  );
};

export default RegionMarkers;
