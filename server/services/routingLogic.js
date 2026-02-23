const googleMapsService = require('./googleMapsService');
const transitService = require('./transitService');

/**
 * Determine the optimal route combining biking and transit
 */
const determineOptimalRoute = async ({
  startCoords,
  endCoords,
  bikingRoute,
  transitRoute,
  nearbyTransitStations
}) => {
  try {
    const routes = [];

    // Option 1: Pure biking route
    routes.push({
      type: 'bike_only',
      duration: bikingRoute.duration,
      distance: bikingRoute.distance,
      steps: bikingRoute.steps,
      polyline: bikingRoute.polyline,
      description: `Bike the entire route (${bikingRoute.duration.text})`
    });

    // Option 2: Pure transit route (if available)
    if (transitRoute && transitRoute.duration) {
      routes.push({
        type: 'transit_only',
        duration: transitRoute.duration,
        distance: transitRoute.distance,
        steps: transitRoute.steps,
        polyline: transitRoute.polyline,
        description: `Take public transit (${transitRoute.duration.text})`
      });
    }

    // Option 3: Combined bike + transit routes
    for (const station of nearbyTransitStations.slice(0, 3)) {
      try {
        // Get biking time to station
        const bikeToStation = await googleMapsService.getDirections(
          startCoords,
          station.location,
          'BICYCLING'
        );

        // Get transit time from station to destination
        const transitFromStation = await googleMapsService.getDirections(
          station.location,
          endCoords,
          'TRANSIT'
        );

        // Calculate total time (including 5-minute buffer for station transfer)
        const totalDurationSeconds = 
          bikeToStation.duration.value + 
          transitFromStation.duration.value + 
          300; // 5-minute transfer buffer

        const combinedRoute = {
          type: 'bike_transit',
          duration: {
            value: totalDurationSeconds,
            text: formatDuration(totalDurationSeconds)
          },
          segments: [
            {
              type: 'BICYCLING',
              duration: bikeToStation.duration,
              distance: bikeToStation.distance,
              steps: bikeToStation.steps,
              polyline: bikeToStation.polyline,
              description: `Bike to ${station.name}`
            },
            {
              type: 'TRANSIT',
              duration: transitFromStation.duration,
              distance: transitFromStation.distance,
              steps: transitFromStation.steps,
              polyline: transitFromStation.polyline,
              station: station.name,
              description: `Take transit from ${station.name}`
            }
          ],
          description: `Bike to ${station.name}, then take transit (${formatDuration(totalDurationSeconds)})`
        };

        routes.push(combinedRoute);
      } catch (error) {
        console.log(`Could not create route via ${station.name}:`, error.message);
      }
    }

    // Sort routes by duration (fastest first)
    routes.sort((a, b) => {
      const aDuration = a.duration?.value || Infinity;
      const bDuration = b.duration?.value || Infinity;
      return aDuration - bDuration;
    });

    // Return the optimal route with alternatives
    const optimalRoute = routes[0];
    const alternatives = routes.slice(1, 3); // Top 2 alternatives

    return {
      optimal: optimalRoute,
      alternatives,
      analysis: {
        total_options_considered: routes.length,
        fastest_option: optimalRoute.type,
        time_saved_vs_bike_only: optimalRoute.duration?.value != null
          ? bikingRoute.duration.value - optimalRoute.duration.value
          : 0
      }
    };

  } catch (error) {
    console.error('Error in routing logic:', error.message);
    
    // Fallback to bike-only route if everything else fails
    return {
      optimal: {
        type: 'bike_only',
        duration: bikingRoute.duration,
        distance: bikingRoute.distance,
        steps: bikingRoute.steps,
        polyline: bikingRoute.polyline,
        description: `Bike the entire route (${bikingRoute.duration.text}) - fallback option`
      },
      alternatives: [],
      analysis: {
        total_options_considered: 1,
        fastest_option: 'bike_only',
        error: 'Could not generate multi-modal routes'
      }
    };
  }
};

/**
 * Format duration in seconds to human-readable string
 */
const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} min${minutes !== 1 ? 's' : ''}`;
  } else {
    return `${minutes} min${minutes !== 1 ? 's' : ''}`;
  }
};

module.exports = {
  determineOptimalRoute
};
