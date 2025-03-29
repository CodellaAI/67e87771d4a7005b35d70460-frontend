
import { User, Phone, Pencil, Trash } from 'lucide-react'

export default function FamilyMemberCard({ member, onEdit, onDelete }) {
  return (
    <div className="card hover:shadow-premium transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <div className="mb-4 sm:mb-0">
          <div className="flex items-center mb-2">
            <div className="w-10 h-10 rounded-full bg-black-700 flex items-center justify-center mr-3">
              <span className="text-gold-500 font-medium">{member.name.charAt(0)}</span>
            </div>
            <div>
              <h3 className="text-lg font-medium">{member.name}</h3>
              <p className="text-sm text-gray-400">{member.relation}</p>
            </div>
          </div>
          
          {member.phone && (
            <div className="flex items-center text-sm text-gray-300 ml-13">
              <Phone className="text-gold-500 mr-2" size={14} />
              <span>{member.phone}</span>
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="p-2 rounded-md bg-black-800 hover:bg-black-700 transition-colors"
            title="Edit family member"
          >
            <Pencil size={18} className="text-gold-500" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-md bg-black-800 hover:bg-black-700 transition-colors"
            title="Remove family member"
          >
            <Trash size={18} className="text-red-500" />
          </button>
        </div>
      </div>
    </div>
  )
}
