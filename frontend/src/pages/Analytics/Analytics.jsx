import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, Users, Leaf, Calendar, Sparkles, Map as MapIcon, Globe, ArrowUpRight, Zap, Utensils, Building2, MapPin, AlertCircle } from 'lucide-react'
import { http } from '../../services/api'

const formatTimeAgo = (dateString) => {
  if (!dateString) return 'Just now';
  const diff = Math.floor((new Date() - new Date(dateString)) / 60000);
  if (diff < 1) return 'Just now';
  if (diff < 60) return `${diff}m ago`;
  const hours = Math.floor(diff / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

const Analytics = () => {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await http.get('/analytics/summary')
        setData(response.data)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch analytics', err)
        setError('Failed to fetch live activity. Retrying...')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchAnalytics()
    const interval = setInterval(fetchAnalytics, 10000)
    return () => clearInterval(interval)
  }, [])

  const stats = data ? [
    { 
      label: 'Total Meals Saved', 
      value: data.totalServings?.toLocaleString() || '0', 
      icon: <Utensils className="text-emerald-600" />, 
      trend: '+12% this month',
      color: 'bg-emerald-50'
    },
    { 
      label: 'Redistribution Rate', 
      value: `${Math.round((data.matchedDonations / data.totalDonations) * 100 || 0)}%`, 
      icon: <Users className="text-brand-secondary" />, 
      trend: `${data.matchedDonations} matched`,
      color: 'bg-amber-50'
    },
    { 
      label: 'Active Partners', 
      value: data.activePartners?.toLocaleString() || '0', 
      icon: <Building2 className="text-indigo-600" />, 
      trend: 'Registered today',
      color: 'bg-indigo-50'
    },
    { 
      label: 'CO2 Offset', 
      value: `${data.co2Saved} kg`, 
      icon: <Leaf className="text-emerald-500" />, 
      trend: 'Lifetime impact',
      color: 'bg-emerald-50'
    },
  ] : []

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <header className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-brand-primary">
            <Sparkles size={20} />
            <span className="text-sm font-bold uppercase tracking-wider">Mission Intelligence</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">Impact <span className="text-gradient">Analytics</span></h1>
          <p className="mt-2 text-slate-600 max-w-xl">Real-time data from our AI-driven food redistribution network across the city.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition-all hover:shadow-md">
            <Calendar size={16} />
            Last 30 Days
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white shadow-lg transition-all hover:bg-slate-800">
            Export Report
          </button>
        </div>
      </header>

      {/* Main Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="card-hover glass rounded-[2.5rem] p-8"
          >
            <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${stat.color}`}>
              {stat.icon}
            </div>
            <div className="text-xs font-bold uppercase tracking-widest text-slate-400">{stat.label}</div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-bold text-slate-900">{stat.value}</span>
            </div>
            <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-brand-primary">
               <ArrowUpRight size={12} />
               {stat.trend}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-12">
        {/* Left Column: Charts & Insights */}
        <div className="lg:col-span-8 space-y-8">
          <div className="glass rounded-[3rem] p-10 shadow-xl">
             <div className="mb-8 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-xl font-bold text-slate-800">
                  <BarChart3 size={22} className="text-brand-primary" />
                  Redistribution Efficiency
                </h3>
                <div className="flex items-center gap-4 text-sm font-bold text-slate-500">
                  <span className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-emerald-500" /> Success</span>
                  <span className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-slate-200" /> Target</span>
                </div>
             </div>
             
             <div className="grid grid-cols-7 gap-4 items-end h-64">
                {(data?.trends || [0,0,0,0,0,0,0]).map((item, i) => {
                  const val = item.efficiency || 0
                  return (
                    <div key={i} className="group relative flex flex-1 flex-col items-center justify-end h-full">
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        whileInView={{ height: `${Math.max(5, val)}%`, opacity: 0.8 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                        className="w-full rounded-t-2xl bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)] group-hover:opacity-100 group-hover:scale-x-105 transition-all"
                      />
                      <div className="absolute -bottom-8 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        {item.day || `Day ${i+1}`}
                      </div>
                      {/* Tooltip */}
                      <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-all bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl pointer-events-none shadow-xl z-20 whitespace-nowrap">
                        {val}% Efficiency • {item.servings || 0} meals
                      </div>
                    </div>
                  )
                })}
              </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <div className="glass rounded-[2.5rem] p-8">
              <h4 className="mb-6 font-bold text-slate-800">Food Type Breakdown</h4>
              <div className="space-y-5">
                {(data?.foodTypes?.length > 0 ? data.foodTypes : [
                  { type: 'No Data Yet', percent: 0 }
                ]).map((item, idx) => (
                  <div key={idx}>
                    <div className="mb-2 flex justify-between text-sm font-bold">
                      <span className="text-slate-600">{item.type}</span>
                      <span className="text-slate-900">{item.percent}%</span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percent}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className={`h-full ${['bg-emerald-500', 'bg-brand-secondary', 'bg-indigo-500'][idx % 3]}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-dark rounded-[2.5rem] p-8 relative overflow-hidden group">
               <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-emerald-500/10 blur-3xl group-hover:bg-emerald-500/20 transition-all duration-700" />
               <h4 className="flex items-center gap-2 font-bold mb-4">
                 <Sparkles size={18} className="text-emerald-400" />
                 AI Optimization Tip
               </h4>
               <p className="text-sm leading-relaxed text-emerald-100/80">
                 System detected a peak efficiency of <strong>{data?.trends?.[0]?.efficiency || 0}%</strong> today. 
                 Continuing to distribute surplus food in highly active zones will increase overall successful deliveries.
               </p>
               <button className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 hover:text-emerald-300 transition-colors">
                 Apply Optimization <ArrowUpRight size={14} />
               </button>
            </div>
          </div>
        </div>

        {/* Right Column: Global Impact */}
        <div className="lg:col-span-4 space-y-8">
          <div className="glass rounded-[3rem] p-10 shadow-xl flex flex-col items-center text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 opacity-50" />
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 relative group-hover:scale-110 transition-transform duration-500">
               <Leaf size={48} />
               <motion.div 
                 animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                 transition={{ duration: 3, repeat: Infinity }}
                 className="absolute inset-0 rounded-full bg-emerald-400"
               />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">Carbon Saved</h3>
            <p className="mt-3 text-sm text-slate-500 leading-relaxed px-2">
              Preventing food from reaching landfills has mitigated methane emissions equivalent to:
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4 w-full">
              <div className="rounded-[2rem] bg-slate-50 p-5 border border-slate-100 hover:bg-emerald-50 hover:border-emerald-100 transition-colors">
                 <div className="text-2xl font-black text-slate-900">{Math.floor((data?.totalServings || 0) * 0.08)}</div>
                 <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Trees Planted</div>
              </div>
              <div className="rounded-[2rem] bg-slate-50 p-5 border border-slate-100 hover:bg-emerald-50 hover:border-emerald-100 transition-colors">
                 <div className="text-2xl font-black text-slate-900">{Math.floor((data?.totalServings || 0) * 3)}</div>
                 <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Car Miles Saved</div>
              </div>
            </div>
          </div>

          <div className="glass rounded-[3rem] p-8 shadow-2xl border-2 border-white bg-gradient-to-br from-white/90 to-slate-50/90 relative group overflow-hidden flex flex-col h-[550px]">
             <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
             <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-6 shrink-0">
                   <h4 className="font-black flex items-center gap-3 text-xl text-slate-800">
                     <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center text-brand-primary shadow-inner">
                        <Globe size={20} />
                     </div>
                     Live City Feed
                   </h4>
                   <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 shadow-sm">
                      <span className="text-[10px] font-black uppercase text-brand-primary tracking-widest animate-pulse">Live</span>
                      <div className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary shadow-[0_0_8px_#10B981]"></span>
                      </div>
                   </div>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                  {error ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-red-200 rounded-2xl bg-red-50/50">
                      <AlertCircle size={32} className="text-red-400 mb-3" />
                      <span className="text-sm font-bold text-red-600">{error}</span>
                    </div>
                  ) : isLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="animate-pulse flex items-center justify-between p-4 bg-slate-100/50 rounded-2xl border border-white">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-slate-200/70 rounded-xl" />
                            <div className="space-y-2">
                              <div className="h-4 w-32 bg-slate-200/70 rounded" />
                              <div className="h-3 w-48 bg-slate-200/70 rounded" />
                            </div>
                          </div>
                          <div className="h-6 w-20 bg-slate-200/70 rounded-lg" />
                        </div>
                      ))}
                    </div>
                  ) : data?.recentActivity?.length > 0 ? (
                    data.recentActivity.map((item, i) => (
                     <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={item.id || i} 
                        className="flex items-center justify-between p-4 bg-white/80 border border-white hover:border-brand-primary/30 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group/item hover:-translate-y-0.5"
                      >
                        <div className="flex items-center gap-4">
                           <div className="h-12 w-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover/item:text-brand-primary group-hover/item:bg-emerald-50 transition-colors shadow-inner shrink-0">
                              <MapPin size={20} />
                           </div>
                           <div className="min-w-0">
                              <div className="text-sm font-black text-slate-800 truncate pr-2">{item.area}</div>
                              <div className="text-[11px] text-slate-500 font-medium mt-1 flex items-center flex-wrap gap-x-2 gap-y-1">
                                <span className="text-brand-primary font-bold whitespace-nowrap">{item.servings} meals</span>
                                <span className="text-slate-300">•</span>
                                <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 truncate max-w-[100px]">{item.donorName}</span>
                                <span className="text-slate-300">•</span>
                                <span className="whitespace-nowrap font-bold">{formatTimeAgo(item.time)}</span>
                              </div>
                           </div>
                        </div>
                        <div className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg border shrink-0 ml-2 ${
                          item.status === 'Delivered' 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                            : item.status === 'In Transit' || item.status === 'Accepted'
                            ? 'bg-amber-50 text-amber-600 border-amber-200'
                            : 'bg-slate-50 text-slate-600 border-slate-200'
                        }`}>
                          {item.status}
                        </div>
                     </motion.div>
                    ))
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                      <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                        <MapIcon size={24} className="text-slate-300" />
                      </div>
                      <span className="text-sm font-bold text-slate-500">No live donations available</span>
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => navigate('/tracking')}
                  className="mt-6 w-full rounded-2xl bg-slate-900 border-2 border-slate-800 py-4 text-xs font-black uppercase tracking-widest text-white hover:bg-brand-primary hover:border-brand-primary transition-all shadow-lg hover:shadow-brand-primary/30 active:scale-[0.98] shrink-0"
                >
                  View Full Map Activity
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
