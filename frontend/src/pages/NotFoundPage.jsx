import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'

const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <section className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-9xl font-black text-gray-50 tracking-tighter absolute -z-10 select-none">
        404
      </h1>
      
      <div className="relative z-10 space-y-6">
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">
          Page Not Found
        </h2>
        <p className="text-gray-500 max-w-md mx-auto text-lg">
          The page you are looking for does not exist or has been moved to a new location.
        </p>
        
        <div className="pt-8">
          <Button 
            type="primary" 
            size="large" 
            className="h-14 px-10 bg-black text-white rounded-none border-none uppercase tracking-widest font-bold text-xs hover:bg-gray-800"
            onClick={() => navigate('/')}
          >
            Back to Home
          </Button>
        </div>
      </div>
    </section>
  )
}

export default NotFoundPage
