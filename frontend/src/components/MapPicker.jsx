import { useState, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Custom Modern Pin using HTML string instead of react-dom/server
const customIcon = L.divIcon({
  html: `
    <div class="flex h-12 w-12 items-center justify-center">
       <div class="relative">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="white" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 h-2 w-6 bg-slate-900/20 blur-sm rounded-full"></div>
       </div>
    </div>
  `,
  className: 'custom-picker-icon',
  iconSize: [48, 48],
  iconAnchor: [24, 44],
})

function LocationMarker({ position, setPosition }) {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng)
      map.flyTo(e.latlng, map.getZoom())
    },
  })

  return position === null ? null : (
    <Marker position={position} icon={customIcon}>
       <Popup>
          <div className="p-1 font-bold text-slate-800">Pickup Point Set ✓</div>
       </Popup>
    </Marker>
  )
}

const MapPicker = ({ position, setPosition }) => {
  const center = useMemo(() => [17.3850, 78.4867], []) 

  return (
    <div className="relative h-full w-full">
      <MapContainer 
        center={center} 
        zoom={13} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <LocationMarker position={position} setPosition={setPosition} />
      </MapContainer>
      
      <div className="absolute top-4 left-4 z-[1000] glass px-4 py-2 rounded-xl border-white/50 text-xs font-bold text-slate-600 shadow-lg">
         Click on the map to set pickup point
      </div>
      
      {!position && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-[999]">
           <div className="h-20 w-20 rounded-full bg-brand-primary/10 animate-ping border-2 border-brand-primary/20" />
        </div>
      )}
    </div>
  )
}

export default MapPicker
