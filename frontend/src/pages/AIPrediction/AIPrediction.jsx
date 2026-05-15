import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Cpu, Zap, Activity, ShieldCheck, BrainCircuit, Search } from 'lucide-react'

  const [guests, setGuests] = useState(100)
  const [type, setType] = useState('Wedding')
  const [prediction, setPrediction] = useState({ min: 120, max: 145 })

  useEffect(() => {
    // Simulated prediction logic
    const base = type === 'Wedding' ? 1.2 : type === 'Corporate' ? 0.8 : type === 'Party' ? 1.5 : 2.0
    const min = Math.round(guests * base * 0.8)
    const max = Math.round(guests * base * 1.2)
    setPrediction({ min, max })
  }, [guests, type])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-12">
        <div className="mb-2 flex items-center gap-2 text-brand-primary">
          <Cpu size={20} />
          <span className="text-sm font-bold uppercase tracking-wider">Predictive Intelligence</span>
        </div>
        <h1 className="text-4xl font-bold text-slate-900">Smart <span className="text-gradient">Redistribution</span> AI</h1>
        <p className="mt-2 text-slate-600">Our models optimize every meal's journey using real-time event and location data.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main AI Tool */}
        <div className="lg:col-span-2">
          <div className="glass h-full rounded-[3rem] p-8 shadow-xl lg:p-10">
            <div className="mb-8 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800">Surplus Predictor</h3>
              <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-bold text-emerald-600">
                <Activity size={14} className="animate-pulse" />
                Live Model v2.4
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <label className="mb-4 block text-sm font-bold text-slate-700">Function Type</label>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {['Wedding', 'Corporate', 'Party', 'Festival'].map((t) => (
                    <button 
                      key={t} 
                      onClick={() => setType(t)}
                      className={`rounded-2xl py-4 text-sm font-bold transition-all active:scale-95 ${
                        type === t ? 'bg-brand-primary text-white shadow-lg shadow-emerald-200' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-4 flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-700">Expected Guests</label>
                  <span className="text-lg font-black text-brand-primary">{guests}</span>
                </div>
                <input 
                  type="range" 
                  min="50"
                  max="1000"
                  step="10"
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-100 accent-brand-primary" 
                />
              </div>

              <div className="rounded-[2.5rem] bg-slate-900 p-10 text-white shadow-2xl relative overflow-hidden group">
                 <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-[80px] group-hover:bg-emerald-500/20 transition-all duration-1000" />
                 <div className="flex items-center justify-between relative z-10">
                   <div>
                     <div className="text-xs font-bold uppercase tracking-widest text-emerald-400">Predicted Surplus</div>
                     <div className="mt-2 text-5xl font-black text-white">{prediction.min} - {prediction.max} <span className="text-xl font-medium text-slate-500">servings</span></div>
                   </div>
                   <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400">
                      <BrainCircuit size={32} />
                   </div>
                 </div>
                 <p className="mt-6 text-sm text-slate-400 leading-relaxed max-w-md">Our AI suggests booking 2 volunteers and 1 vehicle for pickup at 11:30 PM based on similar events in your area.</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Features List */}
        <div className="space-y-6">
          {[
            { 
              icon: <Zap className="text-amber-500" />, 
              title: 'Routing optimization', 
              desc: 'AI calculates the fastest path to ensure food stays fresh.' 
            },
            { 
              icon: <ShieldCheck className="text-emerald-500" />, 
              title: 'Quality Verification', 
              desc: 'Visual recognition models verify food safety & quantity.' 
            },
            { 
              icon: <Search className="text-indigo-500" />, 
              title: 'Smart Matching', 
              desc: 'Prioritizes NGOs with the most urgent need and best fit.' 
            },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="glass rounded-[2rem] p-6 shadow-lg"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50">
                {feature.icon}
              </div>
              <h4 className="font-bold text-slate-800">{feature.title}</h4>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AIPrediction
