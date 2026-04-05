import { useParams, Link, useNavigate } from 'react-router-dom'
import { Button } from 'antd'
import { ArrowLeftOutlined, ShareAltOutlined, TwitterOutlined, LinkedinOutlined, LinkOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

// Mock data - in real app this would come from API
const BLOG_POSTS = {
  0: {
    id: 0,
    title: "The Architecture Behind Our Newest M-Series Silicon Processor",
    excerpt: "A deep dive into how changing the internal geometry and incorporating unified memory structures allowed us to deliver performance per watt previously thought impossible in a mobile form factor.",
    category: "Engineering",
    date: "Oct 24, 2026",
    readTime: "8 min",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    author: {
      name: "Dr. Sarah Chen",
      role: "Chief Architecture Engineer",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    },
    content: `
      <p>The semiconductor industry has reached an inflection point. For decades, performance gains came from simply shrinking transistors and cramming more onto each die. But physics has limits — and as we've approached those limits, we've had to fundamentally rethink how processors are designed.</p>

      <h2>A New Kind of Architecture</h2>
      <p>Our latest M-Series chip represents the culmination of five years of research into heterogeneous computing. Rather than treating CPU, GPU, and memory as separate subsystems, we've unified them under a single architectural umbrella that allows data to flow without the traditional bottlenecks.</p>
      <p>The key insight was deceptively simple: what if memory wasn't a separate system that the processor had to access through narrow buses, but rather an integral part of the computational fabric itself?</p>

      <h2>Unified Memory: The Technical Details</h2>
      <p>Traditional architectures require data to be copied between memory pools. When your CPU needs data that's currently in GPU memory, it must traverse a narrow PCIe bus, creating latency that limits performance. Our unified memory architecture eliminates this bottleneck entirely.</p>
      <p>By architecting the memory subsystem from scratch, we achieved memory bandwidth that would have seemed impossible just a few years ago — over 400 GB/s in the high-end variant, with latencies measured in single-digit nanoseconds.</p>

      <h2>Thermal Efficiency</h2>
      <p>Performance per watt has become the true measure of processor capability. Our new thermal management system uses a combination of advanced materials science and intelligent power gating to deliver unprecedented efficiency.</p>
      <p>The result? The same performance you'd expect from a desktop workstation, in a form factor that stays cool and quiet in your lap.</p>

      <h2>Looking Forward</h2>
      <p>This architecture is just the beginning. We're already working on the next generation, which will push these boundaries even further. The future of computing isn't about raw speed — it's about making powerful computation accessible, efficient, and sustainable.</p>
    `,
    tags: ["Silicon", "Architecture", "Performance", "M-Series"],
    relatedPosts: [1, 4],
  },
  1: {
    id: 1,
    title: "Why Spatial Audio is the Future of Mixing",
    excerpt: "Exploring the software updates that bring true 3D soundscapes to standard stereo headphones.",
    category: "Software",
    date: "Oct 18, 2026",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1612282130134-49b84fa8004f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    author: {
      name: "Marcus Webb",
      role: "Senior Audio Engineer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    },
    content: `
      <p>Spatial audio represents a paradigm shift in how we experience sound. It's not just about adding effects — it's about fundamentally rethinking how audio is captured, processed, and reproduced.</p>

      <h2>The Science of Spatial Sound</h2>
      <p>Our ears are remarkable instruments. They don't just detect sound — they use the subtle differences in timing and volume between what each ear hears to construct a three-dimensional map of the world around us. Traditional stereo recordings ignore most of this information, collapsing a rich, dimensional soundstage into a flat plane.</p>
      <p>Spatial audio reinstates that dimensionality, placing sounds in a three-dimensional space that your ears can naturally navigate.</p>

      <h2>Head-Tracked Sound</h2>
      <p>One of the key innovations in our latest update is head tracking. Using the motion sensors built into your devices, we can now track the orientation of your head relative to your screen and adjust the audio accordingly.</p>
      <p>The result is a soundstage that stays anchored to your environment, even as you move. Sounds appear to come from fixed points in space, creating an experience that's remarkably close to listening to live music.</p>

      <h2>For Creators</h2>
      <p>We've also updated our professional tools to support spatial audio production. The new mixer interface provides intuitive controls for positioning sounds in three-dimensional space, while the metering tools help you ensure consistent spatial balance throughout your mix.</p>
    `,
    tags: ["Audio", "Spatial", "Software", "Immersive"],
    relatedPosts: [0, 5],
  },
  2: {
    id: 2,
    title: "Sustainability Report: 100% Recycled Aluminum",
    excerpt: "How we completely re-engineered our supply chain to hit our zero carbon goals five years early.",
    category: "Corporate",
    date: "Oct 12, 2026",
    readTime: "4 min",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    author: {
      name: "Priya Kapoor",
      role: "VP of Sustainability",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    },
    content: `
      <p>Five years ago, we set an ambitious goal: to make every product from 100% recycled or renewable materials by 2030. Today, we're proud to announce we've achieved that goal five years ahead of schedule.</p>

      <h2>The Aluminum Challenge</h2>
      <p>Aluminum is one of the most recyclable materials on Earth — but recycled aluminum requires only 5% of the energy of new aluminum production. The challenge wasn't recycling itself, but establishing a supply chain that could meet our quality standards while using 100% recycled input.</p>
      <p>We worked with our suppliers to develop new smelting and alloying processes that achieve the same precision with recycled material. The result is an aluminum enclosure that's indistinguishable in quality from our previous products, with a fraction of the environmental impact.</p>

      <h2>Beyond Aluminum</h2>
      <p>Aluminum was just the beginning. We've also transitioned to 100% recycled rare earth elements in our speakers and haptic motors, and we've eliminated PVC from all our cables.</p>
      <p>Our packaging now uses 100% fiber-based materials, all sourced from sustainably managed forests. We've even eliminated the plastic trays from our retail packaging, replacing them with molded fiber that's fully compostable.</p>

      <h2>The Path Forward</h2>
      <p>Reaching 100% recycled materials was a major milestone, but it's not the end of our journey. We're now focused on the other half of the equation: making our manufacturing carbon neutral, and eventually carbon negative.</p>
    `,
    tags: ["Sustainability", "Recycling", "Corporate", "Environment"],
    relatedPosts: [6],
  },
  3: {
    id: 3,
    title: "Designing the Perfect Mechanical Switch",
    excerpt: "The 18-month journey to balance tactile feedback with acoustic dampening for pro typists.",
    category: "Hardware",
    date: "Sep 29, 2026",
    readTime: "12 min",
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    author: {
      name: "James Liu",
      role: "Principal Hardware Engineer",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    },
    content: `
      <p>Mechanical keyboards have seen a renaissance in recent years, driven by professionals who demand the best possible typing experience. But what makes a switch truly great? We spent 18 months trying to find out.</p>

      <h2>The Physics of Typing</h2>
      <p>Every keystroke is a complex interaction between physical components. The spring provides resistance, the housing guides the stem, and the contact materials determine both feel and longevity. Change any variable, and the entire experience shifts.</p>
      <p>We started by studying the biomechanics of typing, measuring the force profiles of thousands of typists to understand what makes a keystroke feel satisfying without being fatiguing.</p>

      <h2>The Tactile Question</h2>
      <p>One of the oldest debates in mechanical keyboards is tactile versus linear. Tactile switches provide a bump that many typists find satisfying, confirming that the key has actuated without requiring a bottom-out. But designing a tactile switch that's precise, consistent, and durable is notoriously difficult.</p>
      <p>We developed a new approach using precisely engineered leaf springs that create a crisp, consistent tactile event at exactly the actuation point — no wobble, no mushiness, just a satisfying click that tells your fingers they've hit the mark.</p>

      <h2>Acoustic Engineering</h2>
      <p>Sound is often overlooked in switch design, but it's crucial to the overall experience. We worked with acoustic engineers to analyze and optimize the sound signature of every component, eliminating unwanted resonance while preserving the satisfying click that typists love.</p>
    `,
    tags: ["Hardware", "Keyboard", "Engineering", "Design"],
    relatedPosts: [0],
  },
  4: {
    id: 4,
    title: "Unified Memory: Why It Changes Everything",
    excerpt: "Traditional architectures waste bandwidth copying data between memory pools. Unified memory eliminates that bottleneck entirely.",
    category: "Engineering",
    date: "Sep 15, 2026",
    readTime: "7 min",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    author: {
      name: "Dr. Sarah Chen",
      role: "Chief Architecture Engineer",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    },
    content: `
      <p>Memory bandwidth is the hidden constraint in modern computing. Every computation requires data, and moving that data between memory and processors has become the primary bottleneck limiting system performance.</p>

      <h2>The Bandwidth Crisis</h2>
      <p>As processor speeds have increased, memory bandwidth has struggled to keep pace. Today's fastest CPUs can perform billions of operations per second, but they're often idle, waiting for data to arrive from memory. This is especially pronounced in workloads that process large amounts of data, like video editing, machine learning, and scientific computing.</p>

      <h2>Our Solution</h2>
      <p>Unified memory isn't just a marketing term — it represents a fundamental architectural change. By designing the memory subsystem to be physically shared between all processing units, we've eliminated the need for costly and slow data copies.</p>
      <p>The result is a system where the CPU, GPU, Neural Engine, and other accelerators can all access the same memory directly, without translation layers or copy operations.</p>

      <h2>Real-World Impact</h2>
      <p>In benchmark after benchmark, unified memory delivers 2x to 5x the performance of traditional architectures for data-intensive workloads. A video editor can work with 8K footage in real time. A machine learning model trains in hours instead of days. A scientific simulation runs at interactive frame rates.</p>
    `,
    tags: ["Memory", "Architecture", "Performance", "M-Series"],
    relatedPosts: [0],
  },
  5: {
    id: 5,
    title: "Accessibility First: Building for Everyone",
    excerpt: "A behind-the-scenes look at how our accessibility team shaped the design language of our latest operating system.",
    category: "Software",
    date: "Sep 8, 2026",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    author: {
      name: "Nina Reyes",
      role: "Director of Accessibility",
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    },
    content: `
      <p>Accessibility isn't an afterthought — it's a fundamental design principle that shapes every decision we make. Our latest operating system represents the most comprehensive accessibility update in our company's history.</p>

      <h2>Designed With, Not For</h2>
      <p>The most important change in our approach has been moving from designing for accessibility to designing with the accessibility community. Our team includes engineers, designers, and content creators who use assistive technologies in their daily lives.</p>
      <p>This lived experience informs every decision, from the size of touch targets to the contrast ratios of text to the timing of animations.</p>

      <h2>New Features</h2>
      <p>Voice Control has been completely redesigned from the ground up, offering faster, more accurate recognition and a new natural language interface that understands context. Face ID now works with a wider range of hairstyles, glasses, and prosthetic devices.</p>
      <p>We've also added new features for users with cognitive disabilities, including simplified interfaces that reduce visual complexity and customizable notification schedules that respect individual needs.</p>

      <h2>Open Standards</h2>
      <p>We've contributed our accessibility improvements to open standards bodies, ensuring that the innovations we develop benefit everyone — not just our users. Accessibility is a basic human right, and we're committed to making it universal.</p>
    `,
    tags: ["Accessibility", "Software", "Design", "Inclusion"],
    relatedPosts: [1],
  },
  6: {
    id: 6,
    title: "Our Carbon Neutral Roadmap",
    excerpt: "From renewable manufacturing to packaging redesign, here's every step on our path to a net-zero supply chain.",
    category: "Corporate",
    date: "Aug 30, 2026",
    readTime: "9 min",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    author: {
      name: "Priya Kapoor",
      role: "VP of Sustainability",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    },
    content: `
      <p>Climate change is the defining challenge of our generation. As a company, we have both the responsibility and the opportunity to lead the transition to a sustainable economy.</p>

      <h2>Our Progress</h2>
      <p>We've already achieved carbon neutrality for our corporate operations, and we've committed to achieving the same for our entire product lifecycle by 2030. This is an ambitious goal that requires fundamental changes to how we design, manufacture, and ship our products.</p>

      <h2>Manufacturing</h2>
      <p>Our manufacturing partners have committed to 100% renewable energy for all facilities that produce our products. We've invested in solar and wind projects around the world to ensure that there's enough clean energy to go around.</p>
      <p>We've also redesigned our products for disassembly, making it easier to recover materials at the end of their useful life. Our recycling robots can now recover more materials from each device than ever before.</p>

      <h2>Transportation</h2>
      <p>We're shifting from air freight to ocean shipping for the majority of our product transportation, even if it means longer lead times. Ocean shipping produces 50 times less carbon emissions per kilogram of cargo than air freight.</p>
      <p>For the last mile, we're partnering with logistics companies that use electric vehicles and cargo bikes.</p>
    `,
    tags: ["Climate", "Sustainability", "Corporate", "Environment"],
    relatedPosts: [2],
  },
}

const RELATED_IMAGES = [
  "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1612282130134-49b84fa8004f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1595225476474-87563907a212?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
]

const BlogPostPage = () => {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()

  const post = BLOG_POSTS[id]

  if (!post) {
    return (
      <div className="bg-[#fbfbfd] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#1d1d1f] mb-4">{t('blog.post_not_found')}</h1>
          <p className="text-gray-500 mb-8">{t('blog.post_not_found_desc')}</p>
          <Button type="primary" size="large" onClick={() => navigate('/blog')}>
            {t('blog.back_to_newsroom')}
          </Button>
        </div>
      </div>
    )
  }

  const relatedPosts = post.relatedPosts.map((pid) => BLOG_POSTS[pid]).filter(Boolean)

  return (
    <div className="bg-[#fbfbfd] min-h-screen">
      {/* Hero Image */}
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        {/* Back Button */}
        <div className="absolute top-6 left-6">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-sm font-semibold hover:bg-white/20 transition-colors border border-white/20"
          >
            <ArrowLeftOutlined />
            {t('blog.back_to_newsroom')}
          </Link>
        </div>
        {/* Share */}
        <div className="absolute top-6 right-6 flex gap-2">
          <button className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors border border-white/20">
            <ShareAltOutlined />
          </button>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-6 -mt-20 relative z-10 pb-24">
        {/* Article Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12 mb-12">
          {/* Category Badge */}
          <div className="mb-6">
            <span className="inline-block bg-[#0071e3]/10 text-[#0071e3] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl lg:text-5xl font-bold text-[#1d1d1f] leading-tight mb-6">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 pb-8 mb-8 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
              />
              <div>
                <p className="font-bold text-[#1d1d1f]">{post.author.name}</p>
                <p className="text-xs text-gray-500">{post.author.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-400 ml-auto">
              <span>{post.date}</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full" />
              <span>{t('blog.read_time', { count: post.readTime.split(' ')[0] })}</span>
            </div>
          </div>

          {/* Excerpt */}
          <p className="text-xl text-gray-500 leading-relaxed mb-10 border-l-4 border-[#0071e3] pl-6 italic">
            {post.excerpt}
          </p>

          {/* Content */}
          <div
            className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-[#1d1d1f] prose-p:text-gray-600 prose-p:leading-relaxed prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-a:text-[#0071e3]"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          <div className="mt-12 pt-8 border-t border-gray-100">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-1.5 bg-gray-100 rounded-full text-xs font-semibold text-gray-600 hover:bg-[#0071e3]/10 hover:text-[#0071e3] transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Share Row */}
          <div className="mt-8 pt-8 border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-500">{t('blog.share_this')}</span>
            <div className="flex gap-3">
              <button className="w-10 h-10 bg-[#1DA1F2] rounded-full flex items-center justify-center text-white hover:opacity-90 transition-opacity">
                <TwitterOutlined />
              </button>
              <button className="w-10 h-10 bg-[#0A66C2] rounded-full flex items-center justify-center text-white hover:opacity-90 transition-opacity">
                <LinkedinOutlined />
              </button>
              <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
                <LinkOutlined />
              </button>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-8">
              {t('blog.related_articles')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((related, idx) => (
                <Link
                  key={related.id}
                  to={`/blog/${related.id}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-[#0071e3]/10 transition-all duration-300 border border-gray-100 flex"
                >
                  <div className="w-32 h-32 shrink-0 overflow-hidden">
                    <img
                      src={RELATED_IMAGES[idx % RELATED_IMAGES.length]}
                      alt={related.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 flex flex-col justify-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#0071e3] mb-1">
                      {related.category}
                    </span>
                    <h3 className="font-bold text-sm text-[#1d1d1f] leading-snug line-clamp-2 group-hover:text-[#0071e3] transition-colors">
                      {related.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {t('blog.read_time', { count: related.readTime.split(' ')[0] })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#0071e3] transition-colors"
          >
            <ArrowLeftOutlined />
            {t('blog.back_to_newsroom')}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default BlogPostPage
