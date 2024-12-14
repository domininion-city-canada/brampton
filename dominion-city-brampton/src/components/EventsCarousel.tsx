'use client'
import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const events = [
  { id: 1, title: 'Sunday Service', date: 'Every Sunday', time: '12:00 PM' },
  { id: 2, title: 'Discovery Bible Study', date: 'Every Wednesday', time: '8:00 PM' },
  { id: 3, title: 'Threshing Floor', date: 'Last Friday of the month', time: '11:30 PM' },
  { id: 4, title: 'Living Waters', date: 'Every Saturday', time: '10:00 AM' }
]

const EventsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + events.length) % events.length)
  }

  return (
      <section id="events" className="w-full py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Upcoming Events</h2>
          <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <div className="flex transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
              {events.map((event) => (
                <div key={event.id} className="w-full flex-shrink-0">
                  <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                    <p className="text-gray-600 mb-2">{event.date}</p>
                    <p className="text-gray-600 mb-4">{event.time}</p>
                    <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300">
                      RSVP
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
          >
            <ChevronLeft className="w-6 h-6 text-blue-600" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
          >
            <ChevronRight className="w-6 h-6 text-blue-600" />
          </button>
        </div>
      </div>
    </section>
  )
}

export default EventsCarousel

