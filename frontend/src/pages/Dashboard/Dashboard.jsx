import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import {
  Utensils, MapPin, Clock, CheckCircle2, ChevronRight, Bell,
  Home as HomeIcon, Sparkles, AlertCircle, TrendingUp, X,
  Plus, Heart, Award, History, ArrowUpRight, Package, Navigation, Search
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { donationService, http } from '../../services/api'
import ReceiverMap from '../../components/ReceiverMap'

const DashboardSkeleton = () => (
  <div className="mx-auto max-w-7xl px-4 py-8 animate-pulse">
    <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
      <div className="space-y-4 w-full md:w-1/2">
        <div className="h-8 w-40 bg-slate-200/60 rounded-xl"></div>
        <div className="h-10 w-64 bg-slate-200/60 rounded-xl"></div>
        <div className="h-4 w-full max-w-md bg-slate-200/60 rounded"></div>
      </div>
      <div className="flex gap-4">
        <div className="h-16 w-16 bg-slate-200/60 rounded-2xl"></div>
        <div className="h-16 w-48 bg-slate-200/60 rounded-2xl"></div>
      </div>
    </div>
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="lg:col-span-7 h-[650px] bg-slate-200/60 rounded-[3rem]"></div>
      <div className="lg:col-span-5 space-y-4">
        <div className="h-8 w-40 bg-slate-200/60 rounded-lg mb-6"></div>
        {[1, 2, 3].map(i => (
          <div key={i} className="h-40 bg-slate-200/60 rounded-3xl"></div>
        ))}
      </div>
    </div>
  </div>
)

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
    return <DashboardSkeleton />
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
          <motion.div 
            whileHover={{ scale: 1.05, y: -2 }}
            className="glass rounded-[2rem] px-6 py-4 shadow-xl shadow-emerald-500/5 border border-white flex items-center gap-4 bg-gradient-to-br from-white to-emerald-50/50 cursor-default"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-sm border border-emerald-100">
              <TrendingUp size={24} />
            </div>
            <div className="text-left">
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Impact</div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900">{totalMeals > 0 ? `${totalMeals.toLocaleString()}+` : '0'}</span>
                <span className="text-sm font-bold text-slate-500">Meals</span>
              </div>
              <div className="text-[10px] font-medium text-slate-500">redistributed this year</div>
            </div>
          </motion.div>
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
              <div className="flex items-center justify-between px-2">
                <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  Live City Feed
                </h3>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full uppercase tracking-widest">Live</span>
              </div>
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar pb-4 relative">
                <AnimatePresence>
                  {donations.length > 0 ? (
                    donations.map((donation, idx) => (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: idx * 0.1 }}
                        key={donation.id || donation._id}
                      >
                        <DonationCard donation={donation} handleAccept={handleAccept} acceptedId={acceptedId} />
                      </motion.div>
                    ))
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="p-8 text-center glass rounded-3xl border-dashed border-2 border-slate-200 bg-slate-50/50"
                    >
                      <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-100">
                        <Search size={24} className="text-slate-300" />
                      </div>
                      <div className="text-slate-500 font-bold mb-1">No Active Missions</div>
                      <div className="text-slate-400 text-xs">Waiting for new surplus food alerts in your area.</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="glass rounded-[2.5rem] bg-white/80 p-8 shadow-2xl border border-white">
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
  <motion.div 
    layout
    whileHover={{ y: -4, scale: 1.01 }}
    className={`glass rounded-3xl p-5 relative overflow-hidden transition-all duration-300 ${
      donation.isPriority ? 'border-l-4 border-l-red-500 border-t border-r border-b border-white shadow-red-500/10' : 'border border-white/60 shadow-xl shadow-slate-200/50'
    } bg-gradient-to-br from-white/90 to-white/50`}
  >
    {donation.isPriority && (
      <div className="absolute top-4 right-4 flex items-center gap-1 bg-red-50 text-red-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider z-10">
        <AlertCircle size={10} /> Urgent
      </div>
    )}
    {!donation.isPriority && (
      <div className="absolute top-4 right-4 flex items-center gap-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider z-10">
        <Sparkles size={10} /> Fresh Match
      </div>
    )}

    <div className="flex gap-4">
      <div className="h-16 w-16 rounded-2xl bg-slate-100 flex-shrink-0 overflow-hidden shadow-inner border border-slate-200/50">
        <img src={`https://api.dicebear.com/7.x/shapes/svg?seed=${donation.id || donation._id}&backgroundColor=e2e8f0`} alt="Food" className="h-full w-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-slate-900 truncate pr-24">{donation.function_name}</h4>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 mb-2">
           <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">{donation.donor?.name || 'Local Food Partner'}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-2 py-1 rounded-md">
            <MapPin size={12} className="text-slate-400"/> 
            <span className="truncate max-w-[100px]">{donation.pickup_area}</span>
          </div>
          <div className="flex items-center gap-1 bg-amber-50 border border-amber-100 px-2 py-1 rounded-md text-amber-700">
            <Clock size={12} /> {donation.remainingHrs}h left
          </div>
        </div>
      </div>
    </div>

    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
      <div className="flex flex-col">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quantity</span>
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-black text-emerald-600">{donation.servings}</span>
          <span className="text-xs font-bold text-emerald-600/70">Meals</span>
        </div>
      </div>
      <button
        onClick={() => handleAccept(donation.id || donation._id)}
        disabled={acceptedId !== null}
        className="rounded-xl bg-slate-900 px-6 py-3 text-xs font-black text-white hover:bg-brand-primary transition-all shadow-md hover:shadow-brand-primary/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {acceptedId === (donation.id || donation._id) ? (
          <><div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin"/> Claiming...</>
        ) : 'Claim Mission'}
      </button>
    </div>
  </motion.div>
)

