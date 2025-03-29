
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-black-900 border-t border-black-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo and description */}
          <div>
            <Link href="/" className="inline-block mb-6">
              <div className="relative h-10 w-40">
                <Image 
                  src="/images/logo.png" 
                  alt="Matan Elbaz Barbershop"
                  fill
                  style={{objectFit: 'contain'}}
                />
              </div>
            </Link>
            <p className="text-gray-400 mb-6">
              Premium barbershop providing exceptional grooming services with attention to detail and personalized care.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gold-500 transition-colors">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gold-500 transition-colors">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gold-500 transition-colors">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </a>
            </div>
          </div>
          
          {/* Quick links */}
          <div>
            <h3 className="text-lg font-serif font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-400 hover:text-gold-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-400 hover:text-gold-500 transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/booking" className="text-gray-400 hover:text-gold-500 transition-colors">
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link href="/my-appointments" className="text-gray-400 hover:text-gold-500 transition-colors">
                  My Appointments
                </Link>
              </li>
              <li>
                <Link href="/family-members" className="text-gray-400 hover:text-gold-500 transition-colors">
                  Family Members
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact information */}
          <div>
            <h3 className="text-lg font-serif font-bold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="text-gold-500 mr-3 mt-1 flex-shrink-0" size={18} />
                <span className="text-gray-400">123 Style Street, Fashion District, New York, NY 10001</span>
              </li>
              <li className="flex items-center">
                <Phone className="text-gold-500 mr-3 flex-shrink-0" size={18} />
                <a href="tel:+12125551234" className="text-gray-400 hover:text-gold-500 transition-colors">
                  (212) 555-1234
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="text-gold-500 mr-3 flex-shrink-0" size={18} />
                <a href="mailto:info@matanelbaz.com" className="text-gray-400 hover:text-gold-500 transition-colors">
                  info@matanelbaz.com
                </a>
              </li>
            </ul>
          </div>
          
          {/* Business hours */}
          <div>
            <h3 className="text-lg font-serif font-bold mb-6">Business Hours</h3>
            <ul className="space-y-3">
              <li className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="text-gold-500 mr-3 flex-shrink-0" size={18} />
                  <span className="text-gray-400">Monday - Friday</span>
                </div>
                <span className="text-white">9:00 - 19:00</span>
              </li>
              <li className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="text-gold-500 mr-3 flex-shrink-0" size={18} />
                  <span className="text-gray-400">Saturday</span>
                </div>
                <span className="text-white">10:00 - 18:00</span>
              </li>
              <li className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="text-gold-500 mr-3 flex-shrink-0" size={18} />
                  <span className="text-gray-400">Sunday</span>
                </div>
                <span className="text-white">Closed</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="gold-divider my-8"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {currentYear} Matan Elbaz Barbershop. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="/privacy-policy" className="text-gray-400 hover:text-gold-500 transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-gray-400 hover:text-gold-500 transition-colors text-sm">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
