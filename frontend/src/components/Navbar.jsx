import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Utensils, BarChart3, LogIn, LogOut, UserPlus, Heart, Menu, X, LayoutDashboard } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsMobileMenuOpen(false)
  }

  const dashboardPath = '/dashboard'

  return (
    <nav className={`sticky top-0 z-[100] px-4 transition-all duration-500 ${isScrolled ? 'py-2' : 'py-4'}`}>
      <div className={`mx-auto max-w-7xl transition-all duration-500 ${
        isScrolled ? 'glass rounded-2xl px-6 py-3 shadow-xl' : 'px-2 py-2'
      }`}>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl shadow-lg" style={{ backgroundColor: '#10b981' }}>
              <Utensils size={22} color="white" />
            </div>
            <div>
              <span className="text-lg font-black text-slate-900">FoodShare <span style={{ color: '#10b981' }}>AI</span></span>
              <div className="text-[9px] font-bold uppercase tracking-widest text-slate-400 leading-none">Smart Redistribution</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-2 lg:flex">
            <NavLink
              to="/analytics"
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                  isActive ? 'text-white shadow-lg' : 'text-slate-600 hover:bg-white hover:shadow-sm'
                }`
              }
              style={({ isActive }) => isActive ? { backgroundColor: '#10b981' } : {}}
            >
              <BarChart3 size={16} />
              <span>Impact</span>
            </NavLink>

            {user ? (
              <>
                {user.role?.toLowerCase() === 'donor' && (
                  <NavLink
                    to="/donate"
                    className={({ isActive }) =>
                      `flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                        isActive ? 'text-white shadow-lg' : 'text-slate-600 hover:bg-white hover:shadow-sm'
                      }`
                    }
                    style={({ isActive }) => isActive ? { backgroundColor: '#10b981' } : {}}
                  >
                    <Heart size={16} />
                    <span>Donate</span>
                  </NavLink>
                )}
                <NavLink
                  to={dashboardPath}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                      isActive ? 'text-white shadow-lg' : 'text-slate-600 hover:bg-white hover:shadow-sm'
                    }`
                  }
                  style={({ isActive }) => isActive ? { backgroundColor: '#10b981' } : {}}
                >
                  <LayoutDashboard size={16} />
                  <span>Dashboard</span>
                </NavLink>
                <div className="mx-2 h-6 w-px bg-slate-200" />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-slate-500 transition-all hover:bg-red-50 hover:text-red-500"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">
                  <LogIn size={16} />
                  <span>Sign In</span>
                </Link>
                <Link to="/register" className="btn-premium gap-2 text-sm px-5 py-2.5">
                  <UserPlus size={16} />
                  <span>Join Mission</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-md lg:hidden"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="fixed inset-x-4 top-20 z-[110] glass rounded-2xl p-5 shadow-2xl lg:hidden"
          >
            <div className="flex flex-col gap-1">
              <Link to="/analytics" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3 font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-all">
                <BarChart3 size={18} /> Impact Analytics
              </Link>
              {user ? (
                <>
                  {user.role?.toLowerCase() === 'donor' && (
                    <Link to="/donate" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3 font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-all">
                      <Heart size={18} /> New Donation
                    </Link>
                  )}
                  <Link to={dashboardPath} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3 font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-all">
                    <LayoutDashboard size={18} /> Control Center
                  </Link>
                  <button onClick={handleLogout} className="flex items-center gap-3 rounded-xl px-4 py-3 font-bold text-red-500 hover:bg-red-50 transition-all text-left">
                    <LogOut size={18} /> Sign Out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3 pt-3 border-t border-slate-100">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 rounded-xl py-3 font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all">
                    <LogIn size={18} /> Sign In
                  </Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="btn-premium justify-center gap-2 py-3 text-sm">
                    <UserPlus size={18} /> Create Account
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
