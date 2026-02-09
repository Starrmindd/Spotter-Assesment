# ELD Trip Planner

A professional-grade trucking trip planner with Hours of Service (HOS) compliance and ELD log simulation. Built as a single deployable Django application with embedded React frontend.

## 🎯 Overview

This application calculates optimal trucking routes while automatically simulating DOT-compliant ELD (Electronic Logging Device) logs. It handles:

- Multi-stop route planning with geocoding
- Automatic fuel stop insertion (every 1,000 miles)
- HOS regulation compliance (11-hour driving, 14-hour on-duty, 10-hour rest)
- Professional DOT-style daily log sheets
- 70-hour/8-day cycle tracking

## 🏗️ Architecture

**Single-Service Design**: Django serves both the API and the React frontend, reducing operational complexity and presenting a cohesive product. This is an intentional architectural decision that simplifies deployment, eliminates CORS issues, and reduces infrastructure costs.

## Tech Stack

- **Backend**: Django 5.0 + Django REST Framework
- **Frontend**: React 18 + Vite + Tailwind CSS
- **Mapping**: Mapbox GL JS
- **ELD Rendering**: SVG-based custom implementation

## Assumptions

- Property-carrying driver
- 70 hours / 8 days cycle
- 11-hour daily driving limit
- 14-hour on-duty limit
- 10-hour rest break required
- No adverse driving conditions
- Fuel stop every 1,000 miles (15 min each)
- Pickup time: 1 hour
- Drop-off time: 1 hour
- Average speed: 60 mph

## 🚀 Quick Start

### Automated Setup (Recommended)

**Windows:**
```bash
setup.bat
```

**Mac/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

### Manual Setup

1. **Create and activate virtual environment:**
```bash
python -m venv venv
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate     # Windows
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
cd frontend && npm install && npm run build && cd ..
```

3. **Setup Django:**
```bash
python manage.py migrate
python manage.py collectstatic --noinput
```

4. **Run server:**
```bash
python manage.py runserver
```

5. **Open browser:** http://localhost:8000

See [QUICK_START.md](QUICK_START.md) for detailed instructions and troubleshooting.

## 📋 Features

### Route Planning
- Geocoding for any US address
- Multi-waypoint routing (start → pickup → dropoff)
- Automatic fuel stop insertion every 1,000 miles
- Distance and duration calculations
- Visual route map with markers

### HOS Compliance
- 11-hour daily driving limit enforcement
- 14-hour on-duty limit enforcement
- Automatic 10-hour rest break insertion
- 70-hour/8-day cycle tracking
- Real-time compliance validation

### ELD Log Simulation
- DOT-style daily log sheets
- 24-hour timeline grids
- Color-coded duty statuses (Off Duty, Sleeper, Driving, On Duty)
- Daily totals and summaries
- Multi-day trip support
- Event detail listings

### User Experience
- Clean, modern UI with Tailwind CSS
- Responsive design (mobile, tablet, desktop)
- Real-time form validation
- Loading states and error handling
- Professional logistics-grade aesthetics

## 🎨 Screenshots

### Trip Input Form
Clean form with validation for current location, pickup, dropoff, and cycle hours.

### Route Map
Visual route display with start (green), pickup (orange), dropoff (red), and fuel stops (purple).

### ELD Daily Logs
Professional DOT-style log sheets with 24-hour timeline, duty status transitions, and daily totals.

## 📚 Documentation

- **[QUICK_START.md](QUICK_START.md)** - Get up and running in 5 minutes
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Deep dive into system design
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment guide
- **[TESTING.md](TESTING.md)** - Testing strategies and scenarios
- **[LOOM_SCRIPT.md](LOOM_SCRIPT.md)** - Video walkthrough script

## Development Workflow

### Frontend Development (Hot Reload)
```bash
cd frontend
npm run dev
```
Then access via `http://localhost:5173` for hot reload during development.

### Production Build
```bash
cd frontend
npm run build
cd ..
python manage.py collectstatic --noinput
```

## Deployment

This application is designed for single-service deployment on:
- Railway
- Render
- Fly.io
- Any VPS with Python support

