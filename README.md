# Rainer Route - Seattle Bike + Transit Routing

A smart multi-modal routing application that combines biking and public transit to provide optimal commuting solutions for the Seattle metropolitan area.

## Features

- **Multi-Modal Routing**: Intelligently combines biking and public transit options
- **Real-Time Data**: Integrates with King County Metro GTFS real-time feeds
- **Smart Optimization**: Compares bike-to-transit vs. direct routes to find the fastest option
- **Interactive Map**: Visual route display with Google Maps integration
- **Mobile-Friendly**: Responsive design built with React and Tailwind CSS

## Architecture

### Backend (Node.js/Express)
- **API Endpoint**: `/api/route` - Generates optimized routes
- **Google Maps Integration**: Places API for geocoding, Directions API for routing
- **Transit Data**: King County Metro GTFS real-time feed integration
- **Smart Logic**: Compares multiple route options to recommend the fastest

### Frontend (React/Vite)
- **Search Interface**: Clean form for entering start/end locations
- **Interactive Map**: Google Maps display with route visualization
- **Results Display**: Step-by-step directions and route alternatives
- **Modern UI**: Tailwind CSS with responsive design