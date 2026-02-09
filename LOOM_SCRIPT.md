# Loom Walkthrough Script

## Opening (30 seconds)

"Hi, I'm [Your Name], and I built this ELD Trip Planner as a full-stack web application. This is a professional-grade trucking route planner with Hours of Service compliance simulation."

"I intentionally kept this as a single deployable Django application to reduce operational complexity and present a cohesive product."

## Architecture Overview (1 minute)

"Let me show you the architecture first."

[Show folder structure]

"The entire application is built with:
- Django 5 as the primary framework
- Django REST Framework for the API layer
- React 18 with Vite for the frontend
- The React app is built and served directly by Django through static files

This means one deployment, one service, one codebase to maintain."

## Backend Deep Dive (2 minutes)

[Open trips/services/]

"The backend is organized into clean service layers:

1. **RouteService** - Handles geocoding and route calculation using OpenStreetMap's OSRM API
2. **ELDSimulator** - Implements HOS regulations:
   - 11-hour driving limit
   - 14-hour on-duty limit
   - 10-hour rest requirement
   - 70-hour/8-day cycle tracking

3. **TripCalculator** - Orchestrates everything:
   - Geocodes locations
   - Calculates routes
   - Inserts fuel stops every 1,000 miles
   - Simulates realistic ELD logs"

[Show key code sections]

"Notice the separation of concerns - each service has a single responsibility, making it testable and maintainable."

## API Design (1 minute)

[Show trips/views.py and serializers.py]

"The API is simple but robust:
- Single endpoint: POST /api/trips/calculate/
- Request validation with DRF serializers
- Comprehensive error handling
- Clean JSON responses structured for direct frontend consumption"

## Frontend Architecture (2 minutes)

[Show frontend/src/]

"The React frontend is built with modern best practices:

1. **Component Structure**:
   - TripForm - Clean input with validation
   - MapView - Canvas-based route visualization
   - ELDLogsViewer - Tabbed daily log interface
   - ELDLogSheet - SVG/Canvas DOT-style log rendering

2. **Styling**: Tailwind CSS for a professional, logistics-grade UI
3. **State Management**: Simple React hooks - no over-engineering"

## Live Demo (3 minutes)

[Run the application]

"Let me show you this in action."

[Enter trip details]
- Current: Los Angeles, CA
- Pickup: Phoenix, AZ
- Dropoff: Dallas, TX
- Cycle hours: 15

[Click Calculate]

"Watch the loading state - good UX matters."

[Show results]

"Here's what we get:

1. **Summary Cards** - Quick metrics at a glance
2. **Route Map** - Visual route with waypoints and stops
   - Green: Start
   - Orange: Pickup
   - Red: Dropoff
   - Purple: Fuel stops

3. **ELD Daily Logs** - This is the critical piece"

[Click through days]

"Each day shows:
- 24-hour timeline grid
- Color-coded duty statuses
- Automatic rest breaks when limits are hit
- Daily totals for compliance
- Event details below

These logs look like real DOT ELD sheets because they follow the same visual standards."

## Technical Highlights (1 minute)

"Key technical decisions:

1. **Single Deployment** - Django serves everything, reducing DevOps complexity
2. **Service Layer Pattern** - Clean separation makes testing and maintenance easy
3. **Canvas Rendering** - ELD logs use Canvas for performance and precision
4. **Fallback Logic** - If OSRM fails, we fall back to geodesic calculations
5. **Production Ready** - Whitenoise for static files, Gunicorn for WSGI, environment-based config"

## Deployment (30 seconds)

[Show Procfile and requirements.txt]

"Deployment is straightforward:
- Works on Railway, Render, Fly.io, or any VPS
- Single Procfile
- Environment variables for configuration
- One command: `gunicorn config.wsgi`"

## Closing (30 seconds)

"This application demonstrates:
- Full-stack architecture thinking
- Clean code organization
- Production-grade UI/UX
- Domain knowledge (logistics/ELD)
- Pragmatic technical decisions

The entire codebase is documented, tested, and ready for a senior engineer to review."

"Thanks for watching!"

---

## Key Points to Emphasize

1. **Single-service architecture** - This is a strategic decision, not a limitation
2. **Clean separation of concerns** - Service layer, API layer, presentation layer
3. **Production thinking** - Error handling, validation, fallbacks, deployment config
4. **Visual quality** - The ELD logs look professional because they matter
5. **Domain expertise** - Understanding HOS regulations shows depth

## Demo Tips

- Keep the demo smooth - test beforehand
- Use real city names that are far apart (shows multi-day trips)
- Highlight the automatic rest breaks
- Show how cycle hours affect the calculation
- Point out the visual polish (colors, spacing, transitions)

## Time Management

Total: ~10 minutes
- Intro: 0:30
- Architecture: 1:00
- Backend: 2:00
- API: 1:00
- Frontend: 2:00
- Demo: 3:00
- Technical: 1:00
- Deployment: 0:30
- Closing: 0:30

Keep it tight, confident, and focused on demonstrating senior-level thinking.
