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

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Google Maps Platform API key with Places API and Directions API enabled

### Installation

1. **Clone and install dependencies**:
```bash
git clone <repository-url>
cd rainer-route
npm run install:all
```

2. **Configure environment variables**:
```bash
# Copy the example environment file
cp server/env.example server/.env

# Edit server/.env and add your Google Maps API key:
GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

3. **Start development servers**:
```bash
npm run dev
```

This starts both the backend server (port 3001) and frontend development server (port 3000).

4. **Open the application**:
Visit `http://localhost:3000` in your browser.

## API Configuration

### Google Maps Platform Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Places API
   - Directions API
   - Maps JavaScript API (for frontend maps)
4. Create credentials (API Key)
5. Add the API key to `server/.env` as `GOOGLE_MAPS_API_KEY`

### Environment Variables

**Server (`server/.env`)**:
```bash
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
PORT=3001
NODE_ENV=development
GTFS_REALTIME_URL=https://s3.amazonaws.com/kcm-alerts-realtime-prod/vehiclepositions.pb
```

**Frontend**: The frontend gets the Google Maps API key through the backend for security.

## Usage

1. **Enter Locations**: Type your starting point and destination
2. **Get Route**: Click "Find Route" to generate optimized options
3. **View Results**: See the recommended route with alternatives
4. **Map Display**: Visual representation of your route with different colors for biking (green) and transit (blue) segments

### Sample Routes to Try

- University of Washington to Pike Place Market
- Capitol Hill to SeaTac Airport
- Fremont to Downtown Seattle
- Ballard to University District

## API Endpoints

### `POST /api/route`

Generate an optimized multi-modal route.

**Request Body**:
```json
{
  "start_location": "University of Washington, Seattle",
  "end_location": "Pike Place Market, Seattle"
}
```

**Response**:
```json
{
  "success": true,
  "route": {
    "optimal": {
      "type": "bike_transit",
      "duration": { "text": "28 mins", "value": 1680 },
      "segments": [
        {
          "type": "BICYCLING",
          "description": "Bike to University of Washington Station",
          "duration": { "text": "8 mins", "value": 480 }
        },
        {
          "type": "TRANSIT", 
          "description": "Take transit from University of Washington Station",
          "duration": { "text": "15 mins", "value": 900 }
        }
      ]
    },
    "alternatives": [...],
    "analysis": {
      "total_options_considered": 4,
      "fastest_option": "bike_transit",
      "time_saved_vs_bike_only": 420
    }
  }
}
```

## Deployment

### Backend Deployment (Render/Heroku)

1. **Render**:
   - Connect your GitHub repository
   - Set build command: `cd server && npm install`
   - Set start command: `cd server && npm start`
   - Add environment variable: `GOOGLE_MAPS_API_KEY`

2. **Heroku**:
```bash
cd server
heroku create your-app-name-api
heroku config:set GOOGLE_MAPS_API_KEY=your_key
git subtree push --prefix server heroku main
```

### Frontend Deployment (Vercel/Netlify)

1. **Vercel**:
   - Connect GitHub repository
   - Set root directory: `client`
   - Build command: `npm run build`
   - Output directory: `dist`

2. **Netlify**:
   - Connect repository
   - Build command: `cd client && npm run build`
   - Publish directory: `client/dist`

Update the frontend API base URL to point to your deployed backend.

## Development

### Project Structure
```
rainer-route/
├── server/                 # Backend API
│   ├── controllers/        # Route handlers
│   ├── services/          # Business logic
│   ├── package.json
│   └── index.js           # Server entry point
├── client/                # Frontend React app
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API client
│   │   └── App.jsx        # Main app component
│   ├── package.json
│   └── vite.config.js
└── package.json           # Root package with scripts
```

### Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run server:dev` - Start only the backend server
- `npm run client:dev` - Start only the frontend development server
- `npm run client:build` - Build the frontend for production

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -am 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Roadmap

- [ ] Real GTFS real-time data parsing
- [ ] User location detection
- [ ] Route favorites and history
- [ ] Weather-aware routing
- [ ] Bike share integration
- [ ] Real-time transit alerts
- [ ] Mobile app (React Native)

---

Built with ❤️ for Seattle commuters