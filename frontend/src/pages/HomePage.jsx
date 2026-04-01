const HomePage = () => {
  return (
    <section className="space-y-6">
      <p className="inline-flex rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs text-sky-300">
        Frontend is ready
      </p>
      <h2 className="text-3xl font-semibold tracking-tight">
        React + Vite + Tailwind da duoc setup
      </h2>
      <p className="max-w-2xl text-slate-300">
        Ban co the bat dau tao pages/components cho catalog, cart, checkout va
        dashboard. API base URL dang doc tu bien moi truong `VITE_API_BASE_URL`.
      </p>
    </section>
  )
}

export default HomePage
