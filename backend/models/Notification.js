import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema(
  {
    // Notification content
    type: { 
      type: String, 
      enum: ['donation-match', 'donation-alert', 'pickup-reminder', 'delivery-update', 'system-alert', 'event-reminder'],
      required: true 
    },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    
    // Priority and urgency
    priority: { type: String, enum: ['low', 'normal', 'high', 'urgent'], default: 'normal' },
    
    // Recipient information
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetRole: { type: String, enum: ['donor', 'ngo', 'admin', 'all'], default: 'all' },
    
    // Related entity
    relatedDonation: { type: mongoose.Schema.Types.ObjectId, ref: 'Donation' },
    relatedMatch: { type: mongoose.Schema.Types.ObjectId, ref: 'Match' },
    relatedEvent: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
    
    // Status tracking
    read: { type: Boolean, default: false },
    readAt: { type: Date },
    acknowledged: { type: Boolean, default: false },
    
    // Delivery methods
    deliveryMethods: {
      inApp: { type: Boolean, default: true },
      email: { type: Boolean, default: false },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: false }
    },
    deliveryStatus: {
      inApp: { type: Boolean, default: true },
      email: { type: Boolean, default: false },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: false }
    },
    
    // Action URL
    actionUrl: { type: String },
    
    // Analytics
    viewCount: { type: Number, default: 0 },
    clickCount: { type: Number, default: 0 },
    
    // Expiry
    expiresAt: { type: Date }
  },
  { timestamps: true }
)

// Index for queries
notificationSchema.index({ recipient: 1, read: 1, createdAt: -1 })
notificationSchema.index({ priority: 1, createdAt: -1 })
notificationSchema.index({ expiresAt: 1 })

const Notification = mongoose.model('Notification', notificationSchema)
export default Notification
