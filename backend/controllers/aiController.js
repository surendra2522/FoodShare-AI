import { surplusPredictor } from '../services/aiService.js'

export const getAIPrediction = async (req, res, next) => {
  try {
    const guests = req.query.guests || 100
    const foodType = req.query.foodType || 'Veg'
    const freshness = req.query.freshness || 6
    
    const prediction = await surplusPredictor(guests, foodType, freshness)
    res.json(prediction)
  } catch (error) {
    next(error)
  }
}
