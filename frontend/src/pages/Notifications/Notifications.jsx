import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Info, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import { http } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'

const Notifications = () => {
  const { token, loading: authLoading } = useAuth()
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (token) fetchNotifications()
    else setLoading(false)
  }, [token])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const res = await http.get('/notifications')
      setAlerts(res.data || [])
    } catch (err) {
      console.error('Failed to fetch notifications', err)
      setError('Unable to load notifications.')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (id) => {
    try {
      await http.patch(`/notifications/${id}/read`)
      setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a))
    } catch (err) {
      console.error('Failed to mark read', err)
    }
  }

  const getIconAndColor = (type) => {
    switch (type) {
      case 'donation_alert': return { icon: <AlertTriangle className="text-amber-600" />, color: 'bg-amber-50 ring-amber-600/20' }
      case 'success': return { icon: <CheckCircle className="text-emerald-600" />, color: 'bg-emerald-50 ring-emerald-600/20' }
      default: return { icon: <Info className="text-indigo-600" />, color: 'bg-indigo-50 ring-indigo-600/20' }
    }
  }

  if (authLoading) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Notifications</h1>
          <p className="mt-1 text-slate-600">Stay updated on your impact and pending missions.</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-md text-slate-400">
           <Bell size={24} />
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex h-32 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-500" />
          </div>
        ) : error ? (
          <div className="rounded-[2.5rem] bg-red-50 p-6 text-center text-red-600 ring-1 ring-red-100 font-bold">{error}</div>
        ) : alerts.length === 0 ? (
          <div className="rounded-[2.5rem] bg-slate-50 p-12 text-center text-slate-500 ring-1 ring-slate-100">
            You have no notifications at this time.
          </div>
        ) : (
          <AnimatePresence>
            {alerts.map((alert, idx) => {
              const { icon, color } = getIconAndColor(alert.type)
              return (
                <motion.div
                  key={alert.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 20, opacity: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`flex gap-6 rounded-[2.5rem] p-6 shadow-sm ring-1 ring-inset ${alert.read ? 'opacity-60 bg-white ring-slate-100' : color + ' glass'} transition-all`}
                >
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-sm ${alert.read ? 'bg-slate-50 opacity-50' : 'bg-white'}`}>
                    {icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-bold ${alert.read ? 'text-slate-500' : 'text-slate-800'}`}>{alert.title}</h4>
                      <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        <Clock size={12} />
                        {new Date(alert.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <p className={`mt-2 text-sm leading-relaxed ${alert.read ? 'text-slate-500' : 'text-slate-600'}`}>{alert.message}</p>
                    <div className="mt-4 flex gap-3">
                      {alert.related_donation_id && (
                        <Link to={`/tracking/${alert.related_donation_id}`} className="text-xs font-bold text-brand-primary hover:underline">
                          View Mission
                        </Link>
                      )}
                      {!alert.is_read && (
                        <button onClick={() => handleMarkAsRead(alert.id)} className="text-xs font-bold text-slate-400 hover:underline">
                          Mark as Read
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        )}
      </div>

      <div className="mt-12 rounded-[2.5rem] bg-slate-900 p-10 text-center text-white shadow-2xl">
         <h3 className="text-xl font-bold">Never Miss a Mission</h3>
         <p className="mt-2 text-slate-400">Enable push notifications to get real-time alerts about nearby food surplus.</p>
         <button className="mt-6 rounded-xl bg-brand-primary px-8 py-3 font-bold transition-all hover:scale-105">Enable Browser Alerts</button>
      </div>
    </div>
  )
}

export default Notifications
