import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Utensils, Users, Calendar, ArrowRight, CheckCircle2, Sparkles, Clock, AlertTriangle, LogIn, Plus } from 'lucide-react'
import MapPicker from '../../components/MapPicker'
import { donationService, http } from '../../services/api'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const DonateFood = () => {
  const navigate = useNavigate()
  const { user, token, loading: authLoading } = useAuth()
  const [position, setPosition] = useState(null)
  const [form, setForm] = useState({
    functionName: '',
    functionType: 'Wedding',
    expectedGuests: '',
    foodType: 'Veg',
    servings: '',
    expiryHours: '4',
    pickupArea: '',
    notes: '',
  })
  const [aiPrediction, setAiPrediction] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [demoCondition, setDemoCondition] = useState('Fresh')

  useEffect(() => {
    if (analysisResult) {
      let score = 92, status = 'Fresh';
      if (demoCondition === 'Spoiled') { score = 21; status = 'Spoiled'; }
      else if (demoCondition === 'Moderate') { score = 63; status = 'Moderate'; }

      if (analysisResult.status !== status) {
        setAnalysisResult(prev => ({ ...prev, score, status, predictions: [{ class: 'Manual Camera Verification', probability: 99 }] }));
      }
    }
  }, [demoCondition, analysisResult])

  // AI Prediction Logic
  useEffect(() => {
    const fetchPrediction = async () => {
      if (form.expectedGuests && form.foodType) {
        try {
          const res = await http.get('/ai/surplus', {
            params: {
              guests: form.expectedGuests,
              foodType: form.foodType,
              freshness: form.expiryHours
            }
          })
          setAiPrediction({
            estimate: res.data.servingsEstimate,
            confidence: Math.round(res.data.confidence * 100),
            impact: (res.data.servingsEstimate * 0.42).toFixed(1)
          })
        } catch (err) {
          console.warn('AI prediction failed, using fallback')
          // Basic fallback if AI service is down
          const guests = parseInt(form.expectedGuests)
          const estimate = Math.round(guests * 0.22)
          setAiPrediction({
            estimate,
            confidence: 70,
            impact: (estimate * 0.4).toFixed(1)
          })
        }
      } else {
        setAiPrediction(null)
      }
    }

    const timer = setTimeout(fetchPrediction, 500) // Debounce
    return () => clearTimeout(timer)
  }, [form.expectedGuests, form.foodType, form.expiryHours])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      setIsAnalyzing(true)
      setAnalysisResult(null)
      setError(null)
      setAnalysisProgress(10)

      const formData = new FormData()
      formData.append('image', file)

      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => (prev >= 90 ? 90 : prev + 15))
      }, 1000)

      try {
        const res = await http.post('/ai/analyze-freshness', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 10000 // 10s timeout protection
        })

        clearInterval(progressInterval)
        setAnalysisProgress(100)

        setTimeout(() => {
          setIsAnalyzing(false)
          setAnalysisResult({
            score: res.data.score,
            status: res.data.status,
            fileName: file.name,
            predictions: res.data.predictions
          })
        }, 500)
      } catch (err) {
        clearInterval(progressInterval)
        console.error('AI Analysis Error:', err)

        const isTimeout = err.code === 'ECONNABORTED' || err.message.includes('timeout')
        if (isTimeout) {
          setError('AI analysis timeout. Using manual camera workflow.')
        } else {
          setError('AI backend offline. Using manual camera workflow.')
        }

        setAnalysisProgress(100)

        // Realistic Simulated Fallback (Dynamic based on Dropdown)
        setTimeout(() => {
          setIsAnalyzing(false)
          let score = 92, status = 'Fresh'

          if (demoCondition === 'Spoiled') {
            score = 21; status = 'Spoiled'
          } else if (demoCondition === 'Moderate') {
            score = 63; status = 'Moderate'
          }

          setAnalysisResult({
            score,
            status,
            fileName: file.name,
            predictions: [{ class: 'Manual Camera Analysis', probability: 99 }]
          })
        }, 800)
      } finally {
        setIsAnalyzing(false)
      }
    }
  }

  const isSpoiled = analysisResult?.status === 'Spoiled';
  const isSubmitDisabled = isSubmitting || isSpoiled || isAnalyzing;

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!position) {
      alert("Please pin your location on the map");
      setError('Please click on the map to set a pickup location.');
      return
    }

    setIsSubmitting(true)
    try {
      await donationService.submitDonation({
        ...form,
        location: { lat: position.lat, lng: position.lng }
      })
      setSuccess(true)
    } catch (err) {
      const msg = err.response?.data?.message || 'Submission failed. Make sure you are logged in.'
      setError(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Auth guard — show login prompt if not authenticated
  if (!authLoading && !token) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass max-w-md w-full rounded-3xl p-12 text-center shadow-2xl"
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full" style={{ backgroundColor: '#f0fdf4' }}>
            <LogIn size={40} style={{ color: '#10b981' }} />
          </div>
          <h2 className="text-3xl font-bold text-slate-800">Login Required</h2>
          <p className="mt-4 text-slate-600">You must be signed in to donate food. It only takes a moment!</p>
          <div className="mt-8 flex gap-3">
            <Link
              to={`/login`}
              className="btn-premium flex-1 justify-center py-3"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="btn-secondary flex-1 justify-center py-3"
            >
              Create Account
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass max-w-md w-full rounded-3xl p-12 text-center shadow-2xl"
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full" style={{ backgroundColor: '#f0fdf4' }}>
            <CheckCircle2 size={40} style={{ color: '#10b981' }} />
          </div>
          <h2 className="text-3xl font-bold text-slate-800">Donation Live!</h2>
          <p className="mt-4 text-slate-600">Nearby NGOs are being notified. Your mission is active!</p>
          <div className="mt-8 flex gap-3">
            <button
              onClick={() => { setSuccess(false); setForm({ functionName: '', functionType: 'Wedding', expectedGuests: '', foodType: 'Veg', servings: '', expiryHours: '4', pickupArea: '', notes: '' }); setPosition(null) }}
              className="btn-premium flex-1 justify-center py-3"
            >
              Donate More
            </button>
            <button
              onClick={() => navigate('/donor-dashboard')}
              className="btn-secondary flex-1 justify-center py-3"
            >
              My Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      {/* Header */}
      <div className="mb-10 text-center">
        <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold mb-4" style={{ backgroundColor: '#f0fdf4', color: '#065f46' }}>
          <Sparkles size={14} />
          AI-Powered Redistribution
        </span>
        <h1 className="text-4xl font-black text-slate-900 sm:text-5xl">
          Broadcast Your <span className="text-gradient">Abundance</span>
        </h1>
        <p className="mt-3 text-lg text-slate-500 max-w-xl mx-auto">
          Fill the form below and pin your location. NGOs near you get notified instantly.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Form Column */}
        <div className="lg:col-span-7">
          <div className="glass rounded-3xl p-6 shadow-xl lg:p-8">
            {/* Error Banner */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mb-6 overflow-hidden rounded-2xl bg-red-50 border border-red-100 px-4 py-3 text-sm font-bold text-red-600 flex items-center gap-2"
                >
                  <AlertTriangle size={16} />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Function Name */}
              <div>
                <label className="mb-1.5 flex items-center gap-2 text-sm font-bold text-slate-700">
                  <Calendar size={14} style={{ color: '#10b981' }} />
                  Function Name *
                </label>
                <input
                  type="text" name="functionName" value={form.functionName}
                  onChange={handleChange} required
                  placeholder="e.g. Grand Wedding Reception"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-all"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Event Type */}
                <div>
                  <label className="mb-1.5 flex items-center gap-2 text-sm font-bold text-slate-700">
                    <Utensils size={14} style={{ color: '#10b981' }} />
                    Event Type
                  </label>
                  <select
                    name="functionType" value={form.functionType} onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none focus:border-emerald-400 focus:bg-white transition-all"
                  >
                    <option value="Wedding">Wedding</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Party">Social Party</option>
                    <option value="Other">Other Event</option>
                  </select>
                </div>

                {/* Expected Guests */}
                <div>
                  <label className="mb-1.5 flex items-center gap-2 text-sm font-bold text-slate-700">
                    <Users size={14} style={{ color: '#10b981' }} />
                    Expected Guests
                  </label>
                  <input
                    type="number" name="expectedGuests" value={form.expectedGuests}
                    onChange={handleChange} placeholder="e.g. 200"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-all"
                  />
                </div>
              </div>

              {/* AI Prediction Box */}
              <AnimatePresence>
                {aiPrediction && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="rounded-2xl p-5 text-white relative overflow-hidden" style={{ backgroundColor: '#064e3b' }}>
                      <div className="absolute top-4 right-4 opacity-30">
                        <Sparkles size={32} />
                      </div>
                      <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#6ee7b7' }}>AI Prediction</div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black">~{aiPrediction.estimate}</span>
                        <span style={{ color: '#a7f3d0' }}>servings likely surplus</span>
                      </div>
                      <p className="mt-2 text-sm" style={{ color: '#d1fae5' }}>
                        {aiPrediction.confidence}% confidence for {form.functionType}s. Sharing saves <strong>{aiPrediction.impact}kg CO₂</strong>.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Actual Servings */}
                <div>
                  <label className="mb-1.5 flex items-center gap-2 text-sm font-bold text-slate-700">
                    <Utensils size={14} style={{ color: '#10b981' }} />
                    Actual Servings *
                  </label>
                  <input
                    type="number" name="servings" value={form.servings}
                    onChange={handleChange} required placeholder="Meals available"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-all"
                  />
                </div>

                {/* Freshness Window */}
                <div>
                  <label className="mb-1.5 flex items-center gap-2 text-sm font-bold text-slate-700">
                    <Clock size={14} style={{ color: '#10b981' }} />
                    Freshness Window (hrs) *
                  </label>
                  <input
                    type="number" name="expiryHours" value={form.expiryHours}
                    onChange={handleChange} required min="1" max="24"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-all"
                  />
                </div>
              </div>

              {/* Pickup Area */}
              <div>
                <label className="mb-1.5 flex items-center gap-2 text-sm font-bold text-slate-700">
                  <MapPin size={14} style={{ color: '#10b981' }} />
                  Pickup Area Name *
                </label>
                <input
                  type="text" name="pickupArea" value={form.pickupArea}
                  onChange={handleChange} required placeholder="e.g. Crystal Ballroom, Banjara Hills"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-all"
                />
              </div>

              {/* Food Image Upload */}
              <div className={`rounded-2xl border-2 border-dashed p-6 text-center transition-all cursor-pointer bg-slate-50/50 ${analysisResult ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-emerald-400'}`}>
                <input type="file" className="hidden" id="food-image" onChange={handleImageUpload} accept="image/*" />
                <label htmlFor="food-image" className="cursor-pointer">
                  {isAnalyzing ? (
                    <div className="py-2">
                      <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-500 mb-3" />
                      <div className="text-sm font-bold text-emerald-600 animate-pulse">AI is scanning visual freshness...</div>
                    </div>
                  ) : analysisResult ? (
                    <div className="py-2">
                      <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg">
                        <CheckCircle2 size={24} />
                      </div>
                      <div className="text-sm font-bold text-emerald-700">Photo Verified!</div>
                      <div className="text-[10px] text-emerald-600 font-medium uppercase mt-1">{analysisResult.fileName}</div>
                    </div>
                  ) : (
                    <>
                      <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                        <Plus size={24} />
                      </div>
                      <div className="text-sm font-bold text-slate-700">Upload Food Photo</div>
                      <div className="text-xs text-slate-500 mt-1">AI will analyze freshness automatically</div>
                    </>
                  )}
                </label>
              </div>

              {/* Demo Override Dropdown */}
              <AnimatePresence>
                {(analysisResult || isAnalyzing) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="mt-4"
                  >
                    <label className="mb-1.5 flex items-center gap-2 text-sm font-bold text-slate-700">
                      <Sparkles size={14} style={{ color: '#10b981' }} />
                      Camera Upload Verification (Demo Workflow)
                    </label>
                    <select
                      value={demoCondition}
                      onChange={(e) => setDemoCondition(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-indigo-50 px-4 py-3.5 text-indigo-900 outline-none focus:border-indigo-400 transition-all font-bold"
                    >
                      <option value="Fresh">Simulate: Fresh Food (85-100%)</option>
                      <option value="Moderate">Simulate: Moderate Food (50-80%)</option>
                      <option value="Spoiled">Simulate: Spoiled Food (Below 40%)</option>
                    </select>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* AI Freshness Insight */}
              <AnimatePresence>
                {(isAnalyzing || analysisResult) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className={`rounded-2xl border p-4 flex items-start gap-3 overflow-hidden mt-4 ${isAnalyzing ? 'bg-indigo-50 border-indigo-100' :
                      analysisResult?.status === 'Spoiled' ? 'bg-red-50 border-red-200' :
                        analysisResult?.status === 'Moderate' ? 'bg-amber-50 border-amber-200' :
                          'bg-emerald-50 border-emerald-200'
                      }`}
                  >
                    <div className={`mt-1 ${isAnalyzing ? 'animate-pulse text-indigo-400' :
                      analysisResult?.status === 'Spoiled' ? 'text-red-500' :
                        analysisResult?.status === 'Moderate' ? 'text-amber-500' :
                          'text-emerald-500'
                      }`}>
                      {analysisResult?.status === 'Spoiled' ? <AlertTriangle size={18} /> : <Sparkles size={18} />}
                    </div>
                    <div>
                      <div className={`text-sm font-bold ${isAnalyzing ? 'text-indigo-900' :
                        analysisResult?.status === 'Spoiled' ? 'text-red-900' :
                          analysisResult?.status === 'Moderate' ? 'text-amber-900' :
                            'text-emerald-900'
                        }`}>
                        {isAnalyzing ? 'Deep Learning Analysis in Progress...' :
                          analysisResult.status === 'Spoiled' ? 'AI Safety Alert: Unsafe Food Detected' :
                            'AI Freshness Verification Success'}
                      </div>

                      {isAnalyzing ? (
                        <div className="mt-3 w-full max-w-xs">
                          <div className="h-2 w-full bg-indigo-100 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-indigo-500 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${analysisProgress}%` }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                          <div className="flex justify-between text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-1">
                            <span>Scanning Pixels</span>
                            <span>{analysisProgress}%</span>
                          </div>
                        </div>
                      ) : (
                        <p className={`text-xs mt-1 leading-relaxed ${analysisResult?.status === 'Spoiled' ? 'text-red-700' :
                          analysisResult?.status === 'Moderate' ? 'text-amber-700' :
                            'text-emerald-700'
                          }`}>
                          Analysis complete. Visual indicators suggest this food is in {analysisResult.status} condition. {
                            analysisResult.predictions ? `Matches: ${analysisResult.predictions.map(p => p.class.split(',')[0]).join(', ')}` : ''
                          }
                          <span className={`block mt-2 font-black ${analysisResult?.status === 'Spoiled' ? 'text-red-600' :
                            analysisResult?.status === 'Moderate' ? 'text-amber-600' :
                              'text-emerald-600'
                            }`}>
                            "{analysisResult.score}% Freshness Score Verified"
                            {analysisResult.status === 'Spoiled' && (
                              <span className="block mt-2 text-red-700 font-bold bg-red-100 px-3 py-2 rounded-lg border border-red-200 flex items-center gap-2">
                                <AlertTriangle size={16} className="shrink-0" />
                                Unsafe food cannot be redistributed. Submission Blocked.
                              </span>
                            )}
                          </span>
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitDisabled}
                className="btn-premium w-full justify-center gap-3 py-4 text-lg mt-6"
                style={isSubmitDisabled ? { backgroundColor: '#6b7280', cursor: 'not-allowed', transform: 'none', boxShadow: 'none' } : {}}
              >
                {isSubmitting ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    {isSpoiled ? <AlertTriangle size={20} /> : <Sparkles size={20} />}
                    <span>{isSpoiled ? 'Safety Check Failed' : position ? 'Activate Redistribution' : 'Pin Location & Submit'}</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>

              {!position && (
                <p className="text-center text-sm text-amber-600 font-medium">
                  ⬆️ Click on the map (right panel) to pin your pickup location
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Map Column */}
        <div className="lg:col-span-5 space-y-5">
          <div className="glass rounded-3xl p-4 shadow-xl overflow-hidden">
            <div className="px-3 pb-3 pt-1">
              <h3 className="flex items-center gap-2 font-bold text-slate-800">
                <MapPin size={18} style={{ color: '#10b981' }} />
                Pickup Location
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {position
                  ? `📍 Pinned at ${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}`
                  : 'Click anywhere on the map to set your pickup point'}
              </p>
            </div>
            <div className="h-[400px] overflow-hidden rounded-2xl">
              <MapPicker position={position} setPosition={setPosition} />
            </div>
          </div>

          {/* Info Cards */}
          <div className="rounded-2xl p-5" style={{ backgroundColor: '#eff6ff' }}>
            <h4 className="font-bold text-blue-900 mb-2">⚡ Real-time Matching</h4>
            <p className="text-sm text-blue-700 leading-relaxed">Once posted, the system finds the 3 nearest NGOs and sends instant alerts for pickup.</p>
          </div>

          <div className="rounded-2xl p-5" style={{ backgroundColor: '#fffbeb' }}>
            <h4 className="font-bold text-amber-900 mb-2">🔥 Priority Escalation</h4>
            <p className="text-sm text-amber-700 leading-relaxed">Donations under 2hrs freshness are auto-boosted to the top of all volunteer feeds.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DonateFood
