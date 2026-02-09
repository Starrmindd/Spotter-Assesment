import { useState } from 'react'
import ELDLogSheet from './ELDLogSheet'

function ELDLogsViewer({ logs }) {
  const [selectedDay, setSelectedDay] = useState(0)

  if (!logs || logs.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500">
        No ELD logs available
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Day Tabs */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        {logs.map((log, index) => (
          <button
            key={index}
            onClick={() => setSelectedDay(index)}
            className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition ${
              selectedDay === index
                ? 'bg-primary-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Day {index + 1}
            <span className="block text-xs mt-0.5 opacity-80">
              {new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </button>
        ))}
      </div>

      {/* Selected Day Log */}
      <ELDLogSheet log={logs[selectedDay]} dayNumber={selectedDay + 1} />
    </div>
  )
}

export default ELDLogsViewer
