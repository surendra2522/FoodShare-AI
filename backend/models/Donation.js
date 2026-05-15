import mongoose from 'mongoose'

const donationSchema = new mongoose.Schema(
  {
    donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    functionName: { type: String, required: true, trim: true },
    foodCategory: { type: String, enum: ['Veg', 'Non-Veg', 'Mixed'], default: 'Veg' },
    servingsCount: { type: Number, required: true },
    
    // Freshness and expiration tracking
    expiryHours: { type: Number, required: true, default: 6 },
    preparationTime: { type: Date, default: Date.now },
    
    // Location information for matching
    areaName: { type: String, required: true, trim: true },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    },
    
    // Donation details
    description: { type: String, trim: true },
    images: [{ type: String }],
    
    // Status tracking
    status: { 
      type: String, 
      enum: ['pending', 'ai-verified', 'accepted', 'picking-up', 'in-transit', 'delivered', 'cancelled'], 
      default: 'pending' 
    },
    
    // Matching information
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    acceptedAt: { type: Date },
    
    // Delivery tracking
    deliveryProof: [{ type: String }],
    
    // Impact metrics
    isEmergency: { type: Boolean, default: false }
  },
  { timestamps: true }
)

// Index for location-based queries
donationSchema.index({ 'coordinates': '2dsphere' })
donationSchema.index({ status: 1 })
donationSchema.index({ createdAt: -1 })

const Donation = mongoose.model('Donation', donationSchema)
export default Donation
