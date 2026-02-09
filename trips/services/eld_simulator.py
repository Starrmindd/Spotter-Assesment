"""
ELD (Electronic Logging Device) simulation service.
Implements HOS (Hours of Service) regulations for property-carrying drivers.
"""
from typing import List, Dict
from datetime import datetime, timedelta


class ELDSimulator:
    """
    Simulates ELD logs based on HOS regulations.
    
    Regulations (Property-Carrying):
    - 11-hour driving limit
    - 14-hour on-duty limit
    - 10-hour rest break required
    - 70 hours / 8 days cycle
    """
    
    # Duty statuses
    OFF_DUTY = "off_duty"
    SLEEPER = "sleeper"
    DRIVING = "driving"
    ON_DUTY = "on_duty"
    
    def __init__(self):
        self.max_driving_hours = 11
        self.max_on_duty_hours = 14
        self.required_rest_hours = 10
        self.max_cycle_hours = 70
    
    def simulate_trip(
        self,
        total_distance: float,
        stops: List[Dict],
        current_cycle_hours: float,
        start_time: datetime = None
    ) -> Dict:
        """
        Simulate ELD logs for entire trip.
        
        Args:
            total_distance: Total trip distance in miles
            stops: List of stops with type, duration, distance_from_start
            current_cycle_hours: Hours already used in current cycle
            start_time: Trip start time (defaults to now)
        
        Returns:
            Dict with daily_logs and summary
        """
        if start_time is None:
            start_time = datetime.now().replace(minute=0, second=0, microsecond=0)
        
        # Initialize tracking
        current_time = start_time
        current_cycle = current_cycle_hours
        daily_driving = 0
        daily_on_duty = 0
        current_distance = 0
        
        events = []
        daily_logs = []
        current_day_events = []
        current_day_start = start_time.date()
        
        # Process each stop
        for i, stop in enumerate(stops):
            # Calculate driving to this stop
            distance_to_stop = stop["distance_from_start"] - current_distance
            
            if distance_to_stop > 0:
                # Check if we need rest before driving
                if daily_driving >= self.max_driving_hours or daily_on_duty >= self.max_on_duty_hours:
                    # Take required rest
                    rest_event = self._create_rest_event(current_time, self.required_rest_hours)
                    current_day_events.append(rest_event)
                    current_time = rest_event["end_time"]
                    
                    # Check if we crossed into a new day
                    if current_time.date() != current_day_start:
                        daily_logs.append(self._create_daily_log(current_day_start, current_day_events))
                        current_day_events = []
                        current_day_start = current_time.date()
                    
                    # Reset daily counters
                    daily_driving = 0
                    daily_on_duty = 0
                
                # Drive to stop
                drive_hours = distance_to_stop / 60  # Assume 60 mph
                drive_event = {
                    "status": self.DRIVING,
                    "start_time": current_time,
                    "end_time": current_time + timedelta(hours=drive_hours),
                    "duration": drive_hours,
                    "description": f"Driving to {stop['type']}"
                }
                
                current_day_events.append(drive_event)
                current_time = drive_event["end_time"]
                daily_driving += drive_hours
                daily_on_duty += drive_hours
                current_cycle += drive_hours
                current_distance = stop["distance_from_start"]
                
                # Check day boundary
                if current_time.date() != current_day_start:
                    daily_logs.append(self._create_daily_log(current_day_start, current_day_events))
                    current_day_events = []
                    current_day_start = current_time.date()
                    daily_driving = 0
                    daily_on_duty = 0
            
            # Handle stop activity
            if stop["duration"] > 0:
                stop_event = {
                    "status": self.ON_DUTY,
                    "start_time": current_time,
                    "end_time": current_time + timedelta(hours=stop["duration"]),
                    "duration": stop["duration"],
                    "description": stop["type"]
                }
                
                current_day_events.append(stop_event)
                current_time = stop_event["end_time"]
                daily_on_duty += stop["duration"]
                current_cycle += stop["duration"]
                
                # Check day boundary
                if current_time.date() != current_day_start:
                    daily_logs.append(self._create_daily_log(current_day_start, current_day_events))
                    current_day_events = []
                    current_day_start = current_time.date()
                    daily_driving = 0
                    daily_on_duty = 0
        
        # Add final day if there are remaining events
        if current_day_events:
            daily_logs.append(self._create_daily_log(current_day_start, current_day_events))
        
        return {
            "daily_logs": daily_logs,
            "summary": {
                "total_days": len(daily_logs),
                "final_cycle_hours": round(current_cycle, 2),
                "cycle_hours_remaining": round(self.max_cycle_hours - current_cycle, 2),
                "start_time": start_time.isoformat(),
                "end_time": current_time.isoformat()
            }
        }
    
    def _create_rest_event(self, start_time: datetime, duration: float) -> Dict:
        """Create a rest/sleeper event."""
        return {
            "status": self.SLEEPER,
            "start_time": start_time,
            "end_time": start_time + timedelta(hours=duration),
            "duration": duration,
            "description": "Required rest break"
        }
    
    def _create_daily_log(self, date, events: List[Dict]) -> Dict:
        """Create a daily log from events."""
        # Convert events to timeline format (0-24 hours)
        timeline = []
        
        for event in events:
            start_hour = event["start_time"].hour + event["start_time"].minute / 60
            end_hour = event["end_time"].hour + event["end_time"].minute / 60
            
            # Handle events that span midnight
            if event["end_time"].date() > event["start_time"].date():
                # Split into two segments
                timeline.append({
                    "status": event["status"],
                    "start": start_hour,
                    "end": 24,
                    "description": event["description"]
                })
            else:
                timeline.append({
                    "status": event["status"],
                    "start": start_hour,
                    "end": end_hour,
                    "description": event["description"]
                })
        
        # Calculate daily totals
        driving_hours = sum(
            e["duration"] for e in events 
            if e["status"] == self.DRIVING and e["start_time"].date() == date
        )
        on_duty_hours = sum(
            e["duration"] for e in events 
            if e["status"] in [self.DRIVING, self.ON_DUTY] and e["start_time"].date() == date
        )
        
        return {
            "date": date.isoformat(),
            "timeline": timeline,
            "totals": {
                "driving": round(driving_hours, 2),
                "on_duty": round(on_duty_hours, 2),
                "off_duty": round(24 - on_duty_hours, 2)
            }
        }
