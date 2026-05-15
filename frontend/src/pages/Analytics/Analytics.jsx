import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, Users, Leaf, Calendar, Sparkles, Map as MapIcon, Globe, ArrowUpRight, Zap, Utensils, Building2, MapPin } from 'lucide-react'
import { http } from '../../services/api'

const Analytics = () => {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await http.get('/analytics/summary')
        setData(response.data)
      } catch (error) {
        console.error('Failed to fetch analytics', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchAnalytics()
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
      value: '156', 
      icon: <Building2 className="text-indigo-600" />, 
      trend: '+8 new this week',
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
                {[
                  { type: 'Pure Veg', percent: 78, color: 'bg-emerald-500' },
                  { type: 'Mixed Meals', percent: 15, color: 'bg-brand-secondary' },
                  { type: 'Dry Goods', percent: 7, color: 'bg-indigo-500' },
                ].map((item, idx) => (
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
                        className={`h-full ${item.color}`}
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
                 System detected a <strong>20% spike</strong> in late-night wedding donations on weekends. 
                 Increasing volunteer standby capacity in Sector 4 could improve match time by <strong>4.5 minutes</strong>.
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
                 <div className="text-2xl font-black text-slate-900">{(data?.totalServings * 0.08).toFixed(0)}</div>
                 <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Trees Planted</div>
              </div>
              <div className="rounded-[2rem] bg-slate-50 p-5 border border-slate-100 hover:bg-emerald-50 hover:border-emerald-100 transition-colors">
                 <div className="text-2xl font-black text-slate-900">{(data?.totalServings * 3).toFixed(0)}k</div>
                 <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Car Miles</div>
              </div>
            </div>
          </div>

          <div className="glass rounded-[3rem] p-10 shadow-2xl bg-slate-900 text-white relative group overflow-hidden border border-white/5">
             <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
             <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                   <h4 className="font-bold flex items-center gap-3 text-lg">
                     <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <Globe size={18} />
                     </div>
                     Live City Feed
                   </h4>
                   <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase text-emerald-400 tracking-widest animate-pulse">Live</span>
                      <div className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10B981]" />
                   </div>
                </div>
                <div className="space-y-6">
                   {(data?.recentActivity || [
                     { area: 'Jubilee Hills', time: '2m ago', servings: 45, status: 'Matched' },
                     { area: 'Banjara Hills', time: '12m ago', servings: 120, status: 'In Transit' },
                     { area: 'Gachibowli', time: '25m ago', servings: 30, status: 'Delivered' },
                   ]).map((item, i) => (
                     <motion.div 
                        initial={{ x: -10, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ delay: i * 0.1 }}
                        key={i} 
                        className="flex items-center justify-between border-b border-white/5 pb-5 last:border-0 last:pb-0 group/item"
                      >
                        <div className="flex items-center gap-4">
                           <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover/item:text-emerald-400 transition-colors">
                              <MapPin size={16} />
                           </div>
                           <div>
                              <div className="text-sm font-bold text-white group-hover/item:text-emerald-50 transition-colors">{item.area}</div>
                              <div className="text-[10px] text-slate-400 font-medium">{item.time} • <span className="text-emerald-400/80">{item.servings} meals</span></div>
                           </div>
                        </div>
                        <div className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg border ${
                          item.status === 'Delivered' 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : 'bg-emerald-600/40 text-white border-emerald-500/40'
                        }`}>
                          {item.status}
                        </div>
                     </motion.div>
                   ))}
                </div>
                <button className="mt-8 w-full rounded-2xl bg-white/5 border border-white/10 py-4 text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all active:scale-[0.98] text-slate-300">
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
