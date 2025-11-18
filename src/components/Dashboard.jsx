import { useState, useMemo } from 'react'

export default function Dashboard({ dataset }) {
  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  const handleAnalyze = async () => {
    if (!dataset?.dataset_id) return
    try {
      setLoading(true)
      setErr('')
      setSummary(null)
      const res = await fetch(`${backend}/analysis/summary/${dataset.dataset_id}`)
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setSummary(data)
    } catch (e) {
      setErr(e.message)
    } finally {
      setLoading(false)
    }
  }

  const charts = useMemo(() => {
    if (!summary) return null
    return (
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-slate-800/60 border border-white/10 rounded-xl p-4">
          <h4 className="text-white font-semibold mb-2">Numeric Summaries</h4>
          <div className="text-slate-200 text-sm space-y-1 max-h-64 overflow-auto">
            {summary.summaries?.map((s, i) => (
              <div key={i} className="flex justify-between border-b border-white/5 py-1">
                <span className="font-medium">{s.column}</span>
                <span>mean {Number(s.mean).toFixed(3)} • std {Number(s.std).toFixed(3)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-slate-800/60 border border-white/10 rounded-xl p-4">
          <h4 className="text-white font-semibold mb-2">Anomalies</h4>
          <p className="text-slate-200 text-sm">{summary.anomalies?.count || 0} potential anomalies detected.</p>
        </div>
      </div>
    )
  }, [summary])

  if (!dataset) return null

  return (
    <section className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-4 gap-3">
        <h3 className="text-white text-xl font-bold">Dataset: {dataset?.dataset_id?.slice(0,8)}</h3>
        <div className="flex items-center gap-2">
          <button onClick={handleAnalyze} disabled={loading} className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white px-3 py-2 rounded">
            {loading ? 'Analyzing…' : 'Analyze'}
          </button>
        </div>
      </div>
      {err && <p className="text-red-400 mb-2">{err}</p>}
      {!summary && !loading && <p className="text-slate-300">Click Analyze to compute summaries and anomalies.</p>}
      {summary && charts}
    </section>
  )
}
