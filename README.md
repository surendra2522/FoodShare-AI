# 🍲 FoodShare AI | Smart Food Redistribution
## Live Website

https://food-share-ai-nine.vercel.app

### *Turning Event Leftovers into Community Blessings*

---

## 🌟 Vision
**FoodShare AI** is a fully-developed, humanitarian platform designed to bridge the gap between grand functions (weddings, corporate events, parties) and those in need. Our platform leverages AI and real-time mapping to ensure that high-quality surplus food is redistributed safely and efficiently.

## ✨ Premium Experience
The platform is now **fully developed** with state-of-the-art features:
- 💎 **Glassmorphism UI**: A stunning, modern interface designed with premium aesthetics and smooth animations.
- 📍 **Precision Pinning**: Leaflet-powered maps for exact donor pickup locations and NGO tracking.
- ⚡ **Unified Control Center**: A single, intelligent dashboard that adapts its interface based on the user's role (Donor or NGO/Receiver).
- 🚚 **Live Mission Tracking**: Real-time monitoring of food status, from acceptance to final delivery.
- 🤖 **Predictive Intelligence**: AI-driven models that forecast surplus based on event types and guest counts to optimize redistribution.
- 📊 **Impact Analytics**: Live monitoring of meals saved, CO2 offset, and distribution efficiency.

## 🚀 Fully Integrated Workflows

### 🎁 For Donors (Event Organizers/Hosts)
- **Fast Posting**: Activate a redistribution mission in under 60 seconds with AI-assisted servings estimation.
- **Location Mapping**: Drop a pin to help NGOs find your venue instantly.
- **Historical Impact**: Track your lifetime contribution to the zero-waste mission.

### 🏠 For Receivers (NGOs/Orphanages/Homes)
- **Live Match Feed**: Access a real-time stream of available surplus in your immediate vicinity.
- **Smart Claiming**: One-tap mission acceptance with immediate tracking capabilities.
- **Alert Center**: Receive high-priority notifications for urgent pickups near you.

## 🛠️ Technology Stack
- **Frontend**: React 19 (Vite), Tailwind CSS, Framer Motion, Lucide React
- **Backend**: Node.js, Express
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT & Supabase Auth Integration
- **Maps**: Leaflet & OpenStreetMap

## 📂 Final Project Architecture
```text
├── frontend/               # Premium React Application
│   ├── src/pages/          # Unified Control Center, Tracking, Analytics
│   ├── src/components/     # Shared Maps, Pickers, and Navigation
│   └── src/services/       # API Integration Layer
├── backend/                # Mission Control API
│   ├── controllers/        # Logic for Donations, Analytics, and Notifications
│   ├── routes/             # RESTful Endpoint definitions
│   └── config/             # Supabase and Environment Configuration
└── database/               # SQL Schemas and Migrations
```

## 🌈 Running the Platform

1. **Environment Setup**
   - Copy `.env.example` to `.env` in both `frontend` and `backend` directories.
   - Configure your Supabase credentials and JWT secrets.

2. **Launch Services**
   - Run `npm run dev` in the `backend` directory.
   - Run `npm run dev` in the `frontend` directory.
   - Access the platform at `http://localhost:3000`.

## 🤝 Mission Accomplished
This platform is now fully developed and ready to serve the community. We have successfully built a future where surplus is shared, not wasted. Every line of code in this project is dedicated to feeding a child or supporting an elder.

---
*Built with ❤️ for the community.*
