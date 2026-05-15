import supabase from '../config/supabaseClient.js'

export const submitDonation = async (req, res, next) => {
  try {
    const { functionName, foodType, servings, expiryHours, pickupArea, notes, location } = req.body

    const fullRecord = {
      donor_id: req.user.id,
      function_name: functionName,
      food_type: foodType || 'Veg',
      servings: Number(servings),
      expiry_hours: Number(expiryHours),
      pickup_area: pickupArea,
      notes: notes || null,
      location: location || null,
      status: 'pending',
      priority: Number(expiryHours) <= 2 ? 'high' : 'normal',
    }

    // Try full insert first
    let { data, error } = await supabase.from('donations').insert([fullRecord]).select('*').single()

    // Fallback logic: if columns are missing, try a minimal insert
    if (error && (error.code === 'PGRST204' || error?.message?.includes('column'))) {
      console.warn('Database schema mismatch, falling back to minimal record:', error.message)
      const minimalRecord = {
        donor_id: req.user.id,
        function_name: functionName,
        status: 'pending'
      }
      const retry = await supabase.from('donations').insert([minimalRecord]).select('*').single()
      data = retry.data
      error = retry.error
    }

    if (error) throw error

    // AI-Driven Smart Matching: Notify nearby NGOs (Simulated)
    try {
      const { data: ngos } = await supabase
        .from('users')
        .select('id')
        .eq('role', 'ngo') // Using lowercase as established earlier
      
      if (ngos && ngos.length > 0) {
        const notifications = ngos.map(ngo => ({
          type: 'donation_alert',
          title: `New Surplus Available: ${functionName}!`,
          message: `A new donation from "${functionName}" is available nearby in ${pickupArea}.`,
          recipient_id: ngo.id,
          related_donation_id: data.id,
        }))

        await supabase.from('notifications').insert(notifications)
      }
    } catch (notifError) {
      console.error('Failed to trigger smart matching notifications:', notifError)
      // We don't fail the donation if notifications fail
    }

    res.status(201).json(data)
  } catch (error) {
    next(error)
  }
}

export const getMyDonations = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .eq('donor_id', req.user.id)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    res.json(data)
  } catch (error) {
    next(error)
  }
}

export const getAvailableDonations = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    res.json(data)
  } catch (error) {
    next(error)
  }
}

export const acceptDonation = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('donations')
      .update({
        status: 'accepted',
        receiver_id: req.user.id,
        accepted_at: new Date().toISOString(),
      })
      .eq('id', req.params.id)
      .select('*')
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ message: 'Donation not found' })
      }
      throw error
    }

    if (!data) {
      return res.status(404).json({ message: 'Donation not found' })
    }

    res.json(data)
  } catch (error) {
    next(error)
  }
}

export const getMyMissions = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .eq('receiver_id', req.user.id)
      .order('accepted_at', { ascending: false })

    if (error) {
      throw error
    }

    res.json(data)
  } catch (error) {
    next(error)
  }
}

export const getDonationById = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .eq('id', req.params.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ message: 'Donation not found' })
      }
      throw error
    }

    res.json(data)
  } catch (error) {
    next(error)
  }
}

export const updateDonationStatus = async (req, res, next) => {
  try {
    const { status } = req.body
    const { data, error } = await supabase
      .from('donations')
      .update({ status })
      .eq('id', req.params.id)
      .select('*')
      .single()

    if (error) throw error
    res.json(data)
  } catch (error) {
    next(error)
  }
}
