import Hero from './components/Hero'
import ServiceInfo from './components/ServiceInfo'
import EventsCarousel from './components/EventsCarousel'
import ConnectionOptions from './components/ConnectionOptions'
import SpecialFeatures from './components/SpecialFeatures'
import ContactInfo from './components/ContactInfo'

export default function Home() {
  return (
    <main className="pt-16">
      <Hero />
      <ServiceInfo />
      <EventsCarousel />
      <ConnectionOptions />
      <SpecialFeatures />
      <ContactInfo />
    </main>
  )
}

