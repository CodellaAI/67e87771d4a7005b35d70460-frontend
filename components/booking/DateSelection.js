
import { useState } from 'react'
import { format, addDays, isSameDay, isToday, isBefore, startOfDay } from 'date-fns'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'

export default function DateSelection({ selectedDate, onSelect }) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [calendarView, setCalendarView] = useState('week') // 'week' or 'month'
  
  const today = new Date()
  
  // Generate dates for week view (next 14 days)
  const weekDates = Array.from({ length: 14 }, (_, i) => addDays(today, i))
  
  const handleDateSelect = (date) => {
    onSelect(date)
  }
  
  const handlePrevMonth = () => {
    setCurrentMonth(prev => addDays(prev, -30))
  }
  
  const handleNextMonth = () => {
    setCurrentMonth(prev => addDays(prev, 30))
  }
  
  const toggleCalendarView = () => {
    setCalendarView(prev => prev === 'week' ? 'month' : 'week')
  }
  
  return (
    <div>
      <h2 className="text-2xl font-serif font-bold mb-6">Select a Date</h2>
      
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">
          {calendarView === 'week' ? 'Next 14 Days' : format(currentMonth, 'MMMM yyyy')}
        </h3>
        
        <div className="flex items-center gap-2">
          <button
            onClick={toggleCalendarView}
            className="flex items-center gap-1 text-sm text-gray-300 hover:text-gold-500 transition-colors"
          >
            <Calendar size={16} />
            {calendarView === 'week' ? 'Month view' : 'Week view'}
          </button>
          
          {calendarView === 'month' && (
            <div className="flex gap-1">
              <button
                onClick={handlePrevMonth}
                className="p-1 rounded-md hover:bg-black-800 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1 rounded-md hover:bg-black-800 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
      
      {calendarView === 'week' ? (
        // Week view
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {weekDates.map((date) => {
            const isSelected = selectedDate && isSameDay(date, selectedDate)
            const isDisabled = isBefore(date, startOfDay(today))
            
            return (
              <button
                key={date.toString()}
                onClick={() => !isDisabled && handleDateSelect(date)}
                disabled={isDisabled}
                className={`flex flex-col items-center p-3 rounded-lg border transition-all ${
                  isSelected
                    ? 'border-gold-500 bg-gold-500/10 text-gold-500'
                    : isDisabled
                      ? 'border-black-800 bg-black-900 text-gray-600 cursor-not-allowed'
                      : 'border-black-700 hover:border-gold-500/50 hover:bg-black-800'
                }`}
              >
                <span className="text-xs uppercase mb-1">
                  {format(date, 'EEE')}
                </span>
                <span className={`text-2xl font-medium ${isToday(date) ? 'text-gold-500' : ''}`}>
                  {format(date, 'd')}
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  {format(date, 'MMM')}
                </span>
              </button>
            )
          })}
        </div>
      ) : (
        // Month view - simplified for this example
        <div className="bg-black-800 rounded-lg p-4">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <div key={day} className="text-center text-xs text-gray-400 font-medium py-1">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {/* This would typically be generated based on the current month */}
            {Array.from({ length: 35 }, (_, i) => {
              const date = addDays(currentMonth, i - 15)
              const isSelected = selectedDate && isSameDay(date, selectedDate)
              const isDisabled = isBefore(date, startOfDay(today))
              const isCurrentMonth = date.getMonth() === currentMonth.getMonth()
              
              return (
                <button
                  key={i}
                  onClick={() => !isDisabled && handleDateSelect(date)}
                  disabled={isDisabled}
                  className={`h-10 rounded-md flex items-center justify-center transition-all ${
                    !isCurrentMonth
                      ? 'text-gray-600'
                      : isSelected
                        ? 'bg-gold-500/10 text-gold-500 border border-gold-500'
                        : isDisabled
                          ? 'text-gray-600 cursor-not-allowed'
                          : 'hover:bg-black-700'
                  }`}
                >
                  <span className={isToday(date) ? 'text-gold-500 font-medium' : ''}>
                    {format(date, 'd')}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}
      
      <div className="mt-6 flex justify-end">
        <button
          onClick={() => handleDateSelect(selectedDate)}
          className="btn-primary"
          disabled={!selectedDate}
        >
          Continue with {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'selected date'}
        </button>
      </div>
    </div>
  )
}
