
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { format, parseISO } from 'date-fns'
import { Calendar, Clock, User, Scissors, Edit, Trash2, AlertCircle } from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'
import AppointmentCard from '@/components/appointments/AppointmentCard'
import EditAppointmentModal from '@/components/appointments/EditAppointmentModal'
import CancelAppointmentModal from '@/components/appointments/CancelAppointmentModal'
import toast from 'react-hot-toast'

export default function MyAppointmentsPage() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  
  const [appointments, setAppointments] = useState([])
  const [services, setServices] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingAppointment, setEditingAppointment] = useState(null)
  const [cancelingAppointment, setCancelingAppointment] = useState(null)
  
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login?redirect=/my-appointments')
      return
    }

    if (isAuthenticated && user) {
      fetchAppointments()
      fetchServices()
    }
  }, [isAuthenticated, user, loading, router])

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/appointments/my-appointments`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      )
      setAppointments(response.data)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching appointments:', error)
      toast.error('Could not load your appointments. Please try again.')
      setIsLoading(false)
    }
  }

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/services`)
      setServices(response.data)
    } catch (error) {
      console.error('Error fetching services:', error)
    }
  }

  const handleEditAppointment = (appointment) => {
    setEditingAppointment(appointment)
  }

  const handleCancelAppointment = (appointment) => {
    setCancelingAppointment(appointment)
  }

  const handleUpdateSuccess = () => {
    setEditingAppointment(null)
    fetchAppointments()
    toast.success('Appointment updated successfully!')
  }

  const handleCancelSuccess = () => {
    setCancelingAppointment(null)
    fetchAppointments()
    toast.success('Appointment cancelled successfully!')
  }

  if (loading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
      </div>
    )
  }

  const upcomingAppointments = appointments.filter(
    app => new Date(app.date + 'T' + app.time) > new Date()
  ).sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time))

  const pastAppointments = appointments.filter(
    app => new Date(app.date + 'T' + app.time) <= new Date()
  ).sort((a, b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time))

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="heading-lg text-center mb-2">My <span className="text-gold-500">Appointments</span></h1>
        <p className="text-center text-gray-300 mb-12">
          Manage your upcoming and past appointments at Matan Elbaz Barbershop
        </p>
        
        {upcomingAppointments.length === 0 && pastAppointments.length === 0 ? (
          <div className="card text-center py-12">
            <AlertCircle className="mx-auto text-gold-500 mb-4" size={48} />
            <h2 className="heading-sm mb-4">No Appointments Found</h2>
            <p className="text-gray-300 mb-8">You don't have any appointments booked yet.</p>
            <a href="/booking" className="btn-primary">Book Your First Appointment</a>
          </div>
        ) : (
          <>
            {upcomingAppointments.length > 0 && (
              <div className="mb-12">
                <h2 className="heading-md mb-6">Upcoming Appointments</h2>
                <div className="space-y-6">
                  {upcomingAppointments.map(appointment => (
                    <AppointmentCard 
                      key={appointment._id} 
                      appointment={appointment}
                      onEdit={() => handleEditAppointment(appointment)}
                      onCancel={() => handleCancelAppointment(appointment)}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {pastAppointments.length > 0 && (
              <div>
                <h2 className="heading-md mb-6">Past Appointments</h2>
                <div className="space-y-6">
                  {pastAppointments.map(appointment => (
                    <AppointmentCard 
                      key={appointment._id} 
                      appointment={appointment}
                      isPast={true}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      {editingAppointment && (
        <EditAppointmentModal
          appointment={editingAppointment}
          services={services}
          onClose={() => setEditingAppointment(null)}
          onSuccess={handleUpdateSuccess}
          token={user.token}
        />
      )}
      
      {cancelingAppointment && (
        <CancelAppointmentModal
          appointment={cancelingAppointment}
          onClose={() => setCancelingAppointment(null)}
          onSuccess={handleCancelSuccess}
          token={user.token}
        />
      )}
    </div>
  )
}
