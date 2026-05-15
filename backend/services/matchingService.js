import supabase from '../config/supabaseClient.js'

/**
 * Calculate distance between two coordinates using Haversine formula
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * Find nearest Homes (Orphanages/Old-age homes) for a donation
 */
export const findNearestHomes = async (lat, lng, limit = 3) => {
  try {
    const { data: homes, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'ngo')
      .eq('is_active', true)
      .in('org_type', ['Orphanage', 'Old-age Home'])

    if (error) {
      throw error
    }

    const scoredHomes = (homes || [])
      .map((home) => ({
        ...home,
        distance: home.location?.lat ? calculateDistance(lat, lng, home.location.lat, home.location.lng) : 999
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit)

    return scoredHomes
  } catch (error) {
    console.error('Error in findNearestHomes:', error)
    throw error
  }
}
