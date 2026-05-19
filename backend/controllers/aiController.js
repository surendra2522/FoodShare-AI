import { surplusPredictor } from '../services/aiService.js'
import { analyzeImageFreshness } from '../services/freshnessModel.js'

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

export const analyzeFreshness = async (req, res, next) => {
  const timeoutId = setTimeout(() => {
    if (!res.headersSent) {
      res.status(504).json({ message: 'AI Analysis timeout on server' })
    }
  }, 9000)

  try {
    if (!req.file) {
      clearTimeout(timeoutId)
      return res.status(400).json({ message: 'No image uploaded for analysis' })
    }
    
    const result = await analyzeImageFreshness(req.file.buffer)
    
    clearTimeout(timeoutId)
    if (!res.headersSent) {
      res.json(result)
    }
  } catch (error) {
    clearTimeout(timeoutId)
    console.error('Freshness analysis failed', error)
    if (!res.headersSent) {
      res.status(500).json({ message: 'AI Analysis failed' })
    }
  }
}
