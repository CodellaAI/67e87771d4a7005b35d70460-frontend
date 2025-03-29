
import Link from 'next/link'
import Image from 'next/image'
import { Calendar } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/cta-bg.jpg"
          alt="Background"
          fill
          style={{objectFit: 'cover'}}
          className="brightness-25"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-black-900/90 to-black-900/70 z-0"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="heading-lg mb-6">Experience the <span className="text-gold-500">Matan Elbaz</span> Difference</h2>
          <p className="text-xl mb-8 text-gray-300">
            Join our community of satisfied clients and discover why we're the premier choice for discerning gentlemen.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/booking" className="btn-primary flex items-center gap-2">
              <Calendar size={20} />
              Book Your Appointment
            </Link>
            <Link href="/services" className="btn-secondary">
              Explore Our Services
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
