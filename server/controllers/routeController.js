const googleMapsService = require('../services/googleMapsService');
const transitService = require('../services/transitService');
const routingLogic = require('../services/routingLogic');

const generateRoute = async (req, res) => {
  try {
    const { start_location, end_location } = req.body;

    // Validate input
    if (!start_location || !end_location) {
      return res.status(400).json({
        error: 'Both start_location and end_location are required'
      });
    }

    console.log(`Generating route from "${start_location}" to "${end_location}"`);

        // Check if API key is configured
    if (!process.env.GOOGLE_MAPS_API_KEY) {
      throw new Error('Google Maps API key not configured');
    }

    // Step 1: Geocode locations using Google Places API
    console.log('Starting geocoding...');
    const [startCoords, endCoords] = await Promise.all([
      googleMapsService.geocodeLocation(start_location),
      googleMapsService.geocodeLocation(end_location)
    ]);

    console.log('Geocoded coordinates:', { startCoords, endCoords });

    // Step 2: Get routing options from Google Directions API
    const [bikingRoute, transitRoute] = await Promise.all([
      googleMapsService.getDirections(startCoords, endCoords, 'BICYCLING'),
      googleMapsService.getDirections(startCoords, endCoords, 'TRANSIT').catch(err => {
        console.log('Transit route unavailable:', err.message);
        return null;
      })
    ]);

    console.log('Retrieved Google Directions');

    // Step 3: Get nearby transit stations and real-time data
    const nearbyTransitStations = await transitService.findNearbyStations(startCoords, endCoords);

    console.log(`Found ${nearbyTransitStations.length} nearby transit stations`);

    // Step 4: Apply routing logic to determine optimal route
    const optimalRoute = await routingLogic.determineOptimalRoute({
      startCoords,
      endCoords,
      bikingRoute,
      transitRoute,
      nearbyTransitStations
    });

    console.log('Generated optimal route');

    res.json({
      success: true,
      route: optimalRoute,
      metadata: {
        start_location,
        end_location,
        generated_at: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error generating route:', error);
    res.status(500).json({
      error: 'Failed to generate route',
      message: error.message
    });
  }
};

module.exports = {
  generateRoute
};
