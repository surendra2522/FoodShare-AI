// import { db } from '../config/mockDB.js'

import axios from 'axios'

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000'

export const surplusPredictor = async (guests, foodType = 'Veg', freshness = 6) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/predict/surplus`, {
      expectedGuests: guests,
      foodType,
      freshnessHours: freshness
    })
    return response.data.prediction
  } catch (error) {
    console.error('AI Service Error:', error.message)
    // Fallback logic
    const surplusServings = guests * 0.22
    return {
      servingsEstimate: Math.round(surplusServings),
      confidence: 0.70,
      suggestion: `[Fallback] Prepare for ~${Math.round(surplusServings)} leftover meals.`
    }
  }
}

export const matchingIntelligence = async (servings, homes) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/predict/matching`, {
      servings,
      homes
    })
    return response.data.recommendations
  } catch (error) {
    console.error('AI Matching Error:', error.message)
    return homes.slice(0, 3).map(h => ({ ...h, matchScore: 50, priority: 'Normal' }))
  }
}
