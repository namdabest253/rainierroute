import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const MapDisplay = ({ route, loading }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [mapError, setMapError] = useState(null);

  // Initialize Google Maps
  useEffect(() => {
    const initMap = async () => {
      try {
        // Note: In production, you'd load the API key from environment variables
        // For now, we'll show a placeholder since the API key isn't configured
        const loader = new Loader({
          apiKey: 'YOUR_GOOGLE_MAPS_API_KEY', // This would come from environment
          version: 'weekly',
          libraries: ['places']
        });

        await loader.load();

        // Initialize map centered on Seattle
        const map = new google.maps.Map(mapRef.current, {
          center: { lat: 47.6062, lng: -122.3321 }, // Seattle coordinates
          zoom: 12,
          styles: [
            {
              featureType: 'transit.station',
              elementType: 'labels',
              stylers: [{ visibility: 'on' }]
            }
          ]
        });

        mapInstanceRef.current = map;
      } catch (error) {
        console.error('Error loading Google Maps:', error);
        setMapError('Unable to load Google Maps. Please check your API key configuration.');
      }
    };

    initMap();
  }, []);

  // Update map when route changes
  useEffect(() => {
    if (route && mapInstanceRef.current) {
      displayRoute(route);
    }
  }, [route]);

  const displayRoute = (routeData) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing overlays
    // In a full implementation, we'd track and clear previous markers/polylines

    try {
      if (routeData.optimal.type === 'bike_only') {
        // Display single polyline for bike-only route
        const polyline = new google.maps.Polyline({
          path: google.maps.geometry.encoding.decodePath(routeData.optimal.polyline),
          geodesic: true,
          strokeColor: '#22c55e',
          strokeOpacity: 1.0,
          strokeWeight: 4
        });
        polyline.setMap(map);

        // Fit map to route bounds
        const bounds = new google.maps.LatLngBounds();
        polyline.getPath().forEach(point => bounds.extend(point));
        map.fitBounds(bounds);

      } else if (routeData.optimal.segments) {
        // Display multi-segment route
        const colors = { BICYCLING: '#22c55e', TRANSIT: '#3b82f6' };
        
        routeData.optimal.segments.forEach((segment, index) => {
          const polyline = new google.maps.Polyline({
            path: google.maps.geometry.encoding.decodePath(segment.polyline),
            geodesic: true,
            strokeColor: colors[segment.type] || '#6b7280',
            strokeOpacity: 1.0,
            strokeWeight: 4
          });
          polyline.setMap(map);
        });

        // Fit map to show all segments
        const bounds = new google.maps.LatLngBounds();
        routeData.optimal.segments.forEach(segment => {
          const path = google.maps.geometry.encoding.decodePath(segment.polyline);
          path.forEach(point => bounds.extend(point));
        });
        map.fitBounds(bounds);
      }
    } catch (error) {
      console.error('Error displaying route on map:', error);
    }
  };

  if (mapError) {
    return (
      <div className="card h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Map Unavailable</h3>
          <p className="text-sm text-gray-500 max-w-sm">
            {mapError}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Configure GOOGLE_MAPS_API_KEY in your environment to enable maps
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-0 overflow-hidden">
      <div 
        ref={mapRef} 
        className="w-full h-96 relative"
        style={{ minHeight: '400px' }}
      >
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Loading route...</p>
            </div>
          </div>
        )}
        
        {!route && !loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="text-gray-400 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Seattle Metro Area</h3>
              <p className="text-sm text-gray-500">
                Enter start and end locations to see your optimized route
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Map Legend */}
      {route && (
        <div className="p-4 bg-gray-50 border-t">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-4 h-1 bg-secondary-500 mr-2"></div>
              <span>Biking</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-1 bg-primary-500 mr-2"></div>
              <span>Transit</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapDisplay;
