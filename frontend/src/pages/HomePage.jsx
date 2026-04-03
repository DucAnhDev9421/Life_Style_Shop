import HeroSection from '../components/luxury/HeroSection'
import BrandStorySection from '../components/luxury/BrandStorySection'
import CuratedProductsSection from '../components/luxury/CuratedProductsSection'
import BrandValuesSection from '../components/luxury/BrandValuesSection'
import MembershipCTA from '../components/luxury/MembershipCTA'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const HomePage = () => {
  const { t } = useTranslation()

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
              <div className="w-3 h-3 bg-[#0071e3] rounded-sm" /> LIFESTYLE TECH
            </h2>
            <div className="flex gap-6 text-xs text-gray-600 font-medium tracking-wide">
              <Link to="/search" className="hover:text-[#0071e3] transition-colors">{t('footer.store')}</Link>
              <Link to="/mac" className="hover:text-[#0071e3] transition-colors">{t('footer.mac')}</Link>
              <Link to="/ipad" className="hover:text-[#0071e3] transition-colors">{t('footer.ipad')}</Link>
              <Link to="/blog" className="hover:text-[#0071e3] transition-colors">{t('footer.newsroom')}</Link>
              <Link to="/support" className="hover:text-[#0071e3] transition-colors">{t('footer.support')}</Link>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-medium">
            <p>{t('footer.copyright')}</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-[#0071e3] border-r border-gray-300 pr-4 transition-colors">{t('footer.privacy')}</a>
              <a href="#" className="hover:text-[#0071e3] border-r border-gray-300 pr-4 transition-colors">{t('footer.terms')}</a>
              <a href="#" className="hover:text-[#0071e3] border-r border-gray-300 pr-4 transition-colors">{t('footer.sales')}</a>
              <a href="#" className="hover:text-[#0071e3] transition-colors">{t('footer.legal')}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
