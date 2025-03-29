
import Image from 'next/image'
import Link from 'next/link'
import { Scissors, Clock, Star, CalendarDays } from 'lucide-react'
import ServiceCard from '@/components/home/ServiceCard'
import TestimonialCard from '@/components/home/TestimonialCard'
import CTASection from '@/components/home/CTASection'

export default function Home() {
  const services = [
    {
      id: 1,
      name: "Kid Cut",
      duration: 30,
      price: 25,
      description: "Perfect haircut for children under 12, gentle and patient approach."
    },
    {
      id: 2,
      name: "Men Cut",
      duration: 45,
      price: 35,
      description: "Classic men's haircut with precision and attention to detail."
    },
    {
      id: 3,
      name: "Men + Beard Cut",
      duration: 60,
      price: 45,
      description: "Complete grooming package with haircut and beard trim/styling."
    },
    {
      id: 4,
      name: "Scissors Cut",
      duration: 60,
      price: 50,
      description: "Premium scissors-only cut for a refined, textured finish."
    }
  ]

  const testimonials = [
    {
      id: 1,
      name: "David Cohen",
      text: "Matan is a true artist. I've never had a better haircut in my life. The attention to detail is unmatched.",
      rating: 5,
    },
    {
      id: 2,
      name: "Michael Levy",
      text: "The atmosphere is as premium as the service. My son and I both get our haircuts here and always leave looking sharp.",
      rating: 5,
    },
    {
      id: 3,
      name: "Jonathan Berg",
      text: "I've been going to Matan for three years now. The consistency and quality never disappoints.",
      rating: 5,
    }
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-bg.jpg"
            alt="Matan Elbaz Barbershop"
            fill
            priority
            style={{objectFit: 'cover'}}
            className="brightness-50"
          />
        </div>
        <div className="container mx-auto px-4 z-10 relative">
          <div className="max-w-3xl">
            <h1 className="heading-xl mb-4">
              <span className="text-white">Premium Grooming at</span>
              <br />
              <span className="text-gold-500">Matan Elbaz Barbershop</span>
            </h1>
            <p className="text-xl mb-8 text-gray-200">
              Experience the artistry of precision cuts and impeccable styling in a sophisticated atmosphere.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/booking" className="btn-primary">
                Book Appointment
              </Link>
              <Link href="/services" className="btn-secondary">
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-black-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="heading-lg mb-6">
                <span className="text-gold-500">Craftsmanship</span> & <span className="text-gold-500">Style</span>
              </h2>
              <div className="gold-divider w-24 mb-6"></div>
              <p className="text-lg mb-6 text-gray-300">
                At Matan Elbaz Barbershop, we believe that a haircut is more than just a service—it's an experience. Our skilled barbers combine traditional techniques with modern styles to create looks that are uniquely you.
              </p>
              <p className="text-lg mb-8 text-gray-300">
                From the moment you step in, you'll be enveloped in an atmosphere of sophistication and attention to detail that defines the Matan Elbaz experience.
              </p>
              <div className="flex flex-wrap gap-8">
                <div className="flex items-center gap-3">
                  <Scissors className="text-gold-500" size={24} />
                  <span>Expert Barbers</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="text-gold-500" size={24} />
                  <span>Punctual Service</span>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="text-gold-500" size={24} />
                  <span>Premium Experience</span>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <div className="aspect-[3/4] relative rounded-lg overflow-hidden">
                <Image
                  src="/images/about-image.jpg"
                  alt="Matan Elbaz at work"
                  fill
                  style={{objectFit: 'cover'}}
                  className="transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-black-900 p-4 rounded-lg border border-gold-500">
                <p className="text-xl font-bold">10+ Years</p>
                <p className="text-gold-500">of Excellence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="heading-lg mb-4">Our Premium <span className="text-gold-500">Services</span></h2>
            <div className="gold-divider w-24 mx-auto mb-6"></div>
            <p className="text-lg max-w-2xl mx-auto text-gray-300">
              Choose from our selection of premium services, each delivered with the signature Matan Elbaz touch of excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/services" className="btn-secondary">
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Booking CTA */}
      <section className="py-20 bg-black-800 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <Image
            src="/images/pattern-bg.jpg"
            alt="Background pattern"
            fill
            style={{objectFit: 'cover'}}
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="heading-lg mb-6">Ready for Your <span className="text-gold-500">Transformation?</span></h2>
            <p className="text-xl mb-8 text-gray-300">
              Book your appointment today and experience the Matan Elbaz difference. Our online booking system makes it easy to find a time that works for you.
            </p>
            <div className="flex justify-center">
              <Link href="/booking" className="btn-primary flex items-center gap-2">
                <CalendarDays size={20} />
                Book Your Appointment
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="heading-lg mb-4">Client <span className="text-gold-500">Testimonials</span></h2>
            <div className="gold-divider w-24 mx-auto mb-6"></div>
            <p className="text-lg max-w-2xl mx-auto text-gray-300">
              Don't just take our word for it. Here's what our clients have to say about their experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map(testimonial => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <CTASection />
    </div>
  )
}
