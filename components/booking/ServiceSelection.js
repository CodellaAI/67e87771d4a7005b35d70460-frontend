
import { useState, useEffect } from 'react'
import { Clock, DollarSign, Scissors } from 'lucide-react'

export default function ServiceSelection({ services, onSelect }) {
  const [selectedServiceId, setSelectedServiceId] = useState(null)
  
  const handleSelectService = (service) => {
    setSelectedServiceId(service._id)
    setTimeout(() => onSelect(service), 300) // Small delay for animation
  }
  
  return (
    <div>
      <h2 className="text-2xl font-serif font-bold mb-6">Select a Service</h2>
      
      {services.length === 0 ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500 mx-auto mb-4"></div>
          <p>Loading services...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {services.map((service) => (
            <div
              key={service._id}
              onClick={() => handleSelectService(service)}
              className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 ${
                selectedServiceId === service._id
                  ? 'border-gold-500 bg-gold-500/5'
                  : 'border-black-700 hover:border-gold-500/50 hover:bg-black-800'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-3 md:mb-0">
                  <h3 className="text-xl font-medium mb-1">{service.name}</h3>
                  <p className="text-gray-400 text-sm">{service.description}</p>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center text-sm bg-black-800 px-3 py-1 rounded-full">
                    <Clock className="text-gold-500 mr-2" size={14} />
                    <span>{service.duration} min</span>
                  </div>
                  
                  <div className="flex items-center text-sm bg-black-800 px-3 py-1 rounded-full">
                    <DollarSign className="text-gold-500 mr-2" size={14} />
                    <span>${service.price}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
