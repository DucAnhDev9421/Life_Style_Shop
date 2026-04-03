import HeroSection from '../components/luxury/HeroSection'
import BrandStorySection from '../components/luxury/BrandStorySection'
import CuratedProductsSection from '../components/luxury/CuratedProductsSection'
import BrandValuesSection from '../components/luxury/BrandValuesSection'
import MembershipCTA from '../components/luxury/MembershipCTA'

const HomePage = () => {
  return (
    <div className="bg-[#fbfbfd]">
      <HeroSection />
      <BrandValuesSection />
      <CuratedProductsSection />
      <BrandStorySection />
      <MembershipCTA />
      
      {/* Tech Footer */}
      <footer className="bg-[#f5f5f7] py-10 px-6 border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto">
          <div className="border-b border-gray-300 pb-8 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-2">
              <div className="w-3 h-3 bg-black rounded-sm" /> LIFESTYLE TECH
            </h2>
            <div className="flex gap-6 text-xs text-gray-600 font-medium tracking-wide">
              <a href="#" className="hover:text-black">Store</a>
              <a href="#" className="hover:text-black">Mac</a>
              <a href="#" className="hover:text-black">iPad</a>
              <a href="#" className="hover:text-black">iPhone</a>
              <a href="#" className="hover:text-black">Support</a>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-medium">
            <p>Copyright © 2026 Lifestyle Tech Inc. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-black border-r border-gray-300 pr-4">Privacy Policy</a>
              <a href="#" className="hover:text-black border-r border-gray-300 pr-4">Terms of Use</a>
              <a href="#" className="hover:text-black border-r border-gray-300 pr-4">Sales Policy</a>
              <a href="#" className="hover:text-black">Legal</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
