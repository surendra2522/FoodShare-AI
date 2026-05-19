import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Heart, MapPin, Zap, Bell, Gift, Sparkles, ShieldCheck, PieChart, Clock, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { http } from '../../services/api'

function Home() {
  const { user } = useAuth()
  const [analytics, setAnalytics] = useState(null)
  
  useEffect(() => {
    http.get('/analytics/summary').then(res => setAnalytics(res.data)).catch(() => {})
  }, [])
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  const item = {
    hidden: { y: 30, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  }

  return (
    <div className="pb-20">
      {/* Hero Section: The "Wow" Factor */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden px-6 lg:px-8">
        <div className="mx-auto max-w-7xl w-full">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <motion.div 
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mb-8 inline-flex items-center gap-3 rounded-full bg-emerald-100/50 backdrop-blur-md px-5 py-2 text-sm font-bold text-emerald-700 ring-1 ring-inset ring-emerald-600/30"
              >
                <Sparkles size={16} className="text-brand-primary animate-pulse" />
                <span>Next-Gen Food Redistribution</span>
              </motion.div>
              
              <h1 className="text-5xl font-black tracking-tight text-slate-900 sm:text-7xl lg:text-8xl leading-[1.1]">
                End <span className="text-gradient">Waste</span>.<br />
                Begin <span className="text-brand-secondary underline decoration-emerald-200 underline-offset-8">Blessings</span>.
              </h1>
              
              <p className="mt-8 text-lg leading-8 text-slate-600 lg:text-2xl max-w-xl">
                An **AI-enabled** platform that connects surplus food from events to nearby communities in real time. Smart, fast, and transparent.
              </p>
              
              <div className="mt-12 flex flex-wrap gap-6">
                {(!user || user.role?.toLowerCase() === 'donor') && (
                  <Link to={user ? "/donate" : "/login"} className="btn-premium flex items-center gap-3 text-lg px-10 py-5">
                    <Heart size={24} fill="currentColor" />
                    <span>Donate Surplus</span>
                  </Link>
                )}
                {!user ? (
                  <Link to="/register" className="btn-secondary flex items-center gap-3 text-lg px-10 py-5 group">
                    <span>Join the Mission</span>
                    <ArrowRight size={24} className="transition-transform group-hover:translate-x-2" />
                  </Link>
                ) : (
                  <Link to="/dashboard" className="btn-secondary flex items-center gap-3 text-lg px-10 py-5">
                    <span>Go to Control Center</span>
                    <ArrowRight size={24} />
                  </Link>
                )}
              </div>
              
              <motion.div 
                whileHover={{ y: -4, scale: 1.02 }}
                className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-6 border border-white bg-gradient-to-br from-white/90 to-emerald-50/50 backdrop-blur-md shadow-2xl shadow-emerald-900/5 rounded-[2rem] p-6 lg:p-8 relative overflow-hidden"
              >
                 <div className="absolute top-0 right-0 h-32 w-32 bg-brand-primary/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                 <div className="flex -space-x-4 shrink-0 relative z-10">
                    {Array.from({ length: Math.min(4, analytics?.activePartners || 4) }).map((_, i) => (
                       <div key={i} className="h-14 w-14 rounded-full border-4 border-white bg-slate-100 shadow-sm overflow-hidden flex items-center justify-center transition-transform hover:scale-110 hover:z-20 cursor-pointer">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`} alt={`User ${i}`} className="h-full w-full object-cover" />
                       </div>
                    ))}
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-slate-900 text-xs font-bold text-white shadow-sm transition-colors hover:bg-brand-primary hover:z-20 cursor-pointer">
                      +{Math.max(0, (analytics?.activePartners || 10) - 4)}
                    </div>
                 </div>
                 <div className="flex flex-col gap-1 relative z-10">
                    <span className="font-black text-slate-900 flex items-center gap-2 text-3xl">
                      <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        {analytics?.totalServings ? `${analytics.totalServings.toLocaleString()}+` : '...'}
                      </motion.span>
                      <Heart size={24} className="text-emerald-500 fill-emerald-500" />
                    </span>
                    <span className="uppercase tracking-widest text-xs font-bold text-slate-500 flex items-center gap-2">
                       Meals redistributed this year
                    </span>
                 </div>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative hidden lg:block lg:-ml-12"
            >
              <div className="relative z-10 aspect-[5/4] rounded-[4rem] bg-gradient-to-br from-emerald-100 to-indigo-100 p-2 shadow-[0_32px_64px_-16px_rgba(16,185,129,0.2)]">
                 <div className="h-full w-full rounded-[3.8rem] bg-white overflow-hidden relative">
                    <img 
                      src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1200" 
                      className="h-full w-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-1000"
                      alt="Humanitarian impact"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/60 to-transparent" />
                    <div className="absolute bottom-10 left-10 text-white">
                       <div className="text-4xl font-black">Impactful AI</div>
                       <div className="mt-2 font-medium opacity-90">Matching surplus to need in under 15 minutes.</div>
                    </div>
                 </div>
              </div>
              {/* Decorative Floating Cards */}
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-8 top-20 z-20 glass rounded-[2rem] p-6 shadow-2xl"
              >
                 <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                       <Zap size={24} fill="currentColor" />
                    </div>
                    <div>
                       <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Live Match</div>
                       <div className="text-lg font-bold text-slate-800">Wedding Surplus</div>
                    </div>
                 </div>
              </motion.div>
              <motion.div 
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -left-12 bottom-20 z-20 glass rounded-[2rem] p-6 shadow-2xl"
              >
                 <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600">
                       <PieChart size={24} />
                    </div>
                    <div>
                       <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Daily Goal</div>
                       <div className="text-lg font-bold text-slate-800">85% Reduced Waste</div>
                    </div>
                 </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Uniqueness: The "Smart" Platform */}
      <section className="px-6 py-32 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-20 text-center">
            <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">Why We're Different</h2>
            <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto">Existing systems are manual and slow. We built a platform designed specifically for high-stakes event food waste.</p>
          </div>
          
          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid gap-10 md:grid-cols-2 lg:grid-cols-3"
          >
            {[
              { 
                icon: <Sparkles className="text-emerald-600" />, 
                title: 'AI-Based Matching', 
                desc: 'The system uses intelligent matching algorithms to connect donors and NGOs with maximum efficiency.',
                color: 'bg-emerald-50'
              },
              { 
                icon: <Clock className="text-amber-600" />, 
                title: 'Freshness Tracking', 
                desc: 'Integrated food freshness tracking ensures all redistributed food meets safety and quality standards.',
                color: 'bg-amber-50'
              },
              { 
                icon: <MapPin className="text-indigo-600" />, 
                title: 'Location-Based Logic', 
                desc: 'Real-time location matching enables faster distribution by connecting you with the nearest NGOs.',
                color: 'bg-indigo-50'
              },
              { 
                icon: <Bell className="text-red-600" />, 
                title: 'Smart Alerts', 
                desc: 'Instant notifications are sent for urgent food redistribution needs to minimize response time.',
                color: 'bg-red-50'
              },
              { 
                icon: <Zap className="text-brand-secondary" />, 
                title: 'Event-Based Design', 
                desc: 'Specifically engineered for event-based food waste management, making it more effective than general solutions.',
                color: 'bg-emerald-50'
              },
              { 
                icon: <ShieldCheck className="text-emerald-600" />, 
                title: 'Safety First', 
                desc: 'Built-in verification protocols for all partners to ensure humanitarian impact is maximized safely.',
                color: 'bg-emerald-50'
              }
            ].map((feature, idx) => (
              <motion.div key={idx} variants={item} className="card-hover glass group relative rounded-[3rem] p-10 overflow-hidden">
                <div className={`mb-8 flex h-16 w-16 items-center justify-center rounded-[1.5rem] ${feature.color} transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-sm`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                <p className="leading-relaxed text-slate-600 text-lg opacity-80">{feature.desc}</p>
                <div className="absolute -right-8 -bottom-8 h-32 w-32 rounded-full bg-slate-50 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Global Impact CTA */}
      <section className="px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[4rem] bg-slate-900 p-16 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 h-full w-full opacity-20 pointer-events-none">
             <div className="absolute top-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full bg-emerald-500 blur-[120px]" />
          </div>
          <div className="relative z-10 grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
               <h2 className="text-4xl font-bold sm:text-5xl leading-tight">Ready to join the <br /><span className="text-emerald-400">Zero Waste Mission?</span></h2>
               <p className="mt-6 text-xl text-slate-400 max-w-lg">
                 Whether you're hosting a grand celebration or managing a care home, our platform is here to ensure surplus becomes a solution.
               </p>
               <div className="mt-10 flex flex-wrap gap-4">
                  <Link to="/register" className="btn-premium px-10 py-5">Get Started Now</Link>
                  <Link to="/analytics" className="px-10 py-5 font-bold text-white hover:text-emerald-400 transition-all hover:translate-x-2">View Live Impact →</Link>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
               {[
                 { label: 'Meals Served', val: analytics?.totalServings > 1000 ? `${(analytics.totalServings/1000).toFixed(1)}K+` : `${analytics?.totalServings || 0}+`, icon: <Gift className="text-emerald-400" /> },
                 { label: 'Freshness Index', val: `${analytics?.freshnessRate || 98}%`, icon: <Zap className="text-emerald-400" /> }
               ].map((stat, i) => (
                 <div key={i} className="rounded-3xl bg-white/5 p-8 backdrop-blur-md border border-white/10">
                    <div className="mb-4 text-emerald-400">{stat.icon}</div>
                    <div className="text-4xl font-bold">{stat.val}</div>
                    <div className="mt-2 text-xs font-bold uppercase tracking-widest text-slate-500">{stat.label}</div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home