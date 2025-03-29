
import { useState } from 'react'
import { format, addMinutes, parse } from 'date-fns'
import { Clock } from 'lucide-react'

export default function TimeSelection({ availableTimes, selectedTime, onSelect, serviceDuration }) {
  const formatTimeDisplay = (timeString) => {
    try {
      const date = parse(timeString, 'HH:mm', new Date())
      return format(date, 'h:mm a')
    } catch (error) {
      console.error('Error parsing time:', error)
      return timeString
    }
  }
  
  const calculateEndTime = (startTime) => {
    try {
      const date = parse(startTime, 'HH:mm', new Date())
      const endTime = addMinutes(date, serviceDuration)
      return format(endTime, 'h:mm a')
    } catch (error) {
      console.error('Error calculating end time:', error)
      return ''
    }
  }
  
  const handleTimeSelect = (time) => {
    onSelect(time)
  }
  
  // Group times by morning, afternoon, evening
  const groupedTimes = {
    morning: availableTimes.filter(time => {
      const hour = parseInt(time.split(':')[0])
      return hour >= 6 && hour < 12
    }),
    afternoon: availableTimes.filter(time => {
      const hour = parseInt(time.split(':')[0])
      return hour >= 12 && hour < 17
    }),
    evening: availableTimes.filter(time => {
      const hour = parseInt(time.split(':')[0])
      return hour >= 17 && hour < 22
    })
  }
  
  return (
    <div>
      <h2 className="text-2xl font-serif font-bold mb-6">Select a Time</h2>
      
      {availableTimes.length === 0 ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500 mx-auto mb-4"></div>
          <p>Loading available times...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedTimes).map(([timeOfDay, times]) => {
            if (times.length === 0) return null
            
            return (
              <div key={timeOfDay}>
                <h3 className="text-lg font-medium mb-3 capitalize">
                  {timeOfDay}
                </h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {times.map((time) => {
                    const isSelected = time === selectedTime
                    
                    return (
                      <button
                        key={time}
                        onClick={() => handleTimeSelect(time)}
                        className={`flex flex-col items-center p-3 rounded-lg border transition-all ${
                          isSelected
                            ? 'border-gold-500 bg-gold-500/10 text-gold-500'
                            : 'border-black-700 hover:border-gold-500/50 hover:bg-black-800'
                        }`}
                      >
                        <div className="flex items-center mb-1">
                          <Clock size={14} className="mr-1" />
                          <span className="text-base font-medium">
                            {formatTimeDisplay(time)}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">
                          Ends at {calculateEndTime(time)}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
          
          {Object.values(groupedTimes).every(times => times.length === 0) && (
            <div className="text-center py-8 bg-black-800 rounded-lg">
              <p className="text-gray-300 mb-2">No available times for this date.</p>
              <p className="text-gray-400 text-sm">Please select another date.</p>
            </div>
          )}
        </div>
      )}
      
      <div className="mt-6 flex justify-end">
        <button
          onClick={() => handleTimeSelect(selectedTime)}
          className="btn-primary"
          disabled={!selectedTime}
        >
          Continue with {selectedTime ? formatTimeDisplay(selectedTime) : 'selected time'}
        </button>
      </div>
    </div>
  )
}
