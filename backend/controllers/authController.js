import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import supabase from '../config/supabaseClient.js'

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' })
}

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role = 'Donor', orgType, address, location } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' })
    }

    const { data: existingUser, error: findError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (findError) {
      throw findError
    }

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const userRecord = {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role.toLowerCase(), // Normalize to lowercase
      ...(orgType && { org_type: orgType }),
      ...(address && { address }),
      ...(location && { location }),
    }

    const { data, error } = await supabase
      .from('users')
      .insert([userRecord])
      .select('id, name, email, role')
      .single()

    if (error) {
      throw error
    }

    res.status(201).json({
      _id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
      token: generateToken(data.id),
    })
  } catch (error) {
    next(error)
  }
}

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const normalizedEmail = email.toLowerCase()

    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, password, role')
      .eq('email', normalizedEmail)
      .maybeSingle()

    if (error) {
      throw error
    }

    if (!user) {
      console.warn(`Login attempt failed: User not found for ${normalizedEmail}`)
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (isMatch) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role?.toLowerCase(),
        token: generateToken(user.id),
      })
    } else {
      res.status(401).json({ message: 'Invalid email or password' })
    }
  } catch (error) {
    next(error)
  }
}

export const getMe = async (req, res, next) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, role, org_type')
      .eq('id', req.user.id)
      .maybeSingle()

    if (error) {
      throw error
    }

    if (user) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        orgType: user.org_type,
      })
    } else {
      res.status(404).json({ message: 'User not found' })
    }
  } catch (error) {
    next(error)
  }
}

export const getNgos = async (req, res, next) => {
  try {
    const { data: ngos, error } = await supabase
      .from('users')
      .select('id, name')
      .eq('role', 'ngo')

    if (error) throw error
    res.json(ngos)
  } catch (error) {
    next(error)
  }
}
