import { useTranslation } from 'react-i18next'

const BlogCard = ({ post }) => {
  const { t } = useTranslation()

  return (
    <div className="group cursor-pointer flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-[#0071e3]/10 transition-all duration-300 border border-gray-100">
      <div className="relative w-full aspect-[16/10] overflow-hidden">
        <img 
          src={post.image} 
          alt={post.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-[#0071e3] uppercase tracking-widest">
          {post.category}
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="text-xs text-gray-400 mb-3 font-medium flex justify-between items-center">
          <span>{post.date}</span>
          <span>{t('blog.read_time', { count: post.readTime.split(' ')[0] })}</span>
        </div>
        <h3 className="text-xl font-bold text-[#1d1d1f] mb-3 group-hover:text-[#0071e3] transition-colors leading-snug">
          {post.title}
        </h3>
        <p className="text-gray-500 text-sm mb-6 flex-grow line-clamp-3">
          {post.excerpt}
        </p>
        
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center text-sm font-semibold text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors">
          {t('blog.read_full')}
          <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default BlogCard
