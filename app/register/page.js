
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { UserPlus, User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const { register, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push(redirect)
    }
  }, [isAuthenticated, loading, router, redirect])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)

    try {
      await register(formData.name, formData.email, formData.phone, formData.password)
      toast.success('Registration successful!')
    } catch (error) {
      console.error('Registration error:', error)
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading || isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="heading-lg mb-2">Create an <span className="text-gold-500">Account</span></h1>
          <p className="text-gray-300">
            Join Matan Elbaz Barbershop for easy appointment booking
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="name" className="block mb-2 font-medium">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <User className="text-gray-400" size={18} />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className={`input pl-10 ${errors.name ? 'border-red-500' : ''}`}
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              {errors.name && <p className="mt-1 text-red-500 text-sm">{errors.name}</p>}
            </div>

            <div className="mb-6">
              <label htmlFor="email" className="block mb-2 font-medium">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail className="text-gray-400" size={18} />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`input pl-10 ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              {errors.email && <p className="mt-1 text-red-500 text-sm">{errors.email}</p>}
            </div>

            <div className="mb-6">
              <label htmlFor="phone" className="block mb-2 font-medium">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Phone className="text-gray-400" size={18} />
                </div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className={`input pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              {errors.phone && <p className="mt-1 text-red-500 text-sm">{errors.phone}</p>}
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block mb-2 font-medium">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="text-gray-400" size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className={`input pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gold-500 focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              {errors.password && <p className="mt-1 text-red-500 text-sm">{errors.password}</p>}
            </div>

            <div className="mb-8">
              <label htmlFor="confirmPassword" className="block mb-2 font-medium">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="text-gray-400" size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  className={`input pl-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
              {errors.confirmPassword && <p className="mt-1 text-red-500 text-sm">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              className="btn-primary w-full flex justify-center items-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black-900"></div>
              ) : (
                <>
                  <UserPlus size={20} />
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-300">
              Already have an account?{' '}
              <Link href="/login" className="text-gold-500 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
