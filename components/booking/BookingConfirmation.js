
import { useState } from 'react'
import { format } from 'date-fns'
import { Calendar, Clock, User, Scissors, CheckCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function BookingConfirmation({ 
  service, 
  date, 
  time, 
  client, 
  familyMember,
  onConfirm,
  bookingConfirmed,
  bookingReference
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':')
    const date = new Date()
    date.setHours(parseInt(hours, 10))
    date.setMinutes(parseInt(minutes, 10))
    return format(date, 'h:mm a')
  }
  
  const handleConfirm = async () => {
    setIsSubmitting(true)
    try {
      await onConfirm()
    } catch (error) {
      console.error('Error confirming booking:', error)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  if (bookingConfirmed) {
    return (
      <div className="text-center py-6">
        <CheckCircle className="text-gold-500 mx-auto mb-4" size={64} />
        <h2 className="text-2xl font-serif font-bold mb-2">Booking Confirmed!</h2>
        <p className="text-gray-300 mb-6">
          Your appointment has been successfully booked.
        </p>
        
        <div className="bg-black-800 rounded-lg p-6 mb-8 max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-black-700">
            <div className="flex items-center">
              <Calendar className="text-gold-500 mr-2" size={20} />
              <span className="font-medium">{format(date, 'EEEE, MMMM d, yyyy')}</span>
            </div>
            <div className="flex items-center">
              <Clock className="text-gold-500 mr-2" size={20} />
              <span className="font-medium">{formatTime(time)}</span>
            </div>
          </div>
          
          <div className="mb-4 pb-4 border-b border-black-700">
            <h3 className="text-lg font-medium mb-2">{service.name}</h3>
            <div className="flex justify-between text-sm text-gray-400">
              <span>Duration: {service.duration} minutes</span>
              <span>Price: ${service.price}</span>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm uppercase text-gray-400 mb-2">Client</h3>
            <p className="font-medium">{familyMember ? familyMember.name : client.name}</p>
            {familyMember && <p className="text-sm text-gray-400">{familyMember.relation}</p>}
          </div>
          
          {bookingReference && (
            <div className="mt-4 pt-4 border-t border-black-700">
              <h3 className="text-sm uppercase text-gray-400 mb-2">Reference</h3>
              <p className="font-medium text-gold-500">{bookingReference._id}</p>
            </div>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/my-appointments" className="btn-primary flex items-center justify-center gap-2">
            View My Appointments
            <ArrowRight size={18} />
          </Link>
          <Link href="/" className="btn-secondary">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }
  
  return (
    <div>
      <h2 className="text-2xl font-serif font-bold mb-6">Confirm Your Booking</h2>
      
      <div className="bg-black-800 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-medium mb-4 pb-2 border-b border-black-700">
          Appointment Details
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <Scissors className="text-gold-500 mt-1 mr-3 flex-shrink-0" size={18} />
            <div>
              <p className="text-gray-400 text-sm">Service</p>
              <p className="font-medium">{service.name}</p>
              <p className="text-sm text-gray-400">${service.price} · {service.duration} minutes</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Calendar className="text-gold-500 mt-1 mr-3 flex-shrink-0" size={18} />
            <div>
              <p className="text-gray-400 text-sm">Date</p>
              <p className="font-medium">{format(date, 'EEEE, MMMM d, yyyy')}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Clock className="text-gold-500 mt-1 mr-3 flex-shrink-0" size={18} />
            <div>
              <p className="text-gray-400 text-sm">Time</p>
              <p className="font-medium">{formatTime(time)}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <User className="text-gold-500 mt-1 mr-3 flex-shrink-0" size={18} />
            <div>
              <p className="text-gray-400 text-sm">Client</p>
              <p className="font-medium">{familyMember ? familyMember.name : client.name}</p>
              {familyMember && <p className="text-sm text-gray-400">{familyMember.relation}</p>}
              <p className="text-sm text-gray-400">{client.phone}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gold-500/10 border border-gold-500/30 rounded-lg p-4 mb-8">
        <p className="text-sm">
          By confirming this appointment, you agree to our cancellation policy. 
          Please provide at least 24 hours notice for any cancellations or rescheduling.
        </p>
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={handleConfirm}
          className="btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black-900 mr-2"></div>
              Processing...
            </div>
          ) : (
            'Confirm Booking'
          )}
        </button>
      </div>
    </div>
  )
}
