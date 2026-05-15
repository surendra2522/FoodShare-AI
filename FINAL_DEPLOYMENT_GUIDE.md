# 🚀 FoodShare AI: Final Deployment Guide

This guide details how to move your project from local development to a live production environment for your final year project presentation.

## 🏗️ Architecture Overview
- **Frontend**: React (Vite)
- **Backend**: Node.js (Express) + Supabase
- **AI Engine**: Python (Flask) + Scikit-learn
- **Database**: Supabase (PostgreSQL)

---

## 1. Supabase Setup (Database & Auth)
Your database is already configured. For production:
1. Go to your [Supabase Dashboard](https://app.supabase.com/).
2. Ensure the SQL schema in `backend/supabase-schema.sql` has been applied to the SQL Editor.
3. Keep your `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` ready.

---

## 2. Deploy AI Engine (Python)
**Recommended Platform**: [Render.com](https://render.com/)
1. Create a New Web Service.
2. Connect your GitHub Repo.
3. Set **Root Directory** to `ai`.
4. **Build Command**: `pip install -r requirements.txt`
5. **Start Command**: `python app.py` (or use `gunicorn app:app`)
6. Note the provided URL (e.g., `https://foodshare-ai-engine.onrender.com`).

---

## 3. Deploy Backend (Node.js)
**Recommended Platform**: [Render.com](https://render.com/) or [Railway.app](https://railway.app/)
1. Create a New Web Service.
2. Set **Root Directory** to `backend`.
3. **Build Command**: `npm install`
4. **Start Command**: `npm start`
5. **Environment Variables**:
   - `PORT`: `8214`
   - `SUPABASE_URL`: (Your URL)
   - `SUPABASE_SERVICE_KEY`: (Your Key)
   - `JWT_SECRET`: (A strong random string)
   - `AI_SERVICE_URL`: (The URL from Step 2)
6. Note the provided URL (e.g., `https://foodshare-api.onrender.com`).

---

## 4. Deploy Frontend (React)
**Recommended Platform**: [Vercel](https://vercel.com/)
1. Create a New Project.
2. Set **Root Directory** to `frontend`.
3. **Framework Preset**: Vite.
4. **Environment Variables**:
   - `VITE_API_URL`: (The URL from Step 3)
5. Vercel will automatically build and provide your final live URL.

---

## 5. Final Presentation Tips
- **Demo Flow**: Start as a **Donor** -> Post Food -> Open **NGO Dashboard** -> Claim Food -> Open **Tracking** -> Use **Simulator** to show progress.
- **Explain the AI**: Mention that the Flask engine uses historical event data (`food_waste_data.csv`) to predict surplus servings.
- **Highlight the Impact**: Show the Analytics page to demonstrate how the system tracks CO2 and Meals Saved.

**Congratulations on finishing your Final Year Project!** 🎉
