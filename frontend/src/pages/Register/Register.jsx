import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { UserPlus, Mail, Lock, User, Heart, Building2, ArrowRight, Utensils } from 'lucide-react'
import { authService } from '../../services/api'

const Register = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'donor' })
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      await authService.register({
        ...form,
        role: form.role === 'donor' ? 'donor' : 'ngo'
      })
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="glass w-full max-w-xl rounded-3xl p-8 shadow-2xl"
        style={{ boxShadow: '0 32px 64px -16px rgba(16, 185, 129, 0.12)' }}
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg" style={{ backgroundColor: '#10b981' }}>
            <Utensils size={32} color="white" />
          </div>
          <h1 className="text-3xl font-black text-slate-900">Join the Mission</h1>
          <p className="mt-1 text-slate-500">Be the bridge between abundance and need.</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl bg-red-50 border border-red-100 px-4 py-3 text-sm font-bold text-red-600">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Toggle */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setForm(prev => ({ ...prev, role: 'donor' }))}
              className="flex flex-col items-center gap-2 rounded-2xl border-2 p-5 transition-all font-bold text-sm"
              style={{
                borderColor: form.role === 'donor' ? '#10b981' : '#e2e8f0',
                backgroundColor: form.role === 'donor' ? '#f0fdf4' : 'white',
                color: form.role === 'donor' ? '#065f46' : '#64748b',
              }}
            >
              <Heart size={24} style={{ color: form.role === 'donor' ? '#10b981' : '#94a3b8' }} />
              <div className="text-base font-bold">Donor</div>
              <div className="text-[10px] font-medium opacity-70">I have surplus food</div>
            </button>

            <button
              type="button"
              onClick={() => setForm(prev => ({ ...prev, role: 'ngo' }))}
              className="flex flex-col items-center gap-2 rounded-2xl border-2 p-5 transition-all font-bold text-sm"
              style={{
                borderColor: form.role === 'ngo' ? '#6366f1' : '#e2e8f0',
                backgroundColor: form.role === 'ngo' ? '#eef2ff' : 'white',
                color: form.role === 'ngo' ? '#3730a3' : '#64748b',
              }}
            >
              <Building2 size={24} style={{ color: form.role === 'ngo' ? '#6366f1' : '#94a3b8' }} />
              <div className="text-base font-bold">NGO / Receiver</div>
              <div className="text-[10px] font-medium opacity-70">I need food support</div>
            </button>
          </div>

          {/* Fields */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-bold text-slate-700">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text" name="name" value={form.name} onChange={handleChange} required
                  placeholder="e.g. Rahul Sharma"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-10 pr-4 text-slate-900 outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-bold text-slate-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="email" name="email" value={form.email} onChange={handleChange} required
                  placeholder="name@email.com"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-10 pr-4 text-slate-900 outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-all"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-bold text-slate-700">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="password" name="password" value={form.password} onChange={handleChange} required
                placeholder="Minimum 8 characters"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-10 pr-4 text-slate-900 outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-premium w-full justify-center gap-3 py-4 text-lg"
          >
            {isLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                <UserPlus size={20} />
                <span>Create Account</span>
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already a member?{' '}
          <Link to="/login" className="font-bold hover:underline" style={{ color: '#10b981' }}>
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

export default Register
