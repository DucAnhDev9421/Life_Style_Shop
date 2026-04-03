import { Button } from 'antd'
import BlogCard from '../components/common/BlogCard'
import { useTranslation } from 'react-i18next'

const featuredPost = {
  id: 0,
  title: "The Architecture Behind Our Newest M-Series Silicon Processor",
  excerpt: "A deep dive into how changing the internal geometry and incorporating unified memory structures allowed us to deliver performance per watt previously thought impossible in a mobile form factor.",
  category: "Engineering",
  date: "Oct 24, 2026",
  readTime: "8 min",
  image: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
}

const recentPosts = [
  {
    id: 1,
    title: "Why Spatial Audio is the Future of Mixing",
    excerpt: "Exploring the software updates that bring true 3D soundscapes to standard stereo headphones.",
    category: "Software",
    date: "Oct 18, 2026",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1612282130134-49b84fa8004f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    title: "Sustainability Report: 100% Recycled Aluminum",
    excerpt: "How we completely re-engineered our supply chain to hit our zero carbon goals five years early.",
    category: "Corporate",
    date: "Oct 12, 2026",
    readTime: "4 min",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    title: "Designing the Perfect Mechanical Switch",
    excerpt: "The 18-month journey to balance tactile feedback with acoustic dampening for pro typists.",
    category: "Hardware",
    date: "Sep 29, 2026",
    readTime: "12 min",
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
]

const BlogPage = () => {
  const { t } = useTranslation()

  return (
    <div className="bg-[#fbfbfd] min-h-screen">
      {/* Blog Header */}
      <div className="border-b border-gray-200 bg-white pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-5xl font-bold text-[#1d1d1f] tracking-tight mb-6">{t('blog.title')}</h1>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            <Button type="primary" className="rounded-full shadow-none bg-[#1d1d1f] hover:bg-black font-semibold text-sm h-10 px-6">{t('blog.all_stories')}</Button>
            <Button className="rounded-full bg-gray-100 border-none font-semibold text-sm text-gray-600 h-10 px-6 hover:bg-gray-200">{t('blog.engineering')}</Button>
            <Button className="rounded-full bg-gray-100 border-none font-semibold text-sm text-gray-600 h-10 px-6 hover:bg-gray-200">{t('blog.software')}</Button>
            <Button className="rounded-full bg-gray-100 border-none font-semibold text-sm text-gray-600 h-10 px-6 hover:bg-gray-200">{t('blog.hardware')}</Button>
            <Button className="rounded-full bg-gray-100 border-none font-semibold text-sm text-gray-600 h-10 px-6 hover:bg-gray-200">{t('blog.corporate')}</Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Featured Post */}
        <h2 className="text-xl font-bold text-[#1d1d1f] mb-8 uppercase tracking-widest text-sm">{t('blog.featured')}</h2>
        <div className="group cursor-pointer bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-[#0071e3]/10 transition-all duration-500 mb-20 border border-gray-100">
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-3/5 relative overflow-hidden">
              <img 
                src={featuredPost.image} 
                alt={featuredPost.title}
                className="w-full h-full object-cover min-h-[300px] lg:min-h-[500px] group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-[#0071e3] uppercase tracking-widest">
                {featuredPost.category}
              </div>
            </div>
            
            <div className="lg:w-2/5 p-10 lg:p-16 flex flex-col justify-center">
              <div className="text-sm text-gray-400 mb-4 font-medium flex items-center gap-4">
                <span>{featuredPost.date}</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                <span>{t('blog.read_time', { count: featuredPost.readTime.split(' ')[0] })}</span>
              </div>
              <h3 className="text-3xl lg:text-4xl font-bold text-[#1d1d1f] mb-6 leading-tight group-hover:text-[#0071e3] transition-colors">
                {featuredPost.title}
              </h3>
              <p className="text-lg text-gray-500 mb-8 leading-relaxed">
                {featuredPost.excerpt}
              </p>
              
              <div className="flex items-center text-sm font-bold text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors">
                {t('blog.read_full')}
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Posts Grid */}
        <h2 className="text-xl font-bold text-[#1d1d1f] mb-8 uppercase tracking-widest text-sm">{t('blog.latest')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
        
        <div className="mt-20 flex justify-center">
          <Button size="large" className="px-10 rounded-full font-bold text-[#1d1d1f] border-gray-300 bg-white">
            {t('blog.load_more')}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default BlogPage
