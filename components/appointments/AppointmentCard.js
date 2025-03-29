
import { format, parseISO } from 'date-fns'
import { Calendar, Clock, Scissors, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react'

export default function AppointmentCard({ appointment, onEdit, onCancel, isPast = false }) {
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':')
    const date = new Date()
    date.setHours(parseInt(hours, 10))
    date.setMinutes(parseInt(minutes, 10))
    return format(date, 'h:mm a')
  }
  
  const getStatusBadge = () => {
    switch (appointment.status) {
      case 'confirmed':
        return (
          <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 bg-green-500/20 text-green-500 rounded-full">
            <CheckCircle size={12} />
            Confirmed
          </span>
        )
      case 'cancelled':
        return (
          <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 bg-red-500/20 text-red-500 rounded-full">
            <XCircle size={12} />
            Cancelled
          </span>
        )
      default:
        return (
          <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 bg-blue-500/20 text-blue-500 rounded-full">
            <Clock size={12} />
            Pending
          </span>
        )
    }
  }
  
  return (
    <div className={`card ${isPast ? 'opacity-75' : ''}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <div className="mb-4 sm:mb-0">
          <div className="flex items-center mb-1">
            {getStatusBadge()}
            <h3 className="text-lg font-medium ml-2">{appointment.service.name}</h3>
          </div>
          
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-300">
            <div className="flex items-center">
              <Calendar className="text-gold-500 mr-1" size={14} />
              <span>{format(parseISO(appointment.date), 'MMMM d, yyyy')}</span>
            </div>
            <div className="flex items-center">
              <Clock className="text-gold-500 mr-1" size={14} />
              <span>{formatTime(appointment.time)}</span>
            </div>
            <div className="flex items-center">
              <Scissors className="text-gold-500 mr-1" size={14} />
              <span>{appointment.service.duration} minutes</span>
            </div>
          </div>
          
          {appointment.familyMember && (
            <p className="text-sm text-gray-400 mt-2">
              For: {appointment.familyMember.name} ({appointment.familyMember.relation})
            </p>
          )}
        </div>
        
        {!isPast && appointment.status !== 'cancelled' && (
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="p-2 rounded-md bg-black-800 hover:bg-black-700 transition-colors"
              title="Edit appointment"
            >
              <Edit size={18} className="text-gold-500" />
            </button>
            <button
              onClick={onCancel}
              className="p-2 rounded-md bg-black-800 hover:bg-black-700 transition-colors"
              title="Cancel appointment"
            >
              <Trash2 size={18} className="text-red-500" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
