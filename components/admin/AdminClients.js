
'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '@/components/auth/AuthProvider'
import { 
  Users, 
  User, 
  Phone, 
  Mail, 
  Calendar,
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminClients() {
  const { user } = useAuth()
  const [clients, setClients] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedClient, setSelectedClient] = useState(null)
  const [clientDetails, setClientDetails] = useState(null)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)
  
  const CLIENTS_PER_PAGE = 10
  
  useEffect(() => {
    fetchClients()
  }, [currentPage, searchTerm])
  
  const fetchClients = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/clients`,
        {
          params: { 
            page: currentPage, 
            limit: CLIENTS_PER_PAGE,
            search: searchTerm
          },
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      )
      
      setClients(response.data.clients)
      setTotalPages(response.data.totalPages)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching clients:', error)
      toast.error('Could not load clients')
      setIsLoading(false)
    }
  }
  
  const fetchClientDetails = async (clientId) => {
    setIsLoadingDetails(true)
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/clients/${clientId}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      )
      
      setClientDetails(response.data)
      setIsLoadingDetails(false)
    } catch (error) {
      console.error('Error fetching client details:', error)
      toast.error('Could not load client details')
      setIsLoadingDetails(false)
    }
  }
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1) // Reset to first page on new search
  }
  
  const handleClientSelect = (client) => {
    setSelectedClient(client)
    fetchClientDetails(client._id)
  }
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }
  
  return (
    <div>
      <h2 className="text-2xl font-serif font-bold mb-6">Clients</h2>
      
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="text-gray-400" size={18} />
          </div>
          <input
            type="text"
            className="input pl-10"
            placeholder="Search clients by name, email or phone..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/2">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
            </div>
          ) : clients.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-black-700">
                      <th className="text-left py-3 px-4 font-medium">Name</th>
                      <th className="text-left py-3 px-4 font-medium">Email</th>
                      <th className="text-left py-3 px-4 font-medium">Phone</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client) => (
                      <tr 
                        key={client._id} 
                        className={`border-b border-black-700 hover:bg-black-800 cursor-pointer ${
                          selectedClient?._id === client._id ? 'bg-gold-500/10' : ''
                        }`}
                        onClick={() => handleClientSelect(client)}
                      >
                        <td className="py-3 px-4 font-medium">{client.name}</td>
                        <td className="py-3 px-4 text-gray-300">{client.email}</td>
                        <td className="py-3 px-4 text-gray-300">{client.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-400">
                  Showing {clients.length} of {CLIENTS_PER_PAGE * totalPages} clients
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-md ${
                      currentPage === 1 
                        ? 'text-gray-600 cursor-not-allowed' 
                        : 'hover:bg-black-700 text-gray-300'
                    }`}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span className="flex items-center px-2">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-md ${
                      currentPage === totalPages 
                        ? 'text-gray-600 cursor-not-allowed' 
                        : 'hover:bg-black-700 text-gray-300'
                    }`}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 bg-black-800 rounded-lg">
              <Users className="mx-auto text-gray-500 mb-4" size={48} />
              <p className="text-gray-300">No clients found.</p>
              {searchTerm && (
                <p className="text-gray-400 mt-2">
                  Try adjusting your search terms.
                </p>
              )}
            </div>
          )}
        </div>
        
        <div className="lg:w-1/2">
          {selectedClient ? (
            isLoadingDetails ? (
              <div className="flex justify-center items-center h-64 bg-black-800 rounded-lg">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gold-500"></div>
              </div>
            ) : clientDetails ? (
              <div className="card">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-gold-500/20 flex items-center justify-center mr-4">
                    <User className="text-gold-500" size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium">{clientDetails.client.name}</h3>
                    <p className="text-gray-400">Client since {new Date(clientDetails.client.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center">
                    <Mail className="text-gold-500 mr-3" size={18} />
                    <span>{clientDetails.client.email}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Phone className="text-gold-500 mr-3" size={18} />
                    <span>{clientDetails.client.phone}</span>
                  </div>
                </div>
                
                <div className="gold-divider mb-6"></div>
                
                <div className="mb-6">
                  <h4 className="text-lg font-medium mb-4">Family Members</h4>
                  
                  {clientDetails.familyMembers.length > 0 ? (
                    <div className="space-y-3">
                      {clientDetails.familyMembers.map(member => (
                        <div key={member._id} className="flex items-center p-3 bg-black-800 rounded-lg">
                          <div className="w-10 h-10 rounded-full bg-black-700 flex items-center justify-center mr-3">
                            <span className="text-gold-500">{member.name.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-gray-400">{member.relation}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400">No family members added.</p>
                  )}
                </div>
                
                <div>
                  <h4 className="text-lg font-medium mb-4">Recent Appointments</h4>
                  
                  {clientDetails.appointments.length > 0 ? (
                    <div className="space-y-3">
                      {clientDetails.appointments.map(appointment => (
                        <div key={appointment._id} className="p-3 bg-black-800 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <Calendar className="text-gold-500 mr-2" size={16} />
                              <span>{new Date(appointment.date).toLocaleDateString()}</span>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              appointment.status === 'confirmed' 
                                ? 'bg-green-500/20 text-green-500' 
                                : appointment.status === 'cancelled' 
                                  ? 'bg-red-500/20 text-red-500'
                                  : 'bg-blue-500/20 text-blue-500'
                            }`}>
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </span>
                          </div>
                          
                          <p className="font-medium">{appointment.service.name}</p>
                          {appointment.familyMember && (
                            <p className="text-sm text-gray-400">
                              For: {appointment.familyMember.name}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400">No appointments found.</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-black-800 rounded-lg">
                <p className="text-gray-300">Could not load client details.</p>
              </div>
            )
          ) : (
            <div className="text-center py-12 bg-black-800 rounded-lg">
              <User className="mx-auto text-gray-500 mb-4" size={48} />
              <p className="text-gray-300">Select a client to view details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
