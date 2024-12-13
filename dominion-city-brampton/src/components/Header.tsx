import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/">
          <img src="/dc-logo.png" alt="Dominion City Brampton Logo" width={30} height={10} />
        </Link>
        <nav className="hidden md:flex space-x-6">
          <Link to="#home" className="text-blue-600 hover:text-blue-800">Home</Link>
          <Link to="#about" className="text-blue-600 hover:text-blue-800">About Us</Link>
          <Link to="#services" className="text-blue-600 hover:text-blue-800">Services</Link>
          <Link to="#events" className="text-blue-600 hover:text-blue-800">Events</Link>
          <Link to="#connect" className="text-blue-600 hover:text-blue-800">Connect</Link>
          <Link to="#devotional" className="text-blue-600 hover:text-blue-800">Devotional</Link>
        </nav>
        <button className="md:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  )
}

export default Header