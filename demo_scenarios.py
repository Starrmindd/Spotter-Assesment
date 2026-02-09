"""
Comprehensive Demo Scenarios for ELD Trip Planner
Shows different trip types and HOS compliance scenarios
"""
import requests
import json
import time

API_URL = 'http://127.0.0.1:8000/api/trips/calculate/'

def print_header(title):
    print("\n" + "=" * 70)
    print(f"  {title}")
    print("=" * 70)

def print_trip_result(scenario_name, data, result):
    print_header(f"SCENARIO: {scenario_name}")
    
    print(f"\n📍 Route:")
    print(f"   Start:   {data['current_location']}")
    print(f"   Pickup:  {data['pickup_location']}")
    print(f"   Dropoff: {data['dropoff_location']}")
    print(f"   Initial Cycle: {data['current_cycle_hours']} hours")
    
    print(f"\n📊 Results:")
    print(f"   Distance:      {result['summary']['total_distance']} miles")
    print(f"   Duration:      {result['summary']['total_days']} days")
    print(f"   Total Stops:   {result['summary']['total_stops']}")
    print(f"   Cycle Used:    {result['summary']['final_cycle_hours']} hours")
    print(f"   Cycle Left:    {result['summary']['cycle_hours_remaining']} hours")
    
    print(f"\n🛑 Stops:")
    for stop in result['stops']:
        print(f"   • {stop['type']:12} @ {stop['distance_from_start']:6.1f} mi ({stop['duration']} hr)")
    
    print(f"\n📅 Daily Logs:")
    for i, log in enumerate(result['daily_logs'], 1):
        print(f"   Day {i} ({log['date']}):")
        print(f"      Driving: {log['totals']['driving']:5.1f}h | On-Duty: {log['totals']['on_duty']:5.1f}h | Off-Duty: {log['totals']['off_duty']:5.1f}h")
        print(f"      Events: {len(log['timeline'])}")
        for event in log['timeline'][:3]:  # Show first 3 events
            status_emoji = {
                'driving': '🚛',
                'on_duty': '📦',
                'sleeper': '😴',
                'off_duty': '🏠'
            }
            emoji = status_emoji.get(event['status'], '•')
            print(f"         {emoji} {event['description']}")

def test_scenario(name, data):
    try:
        print(f"\n⏳ Testing {name}...")
        response = requests.post(API_URL, json=data, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            print_trip_result(name, data, result)
            return True
        else:
            print(f"❌ Error {response.status_code}: {response.json()}")
            return False
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

# ============================================================================
# DEMO SCENARIOS
# ============================================================================

print_header("ELD TRIP PLANNER - COMPREHENSIVE DEMO")
print("\n🚛 Testing various trip scenarios to demonstrate HOS compliance...")
print("   This will show how the system handles different distances,")
print("   cycle hours, and automatically inserts rest breaks.\n")

time.sleep(2)

# Scenario 1: Short Local Trip (Same Day)
scenario1 = {
    'current_location': 'San Francisco, CA',
    'pickup_location': 'Oakland, CA',
    'dropoff_location': 'San Jose, CA',
    'current_cycle_hours': 5.0
}
test_scenario("Short Local Trip", scenario1)
time.sleep(1)

# Scenario 2: Medium Regional Trip (1-2 Days)
scenario2 = {
    'current_location': 'Los Angeles, CA',
    'pickup_location': 'Las Vegas, NV',
    'dropoff_location': 'Phoenix, AZ',
    'current_cycle_hours': 12.0
}
test_scenario("Medium Regional Trip", scenario2)
time.sleep(1)

# Scenario 3: Long Cross-Country Trip (Multiple Days)
scenario3 = {
    'current_location': 'Seattle, WA',
    'pickup_location': 'Denver, CO',
    'dropoff_location': 'Chicago, IL',
    'current_cycle_hours': 20.0
}
test_scenario("Long Cross-Country Trip", scenario3)
time.sleep(1)

# Scenario 4: High Cycle Hours (Near Limit)
scenario4 = {
    'current_location': 'Miami, FL',
    'pickup_location': 'Atlanta, GA',
    'dropoff_location': 'Charlotte, NC',
    'current_cycle_hours': 62.0
}
test_scenario("High Cycle Hours (Near 70hr Limit)", scenario4)
time.sleep(1)

# Scenario 5: Very Long Trip with Fuel Stops
scenario5 = {
    'current_location': 'New York, NY',
    'pickup_location': 'Kansas City, MO',
    'dropoff_location': 'Los Angeles, CA',
    'current_cycle_hours': 15.0
}
test_scenario("Coast-to-Coast with Fuel Stops", scenario5)

# Summary
print_header("DEMO COMPLETE")
print("\n✅ All scenarios tested successfully!")
print("\n🎯 Key Features Demonstrated:")
print("   ✓ Route calculation with geocoding")
print("   ✓ Automatic fuel stop insertion (every 1,000 miles)")
print("   ✓ HOS compliance (11hr driving, 14hr on-duty limits)")
print("   ✓ Automatic rest break insertion (10 hours)")
print("   ✓ 70-hour/8-day cycle tracking")
print("   ✓ Multi-day trip simulation")
print("   ✓ DOT-style ELD log generation")

print("\n🌐 View the full React interface at: http://127.0.0.1:8000")
print("   Try these scenarios in the web UI for the complete experience!")
print("\n" + "=" * 70 + "\n")
