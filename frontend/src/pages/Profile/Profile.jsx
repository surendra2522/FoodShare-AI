import { motion } from 'framer-motion'
import { User, Mail, MapPin, Shield, Edit3, Camera } from 'lucide-react'

import { useAuth } from '../../context/AuthContext'

const Profile = () => {
  const { user } = useAuth()
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="glass overflow-hidden rounded-[3rem] shadow-2xl">
        {/* Banner */}
        <div className="h-32 bg-brand-primary/20" />
        
        <div className="relative px-8 pb-10">
          {/* Avatar */}
          <div className="absolute -top-12 left-8 h-24 w-24 rounded-3xl border-4 border-white bg-slate-200 shadow-lg overflow-hidden group flex items-center justify-center text-slate-600">
            <User size={48} />
            <button className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <Camera size={20} className="text-white" />
            </button>
          </div>

          <div className="mt-16 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{user?.name || 'Balaram Krishna'}</h1>
              <div className="mt-1 flex items-center gap-2 text-slate-500">
                <Shield size={14} className="text-brand-primary" />
                <span className="text-sm font-bold uppercase tracking-wider">Verified Donor</span>
              </div>
            </div>
            <button className="flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105">
              <Edit3 size={16} />
              Edit Profile
            </button>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-800">Personal Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
                  <Mail size={18} className="text-slate-400" />
                  <div>
                    <div className="text-[10px] font-bold uppercase text-slate-400">Email Address</div>
                    <div className="text-sm font-semibold text-slate-700">{user?.email || 'balaram@example.com'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
                  <MapPin size={18} className="text-slate-400" />
                  <div>
                    <div className="text-[10px] font-bold uppercase text-slate-400">Base Location</div>
                    <div className="text-sm font-semibold text-slate-700">{user?.address || 'Banjara Hills, Hyderabad'}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-800">Impact Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-emerald-50 p-6 text-center">
                  <div className="text-2xl font-bold text-emerald-600">42</div>
                  <div className="text-[10px] font-bold uppercase text-emerald-400">Missions</div>
                </div>
                <div className="rounded-2xl bg-brand-secondary/10 p-6 text-center">
                  <div className="text-2xl font-bold text-brand-secondary">1.2k</div>
                  <div className="text-[10px] font-bold uppercase text-brand-secondary/60">Lives Impacted</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
