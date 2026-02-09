# System Diagrams

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │              React Application                      │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────┐    │    │
│  │  │ TripForm │  │ MapView  │  │ ELDLogsViewer│    │    │
│  │  └────┬─────┘  └────┬─────┘  └──────┬───────┘    │    │
│  │       │             │                │             │    │
│  │       └─────────────┴────────────────┘             │    │
│  │                     │                               │    │
│  │              ┌──────▼──────┐                       │    │
│  │              │  API Client │                       │    │
│  │              └──────┬──────┘                       │    │
│  └─────────────────────┼────────────────────────────┘    │
└────────────────────────┼─────────────────────────────────┘
                         │ HTTP/JSON
                         │
┌────────────────────────▼─────────────────────────────────┐
│                   Django Application                      │
│                                                           │
│  ┌─────────────────────────────────────────────────┐   │
│  │              API Layer (DRF)                     │   │
│  │  ┌──────────────────────────────────────────┐  │   │
│  │  │     TripCalculationView                   │  │   │
│  │  │  ┌────────────────────────────────────┐  │  │   │
│  │  │  │  Request Validation (Serializers)  │  │  │   │
│  │  │  └────────────┬───────────────────────┘  │  │   │
│  │  └───────────────┼──────────────────────────┘  │   │
│  └──────────────────┼─────────────────────────────┘   │
│                     │                                   │
│  ┌──────────────────▼─────────────────────────────┐   │
│  │           Service Layer                         │   │
│  │  ┌──────────────────────────────────────────┐ │   │
│  │  │        TripCalculator                     │ │   │
│  │  │  ┌────────────┐  ┌──────────────────┐   │ │   │
│  │  │  │RouteService│  │  ELDSimulator    │   │ │   │
│  │  │  └─────┬──────┘  └────────┬─────────┘   │ │   │
│  │  └────────┼──────────────────┼─────────────┘ │   │
│  └───────────┼──────────────────┼───────────────┘   │
└──────────────┼──────────────────┼───────────────────┘
               │                  │
               │                  │
    ┌──────────▼──────┐  ┌───────▼────────┐
    │  OSRM API       │  │  HOS Rules     │
    │  (Routing)      │  │  Engine        │
    └─────────────────┘  └────────────────┘
```

## Request Flow Diagram

```
User Input
    │
    ▼
┌─────────────────────┐
│   TripForm          │  1. Validate input
│   (React)           │  2. Submit form
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   API Client        │  3. POST /api/trips/calculate/
│   (Axios)           │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Django Middleware │  4. CSRF, CORS, Auth
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Serializer        │  5. Validate request data
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   TripCalculator    │  6. Orchestrate calculation
└──────────┬──────────┘
           │
           ├─────────────────────┐
           │                     │
           ▼                     ▼
┌─────────────────────┐  ┌─────────────────────┐
│   RouteService      │  │   ELDSimulator      │
│   - Geocode         │  │   - Calculate HOS   │
│   - Calculate route │  │   - Insert breaks   │
│   - Insert stops    │  │   - Generate logs   │
└──────────┬──────────┘  └──────────┬──────────┘
           │                        │
           └────────────┬───────────┘
                        │
                        ▼
           ┌─────────────────────┐
           │   Response JSON     │
           └──────────┬──────────┘
                      │
                      ▼
           ┌─────────────────────┐
           │   React State       │  7. Update UI
           │   Update            │
           └──────────┬──────────┘
                      │
                      ▼
           ┌─────────────────────┐
           │   UI Re-render      │  8. Display results
           │   - Map             │
           │   - ELD Logs        │
           │   - Summary         │
           └─────────────────────┘
```

## Service Layer Interaction

```
┌──────────────────────────────────────────────────────┐
│                  TripCalculator                       │
│                  (Orchestrator)                       │
└───────┬──────────────────────────────────────────────┘
        │
        │  1. Geocode locations
        ▼