### Environment Variables
```
SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=your-domain.com
MAPBOX_TOKEN=your-mapbox-token
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## 🔧 API Reference

### POST /api/trips/calculate/

Calculate trip route, stops, and ELD logs.

**Request:**
```json
{
  "current_location": "Los Angeles, CA",
  "pickup_location": "Phoenix, AZ",
  "dropoff_location": "Dallas, TX",
  "current_cycle_hours": 15.5
}
```

**Response:**
```json
{
  "route": {
    "total_distance": 1200,
    "total_duration": 20.5,
    "coordinates": [[lng, lat], ...],
    "waypoints": [...]
  },
  "stops": [
    {
      "type": "Fuel Stop",
      "distance_from_start": 1000,
      "duration": 0.25,
      "coords": [lng, lat]
    }
  ],
  "daily_logs": [
    {
      "date": "2024-01-15",
      "timeline": [...],
      "totals": {
        "driving": 11.0,
        "on_duty": 12.5,
        "off_duty": 11.5
      }
    }
  ],
  "summary": {
    "total_days": 2,
    "final_cycle_hours": 35.5,
    "cycle_hours_remaining": 34.5,
    "total_distance": 1200,
    "total_stops": 3
  }
}
```

## 🧪 Testing

### Example Test Scenarios

**Short Trip (Same Day):**
```json
{
  "current_location": "San Francisco, CA",
  "pickup_location": "San Jose, CA",
  "dropoff_location": "Sacramento, CA",
  "current_cycle_hours": 5
}
```

**Long Trip (Multi-Day):**
```json
{
  "current_location": "New York, NY",
  "pickup_location": "Chicago, IL",
  "dropoff_location": "Los Angeles, CA",
  "current_cycle_hours": 20
}
```

See [TESTING.md](TESTING.md) for comprehensive test scenarios and validation.

## 🎯 Key Technical Decisions

### Why Single-Service Architecture?
- **Reduced Complexity**: One deployment, one codebase, one service to monitor
- **Simplified DevOps**: No microservice orchestration needed
- **Cost Effective**: Single server instance required
- **No CORS Issues**: Frontend and backend on same origin
- **Faster Development**: No API versioning or contract management

### Why Canvas for ELD Logs?
- **Performance**: Handles complex grids efficiently
- **Precision**: Pixel-perfect DOT-style rendering
- **Flexibility**: Full control over appearance
- **No Dependencies**: No heavy charting libraries needed

### Why OSRM for Routing?
- **Free**: Open-source routing engine
- **Fast**: Sub-second response times
- **Accurate**: Real road network data
- **Fallback**: Geodesic calculation if unavailable

## 📦 Project Structure

```
eld-trip-planner/
├── config/                 # Django configuration
├── trips/                  # Main Django app
│   ├── services/           # Business logic
│   │   ├── route_service.py
│   │   ├── eld_simulator.py
│   │   └── trip_calculator.py
│   ├── views.py            # API endpoints
│   └── serializers.py      # Validation
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # UI components
│   │   └── services/       # API client
│   └── dist/               # Built assets
├── templates/              # Django templates
└── staticfiles/            # Collected static files
```

## 🚦 Assumptions & Limitations

### Assumptions
- Property-carrying driver (not passenger)
- 70 hours / 8 days cycle
- 11-hour daily driving limit
- 14-hour on-duty limit
- 10-hour rest break required
- No adverse driving conditions
- Average speed: 60 mph
- Fuel stop every 1,000 miles (15 min each)
- Pickup time: 1 hour
- Drop-off time: 1 hour

### Current Limitations
- No real-time traffic data
- No weather considerations
- No toll road avoidance
- No multi-driver support
- No trip history persistence
- US addresses only (geocoding limitation)

### Future Enhancements
- User accounts and authentication
- Trip history and saved routes
- PDF export of ELD logs
- Mobile application
- Real-time GPS tracking
- Weather and traffic integration
- Multi-driver coordination
- Fleet management features

## 🎓 Learning Resources

This project demonstrates:
- Full-stack Django + React architecture
- RESTful API design with DRF
- Service layer pattern for business logic
- Canvas-based data visualization
- HOS regulation implementation
- Professional UI/UX with Tailwind CSS
- Production deployment strategies
- Clean code organization

## 🤝 Contributing

This is a portfolio/demonstration project. For production use, consider:
- Adding comprehensive test coverage
- Implementing user authentication
- Adding database for trip persistence
- Integrating real-time traffic data
- Adding rate limiting and caching
- Implementing monitoring and logging
- Adding CI/CD pipeline

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

- OpenStreetMap for geocoding and routing
- OSRM for route calculation engine
- Django and React communities
- DOT for HOS regulations reference

---

**Built with ❤️ as a demonstration of production-grade full-stack development**

For questions or feedback, see the documentation files or open an issue.
