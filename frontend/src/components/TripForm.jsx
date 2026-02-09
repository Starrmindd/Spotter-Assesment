import { useState } from 'react'
import LocationAutocomplete from './LocationAutocomplete'

function TripForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    current_location: '',
    pickup_location: '',
    dropoff_location: '',
    current_cycle_hours: 0,
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'current_cycle_hours' ? parseFloat(value) || 0 : value
    }))
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.current_location.trim()) {
      newErrors.current_location = 'Current location is required'
    }
    if (!formData.pickup_location.trim()) {
      newErrors.pickup_location = 'Pickup location is required'
    }
    if (!formData.dropoff_location.trim()) {
      newErrors.dropoff_location = 'Dropoff location is required'
    }
    if (formData.current_cycle_hours < 0 || formData.current_cycle_hours > 70) {
      newErrors.current_cycle_hours = 'Must be between 0 and 70 hours'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(formData)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Trip Details</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Current Location with Autocomplete */}
          <LocationAutocomplete
            id="current_location"
            name="current_location"
            value={formData.current_location}
            onChange={handleChange}
            placeholder="e.g., Los Angeles, CA"
            label="Current Location"
            error={errors.current_location}
            disabled={loading}
          />

          {/* Pickup Location with Autocomplete */}
          <LocationAutocomplete
            id="pickup_location"
            name="pickup_location"
            value={formData.pickup_location}
            onChange={handleChange}
            placeholder="e.g., Phoenix, AZ"
            label="Pickup Location"
            error={errors.pickup_location}
            disabled={loading}
          />

          {/* Dropoff Location with Autocomplete */}
          <LocationAutocomplete
            id="dropoff_location"
            name="dropoff_location"
            value={formData.dropoff_location}
            onChange={handleChange}
            placeholder="e.g., Dallas, TX"
            label="Dropoff Location"
            error={errors.dropoff_location}
            disabled={loading}
          />

          {/* Current Cycle Hours */}
          <div>
            <label htmlFor="current_cycle_hours" className="block text-sm font-medium text-slate-700 mb-1">
              Current Cycle Hours Used
            </label>
            <input
              type="number"
              id="current_cycle_hours"
              name="current_cycle_hours"
              value={formData.current_cycle_hours}
              onChange={handleChange}
              min="0"
              max="70"
              step="0.5"
              placeholder="0"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
                errors.current_cycle_hours ? 'border-red-300' : 'border-slate-300'
              }`}
              disabled={loading}
            />
            {errors.current_cycle_hours && (
              <p className="text-xs text-red-600 mt-1">{errors.current_cycle_hours}</p>
            )}
            <p className="text-xs text-slate-500 mt-1">Hours already used in 70-hour cycle</p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Calculating...' : 'Calculate Trip'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default TripForm
