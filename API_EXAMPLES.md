# API Examples

## Endpoint

```
POST /api/trips/calculate/
Content-Type: application/json
```

## Example 1: Short Trip (Same Day)

### Request
```json
{
  "current_location": "San Francisco, CA",
  "pickup_location": "San Jose, CA",
  "dropoff_location": "Sacramento, CA",
  "current_cycle_hours": 5.0
}
```

### Expected Response
```json
{
  "route": {
    "total_distance": 178.3,
    "total_duration": 2.97,
    "coordinates": [
      [-122.4194, 37.7749],
      [-121.8863, 37.3382],
      [-121.4944, 38.5816]
    ],
    "waypoints": [
      {
        "name": "Start",
        "coords": [-122.4194, 37.7749]
      },
      {
        "name": "Pickup",
        "coords": [-121.8863, 37.3382]
      },
      {
        "name": "Dropoff",
        "coords": [-121.4944, 38.5816]
      }
    ]
  },
  "stops": [
    {
      "type": "Pickup",
      "distance_from_start": 48.2,
      "duration": 1.0,
      "coords": [-121.8863, 37.3382]
    },
    {
      "type": "Dropoff",
      "distance_from_start": 178.3,
      "duration": 1.0,
      "coords": [-121.4944, 38.5816]
    }
  ],
  "daily_logs": [
    {
      "date": "2024-01-15",
      "timeline": [
        {
          "status": "driving",
          "start": 8.0,
          "end": 8.8,
          "description": "Driving to Pickup"
        },
        {
          "status": "on_duty",
          "start": 8.8,
          "end": 9.8,
          "description": "Pickup"
        },
        {
          "status": "driving",
          "start": 9.8,
          "end": 12.0,
          "description": "Driving to Dropoff"
        },
        {
          "status": "on_duty",
          "start": 12.0,
          "end": 13.0,
          "description": "Dropoff"
        }
      ],
      "totals": {
        "driving": 3.0,
        "on_duty": 5.0,
        "off_duty": 19.0
      }
    }
  ],
  "summary": {
    "total_days": 1,
    "final_cycle_hours": 10.0,
    "cycle_hours_remaining": 60.0,
    "start_time": "2024-01-15T08:00:00",
    "end_time": "2024-01-15T13:00:00",
    "total_distance": 178.3,
    "estimated_duration": 2.97,
    "total_stops": 2
  }
}
```

## Example 2: Medium Trip (Multi-Day)

### Request
```json
{
  "current_location": "Los Angeles, CA",
  "pickup_location": "Phoenix, AZ",
  "dropoff_location": "Dallas, TX",
  "current_cycle_hours": 15.5
}
```

