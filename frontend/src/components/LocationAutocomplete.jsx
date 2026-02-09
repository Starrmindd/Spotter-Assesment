import { useState, useEffect, useRef } from 'react'

function LocationAutocomplete({ 
  id, 
  name, 
  value, 
  onChange, 
  placeholder, 
  label, 
  error, 
  disabled 
}) {
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const wrapperRef = useRef(null)
  const timeoutRef = useRef(null)

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchSuggestions = async (query) => {
    if (query.length < 3) {
      setSuggestions([])
      return
    }

    setLoading(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `q=${encodeURIComponent(query)}&` +
        `format=json&` +
        `addressdetails=1&` +
        `limit=5&` +
        `countrycodes=us`
      )
      const data = await response.json()
      
      const formatted = data.map(item => ({
        display_name: item.display_name,
        name: formatLocationName(item)
      }))
      
      setSuggestions(formatted)
      setShowSuggestions(true)
    } catch (error) {
      console.error('Error fetching suggestions:', error)
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }

  const formatLocationName = (item) => {
    const address = item.address
    const parts = []
    
    if (address.city) parts.push(address.city)
    else if (address.town) parts.push(address.town)
    else if (address.village) parts.push(address.village)
    else if (address.county) parts.push(address.county)
    
    if (address.state) parts.push(address.state)
    
    return parts.join(', ') || item.display_name
  }

  const handleInputChange = (e) => {
    const newValue = e.target.value
    onChange({ target: { name, value: newValue } })
    
    // Debounce API calls
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    timeoutRef.current = setTimeout(() => {
      fetchSuggestions(newValue)
    }, 300)
  }

  const handleSuggestionClick = (suggestion) => {
    onChange({ target: { name, value: suggestion.name } })
    setShowSuggestions(false)
    setSuggestions([])
  }

  return (
    <div ref={wrapperRef} className="relative">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          id={id}
          name={name}
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
            error ? 'border-red-300' : 'border-slate-300'
          }`}
          autoComplete="off"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin h-4 w-4 border-2 border-primary-600 border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>
      
      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full text-left px-4 py-2 hover:bg-primary-50 focus:bg-primary-50 focus:outline-none transition border-b border-slate-100 last:border-b-0"
            >
              <div className="font-medium text-slate-900">{suggestion.name}</div>
              <div className="text-xs text-slate-500 truncate">{suggestion.display_name}</div>
            </button>
          ))}
        </div>
      )}
      
      {error && (
        <p className="text-xs text-red-600 mt-1">{error}</p>
      )}
    </div>
  )
}

export default LocationAutocomplete
