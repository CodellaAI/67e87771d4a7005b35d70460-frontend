
import { useState, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X, AlertTriangle } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function DeleteFamilyMemberModal({ member, onClose, onSuccess, token }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleDelete = async () => {
    setIsSubmitting(true)
    
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/family-members/${member._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      
      onSuccess()
    } catch (error) {
      console.error('Error deleting family member:', error)
      toast.error('Could not delete family member')
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
                    className="text-xl font-medium leading-6 text-red-500"
                  >
                    Remove Family Member
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="flex items-center gap-3 mb-4 p-3 bg-red-500/10 rounded-md border border-red-500/30">
                  <AlertTriangle className="text-red-500 flex-shrink-0" size={24} />
                  <p className="text-sm">
                    Are you sure you want to remove this family member? This action cannot be undone.
                  </p>
                </div>
                
                <div className="bg-black-700 p-4 rounded-md mb-6">
                  <h4 className="font-medium mb-1">{member.name}</h4>
                  <p className="text-sm text-gray-400">{member.relation}</p>
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
                    type="button"
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Removing...
                      </div>
                    ) : (
                      'Remove'
                    )}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
