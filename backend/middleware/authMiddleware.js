import jwt from 'jsonwebtoken'
import supabase from '../config/supabaseClient.js'

export const protect = async (req, res, next) => {
  let token = null

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, token missing.' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret')
    const { data: user, error } = await supabase
      .from('users')
      .select('id, role')
      .eq('id', decoded.id)
      .maybeSingle()

    if (error || !user) {
      return res.status(401).json({ message: 'Not authorized, user not found.' })
    }

    req.user = { id: user.id, role: user.role }
    next()
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token invalid.' })
  }
}
