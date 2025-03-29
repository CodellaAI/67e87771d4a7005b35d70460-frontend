
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { Users, UserPlus, User, Edit, Trash2, AlertCircle } from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'
import FamilyMemberCard from '@/components/family/FamilyMemberCard'
import AddFamilyMemberModal from '@/components/family/AddFamilyMemberModal'
import EditFamilyMemberModal from '@/components/family/EditFamilyMemberModal'
import DeleteFamilyMemberModal from '@/components/family/DeleteFamilyMemberModal'
import toast from 'react-hot-toast'

export default function FamilyMembersPage() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  
  const [familyMembers, setFamilyMembers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingMember, setEditingMember] = useState(null)
  const [deletingMember, setDeletingMember] = useState(null)
  
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login?redirect=/family-members')
      return
    }

    if (isAuthenticated && user) {
      fetchFamilyMembers()
    }
  }, [isAuthenticated, user, loading, router])

  const fetchFamilyMembers = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/family-members`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      )
      setFamilyMembers(response.data)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching family members:', error)
      toast.error('Could not load your family members. Please try again.')
      setIsLoading(false)
    }
  }

  const handleAddSuccess = () => {
    setIsAddModalOpen(false)
    fetchFamilyMembers()
    toast.success('Family member added successfully!')
  }

  const handleEditSuccess = () => {
    setEditingMember(null)
    fetchFamilyMembers()
    toast.success('Family member updated successfully!')
  }

  const handleDeleteSuccess = () => {
    setDeletingMember(null)
    fetchFamilyMembers()
    toast.success('Family member removed successfully!')
  }

  if (loading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="heading-lg text-center mb-2">My <span className="text-gold-500">Family Members</span></h1>
        <p className="text-center text-gray-300 mb-12">
          Manage family members to easily book appointments for them
        </p>
        
        <div className="flex justify-end mb-8">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <UserPlus size={20} />
            Add Family Member
          </button>
        </div>
        
        {familyMembers.length === 0 ? (
          <div className="card text-center py-12">
            <Users className="mx-auto text-gold-500 mb-4" size={48} />
            <h2 className="heading-sm mb-4">No Family Members Added</h2>
            <p className="text-gray-300 mb-8">
              Add family members to easily book appointments for them at Matan Elbaz Barbershop.
            </p>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="btn-primary"
            >
              Add Your First Family Member
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {familyMembers.map(member => (
              <FamilyMemberCard 
                key={member._id} 
                member={member}
                onEdit={() => setEditingMember(member)}
                onDelete={() => setDeletingMember(member)}
              />
            ))}
          </div>
        )}
      </div>
      
      {isAddModalOpen && (
        <AddFamilyMemberModal
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={handleAddSuccess}
          token={user.token}
        />
      )}
      
      {editingMember && (
        <EditFamilyMemberModal
          member={editingMember}
          onClose={() => setEditingMember(null)}
          onSuccess={handleEditSuccess}
          token={user.token}
        />
      )}
      
      {deletingMember && (
        <DeleteFamilyMemberModal
          member={deletingMember}
          onClose={() => setDeletingMember(null)}
          onSuccess={handleDeleteSuccess}
          token={user.token}
        />
      )}
    </div>
  )
}
