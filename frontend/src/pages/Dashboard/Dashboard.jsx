import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import {
  Utensils, MapPin, Clock, CheckCircle2, ChevronRight, Bell,
  Home as HomeIcon, Sparkles, AlertCircle, TrendingUp, X,
  Plus, Heart, Award, History, ArrowUpRight, Package, Navigation
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { donationService, http } from '../../services/api'
import ReceiverMap from '../../components/ReceiverMap'
const Dashboard = () => {
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const [role, setRole] = useState(user?.role?.toLowerCase() || 'donor')

  // States from NGO
  const [donations, setDonations] = useState([])
  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [acceptedId, setAcceptedId] = useState(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [lastClaimedId, setLastClaimedId] = useState(null)

  // States from Donor
  const [myDonations, setMyDonations] = useState([])
  const [missions, setMissions] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      const r = user.role.toLowerCase()
      setRole(r)
      fetchData(r)
    }
  }, [user])

  const fetchNotifications = async () => {
    const response = await http.get('/notifications')
    setNotifications(response.data)
  }

  const fetchMyDonations = async () => {
    const response = await donationService.getMyDonations()
    setMyDonations(response.data)
  }

  const fetchAvailableDonations = async () => {
    const response = await donationService.getAvailable()
    const enhancedData = response.data.map(d => {
      const totalLife = d.expiry_hours || 6
      const elapsed = (new Date() - new Date(d.created_at)) / (1000 * 60 * 60)
      const remaining = Math.max(0.1, totalLife - elapsed)
      return {
        ...d,
        remainingHrs: remaining.toFixed(1),
        freshness: Math.round((remaining / totalLife) * 100),
        isPriority: remaining < 2 || d.priority === 'high'
      }
    })
    setDonations(enhancedData)
  }

  const fetchData = async (overrideRole) => {
    setIsLoading(true)
    const activeRole = overrideRole || role || user?.role?.toLowerCase()
    try {
      if (activeRole === 'donor') {
        await fetchMyDonations()
      } else {
        await fetchAvailableDonations()
        const res = await donationService.getMyMissions()
        setMissions(res.data)
      }
      const notifRes = await http.get('/notifications')
      setNotifications(notifRes.data)
    } catch (error) {
      console.error('Fetch failed', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAccept = async (rawId) => {
    const id = rawId;
    if (!id) return;

    try {
      setAcceptedId(id);
      await donationService.accept(id);
      setLastClaimedId(id);

      // Update local state
      setDonations(prev => prev.filter(d => (d.id || d._id) !== id));
      setShowSuccessModal(true);

      // Refresh missions in background
      donationService.getMyMissions().then(res => setMissions(res.data));
    } catch (error) {
      console.error('Failed to accept donation', error);
      alert('Could not claim mission. Please try again.');
    } finally {
      setAcceptedId(null);
    }
  }

  const totalMeals = role === 'donor'
    ? myDonations.reduce((sum, d) => sum + (d.servings || 0), 0)
    : missions.filter(m => m.status === 'delivered').reduce((sum, d) => sum + (d.servings || 0), 0)

  if (isLoading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-emerald-100 border-t-brand-primary" />
          <div className="text-sm font-bold uppercase tracking-widest text-slate-400 animate-pulse">Syncing Impact Data...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 relative">
      {/* Header */}
      <header className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <div className="mb-3 flex items-center gap-2 text-brand-primary">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 shadow-sm">
              <Sparkles size={16} />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest">
              {role === 'ngo' ? 'NGO Control Center' : 'Donor Impact Hub'}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900">
            Welcome, <span className="text-gradient">{user?.name}</span>
          </h1>
          <p className="mt-2 text-slate-600 max-w-lg">
            {role === 'ngo'
              ? 'Real-time alerts for surplus food available in your immediate vicinity.'
              : `You have helped save ${totalMeals} meals from going to waste.`}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {role === 'donor' ? (
            <Link to="/donate" className="btn-premium flex items-center gap-3 px-8 py-4">
              <Plus size={20} />
              <span>Post Surplus</span>
            </Link>
          ) : (
            <button
              onClick={() => setShowNotifications(true)}
              className="relative h-14 w-14 rounded-2xl bg-white shadow-lg border-2 border-emerald-50 flex items-center justify-center text-slate-600 hover:text-brand-primary transition-all active:scale-95"
            >
              <Bell size={24} />
              {notifications.length > 0 && (
                <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                  {notifications.length}
                </div>
              )}
            </button>
          )}
          <div className="glass rounded-[2rem] px-8 py-4 shadow-lg border-2 border-emerald-50 text-center">
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Impact</div>
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-brand-primary" />
              <div className="text-2xl font-bold text-slate-900">
                {totalMeals.toLocaleString()}
              </div>
              <span className="text-xs text-slate-400">meals</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-12">
        {role === 'ngo' ? (
          <>
            {/* NGO View */}
            <div className="lg:col-span-7">
              <div className="glass h-full overflow-hidden rounded-[3rem] shadow-2xl relative">
                <div className="absolute top-6 left-6 z-10 flex items-center gap-3">
                  <div className="glass flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-bold text-slate-800 shadow-md">
                    <MapPin size={16} className="text-brand-primary" />
                    Live Mission Map
                  </div>
                </div>
                <div className="h-[650px] p-4">
                  <ReceiverMap donations={donations} onAccept={handleAccept} />
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <h3 className="text-xl font-bold text-slate-800 px-2">Smart Match Feed</h3>
              <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar pb-4">
                {donations.length > 0 ? (
                  donations.map((donation) => (
                    <DonationCard key={donation.id || donation._id} donation={donation} handleAccept={handleAccept} acceptedId={acceptedId} />
                  ))
                ) : (
                  <div className="p-8 text-center glass rounded-3xl border-dashed border-2 border-slate-200">
                    <div className="text-slate-400 text-sm font-medium">No pending surplus food in your area right now.</div>
                  </div>
                )}
              </div>
              <div className="rounded-[2.5rem] bg-white p-8 shadow-2xl">
                <h4 className="text-lg font-bold mb-6 text-slate-800">My Claimed Missions</h4>
                <div className="space-y-4">
                  <NGOMissionList missions={missions} />
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Donor View */}
            <div className="lg:col-span-8 space-y-8">
              <div className="grid gap-6 sm:grid-cols-2">
                <StatsCard title="Total Shared" value={totalMeals} icon={<Heart size={32} fill="currentColor" />} />
                <StatsCard
                  title="Badges"
                  value={`Level ${Math.floor(totalMeals / 100) + 1}`}
                  icon={<Award size={32} />}
                  dark
                  subtitle={`${Math.max(0, 100 - (totalMeals % 100))} meals to Level ${Math.floor(totalMeals / 100) + 2}`}
                />
              </div>

              <div className="glass rounded-[3rem] p-10 shadow-xl relative overflow-hidden">
                <h3 className="mb-8 flex items-center gap-3 text-xl font-bold text-slate-800">
                  <History size={22} className="text-brand-primary" />
                  Redistribution History
                </h3>
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {myDonations.map((donation) => (
                    <HistoryItem key={donation.id} donation={donation} />
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-8">
              <div className="glass-dark rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-emerald-500/10 blur-3xl group-hover:bg-emerald-500/20 transition-all duration-700" />
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <Sparkles size={20} className="text-emerald-400" />
                  AI Intelligence Center
                </h3>
                <div className="mt-6 space-y-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">Efficiency</div>
                    <div className="text-lg font-bold">AI predicts 95% successful redistribution</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-1">Demand Alert</div>
                    <div className="text-lg font-bold text-amber-100">High demand detected nearby</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1">Critical Insight</div>
                    <div className="text-lg font-bold text-red-100">Average redistribution: 14 mins</div>
                  </div>
                </div>
                <div className="mt-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Optimization Active
                </div>
              </div>

              <div className="glass rounded-[3rem] p-10 shadow-xl border-2 border-emerald-50">
                <h3 className="text-xl font-bold text-slate-800 mb-6">Food Saved Chart</h3>
                <div className="flex items-end justify-between h-32 gap-2">
                  {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
                    <div key={i} className="flex-1 bg-emerald-100 rounded-t-lg relative group transition-all hover:bg-emerald-500" style={{ height: `${h}%` }}>
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {h}kg
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                  <span>Mon</span><span>Sun</span>
                </div>
              </div>
              <div className="glass rounded-[3rem] p-10 shadow-xl border-2 border-emerald-50">
                <h3 className="text-xl font-bold text-slate-800 mb-6">Impact Community</h3>
                <div className="flex -space-x-4 mb-6">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-slate-100">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`} alt="User" />
                    </div>
                  ))}
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Join 500+ active donors</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Mission Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[3rem] p-10 max-w-sm w-full text-center shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500" />
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Mission Claimed!</h3>
              <p className="text-slate-500 text-sm mb-8">
                The donor has been notified. You can now start tracking the pickup route.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => navigate(`/tracking/${lastClaimedId}`)}
                  className="w-full btn-premium py-4 rounded-2xl flex items-center justify-center gap-2"
                >
                  <Navigation size={18} />
                  Start Tracking
                </button>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full py-3 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-600 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Notification Drawer Overlay (for NGO) */}
      <AnimatePresence>
        {showNotifications && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowNotifications(false)} className="fixed inset-0 z-[110] bg-slate-900/20 backdrop-blur-sm" />
            <motion.div initial={{ x: 400 }} animate={{ x: 0 }} exit={{ x: 400 }} className="fixed right-0 top-0 bottom-0 z-[120] w-full max-w-md bg-white shadow-2xl p-8 overflow-y-auto">
              <div className="mb-8 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-slate-900">Alert Center</h3>
                <button onClick={() => setShowNotifications(false)} className="rounded-full p-2 hover:bg-slate-100"><X size={24} /></button>
              </div>
              <div className="space-y-4">
                {notifications.map(notif => (
                  <div key={notif.id} className={`p-6 rounded-3xl border ${notif.type === 'urgent' ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
                    <h4 className="font-bold text-slate-900 mb-1">{notif.title}</h4>
                    <p className="text-sm text-slate-600">{notif.message}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// Sub-components for cleaner structure
const DonationCard = ({ donation, handleAccept, acceptedId }) => (
  <motion.div layout className={`glass rounded-3xl p-6 relative overflow-hidden ${donation.isPriority ? 'border-2 border-amber-200' : ''}`}>
    <div className="flex justify-between items-start">
      <div>
        <h4 className="font-bold text-slate-900">{donation.function_name}</h4>
        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
          <MapPin size={12} /> {donation.pickup_area} • <Clock size={12} /> {donation.remainingHrs}h left
        </div>
      </div>
      <div className="text-right">
        <div className="text-lg font-black text-emerald-600">{donation.servings}</div>
        <div className="text-[10px] font-bold text-slate-400 uppercase">Meals</div>
      </div>
    </div>
    <button
      onClick={() => handleAccept(donation.id || donation._id)}
      disabled={acceptedId !== null}
      className="mt-6 w-full rounded-2xl bg-slate-900 py-4 text-sm font-black text-white hover:bg-brand-primary transition-all shadow-lg hover:shadow-brand-primary/20 active:scale-[0.98]"
    >
      {acceptedId === (donation.id || donation._id) ? 'Accepting...' : 'Claim Mission'}
    </button>
  </motion.div>
)

const NGOMissionList = ({ missions }) => {
  const navigate = useNavigate()
  return missions.length > 0 ? (
    missions.map(m => (
      <div key={m.id || m._id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-white hover:border-emerald-200 border transition-all cursor-pointer group" onClick={() => navigate(`/tracking/${m.id || m._id}`)}>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-sm group-hover:bg-emerald-50">
            <Package size={18} />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-800">{m.function_name}</div>
            <div className="text-[10px] text-slate-400 font-medium">
              {m.servings} meals • {m.pickup_area}
            </div>
          </div>
        </div>
        <ChevronRight size={16} className="text-slate-300 group-hover:text-brand-primary" />
      </div>
    ))
  ) : (
    <div className="text-center py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
      No missions claimed yet
    </div>
  )
}

const StatsCard = ({ title, value, icon, dark, subtitle }) => (
  <div className={`rounded-[2.5rem] p-10 shadow-xl transition-all duration-500 hover:scale-[1.02] ${dark ? 'glass-dark' : 'glass border border-white/50'}`}>
    <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${dark ? 'bg-white/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
      {icon}
    </div>
    <div className="text-5xl font-black">{value}</div>
    <div className="mt-2 text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</div>
    {subtitle && <div className="mt-4 text-[10px] font-medium text-slate-500/70">{subtitle}</div>}
  </div>
)

const HistoryItem = ({ donation }) => {
  const navigate = useNavigate()
  return (
    <div onClick={() => navigate(`/tracking/${donation.id || donation._id}`)} className="flex items-center justify-between rounded-3xl bg-slate-50 p-6 hover:bg-white hover:shadow-lg transition-all cursor-pointer group">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-sm group-hover:bg-emerald-50"><Package size={20} className="text-slate-400 group-hover:text-emerald-600" /></div>
        <div>
          <div className="font-bold text-slate-800">{donation.function_name}</div>
          <div className="text-xs text-slate-500">{new Date(donation.created_at).toLocaleDateString()} • {donation.servings} servings</div>
        </div>
      </div>
      <ArrowUpRight size={20} className="text-slate-300 group-hover:text-emerald-500" />
    </div>
  )
}

export default Dashboard
