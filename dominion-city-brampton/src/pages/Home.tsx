import Hero from '../components/Hero'
import ServiceInfo from '../components/ServiceInfo'
import EventsCarousel from '../components/EventsCarousel'
import ConnectionOptions from '../components/ConnectionOptions'
import SpecialFeatures from '../components/SpecialFeatures'
import ContactInfo from '../components/ContactInfo'

const Home = () => {
    return (
        <>
            <Hero />
            <ServiceInfo />
            <EventsCarousel />
            <ConnectionOptions />
            <SpecialFeatures />
            <ContactInfo />
        </>
    )
}

export default Home