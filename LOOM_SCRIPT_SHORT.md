# ELD Trip Planner - 3-5 Minute Loom Script

## Opening (20 seconds)

"Hey, I built this ELD Trip Planner - a full-stack web app that calculates trucking routes while automatically simulating DOT-compliant Electronic Logging Device logs. It's production-ready and deployed on Railway."

## Architecture Overview (30 seconds)

[Show the app running]

"The entire app is a single Django service with an embedded React frontend. This is intentional - one deployment, one codebase, no CORS headaches. Backend handles the heavy lifting: route calculation, HOS compliance, ELD simulation. Frontend is React with Tailwind for a clean, professional UI."

## Backend Logic (1 minute)

[Open trips/services/trip_calculator.py]

"The backend has three core services:

**RouteService** - Geocodes addresses and calculates routes using OpenStreetMap's OSRM API.

**ELDSimulator** - This is where the domain knowledge lives. It enforces DOT regulations:
- 11-hour daily driving limit
- 14-hour on-duty limit  
- 10-hour mandatory rest
- 70-hour/8-day cycle tracking

**TripCalculator** - Orchestrates everything. It geocodes your locations, calculates the route, automatically inserts fuel stops every 1,000 miles, and generates realistic ELD logs."

[Show key code snippet]

"Clean separation of concerns - each service has one job, making it testable and maintainable."

## API & Frontend (45 seconds)

[Show API endpoint]

"The API is simple: one POST endpoint that takes your locations and current cycle hours, returns a complete trip plan with route data and daily ELD logs.

The React frontend is equally clean - TripForm for input, MapView for visualization, and ELDLogsViewer for the daily logs. No over-engineering, just solid component architecture."

## Live Demo (1.5-2 minutes)

[Run the app - http://localhost:8000]

"Let me show you this in action. I'll plan a long trip from New York to Los Angeles with 20 cycle hours remaining."

[Fill in form]
- Current: New York, NY
- Pickup: Chicago, IL
- Dropoff: Los Angeles, CA
- Cycle hours: 20

[Click Calculate]

"Watch the loading state - good UX matters. Now here's the output:

**Summary** - Total distance, days needed, final cycle hours. This trip needs 4 days and uses 58 of my 70 available hours.

**Route Map** - Green is start, orange is pickup, red is dropoff, purple dots are fuel stops every 1,000 miles.

**ELD Daily Logs** - This is the critical piece. Each day shows a 24-hour timeline with color-coded duty statuses. See how the system automatically inserted rest breaks when I hit the 11-hour driving limit? Day 1 shows 11 hours driving, then a 10-hour rest. Day 2 starts fresh. The logs look like real DOT sheets because they follow the same visual standards."

[Click through a couple days]

"Notice the daily totals - they respect all HOS regulations. This is what a dispatcher would actually use."

## Technical Highlights (45 seconds)

"Why this architecture works:

1. **Single deployment** - Reduces operational complexity. One service to monitor, one database, one codebase.

2. **Service layer pattern** - Clean separation makes testing easy and code maintainable.

3. **Canvas rendering for ELD logs** - Gives us pixel-perfect control and performance.

4. **Production-ready** - Whitenoise for static files, Gunicorn for WSGI, environment-based config, proper error handling.

5. **Already deployed** - This is running on Railway right now. One git push and it's live."

## Closing (20 seconds)

"This project demonstrates full-stack thinking: clean architecture, domain expertise in logistics, production-grade UI/UX, and pragmatic technical decisions. The code is documented, organized, and ready for review.

Thanks for watching!"

---

## Demo Script Notes

**Timing Breakdown:**
- Intro: 0:20
- Architecture: 0:30
- Backend: 1:00
- API/Frontend: 0:45
- Demo: 1:45
- Technical: 0:45
- Closing: 0:20
**Total: ~5 minutes**

**Demo Tips:**
- Test the app beforehand to ensure it loads quickly
- Use cities that are far apart to show multi-day trips
- Highlight the automatic rest breaks - that's the "wow" moment
- Point out the visual polish (colors, spacing, responsive design)
- Mention it's deployed and live - shows production thinking

**Key Points to Emphasize:**
1. Single-service architecture is a strategic choice, not a limitation
2. Clean code organization with service layers
3. Domain expertise (HOS regulations)
4. Production-ready thinking (deployment, error handling, validation)
5. Visual quality matters - the ELD logs look professional for a reason