### Expected Response
```json
{
  "route": {
    "total_distance": 1423.7,
    "total_duration": 23.73,
    "coordinates": [
      [-118.2437, 34.0522],
      [-112.0740, 33.4484],
      [-96.7970, 32.7767]
    ],
    "waypoints": [
      {
        "name": "Start",
        "coords": [-118.2437, 34.0522]
      },
      {
        "name": "Pickup",
        "coords": [-112.0740, 33.4484]
      },
      {
        "name": "Dropoff",
        "coords": [-96.7970, 32.7767]
      }
    ]
  },
  "stops": [
    {
      "type": "Pickup",
      "distance_from_start": 373.2,
      "duration": 1.0,
      "coords": [-112.0740, 33.4484]
    },
    {
      "type": "Fuel Stop",
      "distance_from_start": 1000.0,
      "duration": 0.25,
      "coords": [-105.2345, 33.1234]
    },
    {
      "type": "Dropoff",
      "distance_from_start": 1423.7,
      "duration": 1.0,
      "coords": [-96.7970, 32.7767]
    }
  ],
  "daily_logs": [
    {
      "date": "2024-01-15",
      "timeline": [
        {
          "status": "driving",
          "start": 8.0,
          "end": 14.22,
          "description": "Driving to Pickup"
        },
        {
          "status": "on_duty",
          "start": 14.22,
          "end": 15.22,
          "description": "Pickup"
        },
        {
          "status": "driving",
          "start": 15.22,
          "end": 19.67,
          "description": "Driving to Fuel Stop"
        },
        {
          "status": "sleeper",
          "start": 19.67,
          "end": 24.0,
          "description": "Required rest break"
        }
      ],
      "totals": {
        "driving": 10.67,
        "on_duty": 11.67,
        "off_duty": 12.33
      }
    },
    {
      "date": "2024-01-16",
      "timeline": [
        {
          "status": "sleeper",
          "start": 0.0,
          "end": 5.67,
          "description": "Required rest break"
        },
        {
          "status": "on_duty",
          "start": 5.67,
          "end": 5.92,
          "description": "Fuel Stop"
        },
        {
          "status": "driving",
          "start": 5.92,
          "end": 13.0,
          "description": "Driving to Dropoff"
        },
        {
          "status": "on_duty",
          "start": 13.0,
          "end": 14.0,
          "description": "Dropoff"
        }
      ],
      "totals": {
        "driving": 7.08,
        "on_duty": 8.33,
        "off_duty": 15.67
      }
    }
  ],
  "summary": {
    "total_days": 2,
    "final_cycle_hours": 35.5,
    "cycle_hours_remaining": 34.5,
    "start_time": "2024-01-15T08:00:00",
    "end_time": "2024-01-16T14:00:00",
    "total_distance": 1423.7,
    "estimated_duration": 23.73,
    "total_stops": 3
  }
}
```

## Example 3: Long Trip (Cross-Country)

### Request
```json
{
  "current_location": "New York, NY",
  "pickup_location": "Chicago, IL",
  "dropoff_location": "Los Angeles, CA",
  "current_cycle_hours": 20.0
}
```

### Expected Response
```json
{
  "route": {
    "total_distance": 2789.4,
    "total_duration": 46.49,
    "coordinates": [
      [-74.0060, 40.7128],
      [-87.6298, 41.8781],
      [-118.2437, 34.0522]
    ],
    "waypoints": [
      {
        "name": "Start",
        "coords": [-74.0060, 40.7128]
      },
      {
        "name": "Pickup",
        "coords": [-87.6298, 41.8781]
      },
      {
        "name": "Dropoff",
        "coords": [-118.2437, 34.0522]
      }
    ]
  },
  "stops": [
    {
      "type": "Pickup",
      "distance_from_start": 789.6,
      "duration": 1.0,
      "coords": [-87.6298, 41.8781]
    },
    {
      "type": "Fuel Stop",
      "distance_from_start": 1000.0,
      "duration": 0.25,
      "coords": [-91.5234, 41.2345]
    },
    {
      "type": "Fuel Stop",
      "distance_from_start": 2000.0,
      "duration": 0.25,
      "coords": [-106.1234, 35.6789]
    },
    {
      "type": "Dropoff",
      "distance_from_start": 2789.4,
      "duration": 1.0,
      "coords": [-118.2437, 34.0522]
    }
  ],
  "daily_logs": [
    {
      "date": "2024-01-15",
      "timeline": [
        {
          "status": "driving",
          "start": 8.0,
          "end": 19.0,
          "description": "Driving to Pickup"
        },
        {
          "status": "sleeper",
          "start": 19.0,
          "end": 24.0,
          "description": "Required rest break"
        }
      ],
      "totals": {
        "driving": 11.0,
        "on_duty": 11.0,
        "off_duty": 13.0
      }
    },
    {
      "date": "2024-01-16",
      "timeline": [
        {
          "status": "sleeper",
          "start": 0.0,
          "end": 5.0,
          "description": "Required rest break"
        },
        {
          "status": "on_duty",
          "start": 5.0,
          "end": 6.0,
          "description": "Pickup"
        },
        {
          "status": "driving",
          "start": 6.0,
          "end": 9.5,
          "description": "Driving to Fuel Stop"
        },
        {
          "status": "on_duty",
          "start": 9.5,
          "end": 9.75,
          "description": "Fuel Stop"
        },
        {
          "status": "driving",
          "start": 9.75,
          "end": 20.0,
          "description": "Driving to Fuel Stop"
        },
        {
          "status": "sleeper",
          "start": 20.0,
          "end": 24.0,
          "description": "Required rest break"
        }
      ],
      "totals": {
        "driving": 13.75,
        "on_duty": 15.0,
        "off_duty": 9.0
      }
    },
    {
      "date": "2024-01-17",
      "timeline": [
        {
          "status": "sleeper",
          "start": 0.0,
          "end": 6.0,
          "description": "Required rest break"
        },
        {
          "status": "on_duty",
          "start": 6.0,
          "end": 6.25,
          "description": "Fuel Stop"
        },
        {
          "status": "driving",
          "start": 6.25,
          "end": 17.0,
          "description": "Driving to Dropoff"
        },
        {
          "status": "on_duty",
          "start": 17.0,
          "end": 18.0,
          "description": "Dropoff"
        }
      ],
      "totals": {
        "driving": 10.75,
        "on_duty": 12.0,
        "off_duty": 12.0
      }
    }
  ],
  "summary": {
    "total_days": 3,
    "final_cycle_hours": 58.0,
    "cycle_hours_remaining": 12.0,
    "start_time": "2024-01-15T08:00:00",
    "end_time": "2024-01-17T18:00:00",
    "total_distance": 2789.4,
    "estimated_duration": 46.49,
    "total_stops": 4
  }
}
```

