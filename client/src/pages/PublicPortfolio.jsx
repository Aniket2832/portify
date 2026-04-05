import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { generateHTML } from '../utils/exportHTML'

export default function PublicPortfolio() {
  const { slug } = useParams()
  const [html, setHtml] = useState(null)
  const [error, setError] = useState(false)
  const [theme, setTheme] = useState('dark')
  const [portfolioData, setPortfolioData] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get(
  (import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + '/public/' + slug
)
      } catch {
        setError(true)
      }
    }
    load()
  }, [slug])

  useEffect(() => {
    if (!portfolioData) return
    const defaultSections = [
      { id: 'hero' }, { id: 'skills' }, { id: 'projects' },
      { id: 'experience' }, { id: 'contact' }
    ]
    const sections = portfolioData.sections?.length ? portfolioData.sections : defaultSections
    const template = portfolioData.template || 'minimal'
    const accentColor = portfolioData.accentColor || '#6366f1'
    setHtml(generateHTML(portfolioData.title, portfolioData.data, sections, theme, template, accentColor))
  }, [portfolioData, theme])

  if (error) return (
    <div style={{ minHeight: '100vh', background: '#09090b', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif", color: '#fff' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>◈</div>
      <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Portfolio not found</h1>
      <p style={{ color: '#52525b', fontSize: 14 }}>This portfolio doesn't exist or hasn't been published yet.</p>
    </div>
  )

  if (!html) return (
    <div style={{ minHeight: '100vh', background: '#09090b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#52525b', fontFamily: "'DM Sans', sans-serif" }}>
      Loading...
    </div>
  )

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <button
        onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
        style={{
          position: 'fixed', top: 20, right: 20, zIndex: 999,
          background: theme === 'dark' ? '#1f1f23' : '#f4f4f5',
          border: theme === 'dark' ? '1px solid #27272a' : '1px solid #e4e4e7',
          borderRadius: 99, padding: '8px 16px', fontSize: 13, fontWeight: 500,
          color: theme === 'dark' ? '#a1a1aa' : '#52525b',
          cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)', transition: 'all 0.2s'
        }}
      >
        {theme === 'dark' ? '☀ Light' : '🌙 Dark'}
      </button>
      <iframe key={theme} srcDoc={html} style={{ width: '100%', height: '100vh', border: 'none' }} title="Portfolio" />
    </div>
  )
}