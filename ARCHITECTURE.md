# Architecture Documentation

## System Overview

ELD Trip Planner is a single-service full-stack web application that combines Django backend with React frontend in a cohesive deployment unit.

### Design Philosophy

**Single Deployment Model**: Rather than separating frontend and backend into microservices, this application intentionally uses a monolithic architecture to:
- Reduce operational complexity
- Simplify deployment and scaling
- Eliminate CORS and cross-origin issues
- Present a cohesive product
- Reduce infrastructure costs

This is a strategic architectural decision, not a limitation.

## Technology Stack

### Backend
- **Django 5.0**: Primary web framework
- **Django REST Framework**: API layer
- **Python 3.11**: Runtime
- **Gunicorn**: WSGI server
- **Whitenoise**: Static file serving

### Frontend
- **React 18**: UI framework
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Styling
- **Axios**: HTTP client
- **Canvas API**: ELD log rendering

### External Services
- **OpenStreetMap Nominatim**: Geocoding
- **OSRM**: Route calculation
- **Geopy**: Distance calculations (fallback)

## Project Structure

```
eld-trip-planner/
├── config/                 # Django project configuration
│   ├── settings.py        # Application settings
│   ├── urls.py            # Root URL configuration
│   ├── wsgi.py            # WSGI entry point
│   └── asgi.py            # ASGI entry point
│
├── trips/                 # Main Django app
│   ├── services/          # Business logic layer
│   │   ├── route_service.py      # Geocoding & routing
│   │   ├── eld_simulator.py      # HOS simulation
│   │   └── trip_calculator.py    # Orchestration
│   ├── views.py           # API endpoints
│   ├── serializers.py     # Request/response validation
│   └── urls.py            # App URL configuration
│
├── frontend/              # React application
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── TripForm.jsx
│   │   │   ├── MapView.jsx
│   │   │   ├── ELDLogsViewer.jsx
│   │   │   └── ELDLogSheet.jsx
│   │   ├── services/      # API client
│   │   │   └── api.js
│   │   ├── App.jsx        # Root component
│   │   └── main.jsx       # Entry point
│   ├── dist/              # Built assets (served by Django)
│   └── vite.config.js     # Build configuration
│
├── templates/             # Django templates
│   └── index.html         # SPA entry point
│
└── staticfiles/           # Collected static files
```

## Architecture Layers

### 1. Presentation Layer (React)

**Responsibility**: User interface and interaction

**Components**:
- `App.jsx`: Root component, state management
- `TripForm.jsx`: Input collection and validation
- `MapView.jsx`: Route visualization
- `ELDLogsViewer.jsx`: Daily log navigation
- `ELDLogSheet.jsx`: Individual log rendering

**Data Flow**:
```
User Input → Form Validation → API Call → State Update → UI Render
```

### 2. API Layer (Django REST Framework)

**Responsibility**: Request handling and response formatting

**Endpoints**:
- `POST /api/trips/calculate/`: Trip calculation

**Flow**:
```
HTTP Request → Serializer Validation → Service Call → Response Serialization → HTTP Response
```

**Error Handling**:
- 400: Validation errors
- 500: Server errors
- Structured error responses

### 3. Service Layer (Python)

**Responsibility**: Business logic and calculations

**Services**:

#### RouteService
- Geocodes addresses to coordinates
- Calculates routes using OSRM
- Provides fallback to geodesic calculations
- Returns distance, duration, and coordinates

#### ELDSimulator
- Implements HOS regulations
- Simulates driving and rest periods
- Tracks cycle hours
- Generates daily logs with timeline events

#### TripCalculator
- Orchestrates route and ELD calculations
- Inserts fuel stops (every 1,000 miles)
- Adds pickup/dropoff stops
- Combines all data into response

**Design Pattern**: Service Layer Pattern
- Separates business logic from views
- Enables unit testing
- Promotes code reuse

### 4. Data Layer

**Current**: Stateless (no database)
- All calculations performed on-demand
- No data persistence required

**Future**: Could add database for:
- Trip history
- User accounts
- Saved routes
- Analytics

## Data Flow

### Complete Request Flow

```
1. User submits form
   ↓
2. React validates input
   ↓
3. Axios sends POST to /api/trips/calculate/
   ↓
4. Django middleware processes request
   ↓
5. DRF serializer validates data
   ↓
6. TripCalculationView calls TripCalculator
   ↓
7. TripCalculator orchestrates:
   a. RouteService.geocode() × 3
   b. RouteService.calculate_route()
   c. TripCalculator._calculate_stops()
   d. ELDSimulator.simulate_trip()
   ↓
8. Response serialized to JSON
   ↓
9. React receives data
   ↓
10. State updated, UI re-renders
```

## Key Algorithms

### HOS Simulation Algorithm

```python
for each stop in route:
    # Check if rest needed
    if daily_driving >= 11h OR daily_on_duty >= 14h:
        insert_rest_break(10h)
        reset_daily_counters()
    
    # Calculate driving to stop
    drive_hours = distance / 60mph
    
    # Check day boundary
    if crosses_midnight:
        create_new_daily_log()
    
    # Add stop activity
    add_on_duty_time(stop.duration)
    
    # Update counters
    daily_driving += drive_hours
    daily_on_duty += drive_hours + stop.duration
    cycle_hours += drive_hours + stop.duration
```