┌──────────────────────────────────────────────────────┐
│                  RouteService                         │
│  ┌────────────────────────────────────────────────┐ │
│  │  geocode(address) → (lat, lng)                 │ │
│  │  calculate_route(waypoints) → route_data       │ │
│  └────────────────────────────────────────────────┘ │
└───────┬──────────────────────────────────────────────┘
        │
        │  2. Calculate route
        ▼
┌──────────────────────────────────────────────────────┐
│                  TripCalculator                       │
│  ┌────────────────────────────────────────────────┐ │
│  │  _calculate_stops(route) → stops_list          │ │
│  │  - Insert fuel stops every 1,000 miles         │ │
│  │  - Add pickup/dropoff stops                    │ │
│  └────────────────────────────────────────────────┘ │
└───────┬──────────────────────────────────────────────┘
        │
        │  3. Simulate ELD logs
        ▼
┌──────────────────────────────────────────────────────┐
│                  ELDSimulator                         │
│  ┌────────────────────────────────────────────────┐ │
│  │  simulate_trip(distance, stops, cycle_hours)   │ │
│  │  - Track driving/on-duty hours                 │ │
│  │  - Insert rest breaks when needed              │ │
│  │  - Generate daily logs                         │ │
│  └────────────────────────────────────────────────┘ │
└───────┬──────────────────────────────────────────────┘
        │
        │  4. Return combined result
        ▼
┌──────────────────────────────────────────────────────┐
│              Complete Trip Data                       │
│  - Route (coordinates, distance, duration)           │
│  - Stops (fuel, pickup, dropoff)                     │
│  - Daily Logs (timeline, totals)                     │
│  - Summary (days, cycle hours, etc.)                 │
└──────────────────────────────────────────────────────┘
```

## HOS Simulation Algorithm

```
START
  │
  ▼
Initialize:
  - current_time = start_time
  - daily_driving = 0
  - daily_on_duty = 0
  - current_cycle = initial_cycle_hours
  │
  ▼
FOR each stop in route:
  │
  ├─► Check if rest needed?
  │   ├─► daily_driving >= 11h? ──YES──┐
  │   ├─► daily_on_duty >= 14h? ──YES──┤
  │   └─► NO ──────────────────────────┼──► Continue
  │                                     │
  │   ┌─────────────────────────────────┘
  │   │
  │   ▼
  │   Insert 10-hour rest break
  │   Reset daily counters
  │   │
  │   ▼
  │   Check day boundary?
  │   ├─► Crossed midnight? ──YES──► Create new daily log
  │   └─► NO ──────────────────────► Continue
  │
  ├─► Calculate driving to stop
  │   distance_to_stop / 60 mph = drive_hours
  │   │
  │   ▼
  │   Add driving event
  │   daily_driving += drive_hours
  │   daily_on_duty += drive_hours
  │   current_cycle += drive_hours
  │
  ├─► Handle stop activity
  │   │
  │   ▼
  │   Add on-duty event (pickup/dropoff/fuel)
  │   daily_on_duty += stop_duration
  │   current_cycle += stop_duration
  │
  └─► Check day boundary again
      └─► If crossed midnight, create new daily log
  │
  ▼
END
  │
  ▼
Return:
  - daily_logs[]
  - summary (total_days, final_cycle_hours, etc.)
```

## Component Hierarchy

```
App
├── Header
│   ├── Title
│   └── Cycle Info
│
├── TripForm
│   ├── Input: Current Location
│   ├── Input: Pickup Location
│   ├── Input: Dropoff Location
│   ├── Input: Current Cycle Hours
│   └── Submit Button
│
├── Error Display (conditional)
│
├── Loading Spinner (conditional)
│
└── Results (conditional)
    ├── Summary Cards
    │   ├── Total Distance
    │   ├── Trip Duration
    │   ├── Total Stops
    │   └── Cycle Hours Used
    │
    ├── MapView
    │   ├── Canvas Element
    │   ├── Route Line
    │   ├── Waypoint Markers
    │   ├── Stop Markers
    │   └── Legend
    │
    └── ELDLogsViewer
        ├── Day Tabs
        └── ELDLogSheet (for selected day)
            ├── Canvas Grid
            ├── Timeline Events
            ├── Daily Totals Box
            └── Event Details List
