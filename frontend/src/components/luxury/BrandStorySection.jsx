const BrandStorySection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#1d1d1f] tracking-tight mb-4">
            Engineering Marvel.
          </h2>
          <p className="text-xl text-gray-500 font-medium max-w-3xl mx-auto">
            We redesigned the thermal architecture from the ground up to let you push the boundaries of what's possible, without breaking a sweat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#f5f5f7] rounded-3xl p-10 overflow-hidden relative group">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-[#1d1d1f] mb-3">Advanced Cooling</h3>
              <p className="text-gray-500 font-medium w-3/4">
                Dual aerospace-grade fans deliver 50% more airflow.
              </p>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Processor details" 
              className="absolute right-0 bottom-0 w-2/3 h-2/3 object-cover rounded-tl-3xl opacity-90 group-hover:scale-105 transition-transform duration-700"
            />
          </div>

          <div className="bg-[#1d1d1f] text-white rounded-3xl p-10 overflow-hidden relative group">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-3">Retina Display XDR</h3>
              <p className="text-gray-400 font-medium w-3/4">
                1000 nits sustained brightness. 1,000,000:1 contrast ratio.
              </p>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1542393545-10f5cde2c810?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Display colors" 
              className="absolute right-0 bottom-0 w-2/3 h-2/3 object-cover rounded-tl-3xl opacity-80 group-hover:scale-105 transition-transform duration-700 mix-blend-screen"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default BrandStorySection
