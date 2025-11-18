import { useState } from 'react'
import Hero from './components/Hero'
import Uploader from './components/Uploader'
import Dashboard from './components/Dashboard'

function App() {
  const [dataset, setDataset] = useState(null)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Hero />
      <section className="max-w-6xl mx-auto px-6 -mt-16 relative z-10">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-1 space-y-4">
            <Uploader onDone={setDataset} />
            <div className="bg-slate-800/60 border border-white/10 rounded-xl p-4">
              <h3 className="text-white font-semibold mb-2">Live Events</h3>
              <LiveEvents />
            </div>
          </div>
          <div className="md:col-span-2">
            {!dataset ? (
              <div className="bg-slate-800/60 border border-white/10 rounded-xl p-6 text-slate-300">
                Upload a dataset to see summaries, anomalies, and exports.
              </div>
            ) : (
              <Dashboard dataset={dataset} />
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

function LiveEvents(){
  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [last, setLast] = useState('')
  useState(() => {
    const es = new EventSource(`${backend}/events`)
    es.onmessage = (e) => setLast(e.data)
    es.onerror = () => es.close()
    return () => es.close()
  }, [])
  return <div className="text-xs text-slate-300 break-all min-h-[24px]">{last || 'Waiting...'}</div>
}

export default App
