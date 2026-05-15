# 🚀 FoodShare AI Deployment Guide

This guide provides step-by-step instructions for deploying the **FoodShare AI - Smart Food Redistribution Platform** to a production environment.

## 🏗️ Architecture Overview
- **Frontend**: React + Vite + Tailwind CSS (Served by the Backend).
- **Backend**: Node.js + Express (API Gateway & Logic).
- **AI Engine**: Python + Flask + Scikit-Learn (Surplus Prediction & Matching).
- **Database**: Supabase (PostgreSQL & Authentication).

---

## 🛠️ Prerequisites
1. **Supabase Account**: Create a project and run the SQL schema located in `backend/supabase-schema.sql`.
2. **Hosting Provider**: We recommend **Render**, **Railway**, or a **VPS** (DigitalOcean/AWS).
3. **Node.js 20+** and **Python 3.12+**.

---

## 📋 Step 1: Database Setup
1. Log in to your **Supabase Dashboard**.
2. Go to the **SQL Editor**.
3. Copy and paste the contents of `backend/supabase-schema.sql` and run it.
4. (Optional) Run the seed script to add demo data:
   ```bash
   npm run seed
   ```

---

## 📋 Step 2: Environment Configuration
Create a `.env` file in the **root directory** (or set these in your hosting provider's dashboard):

```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_role_key
JWT_SECRET=your_random_secret_string
AI_SERVICE_URL=https://your-ai-service.onrender.com
PORT=8214
```

---

## 📋 Step 3: Deployment Options

### Option A: Manual VPS / Local Server
1. **Install Dependencies**:
   ```bash
   npm run install:all
   ```
2. **Build the Frontend**:
   ```bash
   npm run build
   ```
3. **Start the AI Engine** (in the `ai` folder):
   ```bash
   cd ai && python app.py
   ```
4. **Start the Backend** (in the `backend` folder):
   ```bash
   cd backend && npm start
   ```

### Option B: Docker (Recommended for Reliability)
If you have Docker installed, simply run:
```bash
docker-compose up --build -d
```
This will automatically launch the Frontend, Backend, and AI Engine on their respective ports.

---

## 📋 Step 4: Final Verification
- **Frontend**: Accessible at `http://your-domain:8214` (or your hosting URL).
- **API Health**: Check `https://your-domain/api/analytics/summary` to ensure database connection is live.
- **AI Health**: Open the chatbot and type "AI Insights" to verify the AI Engine is responding.

---

## 💡 Troubleshooting
- **CORS Errors**: If the frontend cannot talk to the backend, ensure `CORS()` is configured in `server.js` to whitelist your production domain.
- **AI Prediction 0**: If predictions fail, check if the `surplus_predictor.pkl` exists in `ai/models/`. If not, run `python ai/training/train_model.py`.

---
*Created for the FoodShare AI Final Year Project Review.*
