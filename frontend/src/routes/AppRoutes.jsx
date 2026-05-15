import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Home from '../pages/Home/Home'
import Login from '../pages/Login/Login'
import Register from '../pages/Register/Register'
import DonateFood from '../pages/DonateFood/DonateFood'
import Analytics from '../pages/Analytics/Analytics'
import Tracking from '../pages/Tracking/Tracking'
import Dashboard from '../pages/Dashboard/Dashboard'
import NotFound from '../pages/NotFound/NotFound'
import Chatbot from '../components/Chatbot'
import { useAuth } from '../context/AuthContext'

// Redirects unauthenticated users to /login
const PrivateRoute = ({ children }) => {
  const { token, loading } = useAuth()
  if (loading) return null // Wait for auth state to load
  return token ? children : <Navigate to="/login" replace />
}

const AppRoutes = () => {
  return (
    <div className="min-h-screen bg-transparent">
      <Navbar />
      <main className="relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/donate" element={<PrivateRoute><DonateFood /></PrivateRoute>} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/tracking" element={<Tracking />} />
          <Route path="/tracking/:id" element={<Tracking />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/ngo-dashboard" element={<Navigate to="/dashboard" replace />} />
          <Route path="/donor-dashboard" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      
      {/* Background blobs for that fascinating look */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] h-[40%] w-[40%] rounded-full bg-emerald-100/50 blur-[120px]" />
        <div className="absolute top-[40%] -left-[10%] h-[30%] w-[30%] rounded-full bg-brand-secondary/10 blur-[100px]" />
        <div className="absolute -bottom-[10%] right-[20%] h-[40%] w-[40%] rounded-full bg-indigo-100/30 blur-[120px]" />
      </div>
      
      <Chatbot />
    </div>
  )
}

export default AppRoutes
