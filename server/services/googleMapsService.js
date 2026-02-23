const axios = require('axios');

// Ensure environment variables are loaded
require('dotenv').config();

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const PLACES_API_URL = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json';
const DIRECTIONS_API_URL = 'https://maps.googleapis.com/maps/api/directions/json';

/**
 * Geocode a location string to coordinates using Google Places API
 */
const geocodeLocation = async (locationString) => {
  try {
    console.log(`Geocoding: ${locationString}`);

    if (!GOOGLE_MAPS_API_KEY) {
      throw new Error('Google Maps API key not configured');
    }

    const response = await axios.get(PLACES_API_URL, {
      params: {
        input: locationString,
        inputtype: 'textquery',
        fields: 'place_id,name,geometry',
        locationbias: 'circle:50000@47.6062,-122.3321', // Bias towards Seattle area
        key: GOOGLE_MAPS_API_KEY
      }
    });

    console.log(`Geocoding response status: ${response.data.status}`);

    if (response.data.status === 'REQUEST_DENIED') {
      throw new Error(`Google Maps API request denied. Check your API key and enabled APIs.`);
    }

    if (response.data.status !== 'OK' || !response.data.candidates.length) {
      throw new Error(`Could not geocode location: ${locationString} (Status: ${response.data.status})`);
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
    console.log(`Getting ${travelMode} directions from ${origin.lat},${origin.lng} to ${destination.lat},${destination.lng}`);

    const response = await axios.get(DIRECTIONS_API_URL, {
      params: {
        origin: `${origin.lat},${origin.lng}`,
        destination: `${destination.lat},${destination.lng}`,
        mode: travelMode.toLowerCase(),
        departure_time: 'now',
        key: GOOGLE_MAPS_API_KEY
      }
    });

    console.log(`Directions API response status: ${response.data.status}`);

    if (response.data.status === 'REQUEST_DENIED') {
      throw new Error(`Google Maps API request denied for ${travelMode}. Check your API key and enabled APIs.`);
    }

    if (response.data.status !== 'OK' || !response.data.routes.length) {
      throw new Error(`No ${travelMode} route found (Status: ${response.data.status})`);
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

module.exports = {
  geocodeLocation,
  getDirections
};
