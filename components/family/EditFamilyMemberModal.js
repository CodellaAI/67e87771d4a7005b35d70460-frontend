
import { useState, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X, User, Phone } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function EditFamilyMemberModal({ member, onClose, onSuccess, token }) {
  const [formData, setFormData] = useState({
    name: member.name || '',
    relation: member.relation || '',
    phone: member.phone || ''
  })
  
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  
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
    
    if (!formData.relation.trim()) {
      newErrors.relation = 'Relation is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/family-members/${member._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      
      onSuccess()
    } catch (error) {
      console.error('Error updating family member:', error)
      toast.error('Could not update family member')
      setIsSubmitting(false)
    }
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
                    Edit Family Member
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
                    <label htmlFor="name" className="block mb-2 font-medium">
                      Name
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
                    <label htmlFor="relation" className="block mb-2 font-medium">
                      Relation
                    </label>
                    <select
                      id="relation"
                      name="relation"
                      className={`input ${errors.relation ? 'border-red-500' : ''}`}
                      value={formData.relation}
                      onChange={handleChange}
                    >
                      <option value="">Select relation</option>
                      <option value="Son">Son</option>
                      <option value="Daughter">Daughter</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Brother">Brother</option>
                      <option value="Sister">Sister</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.relation && <p className="mt-1 text-red-500 text-sm">{errors.relation}</p>}
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="phone" className="block mb-2 font-medium">
                      Phone Number (Optional)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Phone className="text-gray-400" size={18} />
                      </div>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="input pl-10"
                        placeholder="+1 (555) 123-4567"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
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
                      disabled={isSubmitting}
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
