# How to Use the ELD Trip Planner

## 🚀 Quick Start

### 1. Access the Application

**Open your web browser and navigate to:**
```
http://127.0.0.1:8000
```

You'll see a professional interface with:
- Trip input form at the top
- Results section below (appears after calculation)

---

## 📝 Using the Web Interface

### Step 1: Enter Trip Details

Fill in the form with your trip information:

**Current Location**
- Enter your starting point (e.g., "Los Angeles, CA")
- Can be any US city or address

**Pickup Location**
- Where you'll pick up the load
- Example: "Phoenix, AZ"

**Dropoff Location**
- Final destination for delivery
- Example: "Dallas, TX"

**Current Cycle Hours Used**
- How many hours you've already used in your 70-hour/8-day cycle
- Enter a number between 0 and 70
- Example: 15.5

### Step 2: Calculate Trip

Click the **"Calculate Trip"** button

The system will:
1. Geocode all three locations
2. Calculate the optimal route
3. Insert fuel stops every 1,000 miles
4. Simulate HOS-compliant driving schedule
5. Generate DOT-style ELD logs

### Step 3: Review Results

After calculation, you'll see:

#### Summary Cards
- **Total Distance**: Trip mileage
- **Trip Duration**: Number of days
- **Total Stops**: Fuel + pickup + dropoff
- **Cycle Hours Used**: Final cycle hours

#### Route Map
- Visual route with color-coded markers:
  - 🟢 Green: Start location
  - 🟠 Orange: Pickup location
  - 🔴 Red: Dropoff location
  - 🟣 Purple: Fuel stops
- Distance and duration info

#### Daily ELD Logs
- Tabs for each day of the trip
- 24-hour timeline grid showing:
  - 🚛 Driving (blue)
  - 📦 On Duty (orange)
  - 😴 Sleeper (dark gray)
  - 🏠 Off Duty (light gray)
- Daily totals for each status
- Event details list below

---

## 🧪 Example Scenarios to Try

### Scenario 1: Short Local Trip
```
Current Location:  San Francisco, CA
Pickup Location:   San Jose, CA
Dropoff Location:  Sacramento, CA
Current Cycle:     5 hours
```
**Expected**: Single day, ~200 miles, no rest breaks needed

### Scenario 2: Medium Regional Trip
```
Current Location:  Los Angeles, CA
Pickup Location:   Phoenix, AZ
Dropoff Location:  Dallas, TX
Current Cycle:     15 hours
```
**Expected**: 2-3 days, ~1,400 miles, 1 fuel stop, rest breaks

### Scenario 3: Long Cross-Country Trip
```
Current Location:  New York, NY
Pickup Location:   Chicago, IL
Dropoff Location:  Los Angeles, CA
Current Cycle:     20 hours
```
**Expected**: 4-5 days, ~2,800 miles, 2 fuel stops, multiple rest breaks

### Scenario 4: High Cycle Hours
```
Current Location:  Miami, FL
Pickup Location:   Atlanta, GA
Dropoff Location:  Nashville, TN
Current Cycle:     65 hours
```
**Expected**: Limited driving before mandatory rest, cycle near limit

---

## 🎯 Understanding the Results

### HOS Compliance Rules (Enforced Automatically)

**11-Hour Driving Limit**
- Maximum 11 hours of driving per day
- System automatically inserts rest breaks when limit reached

**14-Hour On-Duty Limit**
- Maximum 14 hours on-duty (driving + pickup/dropoff) per day
- Includes all work time, not just driving

**10-Hour Rest Requirement**
- Minimum 10 hours off-duty/sleeper before resuming
- Resets daily driving and on-duty counters

**70-Hour/8-Day Cycle**
- Maximum 70 hours on-duty over 8 consecutive days
- Tracks cumulative hours across the trip

### Stop Types

**Fuel Stop**
- Inserted automatically every 1,000 miles
- Duration: 15 minutes (0.25 hours)
- Counted as on-duty time

**Pickup**
- Loading time at pickup location
- Duration: 1 hour
- Counted as on-duty time

**Dropoff**
- Unloading time at dropoff location
- Duration: 1 hour
- Counted as on-duty time

### ELD Log Colors

**Blue (Driving)**
- Actively driving the vehicle
- Counts toward 11-hour driving limit
- Counts toward 14-hour on-duty limit

**Orange (On Duty)**
- Working but not driving
- Pickup, dropoff, fuel stops
- Counts toward 14-hour on-duty limit

**Dark Gray (Sleeper)**
- Resting in sleeper berth
- Required 10-hour rest breaks
- Does NOT count toward limits

**Light Gray (Off Duty)**
- Not working, not in sleeper
- Does NOT count toward limits

---

## 🔧 API Usage (For Developers)

### Endpoint
```
POST http://127.0.0.1:8000/api/trips/calculate/
Content-Type: application/json
```

