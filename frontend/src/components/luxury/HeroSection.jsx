import { Button } from 'antd'

const HeroSection = () => {
  return (
    <section className="relative w-full overflow-hidden bg-[#fbfbfd] pt-24 pb-16 flex flex-col items-center">
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-gray-100 to-transparent opacity-50" />
      
      <div className="relative z-10 text-center max-w-4xl px-6 flex flex-col items-center">
        <h2 className="text-[#0071e3] font-semibold text-sm tracking-widest uppercase mb-4">
          The Next Generation
        </h2>
        <h1 className="text-5xl md:text-7xl font-bold text-[#1d1d1f] mb-4 tracking-tight">
          Pro Performance.
          <br className="hidden md:block" />
          <span className="text-gray-400"> Maximum Efficiency.</span>
        </h1>
        <p className="text-xl text-gray-500 mb-10 font-medium max-w-2xl">
          Supercharged by the new M-series architecture. Mind-blowing speed meets all-day battery life.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 mb-20">
          <Button type="primary" size="large" className="px-8 font-semibold text-[15px]">
            Buy Now
          </Button>
          <Button size="large" className="px-8 font-medium text-[15px] border-none text-[#0071e3] bg-[#0071e3]/10 hover:bg-[#0071e3]/20">
            Learn more &gt;
          </Button>
        </div>
      </div>

      <div className="relative z-20 w-full max-w-5xl px-6 mx-auto perspective-1000">
        <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-white shadow-2xl shadow-gray-200/50 border border-gray-100 mx-auto transition-transform duration-1000 hover:scale-[1.02]">
          <img 
            src="https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
            alt="High tech laptop render" 
            className="w-full h-full object-cover"
          />
          {/* Tech Spec Badges */}
          <div className="absolute top-6 left-6 glass px-4 py-2 rounded-full border border-white/20 bg-white/60 backdrop-blur-md shadow-sm">
            <span className="text-xs font-mono font-bold text-gray-800">12-core CPU</span>
          </div>
          <div className="absolute bottom-6 right-6 glass px-4 py-2 rounded-full border border-white/20 bg-white/60 backdrop-blur-md shadow-sm">
            <span className="text-xs font-mono font-bold text-gray-800">Upto 32GB Unified RAM</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
