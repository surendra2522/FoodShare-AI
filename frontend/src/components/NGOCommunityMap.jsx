import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect } from 'react'
import { Building2, MapPin, Heart, ShieldCheck } from 'lucide-react'

// Auto-fit bounds component
const ChangeView = ({ ngos }) => {
  const map = useMap()
  useEffect(() => {
    if (ngos.length > 0) {
      const points = ngos
        .filter(n => n.location && n.location.lat)
        .map(n => [n.location.lat, n.location.lng])
      if (points.length > 0) {
        map.fitBounds(points, { padding: [50, 50] })
      }
    }
  }, [ngos, map])
  return null
}

const NGOCommunityMap = ({ ngos }) => {
  const center = [17.3850, 78.4867]

  const createNGOIcon = () => L.divIcon({
    html: `
      <div class="relative flex h-12 w-12 items-center justify-center rounded-full border-4 border-white shadow-2xl transition-all hover:scale-110 bg-indigo-500">
         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M12 6h.01"></path><path d="M12 10h.01"></path><path d="M12 14h.01"></path><path d="M16 10h.01"></path><path d="M16 14h.01"></path><path d="M8 10h.01"></path><path d="M8 14h.01"></path></svg>
         <div class="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-400 border-2 border-white"></div>
      </div>
    `,
    className: 'custom-marker-icon',
    iconSize: [48, 48],
    iconAnchor: [24, 48],
    popupAnchor: [0, -48]
  })

  return (
    <div className="h-full w-full overflow-hidden relative rounded-[2.5rem]">
      <MapContainer 
        center={center} 
        zoom={12} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <ChangeView ngos={ngos} />
        <TileLayer
          attribution='&copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        {ngos.filter(n => n.location && n.location.lat && n.location.lng).map((ngo) => (
          <Marker 
            key={ngo.id}
            position={[ngo.location.lat, ngo.location.lng]}
            icon={createNGOIcon()}
          >
            <Popup className="premium-popup">
              <div className="p-4 min-w-[220px]">
                <div className="flex items-center gap-2 mb-3">
                   <ShieldCheck size={16} className="text-indigo-500" />
                   <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Verified Partner</span>
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 leading-tight mb-1">{ngo.name}</h3>
                <p className="text-xs text-slate-500 mb-4 flex items-center gap-1">
                   <Building2 size={12} /> {ngo.org_type || 'NGO'} Partner
                </p>
                
                <div className="rounded-xl bg-indigo-50 p-4 border border-indigo-100 mb-2">
                   <div className="flex items-center gap-2 text-indigo-700 mb-1">
                      <Heart size={14} fill="currentColor" />
                      <div className="text-[10px] font-bold uppercase tracking-wider">Ready to Help</div>
                   </div>
                   <p className="text-[11px] text-indigo-600 leading-relaxed font-medium">
                      This partner is active and ready to redistribute your surplus food instantly.
                   </p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Legend */}
      <div className="absolute top-4 right-4 z-[1000] glass px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
         <div className="h-2 w-2 rounded-full bg-indigo-500" />
         Active NGO Partner
      </div>
    </div>
  )
}

export default NGOCommunityMap
