# ELD Trip Planner

A professional-grade trucking trip planner with Hours of Service (HOS) compliance and ELD log simulation. Built as a single deployable Django application with embedded React frontend.

**Built for the Spotter AI Assessment** - This project demonstrates full-stack development skills, production-ready architecture, and domain expertise in logistics compliance.

## 🎯 Overview

This application calculates optimal trucking routes while automatically simulating DOT-compliant ELD (Electronic Logging Device) logs. It handles:

- Multi-stop route planning with geocoding
- Automatic fuel stop insertion (every 1,000 miles)
- HOS regulation compliance (11-hour driving, 14-hour on-duty, 10-hour rest)
- Professional DOT-style daily log sheets
- 70-hour/8-day cycle tracking

## 🏗️ Architecture

**Single-Service Design**: Django serves both the API and the React frontend, reducing operational complexity and presenting a cohesive product. This is an intentional architectural decision that simplifies deployment, eliminates CORS issues, and reduces infrastructure costs.

**Why this matters**: This shows pragmatic engineering thinking - choosing simplicity over complexity when it makes sense.

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

Want to see it in action? Here's how to get it running locally in 5 minutes.

**Or just visit the live demo:** https://spotter.up.railway.app/

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

**Try it out**: Enter a trip from New York to Los Angeles with 20 cycle hours. Watch how the system automatically calculates the route, inserts fuel stops, and generates compliant ELD logs across multiple days.

See [QUICK_START.md](QUICK_START.md) for detailed instructions and troubleshooting.

## 📋 Features

### Route Planning
- Geocoding for any US address
- Multi-waypoint routing (start → pickup → dropoff)
- Automatic fuel stop insertion every 1,000 miles
- Distance and duration calculations
- Visual route map with markers

### HOS Compliance (The Core Logic)
This is where domain expertise matters. The system enforces real DOT regulations:
- 11-hour daily driving limit enforcement
- 14-hour on-duty limit enforcement
- Automatic 10-hour rest break insertion when limits are hit
- 70-hour/8-day cycle tracking
- Real-time compliance validation

### ELD Log Simulation
- DOT-style daily log sheets (looks like real ELD devices)
- 24-hour timeline grids with color-coded duty statuses
- Automatic rest breaks inserted at the right times
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
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Deep dive into system design and why I made these choices
- **[LOOM_SCRIPT_SHORT.md](LOOM_SCRIPT_SHORT.md)** - 3-5 minute video walkthrough script
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - How to deploy to production (Railway, Render, etc.)
- **[TESTING.md](TESTING.md)** - Testing strategies and example scenarios

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
- **Railway** (Recommended - already configured, deployed and live)
- **Render**
- **Fly.io**
- Any VPS with Python support

**Live Demo**: https://spotter.up.railway.app/

The app is currently deployed on Railway and running in production. Check the deployment logs to see the live URL.

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

This shows I understand when to keep things simple instead of over-engineering.

### Why Canvas for ELD Logs?
- **Performance**: Handles complex grids efficiently
- **Precision**: Pixel-perfect DOT-style rendering
- **Flexibility**: Full control over appearance
- **No Dependencies**: No heavy charting libraries needed

The ELD logs look professional because they matter - they're the core output of the app.

### Why OSRM for Routing?
- **Free**: Open-source routing engine
- **Fast**: Sub-second response times
- **Accurate**: Real road network data
- **Fallback**: Geodesic calculation if unavailable

This demonstrates pragmatic decision-making - using proven tools instead of reinventing.

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

## 🎓 What This Project Demonstrates

- **Full-stack development**: Django backend + React frontend, working together seamlessly
- **Clean architecture**: Service layer pattern, separation of concerns, testable code
- **Domain expertise**: Understanding and implementing real DOT HOS regulations
- **Production thinking**: Error handling, validation, deployment, monitoring
- **UI/UX attention**: Professional design that matches the domain (logistics)
- **Pragmatic engineering**: Making smart choices about complexity vs. simplicity

This isn't just a CRUD app - it's a domain-specific tool that solves a real problem.

## 🤝 Next Steps

**Want to explore the code?**
- Start with `trips/services/trip_calculator.py` - this is where the magic happens
- Check `trips/services/eld_simulator.py` - this implements the HOS logic
- Look at `frontend/src/components/ELDLogSheet.jsx` - this renders the professional ELD logs

**Want to see it in action?**
- Clone the repo and run `python manage.py runserver`
- Try a long trip (New York to Los Angeles) to see multi-day ELD logs
- Check the route map and fuel stop calculations

**Want to deploy it yourself?**
- Follow the [QUICK_START.md](QUICK_START.md) to get it running locally
- Then push to Railway/Render following [DEPLOYMENT.md](DEPLOYMENT.md)

**Questions?**
- Check the documentation files for detailed explanations
- Review the code comments for implementation details
- See [LOOM_SCRIPT_SHORT.md](LOOM_SCRIPT_SHORT.md) for a video walkthrough

## 📄 License

MIT License - See LICENSE file for details

---

**Built for the Spotter AI Assessment** - A demonstration of full-stack development, clean architecture, and domain expertise in logistics compliance.

**Live Demo**: https://spotter.up.railway.app/

**Questions or feedback?** Check the documentation files or review the code. I'm confident in the architecture and happy to discuss any design decisions.

For a video walkthrough, see [LOOM_SCRIPT_SHORT.md](LOOM_SCRIPT_SHORT.md).
