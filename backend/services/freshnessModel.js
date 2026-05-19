import * as tf from '@tensorflow/tfjs'
import * as mobilenet from '@tensorflow-models/mobilenet'
import Jimp from 'jimp'

let net = null

export const analyzeImageFreshness = async (imageBuffer) => {
  if (!net) {
    net = await mobilenet.load()
  }

  const image = await Jimp.read(imageBuffer)
  image.resize(224, 224) // MobileNet expected size

  const numPixels = image.bitmap.width * image.bitmap.height
  const values = new Int32Array(numPixels * 3)

  let darkPixels = 0
  let brightPixels = 0
  let moldyPixels = 0

  for (let i = 0; i < numPixels; i++) {
    const idx = i * 4
    const r = image.bitmap.data[idx]
    const g = image.bitmap.data[idx + 1]
    const b = image.bitmap.data[idx + 2]
    
    values[i * 3] = r
    values[i * 3 + 1] = g
    values[i * 3 + 2] = b

    const brightness = (r + g + b) / 3
    if (brightness < 40) darkPixels++
    else if (brightness > 120) brightPixels++

    // Mold/Spoilage indicators: dull greenish/gray/blueish dark tones
    if (r < 100 && g > r && b > r && brightness < 100) {
      moldyPixels++
    }
    // Deep dark brown/black spots that aren't typical shadow
    if (r < 60 && g < 50 && b < 40 && brightness > 10) {
      moldyPixels++
    }
  }

  const tensor = tf.tensor3d(values, [224, 224, 3], 'int32')
  const predictions = await net.classify(tensor)
  tensor.dispose()

  // Base score logic using MobileNet food verification + pixel heuristics
  const isFood = predictions.some(p => p.className.toLowerCase().match(/(food|fruit|vegetable|dish|meal|meat|bread|pizza|produce|plate|bowl)/))
  
  let baseScore = isFood ? 85 : 50

  const darkRatio = darkPixels / numPixels
  const moldyRatio = moldyPixels / numPixels

  if (moldyRatio > 0.04) {
    baseScore -= (moldyRatio * 1500) // Heavy penalty for mold
  }
  
  if (darkRatio > 0.3) {
    baseScore -= (darkRatio * 100) 
  } else if (brightPixels / numPixels > 0.4) {
    baseScore += 10
  }

  // Slight variance for natural AI output scoring
  baseScore += (Math.random() * 8 - 4)

  baseScore = Math.max(12, Math.min(99, baseScore))
  
  let status = 'Spoiled'
  if (baseScore >= 80) status = 'Fresh'
  else if (baseScore >= 45) status = 'Moderate'

  return {
    score: Math.round(baseScore),
    status,
    predictions: predictions.slice(0, 2).map(p => ({ class: p.className, probability: Math.round(p.probability * 100) }))
  }
}
