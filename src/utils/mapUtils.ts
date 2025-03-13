
// Calculate distance between two coordinates using Haversine formula
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance; // Distance in meters
};

// Check if a user is within the specified radius
export const isWithinRadius = (
  userLat: number,
  userLon: number,
  targetLat: number,
  targetLon: number,
  radiusInMeters: number
): boolean => {
  const distance = calculateDistance(userLat, userLon, targetLat, targetLon);
  return distance <= radiusInMeters;
};

// Generate a random location within a specific radius for testing
export const generateRandomNearbyLocation = (
  centerLat: number,
  centerLon: number,
  radiusInMeters: number
): { latitude: number; longitude: number } => {
  // Earth's radius in meters
  const earthRadius = 6371e3;
  
  // Random distance within the radius
  const randomDistance = Math.random() * radiusInMeters;
  
  // Random angle
  const randomAngle = Math.random() * 2 * Math.PI;
  
  // Calculate offset
  const latOffset = (randomDistance * Math.cos(randomAngle)) / earthRadius;
  const lonOffset = (randomDistance * Math.sin(randomAngle)) / (earthRadius * Math.cos((centerLat * Math.PI) / 180));
  
  // Convert to degrees
  const newLat = centerLat + (latOffset * 180) / Math.PI;
  const newLon = centerLon + (lonOffset * 180) / Math.PI;
  
  return { latitude: newLat, longitude: newLon };
};
