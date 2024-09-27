// Fonction Haversine pour calculer la distance entre deux points géographiques
function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371; // Rayon de la Terre en kilomètres
    const dLat = (lat2 - lat1) * (Math.PI / 180); // Conversion de la différence de latitude en radians
    const dLon = (lon2 - lon1) * (Math.PI / 180); // Conversion de la différence de longitude en radians
    
    // Formule de Haversine pour calculer la distance entre deux points sur une sphère
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) + // Calcul de la première partie de la formule
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * // Calcul de la deuxième partie
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); // Calcul de l'angle en radians
    return R * c; // Calcul et retour de la distance en kilomètres
  }
