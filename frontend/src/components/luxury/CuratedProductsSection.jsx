const products = [
  {
    id: 1,
    name: "AirPods Max Pro",
    tagline: "High-level ANC",
    price: "$549.00",
    image: "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    name: "Mechanical Keyboard X",
    tagline: "Tactile Precision",
    price: "$199.00",
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    name: "Pro Display 32\"",
    tagline: "True Color Accuracy",
    price: "$1299.00",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    name: "Smart Watch Gen 4",
    tagline: "Track everything",
    price: "$399.00",
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
];

const CuratedProductsSection = () => {
  return (
    <section className="py-24 bg-[#fbfbfd]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[#1d1d1f] tracking-tight">
            The latest. 
            <span className="text-gray-500"> Take a look at what's new, right now.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl hover:shadow-[#0071e3]/10 transition-shadow duration-300 group cursor-pointer flex flex-col items-center text-center">
              <p className="text-[#0071e3] text-[10px] font-bold uppercase tracking-widest mb-1">
                New
              </p>
              <h3 className="text-lg font-bold text-[#1d1d1f] mb-1">{product.name}</h3>
              <p className="text-xs text-gray-500 mb-6">{product.tagline}</p>
              
              <div className="relative w-full aspect-square mb-6">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              
              <div className="mt-auto w-full flex justify-between items-center bg-[#f5f5f7] rounded-full p-1 pl-4">
                <span className="text-sm font-semibold text-[#1d1d1f]">{product.price}</span>
                <button className="bg-[#1d1d1f] text-white text-xs font-bold px-4 py-2 rounded-full group-hover:bg-[#0071e3] transition-colors">
                  Buy
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CuratedProductsSection