### Request Body
```json
{
  "current_location": "Los Angeles, CA",
  "pickup_location": "Phoenix, AZ",
  "dropoff_location": "Dallas, TX",
  "current_cycle_hours": 15.5
}
```

### Response
```json
{
  "route": {
    "total_distance": 1423.7,
    "total_duration": 23.73,
    "coordinates": [[lng, lat], ...],
    "waypoints": [...]
  },
  "stops": [...],
  "daily_logs": [...],
  "summary": {...}
}
```

### Using curl
```bash
curl -X POST http://127.0.0.1:8000/api/trips/calculate/ \
  -H "Content-Type: application/json" \
  -d '{
    "current_location": "Los Angeles, CA",
    "pickup_location": "Phoenix, AZ",
    "dropoff_location": "Dallas, TX",
    "current_cycle_hours": 15.5
  }'
```

### Using Python
```python
import requests

response = requests.post(
    'http://127.0.0.1:8000/api/trips/calculate/',
    json={
        'current_location': 'Los Angeles, CA',
        'pickup_location': 'Phoenix, AZ',
        'dropoff_location': 'Dallas, TX',
        'current_cycle_hours': 15.5
    }
)

result = response.json()
print(f"Distance: {result['summary']['total_distance']} miles")
```

---

## 💡 Tips & Best Practices

### For Accurate Results

1. **Use Full City Names**
   - Good: "Los Angeles, CA"
   - Avoid: "LA" or "L.A."

2. **Include State Abbreviations**
   - Helps with geocoding accuracy
   - Example: "Phoenix, AZ" not just "Phoenix"

3. **Be Realistic with Cycle Hours**
   - Enter actual hours used in current cycle
   - Range: 0-70 hours

4. **Consider Current Time**
   - System starts calculation from current time
   - Rest breaks scheduled accordingly

### Understanding Multi-Day Trips

- **Day Boundaries**: Midnight (00:00) marks new day
- **Rest Breaks**: May span across midnight
- **Event Splitting**: Events crossing midnight appear on both days
- **Totals**: Calculated per calendar day

### Common Scenarios

**"Why did it add a rest break?"**
- You hit the 11-hour driving limit, OR
- You hit the 14-hour on-duty limit
- System automatically inserts 10-hour rest

**"Why are there fuel stops?"**
- Automatically added every 1,000 miles
- Realistic for long-haul trucking
- Can be adjusted in code if needed

**"Why multiple days for short trip?"**
- May have high initial cycle hours
- Rest breaks required before continuing
- HOS limits enforced strictly

---

## 🐛 Troubleshooting

### "Could not geocode address"
- Check spelling of city/state
- Use full names with state abbreviations
- Try different format (e.g., "City, State")

### "Calculation taking too long"
- Very long distances may take 10-30 seconds
- OSRM routing API may be slow
- Wait for completion or refresh

### "Map not showing"
- Frontend may not be built
- Check browser console for errors
- Ensure static files collected

### "API not responding"
- Ensure Django server is running
- Check http://127.0.0.1:8000/api/trips/calculate/
- Review server logs for errors

---

## 📊 Interpreting Results

### Good Trip Planning

**Balanced Cycle Usage**
- Final cycle hours < 60: Good
- Final cycle hours 60-68: Caution
- Final cycle hours > 68: Critical

**Realistic Schedules**
- 400-600 miles per day: Typical
- 600-800 miles per day: Aggressive
- 800+ miles per day: Requires perfect conditions

**Rest Break Timing**
- Breaks at night: Ideal
- Breaks during day: Less ideal but compliant
- Multiple breaks per day: High cycle hours

### Red Flags

- Cycle hours remaining < 2: Need reset soon
- More rest breaks than driving days: Inefficient
- Very short driving segments: Route optimization needed

---

## 🎓 Learning Resources

### HOS Regulations
- [FMCSA Hours of Service](https://www.fmcsa.dot.gov/regulations/hours-service)
- Property-carrying driver rules
- 70-hour/8-day cycle details

### ELD Requirements
- [ELD Mandate](https://www.fmcsa.dot.gov/hours-service/elds)
- Log format requirements
- Compliance guidelines

### Project Documentation
- `README.md` - Project overview
- `ARCHITECTURE.md` - System design
- `API_EXAMPLES.md` - API usage examples
- `TESTING.md` - Test scenarios

---

## 🚀 Next Steps

1. **Try Different Scenarios**: Test various trip types
2. **Review ELD Logs**: Understand the timeline format
3. **Check API Responses**: See the raw data structure
4. **Read Documentation**: Deep dive into architecture
5. **Customize**: Modify assumptions in code

---

## 📞 Support

For issues or questions:
1. Check `TESTING.md` for test scenarios
2. Review `TROUBLESHOOTING.md` for common issues
3. Check browser console for errors
4. Review Django server logs

---

**Enjoy planning compliant trucking trips!** 🚛📋✅
