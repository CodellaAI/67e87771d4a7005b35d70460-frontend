
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminDashboard from '@/components/admin/AdminDashboard'
import AdminCalendar from '@/components/admin/AdminCalendar'
import AdminServices from '@/components/admin/AdminServices'
import AdminClients from '@/components/admin/AdminClients'
import AdminSettings from '@/components/admin/AdminSettings'

export default function AdminPage() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('dashboard')

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login?redirect=/admin')
      return
    }

    if (isAuthenticated && user && user.role !== 'admin') {
      router.push('/')
    }
  }, [isAuthenticated, user, loading, router])

  if (loading || !isAuthenticated || (user && user.role !== 'admin')) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard />
      case 'calendar':
        return <AdminCalendar />
      case 'services':
        return <AdminServices />
      case 'clients':
        return <AdminClients />
      case 'settings':
        return <AdminSettings />
      default:
        return <AdminDashboard />
    }
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="heading-lg mb-10">Admin <span className="text-gold-500">Portal</span></h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/4">
          <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        
        <div className="md:w-3/4">
          <div className="card">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  )
}
