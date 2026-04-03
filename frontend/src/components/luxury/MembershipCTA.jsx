import { Button, Input } from 'antd'

const MembershipCTA = () => {
  return (
    <section className="py-24 bg-[#fbfbfd]">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-[#1d1d1f] mb-4 tracking-tight">
          Stay in the loop.
        </h2>
        <p className="text-xl text-gray-500 mb-10 font-medium">
          Sign up to get the latest news on product releases, software updates, and exclusive events.
        </p>

        <form className="max-w-md mx-auto relative group">
          <Input 
            placeholder="Enter your email address" 
            className="w-full h-14 pl-6 pr-32 rounded-full border border-gray-300 hover:border-gray-400 focus:border-[#0071e3] transition-colors shadow-sm text-[15px]"
          />
          <Button 
            type="primary" 
            className="absolute right-1.5 top-1.5 h-11 px-6 rounded-full font-semibold text-sm box-shadow-none"
          >
            Subscribe
          </Button>
        </form>
        
        <p className="text-gray-400 text-xs mt-6 font-medium">
          You can opt out at any time. View our Privacy Policy.
        </p>
      </div>
    </section>
  )
}

export default MembershipCTA
