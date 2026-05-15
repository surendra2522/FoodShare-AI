import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect } from 'react'

// Auto-fit both donor and receiver
const FitBounds = ({ donorPos, receiverPos }) => {
  const map = useMap()
  useEffect(() => {
    if (donorPos && receiverPos && Array.isArray(donorPos) && Array.isArray(receiverPos)) {
      try {
        map.fitBounds([donorPos, receiverPos], { padding: [50, 50] })
      } catch (e) {
        console.warn('Map bounds fitting failed', e)
      }
    }
  }, [donorPos, receiverPos, map])
  return null
}

// Custom icons
const donorIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #10b981; width: 16px; height: 16px; border-radius: 50%; border: 4px solid white; box-shadow: 0 0 15px rgba(16,185,129,0.5);"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8]
})

const receiverIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #6366f1; width: 16px; height: 16px; border-radius: 50%; border: 4px solid white; box-shadow: 0 0 15px rgba(99,102,241,0.5);"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8]
})

const TrackingMap = ({ donorPos, receiverPos }) => {
  return (
    <div className="h-[450px] w-full overflow-hidden rounded-[2.5rem] shadow-inner bg-slate-100">
      <MapContainer center={donorPos} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
        <FitBounds donorPos={donorPos} receiverPos={receiverPos} />
        <TileLayer
          attribution='&copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <Marker position={donorPos} icon={donorIcon}>
          <Popup>Donor Location (Pickup Point)</Popup>
        </Marker>
        <Marker position={receiverPos} icon={receiverIcon}>
          <Popup>Your Location (NGO Receiver)</Popup>
        </Marker>
        <Polyline 
          positions={[donorPos, receiverPos]} 
          color="#6366f1" 
          dashArray="10, 15" 
          weight={4} 
          opacity={0.6}
        />
      </MapContainer>
    </div>
  )
}

export default TrackingMap
