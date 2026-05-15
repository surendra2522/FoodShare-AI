# Database Schemas

This folder documents the MongoDB collections used by the AI-Enabled Smart Food Redistribution System backend.

## Collections Overview

### 1. Users Collection
Stores donors, NGOs, and admin accounts with comprehensive profile and location information.

**Fields:**
- `name` (String): User's full name
- `email` (String): Unique email address
- `password` (String): Hashed password
- `role` (String): 'donor', 'ngo', or 'admin'
- `phone` (String): Contact phone number
- `location` (String): Address/location string
- `coordinates` (Object): Geo-location for matching
  - `latitude` (Number)
  - `longitude` (Number)
- `address` (Object): Detailed address information
  - `street`, `city`, `state`, `zipCode`, `country`
- `organizationName` (String): For NGO accounts
- `organizationType` (String): 'ngo', 'community-center', 'shelter', 'school', 'other'
- `registrationNumber` (String): Organization registration
- `donorType` (String): 'individual', 'restaurant', 'catering', 'event', 'other'
- `capacity` (Number): Storage/handling capacity in kg
- `operatingHours` (Object): When organization operates
  - `startTime` (String): HH:MM format
  - `endTime` (String): HH:MM format
- `isVerified` (Boolean): Account verification status
- `verificationDocument` (String): URL to verification document
- `rating` (Number): 0-5 rating based on past donations
- `totalDonations` (Number): Total donations made/received
- `totalReceived` (Number): Total quantity received
- `successRate` (Number): Percentage of successful deliveries
- `profileImage` (String): Profile picture URL
- `bio` (String): User bio/description
- `preferences` (Object): Notification preferences
  - `notifications`, `emailAlerts`, `smsAlerts` (Boolean)
- `isActive` (Boolean): Account status
- `createdAt`, `updatedAt` (Date): Timestamps

**Indexes:**
- 2dsphere on coordinates (for location-based queries)
- Compound on role + isVerified

---

### 2. Donations Collection
Stores food donation records with detailed freshness, expiry, and matching information.

**Fields:**
- `donor` (ObjectId): Reference to donor User
- `foodName` (String): Type of food donated
- `foodType` (String): 'cooked', 'raw', 'packaged', 'beverage'
- `quantity` (String): Amount of food
- `unit` (String): 'kg', 'liters', 'items', 'portions'

**Freshness Tracking:**
- `freshness` (String): 'very-fresh', 'fresh', 'moderate', 'urgent'
- `expiryTime` (Date): When food expires
- `preparationTime` (Date): When food was prepared
- `storageType` (String): 'room-temp', 'refrigerated', 'frozen'

**Location Information:**
- `pickupLocation` (String): Address for pickup
- `coordinates` (Object): Geo-location for distance matching
  - `latitude`, `longitude` (Number)

**Donation Details:**
- `description` (String): Additional notes
- `images` (Array): URLs to food images
- `nutrition` (Object): Nutritional information
  - `calories`, `protein` (Number), `allergens` (Array)

**Status Tracking:**
- `status` (String): 'pending', 'matched', 'picked-up', 'in-transit', 'delivered', 'cancelled'
- `priority` (String): 'normal', 'urgent', 'high'

**Matching Information:**
- `matchedNgo` (ObjectId): Reference to matched NGO
- `matchedAt` (Date): When match was created
- `pickupSchedule` (Date): Scheduled pickup time

**Delivery Tracking:**
- `deliveryTime` (Date): Actual delivery time
- `deliveryProof` (Array): URLs to delivery verification images

**Event Information:**
- `eventId` (ObjectId): Reference to source event
- `eventName` (String): Name of donation event

**Indexes:**
- 2dsphere on coordinates
- Compound on status + priority
- Single on expiryTime
- Single on createdAt

---

### 3. Notifications Collection
Stores system alerts, emergency updates, and user notifications with delivery tracking.

**Fields:**
- `type` (String): 'donation-match', 'donation-alert', 'pickup-reminder', 'delivery-update', 'system-alert', 'event-reminder'
- `title` (String): Notification title
- `message` (String): Main message content
- `description` (String): Extended description
- `priority` (String): 'low', 'normal', 'high', 'urgent'

**Recipient Information:**
- `recipient` (ObjectId): Reference to User
- `targetRole` (String): Intended role ('donor', 'ngo', 'admin', 'all')

**Related Entities:**
- `relatedDonation` (ObjectId): Associated donation
- `relatedMatch` (ObjectId): Associated match
- `relatedEvent` (ObjectId): Associated event

**Status Tracking:**
- `read` (Boolean): Whether user has seen it
- `readAt` (Date): When notification was read
- `acknowledged` (Boolean): Whether user acknowledged it

**Delivery Methods:**
- `deliveryMethods` (Object): Channels to send via
  - `inApp`, `email`, `sms`, `push` (Boolean)
- `deliveryStatus` (Object): Delivery success status
  - `inApp`, `email`, `sms`, `push` (Boolean)

**Action & Analytics:**
- `actionUrl` (String): URL to take action
- `viewCount` (Number): How many times viewed
- `clickCount` (Number): How many times clicked
- `expiresAt` (Date): When notification expires

**Indexes:**
- Compound on recipient + read + createdAt
- Compound on priority + createdAt
- Single on expiresAt

---

## Data Relationships

```
User (Donor)
    ↓
Donation → matched with → User (NGO)
    ↓
Notification (sent to NGO about match)
```

## Location-Based Matching Algorithm

The system uses:
1. **Haversine Formula**: Calculate distance between donor and NGO coordinates
2. **Multi-factor Scoring**:
   - Location distance (40%)
   - NGO capacity match (25%)
   - NGO rating (20%)
   - Success rate (15%)

3. **Urgency Boost**: For urgent donations, NGOs that are currently operating get bonus points

## Freshness Tracking

Donations automatically transition through freshness states based on time:
- 0-30 min since preparation: **very-fresh**
- 30-60 min: **fresh**
- 60-240 min: **moderate**
- >240 min or expiry soon: **urgent**

## Connection to Backend

The backend uses Mongoose models in `backend/models/`:
- `User.js` - User schema with location and capacity fields
- `Donation.js` - Donation schema with freshness and expiry tracking
- `Notification.js` - Notification schema with delivery methods

## MongoDB Atlas Setup

For production deployment:
1. Create MongoDB Atlas cluster
2. Set `MONGODB_URI` environment variable
3. Database will auto-create collections on first write
4. Indexes are defined in Mongoose schemas and created automatically

## API Endpoints Using These Collections

### Donations
- `POST /api/donations` - Create new donation
- `GET /api/donations` - List all donations
- `GET /api/donations/:id` - Get specific donation
- `PUT /api/donations/:id` - Update donation status

### Matching
- `GET /api/matches/:donationId` - Get matches for donation
- `POST /api/matches/:id/accept` - Accept a match
- `GET /api/matches/stats/:donationId` - Get matching statistics

### Analytics
- `GET /api/analytics/impact` - Impact metrics
- `GET /api/analytics/trends` - Donation trends
- `GET /api/analytics/users` - User statistics

### Notifications
- `GET /api/notifications` - User's notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `DELETE /api/notifications/:id` - Delete notification

### AI Predictions
- `POST /api/ai/predict` - Get food surplus prediction
- `GET /api/ai/forecast` - Get demand forecast

## Best Practices

1. **Always include coordinates** for location-based matching
2. **Set expiryTime** immediately when donation is created
3. **Update freshness** in real-time as time progresses
4. **Use priority levels** for urgent donations (< 30 minutes to expiry)
5. **Track delivery proof** with images for accountability
