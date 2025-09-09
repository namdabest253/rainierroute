import React, { useState } from 'react';

const SearchForm = ({ onSearch, loading }) => {
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (startLocation.trim() && endLocation.trim()) {
      onSearch(startLocation.trim(), endLocation.trim());
    }
  };

  // Sample Seattle locations for quick testing
  const sampleLocations = [
    'University of Washington, Seattle',
    'Pike Place Market, Seattle',
    'Capitol Hill, Seattle',
    'Fremont, Seattle',
    'Ballard, Seattle',
    'Queen Anne, Seattle'
  ];

  const fillSampleRoute = () => {
    setStartLocation('University of Washington, Seattle');
    setEndLocation('Pike Place Market, Seattle');
  };

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Plan Your Route
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="start" className="block text-sm font-medium text-gray-700 mb-1">
            From
          </label>
          <input
            type="text"
            id="start"
            value={startLocation}
            onChange={(e) => setStartLocation(e.target.value)}
            placeholder="Enter starting location..."
            className="input-field"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="end" className="block text-sm font-medium text-gray-700 mb-1">
            To
          </label>
          <input
            type="text"
            id="end"
            value={endLocation}
            onChange={(e) => setEndLocation(e.target.value)}
            placeholder="Enter destination..."
            className="input-field"
            disabled={loading}
          />
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={loading || !startLocation.trim() || !endLocation.trim()}
            className="btn-primary flex-1"
          >
            {loading ? 'Finding Route...' : 'Find Route'}
          </button>
          
          <button
            type="button"
            onClick={fillSampleRoute}
            disabled={loading}
            className="btn-secondary px-3"
            title="Try sample route"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </button>
        </div>
      </form>

      {/* Quick location suggestions */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 mb-2">Popular Seattle locations:</p>
        <div className="flex flex-wrap gap-1">
          {sampleLocations.map((location, index) => (
            <button
              key={index}
              onClick={() => {
                if (!startLocation) {
                  setStartLocation(location);
                } else if (!endLocation) {
                  setEndLocation(location);
                }
              }}
              disabled={loading}
              className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded transition-colors duration-200"
            >
              {location.split(',')[0]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchForm;
