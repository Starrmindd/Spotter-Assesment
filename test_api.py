"""
Test script for ELD Trip Planner API
"""
import requests
import json

# API endpoint
url = 'http://127.0.0.1:8000/api/trips/calculate/'

# Test data - Medium trip
data = {
    'current_location': 'Los Angeles, CA',
    'pickup_location': 'Phoenix, AZ',
    'dropoff_location': 'Dallas, TX',
    'current_cycle_hours': 15.5
}

print("=" * 60)
print("ELD TRIP PLANNER - API TEST")
print("=" * 60)
print(f"\nTesting endpoint: {url}")
print(f"\nRequest data:")
print(json.dumps(data, indent=2))
print("\nSending request...")

try:
    response = requests.post(url, json=data, timeout=30)
    
    print(f"\nStatus Code: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        
        print("\n" + "=" * 60)
        print("SUCCESS! Trip calculated successfully")
        print("=" * 60)
        
        # Display summary
        print("\n📊 TRIP SUMMARY:")
        print(f"  Total Distance: {result['summary']['total_distance']} miles")
        print(f"  Trip Duration: {result['summary']['total_days']} days")
        print(f"  Total Stops: {result['summary']['total_stops']}")
        print(f"  Cycle Hours Used: {result['summary']['final_cycle_hours']}h")
        print(f"  Cycle Hours Remaining: {result['summary']['cycle_hours_remaining']}h")
        
        # Display route info
        print("\n🗺️  ROUTE:")
        print(f"  Start: {data['current_location']}")
        print(f"  Pickup: {data['pickup_location']}")
        print(f"  Dropoff: {data['dropoff_location']}")
        
        # Display stops
        print(f"\n⛽ STOPS ({len(result['stops'])}):")
        for i, stop in enumerate(result['stops'], 1):
            print(f"  {i}. {stop['type']} @ {stop['distance_from_start']:.1f} mi ({stop['duration']}h)")
        
        # Display daily logs
        print(f"\n📋 DAILY LOGS ({len(result['daily_logs'])} days):")
        for i, log in enumerate(result['daily_logs'], 1):
            print(f"\n  Day {i} ({log['date']}):")
            print(f"    Driving: {log['totals']['driving']:.1f}h")
            print(f"    On Duty: {log['totals']['on_duty']:.1f}h")
            print(f"    Off Duty: {log['totals']['off_duty']:.1f}h")
            print(f"    Events: {len(log['timeline'])}")
        
        print("\n" + "=" * 60)
        print("✅ API TEST PASSED")
        print("=" * 60)
        
        # Save full response
        with open('api_response.json', 'w') as f:
            json.dump(result, f, indent=2)
        print("\n💾 Full response saved to: api_response.json")
        
    else:
        print(f"\n❌ ERROR: {response.status_code}")
        print(response.json())
        
except requests.exceptions.ConnectionError:
    print("\n❌ ERROR: Could not connect to server")
    print("Make sure the Django server is running at http://127.0.0.1:8000")
except Exception as e:
    print(f"\n❌ ERROR: {str(e)}")

print("\n" + "=" * 60)
