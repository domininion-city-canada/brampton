import { Link } from 'react-router-dom'

const SpecialFeatures = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8">
          <Link to="/cell-group-assignment" className="bg-blue-600 text-white py-3 px-8 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300">
            Join a Cell Group
          </Link>
          <a href="https://substack.com/@dominionmandate?r=1j2lfo&u" target="_blank" rel="noopener noreferrer" className="bg-green-600 text-white py-3 px-8 rounded-full text-lg font-semibold hover:bg-green-700 transition duration-300">
            Daily Devotional
          </a>
        </div>
      </div>
    </section>
  )
}

export default SpecialFeatures