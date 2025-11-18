import Spline from '@splinetool/react-spline'

export default function Hero() {
  return (
    <section className="relative w-full min-h-[60vh] md:min-h-[70vh] overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/LU2mWMPbF3Qi1Qxh/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-28">
        <div className="backdrop-blur-md bg-slate-900/40 rounded-2xl p-6 md:p-10 border border-white/10 pointer-events-none">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow mb-4">
            Data Intelligence Platform
          </h1>
          <p className="text-slate-200 text-sm md:text-base max-w-2xl">
            Ingest data from files and APIs, analyze trends, run sentiment and predictive models, and stream live insights — all in one place.
          </p>
        </div>
      </div>
    </section>
  )
}
