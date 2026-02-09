import { useState } from 'react'
import TripForm from './components/TripForm'
import MapView from './components/MapView'
import ELDLogsViewer from './components/ELDLogsViewer'
import LoadingSpinner from './components/LoadingSpinner'
import { calculateTrip } from './services/api'

function App() {
  const [tripData, setTripData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState(null)

  const handleCalculateTrip = async (data) => {
    setLoading(true)
    setError(null)
    setTripData(null)
    setFormData(data)

    try {
      console.log('Calculating trip with:', data)
      const result = await calculateTrip(data)
      console.log('Result received:', result)
      setTripData(result)
    } catch (err) {
      console.error('Error calculating trip:', err)
      const errorMsg = err.response?.data?.message || err.message || 'Failed to calculate trip. Please check your locations and try again.'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-700 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">ELD Trip Planner</h1>
                <p className="text-sm text-slate-400 mt-1">
                  Professional Route Planning with DOT HOS Compliance
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <div className="text-center">
                <div className="text-xs text-slate-400 uppercase tracking-wide">Max Driving</div>
                <div className="text-lg font-bold text-white">11 hrs</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-slate-400 uppercase tracking-wide">Max On-Duty</div>
                <div className="text-lg font-bold text-white">14 hrs</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-slate-400 uppercase tracking-wide">Cycle Limit</div>
                <div className="text-lg font-bold text-white">70 hrs/8 days</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Trip Input Form */}
        <div className="mb-8">
          <TripForm onSubmit={handleCalculateTrip} loading={loading} />
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 bg-red-900/50 border border-red-700 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-200">Calculation Error</h3>
                <p className="text-sm text-red-300 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner />
          </div>
        )}

        {/* Results */}
        {tripData && !loading && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-xl p-5 border border-blue-500/50">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-blue-200 uppercase tracking-wide font-semibold">Total Distance</div>
                    <div className="text-3xl font-bold text-white mt-2">
                      {tripData.summary.total_distance}
                    </div>
                    <div className="text-sm text-blue-200 mt-1">miles</div>
                  </div>
                  <svg className="w-12 h-12 text-blue-300 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl shadow-xl p-5 border border-purple-500/50">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-purple-200 uppercase tracking-wide font-semibold">Trip Duration</div>
                    <div className="text-3xl font-bold text-white mt-2">
                      {tripData.summary.total_days}
                    </div>
                    <div className="text-sm text-purple-200 mt-1">days</div>
                  </div>
                  <svg className="w-12 h-12 text-purple-300 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl shadow-xl p-5 border border-green-500/50">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-green-200 uppercase tracking-wide font-semibold">Total Stops</div>
                    <div className="text-3xl font-bold text-white mt-2">
                      {tripData.summary.total_stops}
                    </div>
                    <div className="text-sm text-green-200 mt-1">locations</div>
                  </div>
                  <svg className="w-12 h-12 text-green-300 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl shadow-xl p-5 border border-orange-500/50">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-orange-200 uppercase tracking-wide font-semibold">Cycle Used</div>
                    <div className="text-3xl font-bold text-white mt-2">
                      {tripData.summary.final_cycle_hours}
                    </div>
                    <div className="text-sm text-orange-200 mt-1">of 70 hours</div>
                  </div>
                  <svg className="w-12 h-12 text-orange-300 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-xl shadow-xl p-5 border border-teal-500/50">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-teal-200 uppercase tracking-wide font-semibold">Remaining</div>
                    <div className="text-3xl font-bold text-white mt-2">
                      {tripData.summary.cycle_hours_remaining}
                    </div>
                    <div className="text-sm text-teal-200 mt-1">hours left</div>
                  </div>
                  <svg className="w-12 h-12 text-teal-300 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-hidden">
              <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4 border-b border-slate-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    <h2 className="text-xl font-bold text-white">Route Visualization</h2>
                  </div>
                  <div className="text-sm text-slate-400">
                    {tripData.route.total_distance} miles • {tripData.route.total_duration.toFixed(1)} hours driving
                  </div>
                </div>
              </div>
              <MapView route={tripData.route} stops={tripData.stops} />
            </div>

            {/* ELD Logs */}
            <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700">
              <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4 border-b border-slate-600">
                <div className="flex items-center space-x-3">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h2 className="text-xl font-bold text-white">DOT-Compliant ELD Logs</h2>
                </div>
              </div>
              <ELDLogsViewer logs={tripData.daily_logs} />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-slate-700 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-slate-400">
              ELD Trip Planner © 2026 - DOT HOS Compliance for Property-Carrying Drivers
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-xs text-slate-500">Built by STARMIND </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
