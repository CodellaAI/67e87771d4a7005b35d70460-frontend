
import { useState } from 'react'
import { User, UserPlus, Users } from 'lucide-react'
import Link from 'next/link'

export default function FamilyMemberSelection({ familyMembers, onSelect, onSelfSelect }) {
  const [selectedMemberId, setSelectedMemberId] = useState(null)
  
  const handleSelectMember = (member) => {
    setSelectedMemberId(member._id)
    setTimeout(() => onSelect(member), 300) // Small delay for animation
  }
  
  return (
    <div>
      <h2 className="text-2xl font-serif font-bold mb-6">Who is this appointment for?</h2>
      
      <div className="mb-6">
        <button
          onClick={onSelfSelect}
          className="w-full p-4 border border-black-700 rounded-lg text-left mb-4 hover:border-gold-500/50 hover:bg-black-800 transition-all"
        >
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center mr-3">
              <User className="text-gold-500" size={20} />
            </div>
            <div>
              <p className="font-medium">Myself</p>
              <p className="text-sm text-gray-400">Book this appointment for yourself</p>
            </div>
          </div>
        </button>
        
        {familyMembers.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-medium mb-2 flex items-center">
              <Users className="text-gold-500 mr-2" size={18} />
              Family Members
            </h3>
            
            {familyMembers.map((member) => (
              <div
                key={member._id}
                onClick={() => handleSelectMember(member)}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedMemberId === member._id
                    ? 'border-gold-500 bg-gold-500/5'
                    : 'border-black-700 hover:border-gold-500/50 hover:bg-black-800'
                }`}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-black-700 flex items-center justify-center mr-3">
                    <span className="text-gold-500 font-medium">{member.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-gray-400">{member.relation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="bg-black-800 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <UserPlus className="text-gold-500 mt-1 mr-3 flex-shrink-0" size={20} />
          <div>
            <p className="font-medium mb-2">Add a family member</p>
            <p className="text-sm text-gray-400 mb-3">
              You can add family members to easily book appointments for them in the future.
            </p>
            <Link href="/family-members" className="text-gold-500 text-sm hover:underline">
              Manage family members
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
