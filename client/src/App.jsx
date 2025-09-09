import React, { useState } from 'react';
import SearchForm from './components/SearchForm';
import MapDisplay from './components/MapDisplay';
import ResultsDisplay from './components/ResultsDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import { routeAPI } from './services/api';

function App() {
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (startLocation, endLocation) => {
    setLoading(true);
    setError(null);
    setRoute(null);

    try {
      const response = await routeAPI.generateRoute(startLocation, endLocation);
      setRoute(response.route);
    } catch (err) {
      setError(err.message || 'Failed to generate route');
      console.error('Route generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Rainer Route
              </h1>
              <span className="ml-3 px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full">
                Seattle Metro
              </span>
            </div>
            <div className="text-sm text-gray-500">
              Bike + Transit Routing
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Search and Results */}
          <div className="lg:col-span-1 space-y-6">
            <SearchForm onSearch={handleSearch} loading={loading} />
            
            {error && (
              <div className="card bg-red-50 border border-red-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Error generating route
                    </h3>
                    <p className="mt-1 text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {loading && <LoadingSpinner />}
            
            {route && <ResultsDisplay route={route} />}
          </div>

          {/* Right Column - Map */}
          <div className="lg:col-span-2">
            <MapDisplay route={route} loading={loading} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>
              Rainer Route MVP - Combining biking and public transit for optimal Seattle commuting
            </p>
            <p className="mt-1">
              Powered by Google Maps Platform and King County Metro data
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
