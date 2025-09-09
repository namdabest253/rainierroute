const axios = require('axios');

// King County Metro GTFS Real-time feed URLs
const GTFS_REALTIME_URLS = {
  vehiclePositions: 'https://s3.amazonaws.com/kcm-alerts-realtime-prod/vehiclepositions.pb',
  tripUpdates: 'https://s3.amazonaws.com/kcm-alerts-realtime-prod/tripupdates.pb',
  alerts: 'https://s3.amazonaws.com/kcm-alerts-realtime-prod/alerts.pb'
};

/**
 * Find nearby transit stations within the Seattle metro area
 */
const findNearbyStations = async (startCoords, endCoords) => {
  try {
    // For MVP, we'll use a simplified approach with known major transit hubs
    // In production, this would integrate with GTFS static data
    const majorTransitHubs = [
      {
        name: 'University of Washington Station',
        location: { lat: 47.6496, lng: -122.3039 },
        lines: ['Link Light Rail'],
        type: 'light_rail'
      },
      {
        name: 'Capitol Hill Station',
        location: { lat: 47.6192, lng: -122.3201 },
        lines: ['Link Light Rail'],
        type: 'light_rail'
      },
      {
        name: 'Westlake Station',
        location: { lat: 47.6113, lng: -122.3370 },
        lines: ['Link Light Rail'],
        type: 'light_rail'
      },
      {
        name: 'Pioneer Square Station',
        location: { lat: 47.6021, lng: -122.3317 },
        lines: ['Link Light Rail'],
        type: 'light_rail'
      },
      {
        name: 'International District/Chinatown Station',
        location: { lat: 47.5988, lng: -122.3281 },
        lines: ['Link Light Rail'],
        type: 'light_rail'
      },
      {
        name: 'SODO Station',
        location: { lat: 47.5791, lng: -122.3274 },
        lines: ['Link Light Rail'],
        type: 'light_rail'
      },
      {
        name: 'SeaTac/Airport Station',
        location: { lat: 47.4445, lng: -122.2979 },
        lines: ['Link Light Rail'],
        type: 'light_rail'
      }
    ];

    // Calculate distance from start and end points to each station
    const stationsWithDistance = majorTransitHubs.map(station => {
      const startDistance = calculateDistance(startCoords, station.location);
      const endDistance = calculateDistance(endCoords, station.location);
      
      return {
        ...station,
        startDistance,
        endDistance,
        totalDistance: startDistance + endDistance
      };
    });

    // Filter stations within reasonable distance (5km from start or end)
    const nearbyStations = stationsWithDistance.filter(station => 
      station.startDistance <= 5 || station.endDistance <= 5
    );

    // Sort by total distance (closest to route)
    nearbyStations.sort((a, b) => a.totalDistance - b.totalDistance);

    console.log(`Found ${nearbyStations.length} nearby stations`);
    return nearbyStations.slice(0, 5); // Return top 5 stations

  } catch (error) {
    console.error('Error finding nearby stations:', error.message);
    return [];
  }
};

/**
 * Get real-time transit information (simplified for MVP)
 */
const getRealTimeInfo = async (stationId) => {
  try {
    // For MVP, we'll return mock real-time data
    // In production, this would parse the GTFS real-time protobuf data
    return {
      nextArrivals: [
        { line: 'Link Light Rail', arrival: '3 min', delay: 0 },
        { line: 'Link Light Rail', arrival: '8 min', delay: 1 },
        { line: 'Link Light Rail', arrival: '15 min', delay: 0 }
      ],
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error getting real-time info:', error.message);
    return { nextArrivals: [], lastUpdated: new Date().toISOString() };
  }
};

/**
 * Calculate distance between two coordinates in kilometers
 */
const calculateDistance = (coord1, coord2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(coord2.lat - coord1.lat);
  const dLon = toRad(coord2.lng - coord1.lng);
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(coord1.lat)) * Math.cos(toRad(coord2.lat)) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const toRad = (value) => {
  return value * Math.PI / 180;
};

module.exports = {
  findNearbyStations,
  getRealTimeInfo,
  calculateDistance
};
