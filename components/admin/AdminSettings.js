
'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '@/components/auth/AuthProvider'
import { 
  Clock, 
  Calendar, 
  Save,
  User,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminSettings() {
  const { user, updateUserProfile } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [businessHours, setBusinessHours] = useState({
    monday: { start: '09:00', end: '19:00', closed: false },
    tuesday: { start: '09:00', end: '19:00', closed: false },
    wednesday: { start: '09:00', end: '19:00', closed: false },
    thursday: { start: '09:00', end: '19:00', closed: false },
    friday: { start: '09:00', end: '19:00', closed: false },
    saturday: { start: '10:00', end: '18:00', closed: false },
    sunday: { start: '10:00', end: '18:00', closed: true }
  })
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  })
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  })
  
  const [isSavingHours, setIsSavingHours] = useState(false)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [isSavingPassword, setIsSavingPassword] = useState(false)
  
  useEffect(() => {
    fetchBusinessHours()
  }, [])
  
  const fetchBusinessHours = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/settings/business-hours`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      )
      
      if (response.data) {
        setBusinessHours(response.data)
      }
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching business hours:', error)
      toast.error('Could not load business hours')
      setIsLoading(false)
    }
  }
  
  const handleBusinessHoursChange = (day, field, value) => {
    setBusinessHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: field === 'closed' ? !prev[day].closed : value
      }
    }))
  }
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const toggleShowPassword = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }
  
  const saveBusinessHours = async () => {
    setIsSavingHours(true)
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/settings/business-hours`,
        businessHours,
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      )
      
      toast.success('Business hours updated successfully')
      setIsSavingHours(false)
    } catch (error) {
      console.error('Error updating business hours:', error)
      toast.error('Could not update business hours')
      setIsSavingHours(false)
    }
  }
  
  const saveProfile = async (e) => {
    e.preventDefault()
    setIsSavingProfile(true)
    
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`,
        profileData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      )
      
      updateUserProfile(response.data)
      toast.success('Profile updated successfully')
      setIsSavingProfile(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Could not update profile')
      setIsSavingProfile(false)
    }
  }
  
  const changePassword = async (e) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    
    setIsSavingPassword(true)
    
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/change-password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      )
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      
      toast.success('Password changed successfully')
      setIsSavingPassword(false)
    } catch (error) {
      console.error('Error changing password:', error)
      toast.error(error.response?.data?.message || 'Could not change password')
      setIsSavingPassword(false)
    }
  }
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
      </div>
    )
  }
  
  return (
    <div>
      <h2 className="text-2xl font-serif font-bold mb-6">Settings</h2>
      
      <div className="space-y-10">
        {/* Business Hours */}
        <div>
          <h3 className="text-xl font-medium mb-4 flex items-center">
            <Clock className="text-gold-500 mr-2" size={20} />
            Business Hours
          </h3>
          
          <div className="card mb-4">
            <div className="space-y-4">
              {Object.entries(businessHours).map(([day, hours]) => (
                <div key={day} className="flex flex-wrap items-center gap-4">
                  <div className="w-28">
                    <span className="font-medium capitalize">{day}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`closed-${day}`}
                      checked={hours.closed}
                      onChange={() => handleBusinessHoursChange(day, 'closed')}
                      className="mr-2 rounded bg-black-700 border-black-600 text-gold-500 focus:ring-gold-500"
                    />
                    <label htmlFor={`closed-${day}`}>Closed</label>
                  </div>
                  
                  {!hours.closed && (
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={hours.start}
                        onChange={(e) => handleBusinessHoursChange(day, 'start', e.target.value)}
                        className="input py-1 px-2 w-32"
                      />
                      <span>to</span>
                      <input
                        type="time"
                        value={hours.end}
                        onChange={(e) => handleBusinessHoursChange(day, 'end', e.target.value)}
                        className="input py-1 px-2 w-32"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={saveBusinessHours}
                className="btn-primary flex items-center gap-2"
                disabled={isSavingHours}
              >
                {isSavingHours ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-black-900 mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  <>
                    <Save size={18} />
                    Save Business Hours
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Profile Settings */}
        <div>
          <h3 className="text-xl font-medium mb-4 flex items-center">
            <User className="text-gold-500 mr-2" size={20} />
            Profile Settings
          </h3>
          
          <div className="card mb-4">
            <form onSubmit={saveProfile}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block mb-2 font-medium">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="input"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block mb-2 font-medium">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="input"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block mb-2 font-medium">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="input"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                    required
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="btn-primary flex items-center gap-2"
                  disabled={isSavingProfile}
                >
                  {isSavingProfile ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-black-900 mr-2"></div>
                      Saving...
                    </div>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Profile
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Change Password */}
        <div>
          <h3 className="text-xl font-medium mb-4 flex items-center">
            <Lock className="text-gold-500 mr-2" size={20} />
            Change Password
          </h3>
          
          <div className="card">
            <form onSubmit={changePassword}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block mb-2 font-medium">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.current ? "text" : "password"}
                      id="currentPassword"
                      name="currentPassword"
                      className="input pr-10"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => toggleShowPassword('current')}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gold-500"
                    >
                      {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="newPassword" className="block mb-2 font-medium">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.new ? "text" : "password"}
                      id="newPassword"
                      name="newPassword"
                      className="input pr-10"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => toggleShowPassword('new')}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gold-500"
                    >
                      {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block mb-2 font-medium">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.confirm ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      className="input pr-10"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => toggleShowPassword('confirm')}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gold-500"
                    >
                      {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {passwordData.newPassword && passwordData.confirmPassword && 
                   passwordData.newPassword !== passwordData.confirmPassword && (
                    <p className="mt-1 text-red-500 text-sm">Passwords do not match</p>
                  )}
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="btn-primary flex items-center gap-2"
                  disabled={isSavingPassword || (passwordData.newPassword !== passwordData.confirmPassword)}
                >
                  {isSavingPassword ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-black-900 mr-2"></div>
                      Saving...
                    </div>
                  ) : (
                    <>
                      <Save size={18} />
                      Change Password
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
