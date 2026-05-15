import { motion } from 'framer-motion'
import { Bell, Lock, Map, Eye, Globe, LogOut } from 'lucide-react'

const Settings = () => {
  const sections = [
    {
      title: 'Notifications',
      icon: <Bell size={18} className="text-brand-primary" />,
      items: [
        { name: 'Email Alerts', desc: 'Get updates about your donations via email.', status: true },
        { name: 'Push Notifications', desc: 'Real-time mobile alerts for urgent missions.', status: true },
      ]
    },
    {
      title: 'Privacy & Security',
      icon: <Lock size={18} className="text-brand-secondary" />,
      items: [
        { name: 'Show Impact Publicly', desc: 'Display your donation stats on the leaderboard.', status: false },
        { name: 'Two-Factor Auth', desc: 'Add an extra layer of security to your account.', status: false },
      ]
    }
  ]

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-slate-900">Settings</h1>
        <p className="mt-1 text-slate-600">Tailor your Food Distribution experience.</p>
      </div>

      <div className="space-y-8">
        {sections.map((section, idx) => (
          <div key={idx} className="glass rounded-[2.5rem] p-8 shadow-lg">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50">
                {section.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800">{section.title}</h3>
            </div>
            
            <div className="divide-y divide-slate-100">
              {section.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-6 first:pt-0 last:pb-0">
                  <div>
                    <div className="font-bold text-slate-800">{item.name}</div>
                    <div className="text-sm text-slate-500">{item.desc}</div>
                  </div>
                  <button className={`h-6 w-12 rounded-full p-1 transition-colors ${item.status ? 'bg-brand-primary' : 'bg-slate-200'}`}>
                    <div className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${item.status ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex items-center justify-between rounded-[2rem] bg-red-50 p-6 ring-1 ring-red-100">
          <div>
            <div className="font-bold text-red-900">Danger Zone</div>
            <div className="text-sm text-red-600">Irreversibly delete your account and all data.</div>
          </div>
          <button className="rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-200 hover:bg-red-700">Delete Account</button>
        </div>

        <button className="flex w-full items-center justify-center gap-2 rounded-[2rem] border-2 border-slate-200 py-4 font-bold text-slate-400 transition-colors hover:border-slate-300 hover:text-slate-600">
          <LogOut size={18} />
          Sign Out of All Devices
        </button>
      </div>
    </div>
  )
}

export default Settings
