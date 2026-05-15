import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ user: null, token: null })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedAuth = window.localStorage.getItem('redistribution_auth')
    if (savedAuth) {
      setAuth(JSON.parse(savedAuth))
    }
    setLoading(false)
  }, [])

  const login = (authData) => {
    window.localStorage.setItem('redistribution_auth', JSON.stringify(authData))
    setAuth(authData)
  }

  const logout = () => {
    window.localStorage.removeItem('redistribution_auth')
    setAuth({ user: null, token: null })
  }

  return (
    <AuthContext.Provider value={{ ...auth, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
