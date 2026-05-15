import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Box, Truck, CheckCircle2, ShieldCheck, Clock, Phone, Home as HomeIcon, User, Sparkles } from 'lucide-react'
import { useParams, useNavigate } from 'react-router-dom'
import TrackingMap from '../../components/TrackingMap'
import { donationService, http } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

const Tracking = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [userPos, setUserPos] = useState(null)
  const [mission, setMission] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMission()
    // Get live location of the receiver (NGO)
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserPos([position.coords.latitude, position.coords.longitude])
      }, (err) => {
        console.warn("Geolocation denied, using estimated position", err)
      })
    }
  }, [id])

  const fetchMission = async () => {
    try {
      if (id) {
        const response = await http.get(`/donations/${id}`)
        setMission(response.data)
      } else {
        const response = await donationService.getAvailable()
        if (response.data && response.data.length > 0) {
          setMission(response.data[0])
        }
      }
    } catch (error) {
      console.error('Error fetching mission', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (newStatus) => {
    try {
      await donationService.updateStatus(id, newStatus)
      setMission(prev => ({ ...prev, status: newStatus }))
    } catch (error) {
      console.error('Status update failed', error)
    }
  }

  if (loading) return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-emerald-100 border-t-brand-primary" />
        <div className="text-sm font-bold uppercase tracking-widest text-slate-400">Locating Active Mission...</div>
      </div>
    </div>
  )

  if (!mission) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <div className="glass mx-auto max-w-md rounded-[3rem] p-12 shadow-xl">
           <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 text-slate-300">
             <Truck size={40} />
           </div>
           <h2 className="text-2xl font-bold text-slate-800">No Active Mission</h2>
           <p className="mt-4 text-slate-600">You don't have any food redistributions currently in transit.</p>
        </div>
      </div>
    )
  }

  const donorPos = mission.location?.lat 
    ? [mission.location.lat, mission.location.lng] 
    : [17.3850, 78.4867]
    
  const receiverPos = userPos || (mission.location?.lat
    ? [mission.location.lat + 0.005, mission.location.lng - 0.008]
    : [17.4435, 78.3772])

  const statusMap = {
    'pending': 0,
    'ai-verified': 1,
    'accepted': 2,
    'picking-up': 2,
    'in-transit': 3,
    'delivered': 4,
    'cancelled': -1
  }

  const currentStepIndex = statusMap[mission.status] || 0

  const steps = [
    { label: 'Posted', icon: <Box size={18} />, status: currentStepIndex >= 0 ? 'complete' : 'current', time: 'Recently' },
    { label: 'AI Verified', icon: <Sparkles size={18} />, status: currentStepIndex >= 1 ? 'complete' : currentStepIndex === 0 ? 'current' : 'upcoming', time: currentStepIndex >= 1 ? 'Success' : 'Processing...' },
    { label: 'NGO Accepted', icon: <CheckCircle2 size={18} />, status: currentStepIndex >= 2 ? 'complete' : currentStepIndex === 1 ? 'current' : 'upcoming', time: mission.accepted_at ? new Date(mission.accepted_at).toLocaleTimeString() : '--' },
    { label: 'Picked Up', icon: <Truck size={18} />, status: currentStepIndex >= 3 ? 'complete' : currentStepIndex === 2 ? 'current' : 'upcoming', time: currentStepIndex === 3 ? 'In Transit' : '--' },
    { label: 'Delivered', icon: <ShieldCheck size={18} />, status: currentStepIndex === 4 ? 'complete' : 'upcoming', time: currentStepIndex === 4 ? 'Complete' : '--' },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-slate-900">Mission <span className="text-brand-primary">#FD-{mission.id?.slice(-4).toUpperCase() || 'LIVE'}</span></h1>
        <p className="mt-2 text-slate-600">{mission.function_name} Redistribution in Progress</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Status Stepper */}
        <div className="lg:col-span-12">
          <div className="glass rounded-[2rem] p-8 shadow-lg">
            <div className="flex flex-col justify-between gap-8 md:flex-row">
              {steps.map((step, idx) => (
                <div key={idx} className="flex flex-1 flex-col items-center text-center">
                  <div className={`relative mb-4 flex h-14 w-14 items-center justify-center rounded-2xl transition-all ${
                    step.status === 'complete' ? 'bg-emerald-100 text-emerald-600' :
                    step.status === 'current' ? 'bg-brand-primary text-white shadow-lg shadow-emerald-200' :
                    'bg-slate-50 text-slate-300'
                  }`}>
                    {step.icon}
                    {idx < steps.length - 1 && (
                      <div className="absolute left-full hidden h-0.5 w-[calc(100%_-_3.5rem)] bg-slate-100 md:block" />
                    )}
                  </div>
                  <div className={`font-bold ${step.status === 'upcoming' ? 'text-slate-400' : 'text-slate-800'}`}>
                    {step.label}
                  </div>
                  <div className="mt-1 text-xs font-semibold text-slate-400">{step.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Map */}
        <div className="lg:col-span-8">
          <div className="glass overflow-hidden rounded-[2.5rem] shadow-xl">
             <div className="p-4">
               <TrackingMap donorPos={donorPos} receiverPos={receiverPos} />
             </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="space-y-6 lg:col-span-4">
          <div className="glass rounded-3xl p-6 shadow-lg">
            <h3 className="mb-4 text-lg font-bold text-slate-800">Mission Details</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <MapPin size={16} />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase text-slate-400">Pickup</div>
                  <div className="text-sm font-semibold text-slate-700">{mission.pickup_area}</div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <HomeIcon size={16} />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase text-slate-400">Delivery</div>
                  <div className="text-sm font-semibold text-slate-700">Nearest Verified Home</div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Clock size={16} />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase text-slate-400">Servings</div>
                  <div className="text-sm font-semibold text-slate-700">{mission.servings} Meals</div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass rounded-3xl p-6 shadow-lg border-2 border-brand-primary/20">
            <h3 className="mb-4 text-lg font-bold text-slate-800">Assigned Logistics</h3>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
                <User size={20} />
              </div>
              <div className="flex-1">
                <div className="font-bold text-slate-800">Redistribution Team</div>
                <div className="text-xs text-slate-500">Dispatching now...</div>
              </div>
              <a href="tel:123" className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary text-white shadow-lg transition-transform hover:scale-110">
                <Phone size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Simulation Controls (For Project Demo) */}
        {user?.role?.toLowerCase() === 'ngo' && (
          <div className="lg:col-span-12">
            <div className="glass-dark rounded-[2.5rem] p-8 shadow-2xl overflow-hidden relative group">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl group-hover:bg-emerald-500/20 transition-all duration-700" />
              
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                <div>
                  <h3 className="text-2xl font-bold flex items-center gap-3">
                    <Sparkles size={24} className="text-emerald-400" />
                    Mission Control Simulator
                  </h3>
                  <p className="text-emerald-100/60 text-sm mt-1">Use these controls to simulate live progress for your project review.</p>
                </div>

                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => handleStatusUpdate('picking-up')}
                    disabled={currentStepIndex >= 3}
                    className={`px-8 py-3 rounded-2xl font-bold transition-all active:scale-95 ${
                      currentStepIndex === 2 ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-white/5 text-white/40 cursor-not-allowed'
                    }`}
                  >
                    Start Pickup
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate('in-transit')}
                    disabled={currentStepIndex >= 4 || currentStepIndex < 2}
                    className={`px-8 py-3 rounded-2xl font-bold transition-all active:scale-95 ${
                      currentStepIndex === 2 || currentStepIndex === 3 ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'bg-white/5 text-white/40 cursor-not-allowed'
                    }`}
                  >
                    In Transit
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate('delivered')}
                    disabled={currentStepIndex === 4}
                    className={`px-8 py-3 rounded-2xl font-bold transition-all active:scale-95 ${
                      currentStepIndex === 3 ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 text-white/40 cursor-not-allowed'
                    }`}
                  >
                    Mark Delivered
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Tracking
