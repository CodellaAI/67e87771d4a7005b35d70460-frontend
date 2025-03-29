
import { useState, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X, AlertTriangle } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function CancelAppointmentModal({ appointment, onClose, onSuccess, token }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleCancel = async () => {
    setIsSubmitting(true)
    
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/appointments/${appointment._id}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      
      onSuccess()
    } catch (error) {
      console.error('Error cancelling appointment:', error)
      toast.error('Could not cancel appointment')
      setIsSubmitting(false)
    }
  }
  
  const formatDate = (dateString) => {
    return format(parseISO(dateString), 'MMMM d, yyyy')
  }
  
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':')
    const date = new Date()
    date.setHours(parseInt(hours, 10))
    date.setMinutes(parseInt(minutes, 10))
    return format(date, 'h:mm a')
  }
  
  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black-900/80" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-black-800 p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-medium leading-6 text-red-500"
                  >
                    Cancel Appointment
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="flex items-center gap-3 mb-4 p-3 bg-red-500/10 rounded-md border border-red-500/30">
                  <AlertTriangle className="text-red-500 flex-shrink-0" size={24} />
                  <p className="text-sm">
                    Are you sure you want to cancel this appointment? This action cannot be undone.
                  </p>
                </div>
                
                <div className="bg-black-700 p-4 rounded-md mb-6">
                  <h4 className="font-medium mb-2">{appointment.service.name}</h4>
                  <p className="text-sm text-gray-300">
                    {formatDate(appointment.date)} at {formatTime(appointment.time)}
                  </p>
                  {appointment.familyMember && (
                    <p className="text-sm text-gray-400 mt-1">
                      For: {appointment.familyMember.name}
                    </p>
                  )}
                </div>
                
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="btn-secondary py-2"
                  >
                    Keep Appointment
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Cancelling...
                      </div>
                    ) : (
                      'Cancel Appointment'
                    )}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
