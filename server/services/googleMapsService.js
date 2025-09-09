const axios = require('axios');

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const PLACES_API_URL = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json';
const DIRECTIONS_API_URL = 'https://maps.googleapis.com/maps/api/directions/json';

/**
 * Geocode a location string to coordinates using Google Places API
 */
const geocodeLocation = async (locationString) => {
  try {
    const response = await axios.get(PLACES_API_URL, {
      params: {
        input: locationString,
        inputtype: 'textquery',
        fields: 'place_id,name,geometry',
        locationbias: 'circle:50000@47.6062,-122.3321', // Bias towards Seattle area
        key: GOOGLE_MAPS_API_KEY
      }
    });

    if (response.data.status !== 'OK' || !response.data.candidates.length) {
      throw new Error(`Could not geocode location: ${locationString}`);
    }

    const place = response.data.candidates[0];
    return {
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
      place_id: place.place_id,
      name: place.name
    };
  } catch (error) {
    console.error('Geocoding error:', error.message);
    throw new Error(`Failed to geocode location: ${locationString}`);
  }
};

/**
 * Get directions between two points using Google Directions API
 */
const getDirections = async (origin, destination, travelMode) => {
  try {
    const response = await axios.get(DIRECTIONS_API_URL, {
      params: {
        origin: `${origin.lat},${origin.lng}`,
        destination: `${destination.lat},${destination.lng}`,
        mode: travelMode.toLowerCase(),
        departure_time: 'now',
        key: GOOGLE_MAPS_API_KEY
      }
    });

    if (response.data.status !== 'OK' || !response.data.routes.length) {
      throw new Error(`No ${travelMode} route found`);
    }

    const route = response.data.routes[0];
    const leg = route.legs[0];

    return {
      duration: leg.duration,
      distance: leg.distance,
      steps: leg.steps,
      start_address: leg.start_address,
      end_address: leg.end_address,
      travel_mode: travelMode,
      polyline: route.overview_polyline.points
    };
  } catch (error) {
    console.error(`Directions API error for ${travelMode}:`, error.message);
    throw new Error(`Failed to get ${travelMode} directions`);
  }
};

/**
 * Find nearby transit stations using Google Places API
 */
const findNearbyTransitStations = async (location, radius = 1000) => {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
      params: {
        location: `${location.lat},${location.lng}`,
        radius: radius,
        type: 'transit_station',
        key: GOOGLE_MAPS_API_KEY
      }
    });

    if (response.data.status !== 'OK') {
      return [];
    }

    return response.data.results.map(station => ({
      place_id: station.place_id,
      name: station.name,
      location: station.geometry.location,
      types: station.types,
      rating: station.rating || null
    }));
  } catch (error) {
    console.error('Error finding nearby transit stations:', error.message);
    return [];
  }
};

module.exports = {
  geocodeLocation,
  getDirections,
  findNearbyTransitStations
};