## Example 4: High Cycle Hours (Near Limit)

### Request
```json
{
  "current_location": "Miami, FL",
  "pickup_location": "Atlanta, GA",
  "dropoff_location": "Nashville, TN",
  "current_cycle_hours": 65.0
}
```

### Expected Response
```json
{
  "route": {
    "total_distance": 872.5,
    "total_duration": 14.54,
    "coordinates": [
      [-80.1918, 25.7617],
      [-84.3880, 33.7490],
      [-86.7816, 36.1627]
    ],
    "waypoints": [
      {
        "name": "Start",
        "coords": [-80.1918, 25.7617]
      },
      {
        "name": "Pickup",
        "coords": [-84.3880, 33.7490]
      },
      {
        "name": "Dropoff",
        "coords": [-86.7816, 36.1627]
      }
    ]
  },
  "stops": [
    {
      "type": "Pickup",
      "distance_from_start": 662.3,
      "duration": 1.0,
      "coords": [-84.3880, 33.7490]
    },
    {
      "type": "Dropoff",
      "distance_from_start": 872.5,
      "duration": 1.0,
      "coords": [-86.7816, 36.1627]
    }
  ],
  "daily_logs": [
    {
      "date": "2024-01-15",
      "timeline": [
        {
          "status": "driving",
          "start": 8.0,
          "end": 13.0,
          "description": "Driving to Pickup"
        },
        {
          "status": "sleeper",
          "start": 13.0,
          "end": 23.0,
          "description": "Required rest break (cycle limit approaching)"
        },
        {
          "status": "on_duty",
          "start": 23.0,
          "end": 24.0,
          "description": "Pickup"
        }
      ],
      "totals": {
        "driving": 5.0,
        "on_duty": 6.0,
        "off_duty": 18.0
      }
    },
    {
      "date": "2024-01-16",
      "timeline": [
        {
          "status": "driving",
          "start": 0.0,
          "end": 3.5,
          "description": "Driving to Dropoff"
        },
        {
          "status": "on_duty",
          "start": 3.5,
          "end": 4.5,
          "description": "Dropoff"
        }
      ],
      "totals": {
        "driving": 3.5,
        "on_duty": 4.5,
        "off_duty": 19.5
      }
    }
  ],
  "summary": {
    "total_days": 2,
    "final_cycle_hours": 69.5,
    "cycle_hours_remaining": 0.5,
    "start_time": "2024-01-15T08:00:00",
    "end_time": "2024-01-16T04:30:00",
    "total_distance": 872.5,
    "estimated_duration": 14.54,
    "total_stops": 2
  }
}
```

## Error Responses

