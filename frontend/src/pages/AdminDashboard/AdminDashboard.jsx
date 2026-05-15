import { motion } from 'framer-motion'
import { LayoutDashboard, Users, Activity, Settings, ShieldAlert, BarChart } from 'lucide-react'

const AdminDashboard = () => {
  const stats = [
    { label: 'Total Users', value: '1,240', icon: <Users size={20} />, color: 'text-indigo-600' },
    { label: 'System Uptime', value: '99.9%', icon: <Activity size={20} />, color: 'text-emerald-600' },
    { label: 'Active Missions', value: '18', icon: <ShieldAlert size={20} />, color: 'text-amber-600' },
    { label: 'Data Synced', value: '4.2 TB', icon: <BarChart size={20} />, color: 'text-brand-primary' },
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
          <h3 className="mb-6 font-bold text-slate-800">User Growth</h3>
          <div className="h-64 w-full flex items-end gap-2">
            {[40, 70, 45, 90, 65, 80, 50, 100].map((h, i) => (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                className="flex-1 rounded-t-lg bg-brand-primary/20 hover:bg-brand-primary transition-colors cursor-pointer"
              />
            ))}
          </div>
          <div className="mt-4 flex justify-between text-[10px] font-bold text-slate-400">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Aug</span>
          </div>
        </div>

        <div className="glass rounded-[2.5rem] p-8 shadow-xl">
          <h3 className="mb-6 font-bold text-slate-800">Pending Verifications</h3>
          <div className="space-y-4">
            {[
              { name: 'Global NGO', date: '2h ago' },
              { name: 'City Banquet Hall', date: '5h ago' },
              { name: 'Unity Care Home', date: '1d ago' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                <div>
                  <div className="text-sm font-bold text-slate-800">{item.name}</div>
                  <div className="text-[10px] text-slate-400">{item.date}</div>
                </div>
                <button className="rounded-lg bg-white px-3 py-1.5 text-[10px] font-bold text-brand-primary shadow-sm hover:bg-brand-primary hover:text-white transition-colors">Review</button>
              </div>
            ))}
          </div>
          <button className="mt-6 w-full text-center text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">See all pending requests</button>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