```

## Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                    User Input                            │
│  {                                                       │
│    current_location: "Los Angeles, CA",                 │
│    pickup_location: "Phoenix, AZ",                      │
│    dropoff_location: "Dallas, TX",                      │
│    current_cycle_hours: 15.5                            │
│  }                                                       │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                 Backend Processing                       │
│                                                          │
│  1. Geocode:                                            │
│     LA: (34.05, -118.24)                                │
│     Phoenix: (33.45, -112.07)                           │
│     Dallas: (32.78, -96.80)                             │
│                                                          │
│  2. Route:                                              │
│     Distance: 1,423 miles                               │
│     Duration: 23.7 hours                                │
│     Coordinates: [[lng,lat], ...]                       │
│                                                          │
│  3. Stops:                                              │
│     - Fuel Stop @ 1,000 mi                              │
│     - Pickup @ 373 mi                                   │
│     - Dropoff @ 1,423 mi                                │
│                                                          │
│  4. ELD Simulation:                                     │
│     Day 1: 11h driving, 1h pickup, 10h rest             │
│     Day 2: 11h driving, 1h dropoff                      │
│                                                          │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  Response JSON                           │
│  {                                                       │
│    route: { distance, duration, coordinates, ... },     │
│    stops: [ {type, distance, duration, coords}, ... ],  │
│    daily_logs: [ {date, timeline, totals}, ... ],       │
│    summary: { total_days, cycle_hours, ... }            │
│  }                                                       │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   UI Rendering                           │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Summary Cards: 1,423 mi | 2 days | 3 stops    │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Map: Route line with markers                   │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │  ELD Logs: Day 1 | Day 2                        │   │
│  │  [24-hour grid with duty status bars]           │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Internet                              │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                Load Balancer / CDN                       │
│                  (HTTPS/SSL)                             │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Application Server                          │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │            Gunicorn (WSGI)                      │    │
│  │         (Multiple Workers)                      │    │
│  └────────────────────┬───────────────────────────┘    │
│                       │                                  │
│  ┌────────────────────▼───────────────────────────┐    │
│  │          Django Application                     │    │
│  │  ┌──────────────────────────────────────────┐ │    │
│  │  │  API Endpoints (DRF)                     │ │    │
│  │  └──────────────────────────────────────────┘ │    │
│  │  ┌──────────────────────────────────────────┐ │    │
│  │  │  Service Layer                           │ │    │
│  │  └──────────────────────────────────────────┘ │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │         Whitenoise (Static Files)               │    │
│  │  - React build (JS, CSS)                       │    │
│  │  - Compressed & cached                         │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
└─────────────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              External Services                           │
│  ┌──────────────────┐  ┌──────────────────────────┐    │
│  │  OSRM API        │  │  Nominatim (Geocoding)   │    │
│  │  (Routing)       │  │                          │    │
│  └──────────────────┘  └──────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

## State Management

```
App Component State
├── tripData: null | TripResult
│   ├── route: RouteData
│   ├── stops: Stop[]
│   ├── daily_logs: DailyLog[]
│   └── summary: Summary
│
├── loading: boolean
│
└── error: null | string

TripForm Component State
├── formData
│   ├── current_location: string
│   ├── pickup_location: string
│   ├── dropoff_location: string
│   └── current_cycle_hours: number
│
└── errors: ValidationErrors

ELDLogsViewer Component State
└── selectedDay: number (index)
```

## Technology Stack Layers

```
┌─────────────────────────────────────────────────────────┐
│                  Presentation Layer                      │
│  React 18 | Tailwind CSS | Canvas API                   │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                   API Layer                              │
│  Django REST Framework | Serializers                     │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                 Business Logic Layer                     │
│  RouteService | ELDSimulator | TripCalculator           │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                 Integration Layer                        │
│  OSRM API | Nominatim | Geopy                           │
└─────────────────────────────────────────────────────────┘
```

---

These diagrams provide visual representations of the system architecture, data flow, and component interactions. Use them for:
- Understanding the system design
- Explaining architecture in presentations
- Onboarding new developers
- Documentation and planning
