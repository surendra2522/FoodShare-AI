import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LayoutDashboard, Users, Activity, Settings, ShieldAlert, BarChart } from 'lucide-react'
import { analyticsService } from '../../services/api'

const AdminDashboard = () => {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSummary()
  }, [])

  const fetchSummary = async () => {
    try {
      const res = await analyticsService.getSummary()
      setSummary(res.data)
    } catch (err) {
      console.error('Failed to fetch admin stats', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !summary) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-500" />
      </div>
    )
  }

  const stats = [
    { label: 'Active Partners', value: summary.activePartners || '0', icon: <Users size={20} />, color: 'text-indigo-600' },
    { label: 'Platform Efficiency', value: `${summary.freshnessRate || 98}%`, icon: <Activity size={20} />, color: 'text-emerald-600' },
    { label: 'Total Missions', value: summary.totalDonations || '0', icon: <ShieldAlert size={20} />, color: 'text-amber-600' },
    { label: 'Meals Saved', value: summary.totalServings || '0', icon: <BarChart size={20} />, color: 'text-brand-primary' },
  ]

  return (
    <div className="mx-auto max-max-7xl px-4 py-8">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Platform <span className="text-brand-primary">Control</span></h1>
          <p className="mt-1 text-slate-600">Global oversight for the food redistribution network.</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105">
          <Settings size={18} />
          System Config
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="glass rounded-[2rem] p-6 shadow-lg"
          >
            <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 ${stat.color}`}>
              {stat.icon}
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{stat.label}</div>
            <div className="mt-1 text-2xl font-bold text-slate-900">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="glass col-span-2 rounded-[2.5rem] p-8 shadow-xl">
          <h3 className="mb-6 font-bold text-slate-800">Mission Servings Trend (7 Days)</h3>
          <div className="h-64 w-full flex items-end gap-4">
            {summary.trends?.map((t, i) => {
              const max = Math.max(...summary.trends.map(x => x.servings || 100))
              const height = ((t.servings || 0) / max) * 100 || 5
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    className="w-full rounded-t-lg bg-brand-primary/20 group-hover:bg-brand-primary transition-colors relative"
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs font-bold py-1 px-2 rounded-lg pointer-events-none">
                      {t.servings}
                    </div>
                  </motion.div>
                  <div className="text-[10px] font-bold text-slate-400">{t.day}</div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="glass rounded-[2.5rem] p-8 shadow-xl">
          <h3 className="mb-6 font-bold text-slate-800">Recent Network Activity</h3>
          <div className="space-y-4">
            {summary.recentActivity?.slice(0, 4).map((item, idx) => (
              <div key={idx} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                <div>
                  <div className="text-sm font-bold text-slate-800 truncate max-w-[150px]">{item.donorName}</div>
                  <div className="text-[10px] text-slate-500 font-medium mt-0.5">{item.servings} meals • {item.status}</div>
                </div>
                <div className={`rounded-lg px-3 py-1.5 text-[10px] font-bold shadow-sm ${
                  item.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                  item.status === 'Accepted' ? 'bg-emerald-100 text-emerald-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {item.status}
                </div>
              </div>
            ))}
          </div>
          <button className="mt-6 w-full text-center text-xs font-bold text-slate-400 hover:text-brand-primary transition-colors">View Complete Logs</button>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
