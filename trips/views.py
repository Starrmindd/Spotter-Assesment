"""
API views for trip calculation.
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import TripCalculationRequestSerializer, TripCalculationResponseSerializer
from .services import TripCalculator


class TripCalculationView(APIView):
    """
    POST /api/trips/calculate/
    
    Calculate trip route, stops, and ELD logs.
    """
    
    def post(self, request):
        """Handle trip calculation request."""
        # Validate input
        serializer = TripCalculationRequestSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(
                {"error": "Invalid input", "details": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Extract validated data
        data = serializer.validated_data
        
        try:
            # Calculate trip
            calculator = TripCalculator()
            result = calculator.calculate_trip(
                current_location=data["current_location"],
                pickup_location=data["pickup_location"],
                dropoff_location=data["dropoff_location"],
                current_cycle_hours=data["current_cycle_hours"]
            )
            
            # Return response
            return Response(result, status=status.HTTP_200_OK)
            
        except ValueError as e:
            return Response(
                {"error": "Calculation error", "message": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": "Server error", "message": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
