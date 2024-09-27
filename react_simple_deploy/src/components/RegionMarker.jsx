import React, { useState } from 'react';
import { Marker, Tooltip } from 'react-leaflet';
import { Icon } from 'leaflet';


// Composant pour afficher un marqueur de région
const RegionMarker = ({ region, data, onClick }) => {

    // Définir l'icône du marqueur
  const customerIcon = new Icon({
    iconUrl: '/img/gps.png',
    iconSize: [28, 28],
  });

  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseOver = () => {
    setShowTooltip(true);
  };

  const handleMouseOut = () => {
    setShowTooltip(false);
  };

  return (
    <Marker
      position={[region.latitude, region.longitude]}
      icon={customerIcon}
      eventHandlers={{
        click: onClick,
        mouseover: handleMouseOver,
        mouseout: handleMouseOut
      }}
    >
      {showTooltip && (
        <Tooltip direction="top" offset={[0, -30]} opacity={1}>
          <div>
            {region.name} <br />
            F65-79: {data.femmes_65_79} <br />
            F80+: {data.femmes_80_plus} <br />
            H65-79: {data.hommes_65_79} <br />
            H80+: {data.hommes_80_plus}
          </div>
        </Tooltip>
      )}
    </Marker>
  );
};

export default RegionMarker;
