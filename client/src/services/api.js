import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api',
  timeout: 30000, // 30 second timeout for route generation
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    
    // Provide user-friendly error messages
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please try again.');
    }
    
    if (error.response?.status === 500) {
      throw new Error('Server error. Please try again later.');
    }
    
    if (error.response?.status === 400) {
      throw new Error(error.response.data?.message || 'Invalid request. Please check your input.');
    }
    
    throw new Error(error.response?.data?.message || 'Network error. Please check your connection.');
  }
);

export const routeAPI = {
  /**
   * Generate a route between two locations
   */
  generateRoute: async (startLocation, endLocation) => {
    const response = await api.post('/route', {
      start_location: startLocation,
      end_location: endLocation
    });
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to generate route');
    }
    
    return response.data;
  }
};

export default api;
