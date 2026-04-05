import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'antd'
import BlogCard from '../components/common/BlogCard'
import { useTranslation } from 'react-i18next'

const BLOG_CATEGORIES = ['all', 'engineering', 'software', 'hardware', 'corporate']

const CATEGORY_COLORS = {
  Engineering: 'bg-blue-500',
  Software: 'bg-purple-500',
  Hardware: 'bg-amber-500',
  Corporate: 'bg-emerald-500',
}

const featuredPost = {
  id: 0,
  title: "The Architecture Behind Our Newest M-Series Silicon Processor",
  excerpt: "A deep dive into how changing the internal geometry and incorporating unified memory structures allowed us to deliver performance per watt previously thought impossible in a mobile form factor.",
  category: "Engineering",
  date: "Oct 24, 2026",
  readTime: "8 min",
  image: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
  author: {
    name: "Dr. Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
  }
}

const recentPosts = [
  {
    id: 1,
    title: "Why Spatial Audio is the Future of Mixing",
    excerpt: "Exploring the software updates that bring true 3D soundscapes to standard stereo headphones.",
    category: "Software",
    date: "Oct 18, 2026",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1612282130134-49b84fa8004f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    author: {
      name: "Marcus Webb",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    }
  },
  {
    id: 2,
    title: "Sustainability Report: 100% Recycled Aluminum",
    excerpt: "How we completely re-engineered our supply chain to hit our zero carbon goals five years early.",
    category: "Corporate",
    date: "Oct 12, 2026",
    readTime: "4 min",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    author: {
      name: "Priya Kapoor",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    }
  },
  {
    id: 3,
    title: "Designing the Perfect Mechanical Switch",
    excerpt: "The 18-month journey to balance tactile feedback with acoustic dampening for pro typists.",
    category: "Hardware",
    date: "Sep 29, 2026",
    readTime: "12 min",
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    author: {
      name: "James Liu",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    }
  },
  {
    id: 4,
    title: "Unified Memory: Why It Changes Everything",
    excerpt: "Traditional architectures waste bandwidth copying data between memory pools. Unified memory eliminates that bottleneck entirely.",
    category: "Engineering",
    date: "Sep 15, 2026",
    readTime: "7 min",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    author: {
      name: "Dr. Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    }
  },
  {
    id: 5,
    title: "Accessibility First: Building for Everyone",
    excerpt: "A behind-the-scenes look at how our accessibility team shaped the design language of our latest operating system.",
    category: "Software",
    date: "Sep 8, 2026",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    author: {
      name: "Nina Reyes",
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    }
  },
  {
    id: 6,
    title: "Our Carbon Neutral Roadmap",
    excerpt: "From renewable manufacturing to packaging redesign, here's every step on our path to a net-zero supply chain.",
    category: "Corporate",
    date: "Aug 30, 2026",
    readTime: "9 min",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    author: {
      name: "Priya Kapoor",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    }
  },
]

const BlogPage = () => {
  const { t } = useTranslation()
  const [activeCategory, setActiveCategory] = useState('all')

  const filteredPosts = activeCategory === 'all'
    ? recentPosts
    : recentPosts.filter((p) => p.category.toLowerCase() === activeCategory)

  return (
    <div className="bg-[#fbfbfd] min-h-screen">
      {/* Blog Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-8">
          {/* Header Text */}
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#0071e3] mb-3">
              {t('blog.header_tag')}
            </p>
            <h1 className="text-5xl lg:text-6xl font-bold text-[#1d1d1f] tracking-tight leading-tight mb-4">
              {t('blog.title')}
            </h1>
            <p className="text-lg text-gray-500 max-w-xl leading-relaxed">
              {t('blog.subtitle')}
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {BLOG_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`shrink-0 inline-flex items-center px-5 h-10 rounded-full text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-[#1d1d1f] text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat === 'all' ? t('blog.all_stories') : t(`blog.${cat}`)}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Featured Post Hero */}
        {activeCategory === 'all' && (
          <>
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-6">
              {t('blog.featured')}
            </h2>
            <Link
              to={`/blog/${featuredPost.id}`}
              className="group block mb-16 bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-[#0071e3]/10 transition-all duration-500 border border-gray-100"
            >
              <div className="flex flex-col lg:flex-row">
                {/* Image */}
                <div className="lg:w-[58%] relative overflow-hidden min-h-[300px] lg:min-h-[520px]">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-[800ms]"
                  />
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-[#0071e3]">
                    {featuredPost.category}
                  </div>
                </div>

                {/* Content */}
                <div className="lg:w-[42%] p-10 lg:p-14 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-5">
                    <img
                      src={featuredPost.author.avatar}
                      alt={featuredPost.author.name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100"
                    />
                    <span className="text-sm font-medium text-gray-500">
                      {featuredPost.author.name}
                    </span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span className="text-xs text-gray-400 font-medium">
                      {featuredPost.date}
                    </span>
                  </div>

                  <h3 className="text-3xl lg:text-4xl font-bold text-[#1d1d1f] mb-6 leading-tight group-hover:text-[#0071e3] transition-colors duration-300">
                    {featuredPost.title}
                  </h3>

                  <p className="text-base text-gray-500 mb-8 leading-relaxed line-clamp-4">
                    {featuredPost.excerpt}
                  </p>

                  <div className="flex items-center gap-2 text-sm font-bold text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors duration-300">
                    {t('blog.read_full')}
                    <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>

                  <div className="mt-6 pt-5 border-t border-gray-100 flex items-center gap-4 text-xs text-gray-400 font-medium">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {t('blog.read_time', { count: featuredPost.readTime.split(' ')[0] })}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </>
        )}

        {/* Latest Posts Grid */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400">
            {activeCategory === 'all' ? t('blog.latest') : t(`blog.${activeCategory}`)}
          </h2>
          <span className="text-xs text-gray-400">
            {t('blog.post_count', { count: filteredPosts.length })}
          </span>
        </div>

        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-[#1d1d1f] mb-2">{t('blog.no_posts_title')}</h3>
            <p className="text-gray-500 text-sm">{t('blog.no_posts')}</p>
          </div>
        )}

        {filteredPosts.length > 0 && (
          <div className="mt-20 flex justify-center">
            <Button
              size="large"
              className="px-12 rounded-full font-bold text-[#1d1d1f] border-gray-300 bg-white hover:border-[#0071e3] hover:text-[#0071e3] transition-colors"
            >
              {t('blog.load_more')}
            </Button>
          </div>
        )}

        {/* Newsletter CTA */}
        <div className="mt-24 bg-[#1d1d1f] rounded-3xl p-10 lg:p-16 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">{t('cta.title')}</h3>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">{t('cta.subtitle')}</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder={t('cta.placeholder')}
              className="flex-1 h-12 px-5 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-500 text-sm outline-none focus:border-[#0071e3] transition-colors"
            />
            <Button
              type="primary"
              size="large"
              className="h-12 px-8 rounded-full font-bold bg-[#0071e3] hover:bg-[#0077ed] border-none"
            >
              {t('cta.button')}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-4">{t('cta.note')}</p>
        </div>
      </div>
    </div>
  )
}

export default BlogPage
