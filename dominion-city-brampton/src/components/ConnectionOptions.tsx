const ConnectionOptions = () => {
  return (
      <section id="connect" className="w-full py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Connect With Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">First Timers</h3>
              <iframe src="https://dominioncitycanada.churchcenter.com/people/forms/682759" width="100%" height="400"
                      frameBorder="0"></iframe>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Membership</h3>
              <iframe src="https://dominioncitycanada.churchcenter.com/people/forms/682771" width="100%" height="400"
                      frameBorder="0"></iframe>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Partnership</h3>
              <iframe src="https://dominioncitycanada.churchcenter.com/people/forms/861224" width="100%" height="400"
                      frameBorder="0"></iframe>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Cell Group Sign-up</h3>
              <iframe src="https://dominioncitycanada.churchcenter.com/people/forms/868630" width="100%" height="400"
                      frameBorder="0"></iframe>
            </div>
          </div>
        </div>
      </section>
  )
}

export default ConnectionOptions

