"""
Route calculation service using OpenStreetMap Nominatim and OSRM.
"""
import requests
from typing import Dict, List, Tuple
from geopy.geocoders import Nominatim
from geopy.distance import geodesic
import time


class RouteService:
    """Handles geocoding and route calculation."""
    
    # Common US city coordinates as fallback
    CITY_COORDS = {
        'los angeles, ca': (34.0522, -118.2437),
        'los angeles, california': (34.0522, -118.2437),
        'new york, ny': (40.7128, -74.0060),
        'new york, new york': (40.7128, -74.0060),
        'chicago, il': (41.8781, -87.6298),
        'chicago, illinois': (41.8781, -87.6298),
        'houston, tx': (29.7604, -95.3698),
        'houston, texas': (29.7604, -95.3698),
        'phoenix, az': (33.4484, -112.0740),
        'phoenix, arizona': (33.4484, -112.0740),
        'philadelphia, pa': (39.9526, -75.1652),
        'philadelphia, pennsylvania': (39.9526, -75.1652),
        'san antonio, tx': (29.4241, -98.4936),
        'san antonio, texas': (29.4241, -98.4936),
        'san diego, ca': (32.7157, -117.1611),
        'san diego, california': (32.7157, -117.1611),
        'dallas, tx': (32.7767, -96.7970),
        'dallas, texas': (32.7767, -96.7970),
        'san jose, ca': (37.3382, -121.8863),
        'san jose, california': (37.3382, -121.8863),
        'austin, tx': (30.2672, -97.7431),
        'austin, texas': (30.2672, -97.7431),
        'jacksonville, fl': (30.3322, -81.6557),
        'jacksonville, florida': (30.3322, -81.6557),
        'san francisco, ca': (37.7749, -122.4194),
        'san francisco, california': (37.7749, -122.4194),
        'columbus, oh': (39.9612, -82.9988),
        'columbus, ohio': (39.9612, -82.9988),
        'fort worth, tx': (32.7555, -97.3308),
        'fort worth, texas': (32.7555, -97.3308),
        'indianapolis, in': (39.7684, -86.1581),
        'indianapolis, indiana': (39.7684, -86.1581),
        'charlotte, nc': (35.2271, -80.8431),
        'charlotte, north carolina': (35.2271, -80.8431),
        'seattle, wa': (47.6062, -122.3321),
        'seattle, washington': (47.6062, -122.3321),
        'denver, co': (39.7392, -104.9903),
        'denver, colorado': (39.7392, -104.9903),
        'boston, ma': (42.3601, -71.0589),
        'boston, massachusetts': (42.3601, -71.0589),
        'nashville, tn': (36.1627, -86.7816),
        'nashville, tennessee': (36.1627, -86.7816),
        'detroit, mi': (42.3314, -83.0458),
        'detroit, michigan': (42.3314, -83.0458),
        'portland, or': (45.5152, -122.6784),
        'portland, oregon': (45.5152, -122.6784),
        'las vegas, nv': (36.1699, -115.1398),
        'las vegas, nevada': (36.1699, -115.1398),
        'memphis, tn': (35.1495, -90.0490),
        'memphis, tennessee': (35.1495, -90.0490),
        'atlanta, ga': (33.7490, -84.3880),
        'atlanta, georgia': (33.7490, -84.3880),
        'miami, fl': (25.7617, -80.1918),
        'miami, florida': (25.7617, -80.1918),
    }
    
    def __init__(self):
        # Increase timeout to 10 seconds
        self.geocoder = Nominatim(user_agent="eld-trip-planner", timeout=10)
        self.osrm_base = "http://router.project-osrm.org/route/v1/driving"
    
    def geocode(self, address: str) -> Tuple[float, float]:
        """Convert address to coordinates (lat, lng) with retry logic and fallback."""
        # First, try the cache for common cities
        address_lower = address.lower().strip()
        if address_lower in self.CITY_COORDS:
            print(f"Using cached coordinates for: {address}")
            return self.CITY_COORDS[address_lower]
        
        # Try geocoding with retries
        max_retries = 2  # Reduced retries since we have fallback
        retry_delay = 1
        
        for attempt in range(max_retries):
            try:
                location = self.geocoder.geocode(address)
                if location:
                    return (location.latitude, location.longitude)
                raise ValueError(f"Could not find location: {address}")
            except Exception as e:
                if attempt < max_retries - 1:
                    time.sleep(retry_delay)
                    continue
                else:
                    # Suggest using common city format
                    raise ValueError(
                        f"Could not geocode '{address}'. "
                        f"Please try using format: 'City, State' (e.g., 'Los Angeles, CA'). "
                        f"Or use a major city name."
                    )
    
    def calculate_route(self, waypoints: List[Tuple[float, float]]) -> Dict:
        """
        Calculate route through multiple waypoints.
        Returns route with coordinates, distance (miles), and duration (hours).
        """
        # Format coordinates for OSRM (lng,lat)
        coords_str = ";".join([f"{lng},{lat}" for lat, lng in waypoints])
        
        url = f"{self.osrm_base}/{coords_str}"
        params = {
            "overview": "full",
            "geometries": "geojson",
            "steps": "false"
        }
        
        try:
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            if data.get("code") != "Ok":
                raise ValueError("OSRM routing failed")
            
            route = data["routes"][0]
            
            # Convert meters to miles, seconds to hours
            distance_miles = route["distance"] * 0.000621371
            duration_hours = route["duration"] / 3600
            
            # Extract coordinates (they're in [lng, lat] format)
            coordinates = route["geometry"]["coordinates"]
            
            return {
                "distance": round(distance_miles, 1),
                "duration": round(duration_hours, 2),
                "coordinates": coordinates,
                "legs": self._process_legs(route.get("legs", []))
            }
        except requests.RequestException as e:
            # Fallback to straight-line distance if routing fails
            return self._fallback_route(waypoints)
    
    def _process_legs(self, legs: List[Dict]) -> List[Dict]:
        """Process route legs for segment information."""
        processed = []
        for leg in legs:
            processed.append({
                "distance": round(leg["distance"] * 0.000621371, 1),
                "duration": round(leg["duration"] / 3600, 2)
            })
        return processed
    
    def _fallback_route(self, waypoints: List[Tuple[float, float]]) -> Dict:
        """Fallback to straight-line calculation if routing fails."""
        total_distance = 0
        coordinates = []
        legs = []
        
        for i in range(len(waypoints) - 1):
            start = waypoints[i]
            end = waypoints[i + 1]
            
            # Calculate straight-line distance
            distance_miles = geodesic(start, end).miles
            total_distance += distance_miles
            
            # Add coordinates (convert to [lng, lat])
            coordinates.append([start[1], start[0]])
            
            legs.append({
                "distance": round(distance_miles, 1),
                "duration": round(distance_miles / 60, 2)  # Assume 60 mph
            })
        
        # Add final point
        coordinates.append([waypoints[-1][1], waypoints[-1][0]])
        
        duration_hours = total_distance / 60  # Assume 60 mph average
        
        return {
            "distance": round(total_distance, 1),
            "duration": round(duration_hours, 2),
            "coordinates": coordinates,
            "legs": legs
        }
