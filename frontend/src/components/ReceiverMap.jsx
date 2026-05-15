import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect } from 'react'
import { Utensils, Navigation, Clock, ShieldCheck } from 'lucide-react'

// Auto-fit bounds component
const ChangeView = ({ donations }) => {
  const map = useMap()
  useEffect(() => {
    if (donations.length > 0) {
      const points = donations
        .filter(d => d.location && d.location.lat)
        .map(d => [d.location.lat, d.location.lng])
      if (points.length > 0) {
        map.fitBounds(points, { padding: [50, 50] })
      }
    }
  }, [donations, map])
  return null
}

const ReceiverMap = ({ donations, onAccept }) => {
  const center = [17.3850, 78.4867]

  const createCustomIcon = (isPriority) => L.divIcon({
    html: `
      <div class="relative flex h-12 w-12 items-center justify-center rounded-2xl border-4 border-white shadow-2xl transition-all hover:scale-110 ${
        isPriority ? 'bg-red-500' : 'bg-emerald-500'
      }">
         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path><path d="M7 2v20"></path><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path></svg>
         ${isPriority ? '<div class="absolute inset-0 animate-ping rounded-2xl bg-red-400 opacity-75"></div>' : ''}
         <div class="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-white flex items-center justify-center">
            <div class="h-2 w-2 rounded-full ${isPriority ? 'bg-red-500' : 'bg-emerald-500'}"></div>
         </div>
      </div>
    `,
    className: 'custom-marker-icon',
    iconSize: [48, 48],
    iconAnchor: [24, 48],
    popupAnchor: [0, -48]
  })

  return (
    <div className="h-full w-full overflow-hidden relative">
      <MapContainer 
        center={center} 
        zoom={12} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <ChangeView donations={donations} />
        <TileLayer
          attribution='&copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        {donations.filter(d => d.location && d.location.lat && d.location.lng).map((donation) => (
          <Marker 
            key={donation._id || donation.id}
            position={[donation.location.lat, donation.location.lng]}
            icon={createCustomIcon(donation.isPriority || donation.priority === 'high')}
          >
            <Popup className="premium-popup">
              <div className="p-4 min-w-[240px]">
                <div className="flex items-center gap-2 mb-3">
                   <ShieldCheck size={16} className="text-emerald-500" />
                   <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Verified Donor</span>
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 leading-tight mb-1">{donation.function_name || donation.functionName}</h3>
                <p className="text-xs text-slate-500 mb-4 flex items-center gap-1">
                   <Navigation size={12} /> {donation.pickup_area || donation.pickupArea}
                </p>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                   <div className="rounded-xl bg-slate-50 p-3 text-center">
                      <Utensils size={14} className="mx-auto mb-1 text-brand-primary" />
                      <div className="text-sm font-bold text-slate-800">{donation.servings}</div>
                      <div className="text-[8px] font-bold uppercase text-slate-400">Meals</div>
                   </div>
                   <div className="rounded-xl bg-slate-50 p-3 text-center">
                      <Clock size={14} className="mx-auto mb-1 text-amber-500" />
                      <div className="text-sm font-bold text-slate-800">{donation.expiry_hours || donation.remainingHrs}h</div>
                      <div className="text-[8px] font-bold uppercase text-slate-400">Window</div>
                   </div>
                </div>

                <button 
                  onClick={() => onAccept(donation.id || donation._id)}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 text-xs font-black text-white transition-all hover:bg-emerald-700 hover:shadow-xl active:scale-95"
                >
                  <Navigation size={14} />
                  Claim This Mission
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Legend */}
      <div className="absolute bottom-6 left-6 z-[1000] glass px-4 py-2 rounded-xl flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider text-slate-600">
         <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            Normal
         </div>
         <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            Urgent
         </div>
      </div>
    </div>
  )
}

export default ReceiverMap
