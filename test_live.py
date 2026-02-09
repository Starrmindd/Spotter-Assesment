"""
Live test of the ELD Trip Planner API
"""
import requests
import json

# API endpoint
url = 'http://127.0.0.1:8000/api/trips/calculate/'

# Test data - Short trip
data = {
    'current_location': 'Los Angeles, CA',
    'pickup_location': 'San Diego, CA',
    'dropoff_location': 'Phoenix, AZ',
    'current_cycle_hours': 10.0
}

print("=" * 60)
print("ELD TRIP PLANNER - LIVE TEST")
print("=" * 60)
print(f"\nTesting API at: {url}")
print(f"\nTrip Details:")
print(f"  Current Location: {data['current_location']}")
print(f"  Pickup Location:  {data['pickup_location']}")
print(f"  Dropoff Location: {data['dropoff_location']}")
print(f"  Current Cycle:    {data['current_cycle_hours']} hours")
print("\nSending request...")

try:
    response = requests.post(url, json=data, timeout=30)
    
    if response.status_code == 200:
        result = response.json()
        
        print("\n✅ SUCCESS! Trip calculated successfully!")
        print("\n" + "=" * 60)
        print("TRIP SUMMARY")
        print("=" * 60)
        print(f"Total Distance:    {result['summary']['total_distance']} miles")
        print(f"Trip Duration:     {result['summary']['total_days']} days")
        print(f"Total Stops:       {result['summary']['total_stops']}")
        print(f"Cycle Hours Used:  {result['summary']['final_cycle_hours']} hours")
        print(f"Cycle Remaining:   {result['summary']['cycle_hours_remaining']} hours")
        
        print("\n" + "=" * 60)
        print("STOPS")
        print("=" * 60)
        for i, stop in enumerate(result['stops'], 1):
            print(f"{i}. {stop['type']} @ {stop['distance_from_start']:.1f} miles ({stop['duration']} hour)")
        
        print("\n" + "=" * 60)
        print("DAILY ELD LOGS")
        print("=" * 60)
        for i, log in enumerate(result['daily_logs'], 1):
            print(f"\nDay {i} ({log['date']}):")
            print(f"  Driving:  {log['totals']['driving']:.1f} hours")
            print(f"  On Duty:  {log['totals']['on_duty']:.1f} hours")
            print(f"  Off Duty: {log['totals']['off_duty']:.1f} hours")
            print(f"  Events:   {len(log['timeline'])}")
        
        print("\n" + "=" * 60)
        print("✅ API IS WORKING PERFECTLY!")
        print("=" * 60)
        print("\n🌐 Open your browser to: http://127.0.0.1:8000")
        print("   to see the full React interface!\n")
        
    else:
        print(f"\n❌ Error: {response.status_code}")
        print(response.json())
        
except requests.exceptions.ConnectionError:
    print("\n❌ ERROR: Could not connect to server")
    print("   Make sure Django server is running at http://127.0.0.1:8000")
except Exception as e:
    print(f"\n❌ ERROR: {str(e)}")
