
import { 
  LayoutDashboard, 
  Calendar, 
  Scissors, 
  Users, 
  Settings, 
  LogOut 
} from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'

export default function AdminSidebar({ activeTab, setActiveTab }) {
  const { logout } = useAuth()
  
  const menuItems = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: LayoutDashboard
    },
    {
      id: 'calendar',
      name: 'Appointments',
      icon: Calendar
    },
    {
      id: 'services',
      name: 'Services',
      icon: Scissors
    },
    {
      id: 'clients',
      name: 'Clients',
      icon: Users
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: Settings
    }
  ]
  
  return (
    <div className="card h-full">
      <div className="space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
              activeTab === item.id
                ? 'bg-gold-500/10 text-gold-500'
                : 'hover:bg-black-800 text-gray-300 hover:text-white'
            }`}
          >
            <item.icon size={20} />
            <span>{item.name}</span>
          </button>
        ))}
      </div>
      
      <div className="mt-auto pt-6 border-t border-black-700 mt-6">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-red-500 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )
}