### Fuel Stop Insertion

```python
current_distance = 0
while current_distance + 1000 < total_distance:
    current_distance += 1000
    
    # Don't add if too close to pickup/dropoff
    if not_near_other_stops(current_distance):
        stops.append({
            type: "Fuel Stop",
            distance: current_distance,
            duration: 0.25h  # 15 minutes
        })
```

## Frontend Architecture

### State Management

Simple React hooks (useState) for:
- Form data
- Trip results
- Loading state
- Error state

**Rationale**: Application state is simple enough that Redux/Context would be over-engineering.

### Component Communication

```
App (state container)
├── TripForm (props: onSubmit, loading)
├── MapView (props: route, stops)
└── ELDLogsViewer (props: logs)
    └── ELDLogSheet (props: log, dayNumber)
```

### Rendering Strategy

**ELD Logs**: Canvas-based rendering
- Performance: Handles complex grids efficiently
- Precision: Pixel-perfect DOT-style logs
- Flexibility: Easy to customize appearance

**Map**: Canvas-based visualization
- Lightweight: No external map library dependencies
- Customizable: Full control over appearance
- Fallback: Works without API keys

## Deployment Architecture

### Single-Service Deployment

```
                    ┌─────────────────┐
                    │   Load Balancer │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   Gunicorn      │
                    │   (WSGI Server) │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   Django App    │
                    │   ├── API       │
                    │   └── Static    │
                    └─────────────────┘
```

### Static File Serving

**Development**:
- Vite dev server (hot reload)
- Django serves API

**Production**:
- Vite builds to `frontend/dist/`
- Django collectstatic copies to `staticfiles/`
- Whitenoise serves with compression and caching

### Scaling Strategy

**Horizontal Scaling**:
- Stateless design enables easy replication
- Load balancer distributes requests
- No session state to manage

**Vertical Scaling**:
- Increase Gunicorn workers
- Adjust memory allocation
- Optimize route calculation caching

## Security Considerations

### Current Implementation

- CSRF protection enabled
- CORS configured for development
- Input validation via DRF serializers
- SQL injection prevented (ORM usage)
- XSS prevention (React escaping)

### Production Recommendations

- Enable HTTPS (SSL/TLS)
- Set secure cookie flags
- Implement rate limiting
- Add request logging
- Configure security headers
- Use environment variables for secrets

## Performance Optimization

### Backend

1. **Route Calculation**:
   - OSRM API is fast (< 1s for most routes)
   - Fallback to geodesic if OSRM unavailable
   - Could add caching for repeated routes

2. **ELD Simulation**:
   - Pure Python calculation (< 100ms)
   - No database queries
   - Linear time complexity O(n) where n = stops

### Frontend

1. **Bundle Size**:
   - Vite tree-shaking reduces bundle
   - Tailwind purges unused CSS
   - No heavy dependencies

2. **Rendering**:
   - Canvas rendering is performant
   - React memoization where needed
   - Lazy loading for future features

## Testing Strategy

### Backend Testing

```python
# Unit tests for services
test_route_calculation()
test_eld_simulation()
test_hos_compliance()

# Integration tests for API
test_trip_calculation_endpoint()
test_validation_errors()
test_error_handling()
```

### Frontend Testing

```javascript
// Component tests
test_form_validation()
test_map_rendering()
test_eld_log_display()

// Integration tests
test_complete_trip_flow()
test_error_handling()
```

## Future Enhancements

### Phase 2 Features

1. **User Accounts**:
   - Save trip history
   - Favorite routes
   - Driver profiles

2. **Advanced Routing**:
   - Avoid tolls/highways
   - Weather considerations
   - Traffic integration

3. **Enhanced ELD**:
   - Export to PDF
   - DOT compliance reports
   - Multi-driver support

4. **Analytics**:
   - Trip statistics
   - Fuel cost estimation
   - Efficiency metrics

### Technical Improvements

1. **Caching**:
   - Redis for route caching
   - Session storage for form data

2. **Real-time Updates**:
   - WebSocket for live tracking
   - Progress notifications

3. **Mobile App**:
   - React Native version
   - Offline support

## Monitoring and Observability

### Recommended Tools

- **Application Monitoring**: Sentry
- **Performance**: New Relic / DataDog
- **Logging**: CloudWatch / Papertrail
- **Uptime**: Pingdom / UptimeRobot

### Key Metrics

- API response time (p50, p95, p99)
- Error rate
- Request volume
- User sessions
- Route calculation success rate

## Conclusion

This architecture prioritizes:
- **Simplicity**: Single deployment, clear layers
- **Maintainability**: Clean separation of concerns
- **Performance**: Efficient algorithms, optimized rendering
- **Scalability**: Stateless design, horizontal scaling ready
- **Production-readiness**: Error handling, validation, security

The single-service approach reduces operational complexity while maintaining professional-grade code quality and user experience.
