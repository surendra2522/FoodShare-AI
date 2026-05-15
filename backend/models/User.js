import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['donor', 'ngo', 'admin'], default: 'donor', required: true },
    
    // Detailed Organization Role
    orgType: { type: String, enum: ['Orphanage', 'Old-age Home', 'Community Center', 'Shelter', 'N/A'], default: 'N/A' },
    
    // Contact information
    phone: { type: String, trim: true },
    
    // Location details
    address: { type: String, trim: true },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    },
    
    // Statistics
    totalDonations: { type: Number, default: 0 },
    totalReceived: { type: Number, default: 0 },
    
    // Verification
    isVerified: { type: Boolean, default: false },
    rating: { type: Number, default: 5, min: 0, max: 5 },
    
    // Profile
    profileImage: { type: String },
    bio: { type: String },
    
    // Status
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

// Index for location-based queries
userSchema.index({ 'coordinates': '2dsphere' })
userSchema.index({ role: 1 })
userSchema.index({ email: 1 })

const User = mongoose.model('User', userSchema)
export default User
