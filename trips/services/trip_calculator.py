"""
Main trip calculation orchestrator.
Coordinates route calculation, stop insertion, and ELD simulation.
"""
from typing import Dict, List
from datetime import datetime
from .route_service import RouteService
from .eld_simulator import ELDSimulator


class TripCalculator:
    """Orchestrates trip planning with route, stops, and ELD logs."""
    
    FUEL_INTERVAL_MILES = 1000
    FUEL_STOP_DURATION = 0.25  # 15 minutes
    PICKUP_DURATION = 1.0  # 1 hour
    DROPOFF_DURATION = 1.0  # 1 hour
    
    def __init__(self):
        self.route_service = RouteService()
        self.eld_simulator = ELDSimulator()
    
    def calculate_trip(
        self,
        current_location: str,
        pickup_location: str,
        dropoff_location: str,
        current_cycle_hours: float
    ) -> Dict:
        """
        Calculate complete trip with route, stops, and ELD logs.
        
        Args:
            current_location: Starting address
            pickup_location: Pickup address
            dropoff_location: Dropoff address
            current_cycle_hours: Hours already used in 70-hour cycle
        
        Returns:
            Complete trip data with route, stops, and daily ELD logs
        """
        # Step 1: Geocode all locations
        current_coords = self.route_service.geocode(current_location)
        pickup_coords = self.route_service.geocode(pickup_location)
        dropoff_coords = self.route_service.geocode(dropoff_location)
        
        # Step 2: Calculate route through waypoints
        waypoints = [current_coords, pickup_coords, dropoff_coords]
        route = self.route_service.calculate_route(waypoints)
        
        # Step 3: Insert stops (fuel, pickup, dropoff)
        stops = self._calculate_stops(route)
        
        # Step 4: Simulate ELD logs
        eld_data = self.eld_simulator.simulate_trip(
            total_distance=route["distance"],
            stops=stops,
            current_cycle_hours=current_cycle_hours,
            start_time=datetime.now()
        )
        
        # Step 5: Prepare response
        return {
            "route": {
                "total_distance": route["distance"],
                "total_duration": route["duration"],
                "coordinates": route["coordinates"],
                "waypoints": [
                    {"name": "Start", "coords": [current_coords[1], current_coords[0]]},
                    {"name": "Pickup", "coords": [pickup_coords[1], pickup_coords[0]]},
                    {"name": "Dropoff", "coords": [dropoff_coords[1], dropoff_coords[0]]}
                ]
            },
            "stops": stops,
            "daily_logs": eld_data["daily_logs"],
            "summary": {
                **eld_data["summary"],
                "total_distance": route["distance"],
                "estimated_duration": route["duration"],
                "total_stops": len(stops)
            }
        }
    
    def _calculate_stops(self, route: Dict) -> List[Dict]:
        """
        Calculate all stops including fuel, pickup, and dropoff.
        
        Returns list of stops with:
        - type: stop type
        - distance_from_start: cumulative distance
        - duration: stop duration in hours
        - coords: [lng, lat] if available
        """
        stops = []
        total_distance = route["distance"]
        legs = route.get("legs", [])
        
        # Calculate distances for main waypoints
        distance_to_pickup = legs[0]["distance"] if len(legs) > 0 else 0
        distance_to_dropoff = total_distance
        
        # Insert fuel stops
        current_distance = 0
        while current_distance + self.FUEL_INTERVAL_MILES < total_distance:
            current_distance += self.FUEL_INTERVAL_MILES
            
            # Don't add fuel stop if it's too close to pickup or dropoff
            if (abs(current_distance - distance_to_pickup) > 50 and 
                abs(current_distance - distance_to_dropoff) > 50):
                stops.append({
                    "type": "Fuel Stop",
                    "distance_from_start": current_distance,
                    "duration": self.FUEL_STOP_DURATION,
                    "coords": self._interpolate_coords(route["coordinates"], current_distance, total_distance)
                })
        
        # Add pickup stop
        stops.append({
            "type": "Pickup",
            "distance_from_start": distance_to_pickup,
            "duration": self.PICKUP_DURATION,
            "coords": route["coordinates"][len(route["coordinates"]) // 3] if route["coordinates"] else None
        })
        
        # Add dropoff stop
        stops.append({
            "type": "Dropoff",
            "distance_from_start": distance_to_dropoff,
            "duration": self.DROPOFF_DURATION,
            "coords": route["coordinates"][-1] if route["coordinates"] else None
        })
        
        # Sort by distance
        stops.sort(key=lambda x: x["distance_from_start"])
        
        return stops
    
    def _interpolate_coords(self, coordinates: List, target_distance: float, total_distance: float):
        """Interpolate coordinates for a stop at a given distance."""
        if not coordinates:
            return None
        
        # Simple interpolation based on distance ratio
        ratio = target_distance / total_distance
        index = int(ratio * len(coordinates))
        index = min(index, len(coordinates) - 1)
        
        return coordinates[index]
