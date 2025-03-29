
'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const token = Cookies.get('token')
    if (token) {
      try {
        const decodedToken = jwtDecode(token)
        const currentTime = Date.now() / 1000
        
        if (decodedToken.exp < currentTime) {
          // Token expired
          Cookies.remove('token')
          setUser(null)
        } else {
          // Token valid
          setUser({
            _id: decodedToken.id,
            name: decodedToken.name,
            email: decodedToken.email,
            phone: decodedToken.phone,
            role: decodedToken.role,
            token
          })
        }
      } catch (error) {
        console.error('Invalid token:', error)
        Cookies.remove('token')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        email,
        password
      })
      
      const { token } = response.data
      Cookies.set('token', token, { expires: 7 }) // 7 days
      
      const decodedToken = jwtDecode(token)
      setUser({
        _id: decodedToken.id,
        name: decodedToken.name,
        email: decodedToken.email,
        phone: decodedToken.phone,
        role: decodedToken.role,
        token
      })
      
      return response.data
    } catch (error) {
      throw error
    }
  }

  const register = async (name, email, phone, password) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        name,
        email,
        phone,
        password
      })
      
      const { token } = response.data
      Cookies.set('token', token, { expires: 7 }) // 7 days
      
      const decodedToken = jwtDecode(token)
      setUser({
        _id: decodedToken.id,
        name: decodedToken.name,
        email: decodedToken.email,
        phone: decodedToken.phone,
        role: decodedToken.role,
        token
      })
      
      return response.data
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    Cookies.remove('token')
    setUser(null)
    window.location.href = '/'
  }

  const updateUserProfile = (updatedUserData) => {
    setUser({
      ...user,
      ...updatedUserData
    })
  }

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
    updateUserProfile
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