const NGOMissionList = ({ missions }) => {
  const navigate = useNavigate()
  return missions.length > 0 ? (
    missions.map(m => (
      <motion.div 
        whileHover={{ scale: 1.01, x: 4 }}
        key={m.id || m._id} 
        className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-lg border border-slate-100 hover:border-emerald-200 transition-all cursor-pointer group" 
        onClick={() => navigate(`/tracking/${m.id || m._id}`)}
      >
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-sm group-hover:bg-emerald-50 border border-slate-100">
            <Navigation size={18} />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-800">{m.function_name}</div>
            <div className="flex items-center gap-2 text-[10px] font-medium text-slate-500 mt-1">
              <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">{m.servings} meals</span>
              <span className="bg-slate-100 px-2 py-0.5 rounded max-w-[100px] truncate">{m.pickup_area}</span>
            </div>
          </div>
        </div>
        <div className="h-8 w-8 rounded-full flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
          <ChevronRight size={16} className="text-slate-300 group-hover:text-brand-primary" />
        </div>
      </motion.div>
    ))
  ) : (
    <div className="text-center py-8 text-xs font-bold text-slate-400 uppercase tracking-widest border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50">
      No missions claimed yet
    </div>
  )
}

const StatsCard = ({ title, value, icon, dark, subtitle }) => (
  <div className={`rounded-[2.5rem] p-8 shadow-xl transition-all duration-500 hover:scale-[1.02] relative overflow-hidden group ${dark ? 'glass-dark bg-slate-900' : 'glass border border-white bg-gradient-to-br from-white to-emerald-50/50'}`}>
    {dark && <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-primary/20 blur-3xl group-hover:bg-brand-primary/30 transition-all duration-700" />}
    {!dark && <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-200/40 blur-3xl group-hover:bg-emerald-300/40 transition-all duration-700" />}
    <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl relative z-10 ${dark ? 'bg-white/10 text-emerald-400 border border-white/10 shadow-lg' : 'bg-emerald-100 text-emerald-600 border border-emerald-200 shadow-lg shadow-emerald-100'}`}>
      {icon}
    </div>
    <div className={`text-5xl font-black relative z-10 ${dark ? 'text-white' : 'text-slate-900'}`}>{value}</div>
    <div className={`mt-2 text-xs font-bold uppercase tracking-widest relative z-10 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{title}</div>
    {subtitle && <div className={`mt-4 text-[10px] font-bold relative z-10 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{subtitle}</div>}
  </div>
)

const HistoryItem = ({ donation }) => {
  const navigate = useNavigate()
  return (
    <motion.div 
      whileHover={{ scale: 1.01, x: 4 }}
      onClick={() => navigate(`/tracking/${donation.id || donation._id}`)} 
      className="flex items-center justify-between rounded-3xl bg-white/60 p-5 hover:bg-white hover:shadow-xl hover:shadow-emerald-500/5 transition-all cursor-pointer border border-white group"
    >
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center shadow-inner border border-emerald-100 group-hover:bg-emerald-100 transition-colors">
          <Package size={20} className="text-emerald-500 group-hover:text-emerald-600" />
        </div>
        <div>
          <div className="font-bold text-slate-800">{donation.function_name}</div>
          <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500 mt-1">
            <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">{new Date(donation.created_at).toLocaleDateString()}</span>
            <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded"><Utensils size={10}/>{donation.servings} meals</span>
          </div>
        </div>
      </div>
      <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors text-slate-300">
        <ArrowUpRight size={16} />
      </div>
    </motion.div>
  )
}

export default Dashboard
