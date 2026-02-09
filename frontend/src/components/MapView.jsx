import { useEffect, useRef } from 'react'

function MapView({ route, stops }) {
  const mapContainerRef = useRef(null)
  const mapRef = useRef(null)

  useEffect(() => {
    if (!mapContainerRef.current || !route) return

    // Clean up previous map instance
    if (mapRef.current) {
      mapRef.current.remove()
      mapRef.current = null
    }

    // Check if Leaflet is available
    if (typeof window.L === 'undefined') {
      console.warn('Leaflet not loaded, using canvas fallback')
      renderCanvasMap()
      return
    }

    try {
      // Initialize Leaflet map
      const map = window.L.map(mapContainerRef.current, {
        zoomControl: true,
        attributionControl: true
      }).setView([39.8283, -98.5795], 4)
      
      mapRef.current = map
      
      // Add OpenStreetMap tiles
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map)

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
    } catch (error) {
      console.error('Error initializing map:', error)
      renderCanvasMap()
    }

    function renderCanvasMap() {
      const container = mapContainerRef.current
      if (!container) return
      
      container.innerHTML = ''

      const canvas = document.createElement('canvas')
      canvas.width = container.clientWidth
      canvas.height = 500
      canvas.style.width = '100%'
      canvas.style.height = '500px'
      container.appendChild(canvas)

      const ctx = canvas.getContext('2d')
      
      ctx.fillStyle = '#1e293b'
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
            ctx.fillStyle = '#ffffff'
            ctx.font = 'bold 12px sans-serif'
            ctx.fillText(waypoint.name, x + 12, y + 4)
          })
        }

        stops.forEach(stop => {
          if (stop.coords) {
            const x = scaleX(stop.coords[0])
            const y = scaleY(stop.coords[1])
            ctx.fillStyle = stop.type === 'Fuel Stop' ? '#8b5cf6' : '#0ea5e9'
            ctx.beginPath()
            ctx.arc(x, y, 5, 0, Math.PI * 2)
            ctx.fill()
          }
        })
      }
    }

    return () => {
      if (mapRef.current) {
        try {
          mapRef.current.remove()
        } catch (e) {
          console.error('Error removing map:', e)
        }
        mapRef.current = null
      }
    }
  }, [route, stops])

  return (
    <div className="relative">
      <div ref={mapContainerRef} className="w-full h-[500px] bg-slate-800">
        {!route && (
          <div className="flex items-center justify-center h-full text-slate-400">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <p>Map will appear here after calculation</p>
            </div>
          </div>
        )}
      </div>
      
      {route && (
        <div className="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur-sm rounded-lg shadow-lg p-3 text-sm z-[1000] border border-slate-700">
          <div className="font-semibold text-white">Route Info</div>
          <div className="text-slate-300 mt-1">
            Distance: {route.total_distance} miles
          </div>
          <div className="text-slate-300">
            Duration: {route.total_duration.toFixed(1)} hours
          </div>
        </div>
      )}
    </div>
  )
}

export default MapView
