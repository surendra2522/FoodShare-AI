import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass rounded-[3rem] p-12 shadow-2xl"
      >
        <h1 className="text-8xl font-black text-slate-200">404</h1>
        <h2 className="mt-4 text-2xl font-bold text-slate-800">Lost in the redistribution?</h2>
        <p className="mt-2 text-slate-500">The page you're looking for doesn't exist.</p>
        <Link to="/" className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-brand-primary px-8 py-4 font-bold text-white shadow-xl shadow-emerald-200 transition-all hover:scale-105">
          <Home size={20} />
          Return Home
        </Link>
      </motion.div>
    </div>
  )
}

export default NotFound
