
'use client'

import { useState, useEffect, Fragment } from 'react'
import axios from 'axios'
import { useAuth } from '@/components/auth/AuthProvider'
import { 
  Scissors, 
  Clock, 
  DollarSign, 
  Plus, 
  Edit, 
  Trash2,
  X
} from 'lucide-react'
import { Dialog, Transition } from '@headlessui/react'
import toast from 'react-hot-toast'

export default function AdminServices() {
  const { user } = useAuth()
  const [services, setServices] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [currentService, setCurrentService] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: 30,
    price: 0
  })
  
  useEffect(() => {
    fetchServices()
  }, [])
  
  const fetchServices = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/services`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      )
      
      setServices(response.data)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching services:', error)
      toast.error('Could not load services')
      setIsLoading(false)
    }
  }
  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === 'duration' || name === 'price' ? Number(value) : value
    })
  }
  
  const handleAddService = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/services`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      )
      
      setIsAddModalOpen(false)
      resetForm()
      fetchServices()
      toast.success('Service added successfully')
    } catch (error) {
      console.error('Error adding service:', error)
      toast.error('Could not add service')
    }
  }
  
  const handleEditService = async () => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/services/${currentService._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      )
      
      setIsEditModalOpen(false)
      resetForm()
      fetchServices()
      toast.success('Service updated successfully')
    } catch (error) {
      console.error('Error updating service:', error)
      toast.error('Could not update service')
    }
  }
  
  const handleDeleteService = async () => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/services/${currentService._id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      )
      
      setIsDeleteModalOpen(false)
      fetchServices()
      toast.success('Service deleted successfully')
    } catch (error) {
      console.error('Error deleting service:', error)
      toast.error('Could not delete service')
    }
  }
  
  const openEditModal = (service) => {
    setCurrentService(service)
    setFormData({
      name: service.name,
      description: service.description,
      duration: service.duration,
      price: service.price
    })
    setIsEditModalOpen(true)
  }
  
  const openDeleteModal = (service) => {
    setCurrentService(service)
    setIsDeleteModalOpen(true)
  }
  
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      duration: 30,
      price: 0
    })
    setCurrentService(null)
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif font-bold">Services</h2>
        
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary py-2 flex items-center gap-2"
        >
          <Plus size={18} />
          Add Service
        </button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
        </div>
      ) : services.length > 0 ? (
        <div className="space-y-4">
          {services.map(service => (
            <div key={service._id} className="card hover:shadow-premium transition-all">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-xl font-medium mb-2">{service.name}</h3>
                  
                  <div className="flex flex-wrap gap-4 mb-2">
                    <div className="flex items-center">
                      <Clock className="text-gold-500 mr-2" size={16} />
                      <span>{service.duration} minutes</span>
                    </div>
                    
                    <div className="flex items-center">
                      <DollarSign className="text-gold-500 mr-2" size={16} />
                      <span>${service.price}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-400">{service.description}</p>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(service)}
                    className="p-2 rounded-md bg-black-800 hover:bg-black-700 transition-colors"
                    title="Edit service"
                  >
                    <Edit size={18} className="text-gold-500" />
                  </button>
                  <button
                    onClick={() => openDeleteModal(service)}
                    className="p-2 rounded-md bg-black-800 hover:bg-black-700 transition-colors"
                    title="Delete service"
                  >
                    <Trash2 size={18} className="text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-black-800 rounded-lg">
          <Scissors className="mx-auto text-gray-500 mb-4" size={48} />
          <p className="text-gray-300 mb-4">No services have been added yet.</p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary"
          >
            Add Your First Service
          </button>
        </div>
      )}
      
      {/* Add Service Modal */}
      <Transition appear show={isAddModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsAddModalOpen(false)}>
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
                      Add New Service
                    </Dialog.Title>
                    <button
                      onClick={() => setIsAddModalOpen(false)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block mb-2 font-medium">
                        Service Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="input"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Men's Haircut"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="description" className="block mb-2 font-medium">
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        rows="3"
                        className="input"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Describe the service..."
                      ></textarea>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="duration" className="block mb-2 font-medium">
                          Duration (minutes)
                        </label>
                        <input
                          type="number"
                          id="duration"
                          name="duration"
                          className="input"
                          value={formData.duration}
                          onChange={handleInputChange}
                          min="5"
                          step="5"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="price" className="block mb-2 font-medium">
                          Price ($)
                        </label>
                        <input
                          type="number"
                          id="price"
                          name="price"
                          className="input"
                          value={formData.price}
                          onChange={handleInputChange}
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      className="btn-secondary py-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleAddService}
                      className="btn-primary py-2"
                    >
                      Add Service
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      
      {/* Edit Service Modal */}
      <Transition appear show={isEditModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsEditModalOpen(false)}>
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
                      Edit Service
                    </Dialog.Title>
                    <button
                      onClick={() => setIsEditModalOpen(false)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="edit-name" className="block mb-2 font-medium">
                        Service Name
                      </label>
                      <input
                        type="text"
                        id="edit-name"
                        name="name"
                        className="input"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="edit-description" className="block mb-2 font-medium">
                        Description
                      </label>
                      <textarea
                        id="edit-description"
                        name="description"
                        rows="3"
                        className="input"
                        value={formData.description}
                        onChange={handleInputChange}
                      ></textarea>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="edit-duration" className="block mb-2 font-medium">
                          Duration (minutes)
                        </label>
                        <input
                          type="number"
                          id="edit-duration"
                          name="duration"
                          className="input"
                          value={formData.duration}
                          onChange={handleInputChange}
                          min="5"
                          step="5"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="edit-price" className="block mb-2 font-medium">
                          Price ($)
                        </label>
                        <input
                          type="number"
                          id="edit-price"
                          name="price"
                          className="input"
                          value={formData.price}
                          onChange={handleInputChange}
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      className="btn-secondary py-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleEditService}
                      className="btn-primary py-2"
                    >
                      Save Changes
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      
      {/* Delete Service Modal */}
      <Transition appear show={isDeleteModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsDeleteModalOpen(false)}>
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
                      Delete Service
                    </Dialog.Title>
                    <button
                      onClick={() => setIsDeleteModalOpen(false)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="py-4">
                    <p className="mb-4">
                      Are you sure you want to delete the service "{currentService?.name}"? This action cannot be undone.
                    </p>
                    
                    <p className="text-gray-400 text-sm mb-2">
                      This may affect existing appointments that use this service.
                    </p>
                  </div>
                  
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsDeleteModalOpen(false)}
                      className="btn-secondary py-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteService}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
                    >
                      Delete Service
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}
