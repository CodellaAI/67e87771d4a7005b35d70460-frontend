
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { LogIn, User, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const { login, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push(redirect)
    }
  }, [isAuthenticated, loading, router, redirect])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await login(email, password)
      toast.success('Login successful!')
    } catch (error) {
      console.error('Login error:', error)
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.')
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
          <h1 className="heading-lg mb-2">Welcome <span className="text-gold-500">Back</span></h1>
          <p className="text-gray-300">
            Sign in to manage your appointments and family members
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="block mb-2 font-medium">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <User className="text-gray-400" size={18} />
                </div>
                <input
                  type="email"
                  id="email"
                  className="input pl-10"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-8">
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
                  className="input pl-10 pr-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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
                  <LogIn size={20} />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-300">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-gold-500 hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
