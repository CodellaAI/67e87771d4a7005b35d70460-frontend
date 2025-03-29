
import { Star } from 'lucide-react'

export default function TestimonialCard({ testimonial }) {
  const { name, text, rating } = testimonial
  
  return (
    <div className="card hover:shadow-premium transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={18}
            className={i < rating ? 'text-gold-500 fill-gold-500' : 'text-gray-600'}
          />
        ))}
      </div>
      
      <p className="text-gray-300 mb-6 italic">&ldquo;{text}&rdquo;</p>
      
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center text-black-900 font-bold">
          {name.charAt(0)}
        </div>
        <div className="ml-3">
          <p className="font-medium">{name}</p>
          <p className="text-sm text-gray-400">Client</p>
        </div>
      </div>
    </div>
  )
}
