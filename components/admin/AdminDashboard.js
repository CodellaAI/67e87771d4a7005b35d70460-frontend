
'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '@/components/auth/AuthProvider'
import { 
  Calendar, 
  Users, 
  Scissors, 
  TrendingUp,
  DollarSign,
  Clock
} from 'lucide-react'
import { format, parseISO, startOfDay, endOfDay, isToday } from 'date-fns'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    todayAppointments: 0,
    totalClients: 0,
    totalServices: 0,
    upcomingAppointments: 0
  })
  const [recentAppointments, setRecentAppointments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    fetchDashboardData()
  }, [])
  
  const fetchDashboardData = async () => {
    try {
      const [statsResponse, appointmentsResponse] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/stats`, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/appointments/recent`, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        })
      ])
      
      setStats(statsResponse.data)
      setRecentAppointments(appointmentsResponse.data)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Could not load dashboard data')
      setIsLoading(false)
    }
  }
  
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':')
    const date = new Date()
    date.setHours(parseInt(hours, 10))
    date.setMinutes(parseInt(minutes, 10))
    return format(date, 'h:mm a')
  }
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
      </div>
    )
  }
  
  return (
    <div>
      <h2 className="text-2xl font-serif font-bold mb-6">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card bg-black-800 hover:shadow-premium transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Today's Appointments</p>
              <p className="text-3xl font-bold">{stats.todayAppointments}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Calendar className="text-blue-500" size={24} />
            </div>
          </div>
        </div>
        
        <div className="card bg-black-800 hover:shadow-premium transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Clients</p>
              <p className="text-3xl font-bold">{stats.totalClients}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
              <Users className="text-green-500" size={24} />
            </div>
          </div>
        </div>
        
        <div className="card bg-black-800 hover:shadow-premium transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Services Offered</p>
              <p className="text-3xl font-bold">{stats.totalServices}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Scissors className="text-purple-500" size={24} />
            </div>
          </div>
        </div>
        
        <div className="card bg-black-800 hover:shadow-premium transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Upcoming Appointments</p>
              <p className="text-3xl font-bold">{stats.upcomingAppointments}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gold-500/20 flex items-center justify-center">
              <TrendingUp className="text-gold-500" size={24} />
            </div>
          </div>
        </div>
      </div>
      
      <h3 className="text-xl font-medium mb-4">Recent Appointments</h3>
      
      {recentAppointments.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-black-700">
                <th className="text-left py-3 px-4 font-medium">Client</th>
                <th className="text-left py-3 px-4 font-medium">Service</th>
                <th className="text-left py-3 px-4 font-medium">Date</th>
                <th className="text-left py-3 px-4 font-medium">Time</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentAppointments.map((appointment) => (
                <tr key={appointment._id} className="border-b border-black-700 hover:bg-black-800">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium">
                        {appointment.familyMember 
                          ? appointment.familyMember.name 
                          : appointment.client 
                            ? appointment.client.name 
                            : appointment.clientInfo?.name || 'Guest'}
                      </p>
                      {appointment.familyMember && (
                        <p className="text-xs text-gray-400">
                          Family: {appointment.client?.name}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <Scissors className="text-gold-500 mr-2" size={14} />
                      <span>{appointment.service.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <Calendar className="text-gray-400 mr-2" size={14} />
                      <span className={isToday(parseISO(appointment.date)) ? 'text-gold-500' : ''}>
                        {format(parseISO(appointment.date), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <Clock className="text-gray-400 mr-2" size={14} />
                      <span>{formatTime(appointment.time)}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      appointment.status === 'confirmed' 
                        ? 'bg-green-500/20 text-green-500' 
                        : appointment.status === 'cancelled' 
                          ? 'bg-red-500/20 text-red-500'
                          : 'bg-blue-500/20 text-blue-500'
                    }`}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 bg-black-800 rounded-lg">
          <p className="text-gray-400">No recent appointments found.</p>
        </div>
      )}
    </div>
  )
}
