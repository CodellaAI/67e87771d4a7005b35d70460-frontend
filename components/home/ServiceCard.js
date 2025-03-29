
import { Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function ServiceCard({ service }) {
  return (
    <div className="card group hover:shadow-premium transition-all duration-300 transform hover:-translate-y-1">
      <div className="mb-4">
        <span className="inline-block px-3 py-1 bg-gold-500/10 text-gold-500 rounded-md text-sm font-medium">
          ${service.price}
        </span>
      </div>
      
      <h3 className="text-xl font-bold mb-2">{service.name}</h3>
      
      <div className="flex items-center mb-4 text-gray-400">
        <Clock size={16} className="mr-2" />
        <span>{service.duration} minutes</span>
      </div>
      
      <p className="text-gray-300 mb-6 line-clamp-3">{service.description}</p>
      
      <Link 
        href="/booking" 
        className="flex items-center text-gold-500 font-medium group-hover:text-gold-400 transition-colors"
      >
        Book Now
        <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  )
}
