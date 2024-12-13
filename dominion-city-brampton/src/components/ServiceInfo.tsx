const ServiceInfo = () => {
  return (
    <section id="services" className="py-16 bg-gray-100">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-8">Service Information</h2>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <p className="text-xl mb-4">Sunday Service Time: <span className="font-semibold">12pm EST</span></p>
          <p className="text-xl">Location: <span className="font-semibold">Unit 4, 1900 Clark Blvd Brampton ON L6T 0E9</span></p>
        </div>
      </div>
    </section>
  )
}

export default ServiceInfo

