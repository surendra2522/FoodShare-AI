import { motion } from 'framer-motion'
import { Bell, Info, AlertTriangle, CheckCircle, Clock } from 'lucide-react'

const Notifications = () => {
  const alerts = [
    { 
      id: 1, 
      type: 'urgent', 
      title: 'Urgent Pickup Needed', 
      message: 'A wedding function at Crystal Hall has 200 servings of fresh meals. Pickup needed within 2 hours.',
      time: 'Just now',
      icon: <AlertTriangle className="text-amber-600" />,
      color: 'bg-amber-50 ring-amber-600/20'
    },
    { 
      id: 2, 
      type: 'success', 
      title: 'Donation Accepted', 
      message: 'Hope Haven Orphanage has accepted your donation from the birthday event.',
      time: '45 mins ago',
      icon: <CheckCircle className="text-emerald-600" />,
      color: 'bg-emerald-50 ring-emerald-600/20'
    },
    { 
      id: 3, 
      type: 'info', 
      title: 'Weekly Impact Report', 
      message: 'Congratulations! Your donations this week saved 450 meals from being wasted.',
      time: '2 hours ago',
      icon: <Info className="text-indigo-600" />,
      color: 'bg-indigo-50 ring-indigo-600/20'
    },
  ]

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
        {alerts.map((alert, idx) => (
          <motion.div
            key={alert.id}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: idx * 0.1 }}
            className={`flex gap-6 rounded-[2.5rem] p-6 shadow-sm ring-1 ring-inset ${alert.color} glass`}
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
              {alert.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-800">{alert.title}</h4>
                <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <Clock size={12} />
                  {alert.time}
                </div>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{alert.message}</p>
              <div className="mt-4 flex gap-3">
                <button className="text-xs font-bold text-brand-primary hover:underline">View Details</button>
                <button className="text-xs font-bold text-slate-400 hover:underline">Dismiss</button>
              </div>
            </div>
          </motion.div>
        ))}
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
