import supabase from '../config/supabaseClient.js'

export const getNotifications = async (req, res, next) => {
  try {
    let { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('recipient_id', req.user.id)
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) {
      console.warn('Notifications fetch partially failed:', error.message)
      data = []
    }

    res.json(data)
  } catch (error) {
    next(error)
  }
}

export const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params
    const { error } = await supabase
      .from('notifications')
      .update({ read: true, read_at: new Date().toISOString() })
      .eq('id', id)
      .eq('recipient_id', req.user.id)

    if (error) {
      throw error
    }

    res.json({ success: true })
  } catch (error) {
    next(error)
  }
}
