import { useEffect, useRef } from 'react'

function ELDLogSheet({ log, dayNumber }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current || !log) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    // Set canvas size
    const width = canvas.parentElement.clientWidth
    const height = 400
    canvas.width = width
    canvas.height = height
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Constants
    const padding = { top: 40, right: 40, bottom: 60, left: 80 }
    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom
    const rowHeight = chartHeight / 4

    // Colors for duty statuses
    const statusColors = {
      off_duty: '#94a3b8',
      sleeper: '#475569',
      driving: '#0284c7',
      on_duty: '#f59e0b'
    }

    const statusLabels = {
      off_duty: 'Off Duty',
      sleeper: 'Sleeper',
      driving: 'Driving',
      on_duty: 'On Duty'
    }

    // Draw background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)

    // Draw title
    ctx.fillStyle = '#1e293b'
    ctx.font = 'bold 16px sans-serif'
    ctx.fillText(`Day ${dayNumber} - ${new Date(log.date).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}`, padding.left, 25)

    // Draw grid
    ctx.strokeStyle = '#e2e8f0'
    ctx.lineWidth = 1

    // Horizontal lines (duty status rows)
    const statuses = ['off_duty', 'sleeper', 'driving', 'on_duty']
    statuses.forEach((status, i) => {
      const y = padding.top + i * rowHeight
      
      // Row line
      ctx.beginPath()
      ctx.moveTo(padding.left, y)
      ctx.lineTo(width - padding.right, y)
      ctx.stroke()
      
      // Status label
      ctx.fillStyle = '#475569'
      ctx.font = '12px sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText(statusLabels[status], padding.left - 10, y + rowHeight / 2 + 4)
    })

    // Bottom line
    ctx.beginPath()
    ctx.moveTo(padding.left, padding.top + chartHeight)
    ctx.lineTo(width - padding.right, padding.top + chartHeight)
    ctx.stroke()

    // Vertical lines (hours)
    ctx.textAlign = 'center'
    for (let hour = 0; hour <= 24; hour += 2) {
      const x = padding.left + (hour / 24) * chartWidth
      
      // Grid line
      ctx.strokeStyle = hour % 6 === 0 ? '#cbd5e1' : '#e2e8f0'
      ctx.beginPath()
      ctx.moveTo(x, padding.top)
      ctx.lineTo(x, padding.top + chartHeight)
      ctx.stroke()
      
      // Hour label
      ctx.fillStyle = '#475569'
      ctx.font = '11px sans-serif'
      ctx.fillText(
        hour === 0 ? '12 AM' : hour === 12 ? '12 PM' : hour < 12 ? `${hour} AM` : `${hour - 12} PM`,
        x,
        height - padding.bottom + 20
      )
    }

    // Draw timeline events
    log.timeline.forEach(event => {
      const statusIndex = statuses.indexOf(event.status)
      if (statusIndex === -1) return

      const startX = padding.left + (event.start / 24) * chartWidth
      const endX = padding.left + (event.end / 24) * chartWidth
      const y = padding.top + statusIndex * rowHeight + 5
      const barHeight = rowHeight - 10

      // Draw event bar
      ctx.fillStyle = statusColors[event.status]
      ctx.fillRect(startX, y, endX - startX, barHeight)

      // Draw border
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2
      ctx.strokeRect(startX, y, endX - startX, barHeight)
    })

    // Draw totals box
    const totalsX = width - padding.right - 180
    const totalsY = padding.top
    const totalsWidth = 170
    const totalsHeight = 90

    ctx.fillStyle = '#f8fafc'
    ctx.fillRect(totalsX, totalsY, totalsWidth, totalsHeight)
    ctx.strokeStyle = '#cbd5e1'
    ctx.lineWidth = 1
    ctx.strokeRect(totalsX, totalsY, totalsWidth, totalsHeight)

    ctx.fillStyle = '#1e293b'
    ctx.font = 'bold 12px sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText('Daily Totals', totalsX + 10, totalsY + 20)

    ctx.font = '11px sans-serif'
    ctx.fillStyle = '#475569'
    ctx.fillText(`Driving: ${log.totals.driving.toFixed(1)}h`, totalsX + 10, totalsY + 40)
    ctx.fillText(`On Duty: ${log.totals.on_duty.toFixed(1)}h`, totalsX + 10, totalsY + 55)
    ctx.fillText(`Off Duty: ${log.totals.off_duty.toFixed(1)}h`, totalsX + 10, totalsY + 70)

    // Draw legend
    const legendX = padding.left
    const legendY = height - padding.bottom + 35
    const legendItemWidth = 100

    ctx.textAlign = 'left'
    Object.entries(statusColors).forEach((entry, i) => {
      const [status, color] = entry
      const x = legendX + i * legendItemWidth
      
      // Color box
      ctx.fillStyle = color
      ctx.fillRect(x, legendY, 12, 12)
      
      // Label
      ctx.fillStyle = '#475569'
      ctx.font = '10px sans-serif'
      ctx.fillText(statusLabels[status], x + 16, legendY + 10)
    })

  }, [log, dayNumber])

  return (
    <div className="bg-white">
      <canvas ref={canvasRef} className="w-full" />
      
      {/* Event Details */}
      <div className="mt-6 border-t border-slate-200 pt-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Event Details</h3>
        <div className="space-y-2">
          {log.timeline.map((event, index) => (
            <div key={index} className="flex items-center text-sm">
              <div 
                className="w-3 h-3 rounded-full mr-3"
                style={{ 
                  backgroundColor: {
                    off_duty: '#94a3b8',
                    sleeper: '#475569',
                    driving: '#0284c7',
                    on_duty: '#f59e0b'
                  }[event.status]
                }}
              />
              <div className="flex-1">
                <span className="text-slate-900 font-medium">
                  {event.description || {
                    off_duty: 'Off Duty',
                    sleeper: 'Sleeper',
                    driving: 'Driving',
                    on_duty: 'On Duty'
                  }[event.status]}
                </span>
              </div>
              <div className="text-slate-600">
                {formatTime(event.start)} - {formatTime(event.end)}
              </div>
              <div className="text-slate-500 ml-4">
                {(event.end - event.start).toFixed(1)}h
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function formatTime(hours) {
  const h = Math.floor(hours)
  const m = Math.floor((hours - h) * 60)
  const period = h >= 12 ? 'PM' : 'AM'
  const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${displayHour}:${m.toString().padStart(2, '0')} ${period}`
}

export default ELDLogSheet
