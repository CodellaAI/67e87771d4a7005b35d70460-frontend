
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, User, Calendar, Users, LogOut } from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'
import { Disclosure, Transition } from '@headlessui/react'

export default function Header() {
  const pathname = usePathname()
  const { user, isAuthenticated, logout } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Book Now', href: '/booking' },
    { name: 'Contact', href: '/contact' },
  ]

  const userNavigation = [
    { name: 'My Appointments', href: '/my-appointments', icon: Calendar },
    { name: 'Family Members', href: '/family-members', icon: Users },
  ]

  if (isAuthenticated && user?.role === 'admin') {
    userNavigation.push({ name: 'Admin Portal', href: '/admin', icon: User })
  }

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black-900/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <Disclosure as="nav">
          {({ open }) => (
            <>
              <div className="flex items-center justify-between h-20">
                {/* Logo */}
                <Link href="/" className="flex items-center">
                  <div className="relative h-10 w-40">
                    <Image 
                      src="/images/logo.png" 
                      alt="Matan Elbaz Barbershop"
                      fill
                      style={{objectFit: 'contain'}}
                      priority
                    />
                  </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`text-sm font-medium transition-colors hover:text-gold-500 ${
                        pathname === item.href ? 'text-gold-500' : 'text-white'
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}

                  {isAuthenticated ? (
                    <div className="relative">
                      <button
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        className="flex items-center gap-2 text-sm font-medium text-white hover:text-gold-500 transition-colors"
                      >
                        <span>My Account</span>
                        <div className="w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center text-black-900 font-bold">
                          {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      </button>

                      {/* User dropdown menu */}
                      <Transition
                        show={userMenuOpen}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <div
                          className="absolute right-0 mt-2 w-48 bg-black-800 border border-black-700 rounded-md shadow-lg py-1"
                          onMouseLeave={() => setUserMenuOpen(false)}
                        >
                          <div className="px-4 py-2 border-b border-black-700">
                            <p className="text-sm font-medium text-white">{user?.name}</p>
                            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                          </div>
                          {userNavigation.map((item) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-black-700 hover:text-gold-500"
                            >
                              <item.icon size={16} />
                              {item.name}
                            </Link>
                          ))}
                          <button
                            onClick={logout}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-black-700 hover:text-gold-500 w-full text-left"
                          >
                            <LogOut size={16} />
                            Sign Out
                          </button>
                        </div>
                      </Transition>
                    </div>
                  ) : (
                    <Link
                      href="/login"
                      className="btn-secondary py-2"
                    >
                      Sign In
                    </Link>
                  )}
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden">
                  <Disclosure.Button className="text-gray-300 hover:text-gold-500 focus:outline-none">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <X className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Menu className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>

              {/* Mobile menu */}
              <Disclosure.Panel className="md:hidden">
                <div className="px-2 pt-2 pb-3 space-y-1">
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as={Link}
                      href={item.href}
                      className={`block px-3 py-2 rounded-md text-base font-medium ${
                        pathname === item.href
                          ? 'text-gold-500 bg-black-800'
                          : 'text-gray-300 hover:text-gold-500 hover:bg-black-800'
                      }`}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>

                {isAuthenticated ? (
                  <div className="pt-4 pb-3 border-t border-black-700">
                    <div className="px-4 flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center text-black-900 font-bold text-lg">
                          {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className="text-base font-medium text-white">{user?.name}</div>
                        <div className="text-sm font-medium text-gray-400">{user?.email}</div>
                      </div>
                    </div>
                    <div className="mt-3 px-2 space-y-1">
                      {userNavigation.map((item) => (
                        <Disclosure.Button
                          key={item.name}
                          as={Link}
                          href={item.href}
                          className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-gold-500 hover:bg-black-800"
                        >
                          <item.icon size={18} />
                          {item.name}
                        </Disclosure.Button>
                      ))}
                      <Disclosure.Button
                        as="button"
                        onClick={logout}
                        className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-gold-500 hover:bg-black-800 w-full text-left"
                      >
                        <LogOut size={18} />
                        Sign Out
                      </Disclosure.Button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-4 pb-3 border-t border-black-700 px-4">
                    <Link
                      href="/login"
                      className="w-full btn-secondary flex justify-center items-center"
                    >
                      Sign In
                    </Link>
                    <div className="mt-3">
                      <Link
                        href="/register"
                        className="w-full btn-primary flex justify-center items-center"
                      >
                        Create Account
                      </Link>
                    </div>
                  </div>
                )}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </header>
  )
}
