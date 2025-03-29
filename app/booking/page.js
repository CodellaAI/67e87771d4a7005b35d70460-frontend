
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { format, addDays, parseISO, isAfter, isBefore, isSameDay } from 'date-fns'
import { Calendar, Clock, User, Users, Check, ChevronRight, ChevronLeft, Scissors } from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'
import BookingSteps from '@/components/booking/BookingSteps'
import ServiceSelection from '@/components/booking/ServiceSelection'
import DateSelection from '@/components/booking/DateSelection'
import TimeSelection from '@/components/booking/TimeSelection'
import ClientInfoForm from '@/components/booking/ClientInfoForm'
import FamilyMemberSelection from '@/components/booking/FamilyMemberSelection'
import BookingConfirmation from '@/components/booking/BookingConfirmation'
import toast from 'react-hot-toast'

export default function BookingPage() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  
  const [step, setStep] = useState(1)
  const [services, setServices] = useState([])
  const [selectedService, setSelectedService] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedTime, setSelectedTime] = useState(null)
  const [availableTimes, setAvailableTimes] = useState([])
  const [familyMembers, setFamilyMembers] = useState([])
  const [selectedFamilyMember, setSelectedFamilyMember] = useState(null)
  const [clientInfo, setClientInfo] = useState({
    name: '',
    phone: '',
    email: '',
  })
  const [bookingConfirmed, setBookingConfirmed] = useState(false)
  const [bookingReference, setBookingReference] = useState(null)

  useEffect(() => {
    // Fetch services
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/services`)
        setServices(response.data)
      } catch (error) {
        console.error('Error fetching services:', error)
        toast.error('Could not load services. Please try again.')
      }
    }

    fetchServices()
  }, [])

  useEffect(() => {
    // If user is authenticated, pre-fill client info and fetch family members
    if (isAuthenticated && user) {
      setClientInfo({
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
      })

      const fetchFamilyMembers = async () => {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/family-members`, {
            headers: {
              Authorization: `Bearer ${user.token}`
            }
          })
          setFamilyMembers(response.data)
        } catch (error) {
          console.error('Error fetching family members:', error)
        }
      }

      fetchFamilyMembers()
    }
  }, [isAuthenticated, user])

  useEffect(() => {
    // Fetch available times when date or service changes
    if (selectedDate && selectedService) {
      const fetchAvailableTimes = async () => {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/appointments/available-times`, {
              params: {
                date: format(selectedDate, 'yyyy-MM-dd'),
                serviceId: selectedService._id
              }
            }
          )
          setAvailableTimes(response.data)
        } catch (error) {
          console.error('Error fetching available times:', error)
          toast.error('Could not load available times. Please try again.')
        }
      }

      fetchAvailableTimes()
    }
  }, [selectedDate, selectedService])

  const handleServiceSelect = (service) => {
    setSelectedService(service)
    setSelectedTime(null)
    setStep(2)
  }

  const handleDateSelect = (date) => {
    setSelectedDate(date)
    setSelectedTime(null)
    setStep(3)
  }

  const handleTimeSelect = (time) => {
    setSelectedTime(time)
    setStep(isAuthenticated ? 4 : 5)
  }

  const handleFamilyMemberSelect = (member) => {
    setSelectedFamilyMember(member)
    setStep(6)
  }

  const handleClientInfoSubmit = (info) => {
    setClientInfo(info)
    setStep(6)
  }

  const handleBookingConfirm = async () => {
    try {
      const bookingData = {
        service: selectedService._id,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime,
        client: isAuthenticated ? user._id : null,
        familyMember: selectedFamilyMember ? selectedFamilyMember._id : null,
        clientInfo: !isAuthenticated ? clientInfo : null
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/appointments`,
        bookingData,
        isAuthenticated ? {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        } : {}
      )

      setBookingReference(response.data)
      setBookingConfirmed(true)
      toast.success('Appointment booked successfully!')
    } catch (error) {
      console.error('Error booking appointment:', error)
      toast.error('Could not book appointment. Please try again.')
    }
  }

  const goToStep = (stepNumber) => {
    if (stepNumber < step) {
      setStep(stepNumber)
    }
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <ServiceSelection services={services} onSelect={handleServiceSelect} />
      case 2:
        return <DateSelection selectedDate={selectedDate} onSelect={handleDateSelect} />
      case 3:
        return <TimeSelection 
          availableTimes={availableTimes} 
          selectedTime={selectedTime} 
          onSelect={handleTimeSelect} 
          serviceDuration={selectedService?.duration || 30}
        />
      case 4:
        return <FamilyMemberSelection 
          familyMembers={familyMembers} 
          onSelect={handleFamilyMemberSelect}
          onSelfSelect={() => setStep(6)}
        />
      case 5:
        return <ClientInfoForm 
          initialValues={clientInfo} 
          onSubmit={handleClientInfoSubmit} 
        />
      case 6:
        return <BookingConfirmation 
          service={selectedService}
          date={selectedDate}
          time={selectedTime}
          client={isAuthenticated ? user : clientInfo}
          familyMember={selectedFamilyMember}
          onConfirm={handleBookingConfirm}
          bookingConfirmed={bookingConfirmed}
          bookingReference={bookingReference}
        />
      default:
        return <ServiceSelection services={services} onSelect={handleServiceSelect} />
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="heading-lg text-center mb-2">Book Your <span className="text-gold-500">Appointment</span></h1>
        <p className="text-center text-gray-300 mb-12">
          Select your preferred service, date, and time for your visit to Matan Elbaz Barbershop
        </p>
        
        <BookingSteps currentStep={step} goToStep={goToStep} />
        
        <div className="card mt-8">
          {renderStepContent()}
        </div>
      </div>
    </div>
  )
}
