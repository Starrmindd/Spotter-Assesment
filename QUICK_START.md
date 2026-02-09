# Quick Start Guide

## Prerequisites

- Python 3.11+
- Node.js 18+
- pip and npm

## Installation (5 minutes)

### Option 1: Automated Setup (Recommended)

**Windows:**
```bash
setup.bat
```

**Mac/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

### Option 2: Manual Setup

1. **Create virtual environment:**
```bash
python -m venv venv
```

2. **Activate virtual environment:**

Windows:
```bash
venv\Scripts\activate
```

Mac/Linux:
```bash
source venv/bin/activate
```

3. **Install Python dependencies:**
```bash
pip install -r requirements.txt
```

4. **Install and build frontend:**
```bash
cd frontend
npm install
npm run build
cd ..
```

5. **Setup Django:**
```bash
python manage.py migrate
python manage.py collectstatic --noinput
```

## Running the Application

### Production Mode (Recommended for Demo)

```bash
python manage.py runserver
```

Open: http://localhost:8000

### Development Mode (Hot Reload)

**Terminal 1 - Backend:**
```bash
python manage.py runserver
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Open: http://localhost:5173

## Testing the Application

### Example Trip 1: Short Trip
- Current: San Francisco, CA
- Pickup: San Jose, CA
- Dropoff: Sacramento, CA
- Cycle Hours: 5

Expected: Single day, ~200 miles, no rest breaks

### Example Trip 2: Medium Trip
- Current: Los Angeles, CA
- Pickup: Phoenix, AZ
- Dropoff: Dallas, TX
- Cycle Hours: 15

Expected: 2-3 days, ~1,400 miles, fuel stops, rest breaks

### Example Trip 3: Long Trip
- Current: New York, NY
- Pickup: Chicago, IL
- Dropoff: Los Angeles, CA
- Cycle Hours: 20

Expected: 4-5 days, ~2,800 miles, multiple fuel stops, proper HOS compliance

## API Testing

### Using curl:

```bash
curl -X POST http://localhost:8000/api/trips/calculate/ \
  -H "Content-Type: application/json" \
  -d '{
    "current_location": "Los Angeles, CA",
    "pickup_location": "Phoenix, AZ",
    "dropoff_location": "Dallas, TX",
    "current_cycle_hours": 15.5
  }'
```

### Using Python:

```python
import requests

response = requests.post('http://localhost:8000/api/trips/calculate/', json={
    'current_location': 'Los Angeles, CA',
    'pickup_location': 'Phoenix, AZ',
    'dropoff_location': 'Dallas, TX',
    'current_cycle_hours': 15.5
})

print(response.json())
```

## Common Issues

### Issue: "django-admin not found"
**Solution**: Activate virtual environment first
```bash
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate     # Windows
```

### Issue: "Module not found"
**Solution**: Install dependencies
```bash
pip install -r requirements.txt
```

### Issue: "Static files not loading"
**Solution**: Rebuild frontend and collect static
```bash
cd frontend
npm run build
cd ..
python manage.py collectstatic --noinput
```

### Issue: "CORS error in development"
**Solution**: Use the correct URL
- Frontend dev server: http://localhost:5173
- Backend API: http://localhost:8000

### Issue: "Route calculation fails"
**Solution**: Check internet connection (OSRM API requires internet)

## Project Structure Overview

```
eld-trip-planner/
├── config/              # Django settings
├── trips/               # Main app
│   ├── services/        # Business logic
│   ├── views.py         # API endpoints
│   └── serializers.py   # Validation
├── frontend/            # React app
│   ├── src/
│   │   ├── components/  # UI components
│   │   └── services/    # API client
│   └── dist/            # Built files
└── templates/           # Django templates
```

## Key Files

- `config/settings.py` - Django configuration
- `trips/services/trip_calculator.py` - Main business logic
- `frontend/src/App.jsx` - React root component
- `frontend/src/components/ELDLogSheet.jsx` - ELD rendering

## Environment Variables

Create `.env` file (copy from `.env.example`):

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
MAPBOX_TOKEN=optional-for-enhanced-maps
```

## Next Steps

1. ✅ Run the application
2. ✅ Test with example trips
3. ✅ Review the code structure
4. ✅ Read ARCHITECTURE.md for deep dive
5. ✅ Check DEPLOYMENT.md for production setup
6. ✅ Review LOOM_SCRIPT.md for presentation

## Development Workflow

### Making Changes

1. **Backend changes:**
   - Edit files in `trips/`
   - Django auto-reloads
   - Test at http://localhost:8000

2. **Frontend changes:**
   - Edit files in `frontend/src/`
   - Vite hot-reloads (if using dev server)
   - Rebuild: `cd frontend && npm run build`

### Before Committing

```bash
# Rebuild frontend
cd frontend
npm run build
cd ..

# Collect static files
python manage.py collectstatic --noinput

# Test the application
python manage.py runserver
```

## Deployment Checklist

- [ ] Set `DEBUG=False` in production
- [ ] Set strong `SECRET_KEY`
- [ ] Configure `ALLOWED_HOSTS`
- [ ] Build frontend: `npm run build`
- [ ] Collect static: `python manage.py collectstatic`
- [ ] Use Gunicorn: `gunicorn config.wsgi`
- [ ] Enable HTTPS
- [ ] Set up monitoring

## Getting Help

1. Check TESTING.md for test scenarios
2. Review ARCHITECTURE.md for design decisions
3. See DEPLOYMENT.md for production setup
4. Check GitHub issues (if applicable)

## Performance Tips

- Use production mode for demos (faster)
- Clear browser cache if seeing old frontend
- Check network tab for API response times
- Monitor console for errors

## Assumptions & Limitations

### Assumptions
- Property-carrying driver
- 70 hours / 8 days cycle
- 11-hour daily driving limit
- 14-hour on-duty limit
- 10-hour rest break required
- Average speed: 60 mph
- Fuel every 1,000 miles

### Current Limitations
- No real-time traffic data
- No weather considerations
- No toll road avoidance
- No multi-driver support
- No trip history persistence

### Future Enhancements
- User accounts
- Trip history
- PDF export
- Mobile app
- Real-time tracking

## Success Criteria

You'll know it's working when:
- ✅ Form accepts input without errors
- ✅ Loading spinner appears during calculation
- ✅ Map displays route with waypoints
- ✅ ELD logs show proper duty status transitions
- ✅ Daily totals respect HOS limits
- ✅ Rest breaks inserted automatically
- ✅ Fuel stops appear every ~1,000 miles

## Contact & Support

For questions or issues:
1. Review documentation files
2. Check console for errors
3. Verify all dependencies installed
4. Ensure internet connection (for routing API)

---

**Ready to start?** Run `python manage.py runserver` and open http://localhost:8000

**Want hot reload?** Run `cd frontend && npm run dev` and open http://localhost:5173
