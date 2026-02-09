"""
Serializers for trip calculation API.
"""
from rest_framework import serializers


class TripCalculationRequestSerializer(serializers.Serializer):
    """Validates incoming trip calculation requests."""
    
    current_location = serializers.CharField(
        max_length=255,
        help_text="Current location address"
    )
    pickup_location = serializers.CharField(
        max_length=255,
        help_text="Pickup location address"
    )
    dropoff_location = serializers.CharField(
        max_length=255,
        help_text="Dropoff location address"
    )
    current_cycle_hours = serializers.FloatField(
        min_value=0,
        max_value=70,
        help_text="Hours already used in current 70-hour cycle"
    )
    
    def validate_current_cycle_hours(self, value):
        """Ensure cycle hours are reasonable."""
        if value < 0 or value > 70:
            raise serializers.ValidationError(
                "Current cycle hours must be between 0 and 70"
            )
        return value


class TripCalculationResponseSerializer(serializers.Serializer):
    """Formats trip calculation response."""
    
    route = serializers.DictField()
    stops = serializers.ListField()
    daily_logs = serializers.ListField()
    summary = serializers.DictField()
