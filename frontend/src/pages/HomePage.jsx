import { Button } from 'antd'

const HomePage = () => {
  return (
    <section className="space-y-8 py-12">
      <div className="space-y-4">
        <p className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary uppercase tracking-wider">
          Hệ thống đã sẵn sàng
        </p>
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
          Life Style Shop <span className="text-primary">E-commerce</span>
        </h2>
        <p className="max-w-2xl text-lg text-slate-400">
          Nền tảng mua sắm hiện đại được xây dựng với React, Tailwind CSS và
          Express. Đã cấu hình màu chủ đạo <code className="text-primary">#286AF8</code>.
        </p>
      </div>

      <div className="flex gap-4">
        <Button type="primary" size="large" className="h-12 px-8 font-semibold">
          Bắt đầu mua sắm
        </Button>
        <Button size="large" className="h-12 px-8 font-semibold border-slate-700 text-slate-300">
          Tìm hiểu thêm
        </Button>
      </div>
    </section>
  )
}

export default HomePage
