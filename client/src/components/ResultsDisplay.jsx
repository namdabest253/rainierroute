import React from 'react';

const ResultsDisplay = ({ route }) => {
  if (!route || !route.optimal) return null;

  const { optimal, alternatives = [], analysis = {} } = route;

  const getRouteIcon = (type) => {
    switch (type) {
      case 'bike_only':
        return (
          <svg className="w-5 h-5 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9-3-9m-9 9a9 9 0 019-9" />
          </svg>
        );
      case 'transit_only':
        return (
          <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
          </svg>
        );
      case 'bike_transit':
        return (
          <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const formatRouteType = (type) => {
    switch (type) {
      case 'bike_only': return 'Bike Only';
      case 'transit_only': return 'Transit Only';
      case 'bike_transit': return 'Bike + Transit';
      default: return type;
    }
  };

  const renderSteps = (route) => {
    if (route.segments) {
      // Multi-modal route with segments
      return (
        <div className="space-y-3">
          {route.segments.map((segment, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                segment.type === 'BICYCLING' ? 'bg-secondary-100 text-secondary-700' : 'bg-primary-100 text-primary-700'
              }`}>
                {index + 1}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {segment.description}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {segment.duration.text} • {segment.distance.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      );
    } else if (route.steps) {
      // Single-mode route with steps
      return (
        <div className="space-y-2">
          {route.steps.slice(0, 3).map((step, index) => (
            <div key={index} className="flex items-start space-x-2">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                {index + 1}
              </div>
              <p className="text-sm text-gray-700">{step.html_instructions?.replace(/<[^>]*>/g, '') ?? ''}</p>
            </div>
          ))}
          {route.steps.length > 3 && (
            <p className="text-xs text-gray-500 ml-7">
              ... and {route.steps.length - 3} more steps
            </p>
          )}
        </div>
      );
    }
    
    return (
      <p className="text-sm text-gray-600">
        {route.description}
      </p>
    );
  };

  return (
    <div className="space-y-4">
      {/* Optimal Route */}
      <div className="card border-l-4 border-l-primary-500">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {getRouteIcon(optimal.type)}
            <h3 className="text-lg font-semibold text-gray-900">
              Recommended Route
            </h3>
            <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full">
              {formatRouteType(optimal.type)}
            </span>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-primary-600">
              {optimal.duration?.text || 'N/A'}
            </p>
            {optimal.distance && (
              <p className="text-sm text-gray-500">
                {optimal.distance.text}
              </p>
            )}
          </div>
        </div>
        
        {renderSteps(optimal)}
        
        {analysis.time_saved_vs_bike_only > 0 && (
          <div className="mt-3 p-2 bg-secondary-50 rounded-lg">
            <p className="text-xs text-secondary-700">
              ⚡ Saves {Math.round(analysis.time_saved_vs_bike_only / 60)} minutes vs. bike-only route
            </p>
          </div>
        )}
      </div>

      {/* Alternative Routes */}
      {alternatives.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-md font-medium text-gray-900">
            Alternative Routes
          </h4>
          {alternatives.map((alt, index) => (
            <div key={index} className="card bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getRouteIcon(alt.type)}
                  <span className="text-sm font-medium text-gray-900">
                    {formatRouteType(alt.type)}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-md font-semibold text-gray-700">
                    {alt.duration?.text || 'N/A'}
                  </p>
                  {alt.distance && (
                    <p className="text-xs text-gray-500">
                      {alt.distance.text}
                    </p>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600">
                {alt.description}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Analysis Summary */}
      {analysis.total_options_considered && (
        <div className="card bg-blue-50 border border-blue-200">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            Route Analysis
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-blue-700">Options Considered</p>
              <p className="font-semibold text-blue-900">
                {analysis.total_options_considered}
              </p>
            </div>
            <div>
              <p className="text-blue-700">Fastest Method</p>
              <p className="font-semibold text-blue-900">
                {formatRouteType(analysis.fastest_option)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay;
