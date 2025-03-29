
import { Scissors, Clock, DollarSign } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function ServicesPage() {
  const services = [
    {
      id: 1,
      name: "Kid Cut",
      duration: 30,
      price: 25,
      description: "Perfect haircut for children under 12, gentle and patient approach. Includes wash, cut, and style.",
      features: [
        "Child-friendly experience",
        "Gentle approach",
        "Styling tips for parents",
        "Complimentary lollipop"
      ],
      image: "/images/kid-cut.jpg"
    },
    {
      id: 2,
      name: "Men Cut",
      duration: 45,
      price: 35,
      description: "Classic men's haircut with precision and attention to detail. Includes consultation, wash, cut, and styling.",
      features: [
        "Personalized consultation",
        "Hot towel treatment",
        "Styling with premium products",
        "Neck and sideburn trim"
      ],
      image: "/images/men-cut.jpg"
    },
    {
      id: 3,
      name: "Men + Beard Cut",
      duration: 60,
      price: 45,
      description: "Complete grooming package with haircut and beard trim/styling. The full Matan Elbaz experience.",
      features: [
        "Full haircut service",
        "Beard shaping and styling",
        "Hot towel treatment",
        "Beard oil application"
      ],
      image: "/images/beard-cut.jpg"
    },
    {
      id: 4,
      name: "Scissors Cut",
      duration: 60,
      price: 50,
      description: "Premium scissors-only cut for a refined, textured finish. Perfect for longer styles and detailed work.",
      features: [
        "Scissors-only technique",
        "Texture and layering",
        "Styling consultation",
        "Premium hair products"
      ],
      image: "/images/scissors-cut.jpg"
    }
  ]

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h1 className="heading-lg mb-4">Our Premium <span className="text-gold-500">Services</span></h1>
        <div className="gold-divider w-24 mx-auto mb-6"></div>
        <p className="text-lg max-w-2xl mx-auto text-gray-300">
          At Matan Elbaz Barbershop, we offer a range of premium services tailored to your needs. Each service is delivered with precision, care, and our signature touch of excellence.
        </p>
      </div>

      <div className="space-y-16">
        {services.map((service, index) => (
          <div key={service.id} className="card overflow-hidden">
            <div className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8`}>
              <div className="lg:w-2/5 relative">
                <div className="aspect-[4/3] w-full relative rounded-lg overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    style={{objectFit: 'cover'}}
                    className="transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </div>
              
              <div className="lg:w-3/5">
                <h2 className="heading-md mb-4 text-gold-500">{service.name}</h2>
                
                <div className="flex flex-wrap gap-6 mb-6">
                  <div className="flex items-center gap-2">
                    <Clock className="text-gold-500" size={20} />
                    <span>{service.duration} minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="text-gold-500" size={20} />
                    <span>${service.price}</span>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-6">{service.description}</p>
                
                <h3 className="text-xl font-medium mb-4">Service Includes:</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Scissors className="text-gold-500 mt-1 flex-shrink-0" size={16} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link href="/booking" className="btn-primary">
                  Book This Service
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
