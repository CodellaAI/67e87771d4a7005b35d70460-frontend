
import { useState, useEffect, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X, Calendar, Clock } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function EditAppointmentModal({ appointment, services, onClose, onSuccess, token }) {
  const [selectedService, setSelectedService] = useState(appointment.service._id)
  const [selectedDate, setSelectedDate] = useState(appointment.date)
  const [availableTimes, setAvailableTimes] = useState([])
  const [selectedTime, setSelectedTime] = useState(appointment.time)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  useEffect(() => {
    fetchAvailableTimes()
  }, [selectedDate, selectedService])
  
  const fetchAvailableTimes = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/appointments/available-times`,
        {
          params: {
            date: selectedDate,
            serviceId: selectedService,
            excludeAppointmentId: appointment._id
          },
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      setAvailableTimes(response.data)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching available times:', error)
      toast.error('Could not load available times')
      setIsLoading(false)
    }
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/appointments/${appointment._id}`,
        {
          service: selectedService,
          date: selectedDate,
          time: selectedTime
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      
      onSuccess()
    } catch (error) {
      console.error('Error updating appointment:', error)
      toast.error('Could not update appointment')
      setIsSubmitting(false)
    }
  }
  
  const formatTimeDisplay = (timeString) => {
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
                    className="text-xl font-medium leading-6"
                  >
                    Edit Appointment
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="service" className="block mb-2 font-medium">
                      Service
                    </label>
                    <select
                      id="service"
                      className="input"
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                    >
                      {services.map((service) => (
                        <option key={service._id} value={service._id}>
                          {service.name} (${service.price} - {service.duration} min)
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="date" className="block mb-2 font-medium">
                      Date
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Calendar className="text-gray-400" size={18} />
                      </div>
                      <input
                        type="date"
                        id="date"
                        className="input pl-10"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={format(new Date(), 'yyyy-MM-dd')}
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="time" className="block mb-2 font-medium">
                      Time
                    </label>
                    
                    {isLoading ? (
                      <div className="flex justify-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gold-500"></div>
                      </div>
                    ) : availableTimes.length === 0 ? (
                      <div className="text-center py-4 bg-black-700 rounded-md">
                        <p className="text-gray-300">No available times for this date.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-2">
                        {availableTimes.map((time) => (
                          <button
                            key={time}
                            type="button"
                            onClick={() => setSelectedTime(time)}
                            className={`flex items-center justify-center p-2 rounded-md border ${
                              selectedTime === time
                                ? 'border-gold-500 bg-gold-500/10 text-gold-500'
                                : 'border-black-700 hover:border-gold-500/50 hover:bg-black-700'
                            }`}
                          >
                            <Clock size={14} className="mr-1" />
                            {formatTimeDisplay(time)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="btn-secondary py-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary py-2"
                      disabled={isSubmitting || isLoading || availableTimes.length === 0}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-black-900 mr-2"></div>
                          Saving...
                        </div>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
