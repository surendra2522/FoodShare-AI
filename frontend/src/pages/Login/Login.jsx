import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogIn, Mail, Lock, ArrowRight, Utensils } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { authService } from '../../services/api'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      const response = await authService.login({ email, password })
      login({
        user: {
          _id: response.data._id,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role
        },
        token: response.data.token
      })
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.')
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
        className="glass w-full max-w-md rounded-3xl p-8 shadow-2xl"
        style={{ boxShadow: '0 32px 64px -16px rgba(16, 185, 129, 0.12)' }}
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg" style={{ backgroundColor: '#10b981' }}>
            <Utensils size={32} color="white" />
          </div>
          <h1 className="text-3xl font-black text-slate-900">Welcome Back</h1>
          <p className="mt-1 text-slate-500">Continue your food redistribution mission.</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl bg-red-50 border border-red-100 px-4 py-3 text-sm font-bold text-red-600">
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-bold text-slate-700">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@email.com"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-slate-900 transition-all outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-bold text-slate-700">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-slate-900 transition-all outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-premium w-full justify-center gap-3 py-4 text-lg mt-2"
          >
            {isLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          New here?{' '}
          <Link to="/register" className="font-bold hover:underline" style={{ color: '#10b981' }}>
            Create Account
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

export default Login
