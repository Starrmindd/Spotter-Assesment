import { useEffect, useRef } from 'react'

function MapView({ route, stops }) {
  const mapContainerRef = useRef(null)
  const mapRef = useRef(null)

  useEffect(() => {
    if (!mapContainerRef.current || !route) return

    // Check if Leaflet is available
    if (typeof window.L === 'undefined') {
      // Fallback to canvas visualization
      renderCanvasMap()
      return
    }

    // Initialize Leaflet map
    if (!mapRef.current) {
      mapRef.current = window.L.map(mapContainerRef.current).setView([39.8283, -98.5795], 4)
      
      // Add OpenStreetMap tiles
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(mapRef.current)
    }

    const map = mapRef.current

    // Clear existing layers
    map.eachLayer((layer) => {
      if (layer instanceof window.L.Polyline || layer instanceof window.L.Marker) {
        map.removeLayer(layer)
      }
    })

    // Draw route line
    if (route.coordinates && route.coordinates.length > 0) {
      const latLngs = route.coordinates.map(coord => [coord[1], coord[0]])
      
      window.L.polyline(latLngs, {
        color: '#0284c7',
        weight: 4,
        opacity: 0.8
      }).addTo(map)

      // Add waypoint markers
      if (route.waypoints) {
        route.waypoints.forEach((waypoint, i) => {
          const color = i === 0 ? '#10b981' : i === route.waypoints.length - 1 ? '#ef4444' : '#f59e0b'
          
          const icon = window.L.divIcon({
            className: 'custom-marker',
            html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          })

          window.L.marker([waypoint.coords[1], waypoint.coords[0]], { icon })
            .bindPopup(`<b>${waypoint.name}</b>`)
            .addTo(map)
        })
      }

      // Add stop markers
      stops.forEach(stop => {
        if (stop.coords) {
          const color = stop.type === 'Fuel Stop' ? '#8b5cf6' : '#0ea5e9'
          
          const icon = window.L.divIcon({
            className: 'custom-marker',
            html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.3);"></div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8]
          })

          window.L.marker([stop.coords[1], stop.coords[0]], { icon })
            .bindPopup(`<b>${stop.type}</b><br>${stop.distance_from_start.toFixed(1)} miles`)
            .addTo(map)
        }
      })

      // Fit bounds to show entire route
      map.fitBounds(latLngs, { padding: [50, 50] })
    }

    function renderCanvasMap() {
      const container = mapContainerRef.current
      container.innerHTML = ''

      const canvas = document.createElement('canvas')
      canvas.width = container.clientWidth
      canvas.height = 500
      canvas.style.width = '100%'
      canvas.style.height = '500px'
      container.appendChild(canvas)

      const ctx = canvas.getContext('2d')
      
      ctx.fillStyle = '#e2e8f0'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      if (route.coordinates && route.coordinates.length > 0) {
        const coords = route.coordinates
        const lngs = coords.map(c => c[0])
        const lats = coords.map(c => c[1])
        const minLng = Math.min(...lngs)
        const maxLng = Math.max(...lngs)
        const minLat = Math.min(...lats)
        const maxLat = Math.max(...lats)
        
        const padding = 50
        const width = canvas.width - padding * 2
        const height = canvas.height - padding * 2
        
        const scaleX = (lng) => padding + ((lng - minLng) / (maxLng - minLng)) * width
        const scaleY = (lat) => canvas.height - padding - ((lat - minLat) / (maxLat - minLat)) * height
        
        ctx.strokeStyle = '#0284c7'
        ctx.lineWidth = 3
        ctx.beginPath()
        coords.forEach((coord, i) => {
          const x = scaleX(coord[0])
          const y = scaleY(coord[1])
          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        })
        ctx.stroke()
        
        if (route.waypoints) {
          route.waypoints.forEach((waypoint, i) => {
            const x = scaleX(waypoint.coords[0])
            const y = scaleY(waypoint.coords[1])
            ctx.fillStyle = i === 0 ? '#10b981' : i === route.waypoints.length - 1 ? '#ef4444' : '#f59e0b'
            ctx.beginPath()
            ctx.arc(x, y, 8, 0, Math.PI * 2)
            ctx.fill()
            ctx.fillStyle = '#1e293b'
            ctx.font = 'bold 12px sans-serif'
            ctx.fillText(waypoint.name, x + 12, y + 4)
          })
        }
      }
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [route, stops])

  return (
    <div className="relative">
      <div ref={mapContainerRef} className="w-full h-[500px] bg-slate-100">
        {!route && (
          <div className="flex items-center justify-center h-full text-slate-500">
            Map will appear here after calculation
          </div>
        )}
      </div>
      
      {route && (
        <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 text-sm z-[1000]">
          <div className="font-semibold text-slate-900">Route Info</div>
          <div className="text-slate-600 mt-1">
            Distance: {route.total_distance} miles
          </div>
          <div className="text-slate-600">
            Duration: {route.total_duration} hours
          </div>
        </div>
      )}
    </div>
  )
}

export default MapView