### Validation Error (400)
```json
{
  "error": "Invalid input",
  "details": {
    "current_location": [
      "This field may not be blank."
    ],
    "current_cycle_hours": [
      "Current cycle hours must be between 0 and 70"
    ]
  }
}
```

### Geocoding Error (400)
```json
{
  "error": "Calculation error",
  "message": "Could not geocode address: InvalidCity123"
}
```

### Server Error (500)
```json
{
  "error": "Server error",
  "message": "An unexpected error occurred during calculation"
}
```

## Testing with curl

### Basic Request
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

### With Pretty Print (using jq)
```bash
curl -X POST http://localhost:8000/api/trips/calculate/ \
  -H "Content-Type: application/json" \
  -d '{
    "current_location": "Los Angeles, CA",
    "pickup_location": "Phoenix, AZ",
    "dropoff_location": "Dallas, TX",
    "current_cycle_hours": 15.5
  }' | jq '.'
```

### Save Response to File
```bash
curl -X POST http://localhost:8000/api/trips/calculate/ \
  -H "Content-Type: application/json" \
  -d '{
    "current_location": "Los Angeles, CA",
    "pickup_location": "Phoenix, AZ",
    "dropoff_location": "Dallas, TX",
    "current_cycle_hours": 15.5
  }' > response.json
```

## Testing with Python

```python
import requests
import json

# API endpoint
url = 'http://localhost:8000/api/trips/calculate/'

# Request data
data = {
    'current_location': 'Los Angeles, CA',
    'pickup_location': 'Phoenix, AZ',
    'dropoff_location': 'Dallas, TX',
    'current_cycle_hours': 15.5
}

# Make request
response = requests.post(url, json=data)

# Check status
if response.status_code == 200:
    result = response.json()
    print(json.dumps(result, indent=2))
else:
    print(f"Error: {response.status_code}")
    print(response.json())
```

## Testing with JavaScript (Node.js)

```javascript
const axios = require('axios');

const url = 'http://localhost:8000/api/trips/calculate/';

const data = {
  current_location: 'Los Angeles, CA',
  pickup_location: 'Phoenix, AZ',
  dropoff_location: 'Dallas, TX',
  current_cycle_hours: 15.5
};

axios.post(url, data)
  .then(response => {
    console.log(JSON.stringify(response.data, null, 2));
  })
  .catch(error => {
    console.error('Error:', error.response?.data || error.message);
  });
```

## Response Field Descriptions

### route
- `total_distance`: Total trip distance in miles
- `total_duration`: Total driving time in hours
- `coordinates`: Array of [longitude, latitude] pairs for route line
- `waypoints`: Named waypoints with coordinates

### stops
- `type`: "Pickup", "Dropoff", or "Fuel Stop"
- `distance_from_start`: Cumulative distance from start in miles
- `duration`: Stop duration in hours
- `coords`: [longitude, latitude] of stop location

### daily_logs
- `date`: ISO date string (YYYY-MM-DD)
- `timeline`: Array of duty status events
  - `status`: "off_duty", "sleeper", "driving", or "on_duty"
  - `start`: Hour of day (0-24)
  - `end`: Hour of day (0-24)
  - `description`: Human-readable description
- `totals`: Daily hour totals
  - `driving`: Total driving hours
  - `on_duty`: Total on-duty hours (includes driving)
  - `off_duty`: Total off-duty hours

### summary
- `total_days`: Number of days for trip
- `final_cycle_hours`: Total cycle hours after trip
- `cycle_hours_remaining`: Hours remaining in 70-hour cycle
- `start_time`: Trip start timestamp (ISO 8601)
- `end_time`: Trip end timestamp (ISO 8601)
- `total_distance`: Same as route.total_distance
- `estimated_duration`: Same as route.total_duration
- `total_stops`: Number of stops (fuel + pickup + dropoff)

## Notes

- All distances are in miles
- All durations are in hours (decimal)
- All coordinates are in [longitude, latitude] format
- Times are in 24-hour format (0-24)
- Dates are in ISO 8601 format
- Cycle hours are cumulative (0-70)
