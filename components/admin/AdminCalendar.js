
'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '@/components/auth/AuthProvider'
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  User, 
  Scissors,
  Phone,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO, isToday } from 'date-fns'
import toast from 'react-hot-toast'

export default function AdminCalendar() {
  const { user } = useAuth()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [appointments, setAppointments] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedDateAppointments, setSelectedDateAppointments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    fetchAppointmentsForMonth(currentMonth)
  }, [currentMonth])
  
  useEffect(() => {
    // Filter appointments for selected date
    const dateAppointments = appointments.filter(app => 
      isSameDay(parseISO(app.date), selectedDate)
    ).sort((a, b) => {
      // Sort by time
      return a.time.localeCompare(b.time)
    })
    
    setSelectedDateAppointments(dateAppointments)
  }, [selectedDate, appointments])
  
  const fetchAppointmentsForMonth = async (month) => {
    setIsLoading(true)
    try {
      const startDate = format(startOfMonth(month), 'yyyy-MM-dd')
      const endDate = format(endOfMonth(month), 'yyyy-MM-dd')
      
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/appointments`,
        {
          params: { startDate, endDate },
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      )
      
      setAppointments(response.data)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching appointments:', error)
      toast.error('Could not load appointments')
      setIsLoading(false)
    }
  }
  
  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }
  
  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }
  
  const handleDateClick = (date) => {
    setSelectedDate(date)
  }
  
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':')
    const date = new Date()
    date.setHours(parseInt(hours, 10))
    date.setMinutes(parseInt(minutes, 10))
    return format(date, 'h:mm a')
  }
  
  const getAppointmentCountForDate = (date) => {
    return appointments.filter(app => isSameDay(parseISO(app.date), date)).length
  }
  
  // Generate days for the current month view
  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  })
  
  return (
    <div>
      <h2 className="text-2xl font-serif font-bold mb-6">Appointment Calendar</h2>
      
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-medium">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        
        <div className="flex gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-md hover:bg-black-700 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => setCurrentMonth(new Date())}
            className="p-2 rounded-md hover:bg-black-700 transition-colors"
          >
            <CalendarIcon size={20} />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-md hover:bg-black-700 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm text-gray-400 font-medium py-2">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-6">
        {days.map(day => {
          const appointmentCount = getAppointmentCountForDate(day)
          const isSelected = isSameDay(day, selectedDate)
          
          return (
            <button
              key={day.toString()}
              onClick={() => handleDateClick(day)}
              className={`h-20 p-2 rounded-md flex flex-col items-start transition-all ${
                isSelected
                  ? 'bg-gold-500/10 border border-gold-500'
                  : 'hover:bg-black-800'
              }`}
            >
              <span className={`text-sm font-medium ${
                isToday(day) ? 'text-gold-500' : ''
              }`}>
                {format(day, 'd')}
              </span>
              
              {appointmentCount > 0 && (
                <div className="mt-auto w-full">
                  <div className="bg-black-700 rounded-md px-2 py-1 text-xs text-center">
                    {appointmentCount} appt{appointmentCount !== 1 ? 's' : ''}
                  </div>
                </div>
              )}
            </button>
          )
        })}
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <CalendarIcon className="mr-2 text-gold-500" size={18} />
          {format(selectedDate, 'EEEE, MMMM d, yyyy')}
        </h3>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gold-500"></div>
          </div>
        ) : selectedDateAppointments.length > 0 ? (
          <div className="space-y-4">
            {selectedDateAppointments.map(appointment => (
              <div key={appointment._id} className="card hover:shadow-premium transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="mb-4 md:mb-0">
                    <div className="flex items-center mb-2">
                      <div className="flex items-center mr-3">
                        <Clock className="text-gold-500 mr-2" size={16} />
                        <span className="font-medium">{formatTime(appointment.time)}</span>
                      </div>
                      
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        appointment.status === 'confirmed' 
                          ? 'bg-green-500/20 text-green-500' 
                          : appointment.status === 'cancelled' 
                            ? 'bg-red-500/20 text-red-500'
                            : 'bg-blue-500/20 text-blue-500'
                      }`}>
                        {appointment.status === 'confirmed' && <CheckCircle size={12} className="mr-1" />}
                        {appointment.status === 'cancelled' && <XCircle size={12} className="mr-1" />}
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="flex items-center mb-2">
                      <Scissors className="text-gold-500 mr-2" size={16} />
                      <span className="font-medium">{appointment.service.name}</span>
                      <span className="text-sm text-gray-400 ml-2">
                        ({appointment.service.duration} min)
                      </span>
                    </div>
                    
                    <div className="flex items-center">
                      <User className="text-gold-500 mr-2" size={16} />
                      <div>
                        <span>
                          {appointment.familyMember 
                            ? appointment.familyMember.name 
                            : appointment.client 
                              ? appointment.client.name 
                              : appointment.clientInfo?.name || 'Guest'}
                        </span>
                        
                        {appointment.familyMember && (
                          <span className="text-sm text-gray-400 ml-2">
                            ({appointment.familyMember.relation} of {appointment.client?.name})
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {(appointment.client?.phone || appointment.clientInfo?.phone) && (
                      <div className="flex items-center mt-2 text-sm text-gray-400">
                        <Phone className="mr-2" size={14} />
                        <span>
                          {appointment.client?.phone || appointment.clientInfo?.phone}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-black-800 rounded-lg">
            <p className="text-gray-400">No appointments scheduled for this date.</p>
          </div>
        )}
      </div>
    </div>
  )
}
