from django.urls import path
from .views import TripCalculationView

urlpatterns = [
    path('trips/calculate/', TripCalculationView.as_view(), name='calculate-trip'),
]
