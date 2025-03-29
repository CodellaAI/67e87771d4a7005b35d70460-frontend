
import { useState } from 'react'
import { User, Mail, Phone } from 'lucide-react'

export default function ClientInfoForm({ initialValues, onSubmit }) {
  const [formData, setFormData] = useState({
    name: initialValues.name || '',
    email: initialValues.email || '',
    phone: initialValues.phone || ''
  })
  
  const [errors, setErrors] = useState({})
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }
  
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSubmit(formData)
    }
  }
  
  return (
    <div>
      <h2 className="text-2xl font-serif font-bold mb-6">Your Information</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2 font-medium">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <User className="text-gray-400" size={18} />
            </div>
            <input
              type="text"
              id="name"
              name="name"
              className={`input pl-10 ${errors.name ? 'border-red-500' : ''}`}
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          {errors.name && <p className="mt-1 text-red-500 text-sm">{errors.name}</p>}
        </div>
        
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2 font-medium">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Mail className="text-gray-400" size={18} />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              className={`input pl-10 ${errors.email ? 'border-red-500' : ''}`}
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          {errors.email && <p className="mt-1 text-red-500 text-sm">{errors.email}</p>}
        </div>
        
        <div className="mb-6">
          <label htmlFor="phone" className="block mb-2 font-medium">
            Phone Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Phone className="text-gray-400" size={18} />
            </div>
            <input
              type="tel"
              id="phone"
              name="phone"
              className={`input pl-10 ${errors.phone ? 'border-red-500' : ''}`}
              placeholder="+1 (555) 123-4567"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          {errors.phone && <p className="mt-1 text-red-500 text-sm">{errors.phone}</p>}
          <p className="mt-1 text-gray-400 text-sm">We'll send appointment reminders to this number</p>
        </div>
        
        <div className="flex justify-end">
          <button type="submit" className="btn-primary">
            Continue
          </button>
        </div>
      </form>
    </div>
  )
}
