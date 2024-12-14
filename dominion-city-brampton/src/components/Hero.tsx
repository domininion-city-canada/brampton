import { Link } from 'react-router-dom'

const Hero = () => {
  return (
      <section id="home" className="relative w-full bg-blue-600 text-white py-20 md:py-32">
          <div className="container mx-auto px-4 text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">Dominion City Brampton</h1>
              <p className="text-xl md:text-2xl mb-8">Raising leaders that transform society</p>
              <Link to="#connect"
                    className="inline-block bg-white text-blue-600 py-3 px-8 rounded-full text-lg font-semibold hover:bg-blue-100 transition duration-300">
                  Join Our Community
              </Link>
          </div>
      </section>
  )
}

export default Hero