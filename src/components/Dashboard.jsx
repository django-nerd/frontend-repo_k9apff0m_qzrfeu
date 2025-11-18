import { useEffect, useState, useMemo } from 'react'

export default function Dashboard({ dataset }) {
  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  useEffect(() => {
    if (!dataset?.dataset_id) return
    const fetchSummary = async () => {
      try {
        setLoading(true)
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
    fetchSummary()
  }, [dataset, backend])

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
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-xl font-bold">Dataset: {dataset?.dataset_id?.slice(0,8)}</h3>
        <a href={`${backend}/export/summary/${dataset.dataset_id}.csv`} className="text-blue-300 hover:text-blue-200 underline">Export Summary CSV</a>
      </div>
      {loading && <p className="text-slate-300">Loading summary...</p>}
      {err && <p className="text-red-400">{err}</p>}
      {summary && charts}
    </section>
  )
}
