import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="card">
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Finding Your Route
          </h3>
          <div className="space-y-1 text-sm text-gray-600">
            <p className="flex items-center justify-center">
              <span className="w-2 h-2 bg-primary-500 rounded-full mr-2 animate-pulse"></span>
              Geocoding locations...
            </p>
            <p className="flex items-center justify-center">
              <span className="w-2 h-2 bg-secondary-500 rounded-full mr-2 animate-pulse"></span>
              Calculating bike routes...
            </p>
            <p className="flex items-center justify-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
              Checking transit options...
            </p>
            <p className="flex items-center justify-center">
              <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-pulse"></span>
              Optimizing route...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
