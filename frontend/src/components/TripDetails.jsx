function TripDetails({ formData, tripData }) {
  if (!formData || !tripData) return null

  const formatDateTime = (isoString) => {
    const date = new Date(isoString)
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const cyclePercentage = (tripData.summary.final_cycle_hours / 70) * 100

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Trip Information */}
      <div className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-bold text-white">Trip Information</h3>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-sm text-slate-400">Current Location:</span>
            <span className="text-sm font-medium text-white text-right">{formData.current_location}</span>
          </div>
          <div className="flex justify-between items-start">
            <span className="text-sm text-slate-400">Pickup Location:</span>
            <span className="text-sm font-medium text-white text-right">{formData.pickup_location}</span>
          </div>
          <div className="flex justify-between items-start">
            <span className="text-sm text-slate-400">Dropoff Location:</span>
            <span className="text-sm font-medium text-white text-right">{formData.dropoff_location}</span>
          </div>
          <div className="border-t border-slate-700 pt-3 mt-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Start Time:</span>
              <span className="text-sm font-medium text-white">{formatDateTime(tripData.summary.start_time)}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-slate-400">End Time:</span>
              <span className="text-sm font-medium text-white">{formatDateTime(tripData.summary.end_time)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
