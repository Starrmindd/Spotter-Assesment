# Testing Guide

## Manual Testing Checklist

### Backend API Testing

1. **Test Trip Calculation Endpoint**

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

Expected: 200 OK with route, stops, and daily_logs

2. **Test Invalid Input**

```bash
curl -X POST http://localhost:8000/api/trips/calculate/ \
  -H "Content-Type: application/json" \
  -d '{
    "current_location": "",
    "pickup_location": "Phoenix, AZ",
    "dropoff_location": "Dallas, TX",
    "current_cycle_hours": 80
  }'
```

Expected: 400 Bad Request with validation errors

3. **Test Invalid Location**

```bash
curl -X POST http://localhost:8000/api/trips/calculate/ \
  -H "Content-Type: application/json" \
  -d '{
    "current_location": "InvalidCity123",
    "pickup_location": "Phoenix, AZ",
    "dropoff_location": "Dallas, TX",
    "current_cycle_hours": 10
  }'
```

Expected: 400 Bad Request with geocoding error

### Frontend Testing

1. **Form Validation**
   - [ ] Empty fields show validation errors
   - [ ] Cycle hours < 0 rejected
   - [ ] Cycle hours > 70 rejected
   - [ ] Submit button disabled during loading

2. **Trip Calculation**
   - [ ] Loading spinner appears
   - [ ] Results display after calculation
   - [ ] Summary cards show correct data
   - [ ] Map renders with route
   - [ ] ELD logs display correctly

3. **ELD Logs**
   - [ ] Day tabs switch correctly
   - [ ] Timeline grid renders properly
   - [ ] Duty statuses color-coded
   - [ ] Daily totals calculated correctly
   - [ ] Event details list accurate

4. **Responsive Design**
   - [ ] Mobile view (< 768px)
   - [ ] Tablet view (768px - 1024px)
   - [ ] Desktop view (> 1024px)

### Test Scenarios

#### Scenario 1: Short Trip (Same Day)
```json
{
  "current_location": "San Francisco, CA",
  "pickup_location": "San Jose, CA",
  "dropoff_location": "Sacramento, CA",
  "current_cycle_hours": 5
}
```
Expected: Single day log, no rest breaks

#### Scenario 2: Long Trip (Multi-Day)
```json
{
  "current_location": "New York, NY",
  "pickup_location": "Chicago, IL",
  "dropoff_location": "Los Angeles, CA",
  "current_cycle_hours": 20
}
```
Expected: Multiple day logs, rest breaks, fuel stops

#### Scenario 3: High Cycle Hours
```json
{
  "current_location": "Miami, FL",
  "pickup_location": "Atlanta, GA",
  "dropoff_location": "Nashville, TN",
  "current_cycle_hours": 65
}
```
Expected: Limited driving before rest required

#### Scenario 4: Cross-Country
```json
{
  "current_location": "Seattle, WA",
  "pickup_location": "Denver, CO",
  "dropoff_location": "Boston, MA",
  "current_cycle_hours": 10
}
```
Expected: 4-5 day trip, multiple fuel stops, proper rest scheduling

## HOS Regulation Verification

### 11-Hour Driving Limit
- [ ] No single day exceeds 11 hours of driving
- [ ] Rest break inserted when limit reached

### 14-Hour On-Duty Limit
- [ ] Total on-duty (driving + pickup/dropoff) ≤ 14 hours per day
- [ ] Rest break inserted when limit reached

### 10-Hour Rest Requirement
- [ ] Rest breaks are at least 10 hours
- [ ] Counters reset after rest

### 70-Hour Cycle
- [ ] Final cycle hours = initial + trip hours
- [ ] Cycle hours remaining calculated correctly

## Performance Testing

1. **API Response Time**
   - Short trip (< 500 miles): < 2 seconds
   - Medium trip (500-1500 miles): < 5 seconds
   - Long trip (> 1500 miles): < 10 seconds

2. **Frontend Rendering**
   - Initial load: < 1 second
   - Map render: < 2 seconds
   - ELD log render: < 500ms per day

## Browser Compatibility

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

## Accessibility

- [ ] Keyboard navigation works
- [ ] Form labels properly associated
- [ ] Color contrast meets WCAG AA
- [ ] Focus indicators visible

## Error Handling

1. **Network Errors**
   - [ ] Timeout handled gracefully
   - [ ] Connection error shows user-friendly message
   - [ ] Retry mechanism available

2. **API Errors**
   - [ ] 400 errors display validation messages
   - [ ] 500 errors show generic error message
   - [ ] Error state clearable

3. **Edge Cases**
   - [ ] Very short distances (< 10 miles)
   - [ ] Very long distances (> 3000 miles)
   - [ ] International locations (if supported)
   - [ ] Special characters in location names

## Automated Testing (Future)

### Backend Unit Tests
```python
# trips/tests/test_services.py
from django.test import TestCase
from trips.services import TripCalculator, ELDSimulator

class ELDSimulatorTests(TestCase):
    def test_11_hour_driving_limit(self):
        # Test implementation
        pass
    
    def test_rest_break_insertion(self):
        # Test implementation
        pass
```

### Frontend Unit Tests
```javascript
// frontend/src/components/__tests__/TripForm.test.jsx
import { render, screen, fireEvent } from '@testing-library/react'
import TripForm from '../TripForm'

test('validates empty fields', () => {
  // Test implementation
})
```

## Load Testing

Use Apache Bench or similar:
```bash
ab -n 100 -c 10 -p trip.json -T application/json http://localhost:8000/api/trips/calculate/
```

Expected: 95% of requests complete successfully

## Security Testing

- [ ] CSRF protection enabled
- [ ] SQL injection prevented (using ORM)
- [ ] XSS prevention (React escaping)
- [ ] Rate limiting considered
- [ ] Environment variables not exposed

## Deployment Testing

1. **Pre-Deployment**
   - [ ] All tests pass
   - [ ] Static files build successfully
   - [ ] Environment variables configured
   - [ ] Database migrations ready

2. **Post-Deployment**
   - [ ] Health check endpoint responds
   - [ ] Static files load correctly
   - [ ] API endpoints accessible
   - [ ] HTTPS working
   - [ ] Error logging active

## Monitoring

Set up monitoring for:
- API response times
- Error rates
- User sessions
- Resource usage (CPU, memory)

## Bug Reporting Template

```markdown
**Description**: Brief description of the issue

**Steps to Reproduce**:
1. Step one
2. Step two
3. Step three

**Expected Behavior**: What should happen

**Actual Behavior**: What actually happens

**Environment**:
- Browser: Chrome 120
- OS: Windows 11
- Screen size: 1920x1080

**Screenshots**: If applicable

**Console Errors**: Any JavaScript errors
```
