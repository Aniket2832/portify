import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import api from '../api/axios'
import Onboarding from '../components/Onboarding'

const NAV = [
  { icon: '⊞', label: 'Portfolios', id: 'portfolios' },
  { icon: '◎', label: 'Templates', id: 'templates' },
  { icon: '↗', label: 'Published', id: 'published' },
  { icon: '⚙', label: 'Settings', id: 'settings' },
]

export default function Dashboard() {
  const { user, logout } = useAuth()
  const { c, isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [portfolios, setPortfolios] = useState([])
  const [active, setActive] = useState('portfolios')
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return !localStorage.getItem('portify-onboarded')
  })

  useEffect(() => { fetchPortfolios() }, [])

  const fetchPortfolios = async () => {
    try {
      const { data } = await api.get('/portfolios')
      setPortfolios(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const createPortfolio = async () => {
    setCreating(true)
    try {
      const { data } = await api.post('/portfolios', { title: 'My Portfolio' })
      navigate('/editor/' + data.id)
    } catch (err) {
      console.error(err)
    } finally {
      setCreating(false)
    }
  }

  const deletePortfolio = async (id, e) => {
    e.stopPropagation()
    if (!confirm('Delete this portfolio?')) return
    await api.delete('/portfolios/' + id)
    setPortfolios(portfolios.filter(p => p.id !== id))
  }

  const totalViews = portfolios.reduce((sum, p) => sum + (p.views || 0), 0)
  const publishedCount = portfolios.filter(p => p.published).length
  const initials = user?.email?.slice(0, 2).toUpperCase() || 'AN'

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: c.bgPrimary, fontFamily: "'DM Sans', sans-serif", color: c.text }}>

      {/* ONBOARDING */}
      {showOnboarding && (
        <Onboarding onDone={() => {
          localStorage.setItem('portify-onboarded', 'true')
          setShowOnboarding(false)
        }} />
      )}

      {/* SIDEBAR */}
      <div style={{ width: 240, background: c.bgSecondary, borderRight: '1px solid ' + c.border, display: 'flex', flexDirection: 'column', padding: '24px 0' }}>
        <div style={{ padding: '0 24px 24px', borderBottom: '1px solid ' + c.border, marginBottom: 8 }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 700, color: c.text }}>
            Portify<span style={{ color: '#6366f1' }}>.</span>
          </div>
        </div>

        <div style={{ flex: 1, padding: '8px 12px' }}>
          {NAV.map(item => (
            <div key={item.id} onClick={() => setActive(item.id)} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
              borderRadius: 8, cursor: 'pointer', marginBottom: 2, fontSize: 14,
              background: active === item.id ? c.accentBg : 'transparent',
              color: active === item.id ? c.accentText : c.textMuted,
              fontWeight: active === item.id ? 500 : 400, transition: 'all 0.15s'
            }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>

        <div style={{ padding: '16px 16px 0', borderTop: '1px solid ' + c.border }}>
          <button onClick={toggleTheme} style={{
            width: '100%', background: c.bgCard, border: '1px solid ' + c.borderStrong,
            borderRadius: 8, padding: '8px', fontSize: 13, color: c.textMuted,
            cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", marginBottom: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
          }}>
            {isDark ? '☀ Light mode' : '🌙 Dark mode'}
          </button>

          {/* Replay onboarding */}
          <button onClick={() => setShowOnboarding(true)} style={{
            width: '100%', background: 'transparent', border: '1px solid ' + c.borderStrong,
            borderRadius: 8, padding: '8px', fontSize: 13, color: c.textMuted,
            cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", marginBottom: 12,
          }}>
            ? Help tour
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: '#fff', flexShrink: 0 }}>{initials}</div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: c.text }}>{user?.email}</div>
              <div style={{ fontSize: 11, color: c.textFaint }}>Free plan</div>
            </div>
          </div>
          <button onClick={() => { logout(); navigate('/login') }} style={{
            width: '100%', background: 'transparent', border: '1px solid ' + c.borderStrong,
            borderRadius: 8, padding: '8px', fontSize: 13, color: c.textMuted,
            cursor: 'pointer', fontFamily: "'DM Sans', sans-serif"
          }}>Logout</button>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, padding: '40px 48px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 700, letterSpacing: -0.5, marginBottom: 4, color: c.text }}>My Portfolios</h1>
            <p style={{ fontSize: 14, color: c.textFaint }}>{portfolios.length} portfolio{portfolios.length !== 1 ? 's' : ''} · click to edit</p>
          </div>
          <button onClick={createPortfolio} disabled={creating} style={{
            background: '#6366f1', color: '#fff', border: 'none', borderRadius: 10,
            padding: '10px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif", opacity: creating ? 0.7 : 1,
            display: 'flex', alignItems: 'center', gap: 8
          }}>
            <span style={{ fontSize: 18, lineHeight: 1 }}>+</span>
            {creating ? 'Creating...' : 'New Portfolio'}
          </button>
        </div>

        {/* STATS */}
        {portfolios.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 32 }}>
            {[
              { label: 'Total Portfolios', value: portfolios.length, icon: '⊞', color: '#6366f1' },
              { label: 'Published', value: publishedCount, icon: '↗', color: '#4ade80' },
              { label: 'Total Views', value: totalViews.toLocaleString(), icon: '◎', color: '#f59e0b' },
            ].map(stat => (
              <div key={stat.label} style={{ background: c.bgCard, border: '1px solid ' + c.border, borderRadius: 12, padding: '20px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: 11, color: c.textFaint, textTransform: 'uppercase', letterSpacing: 1 }}>{stat.label}</span>
                  <span style={{ fontSize: 16, color: stat.color }}>{stat.icon}</span>
                </div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 700, color: stat.color }}>{stat.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* GRID */}
        {loading ? (
          <div style={{ color: c.textFaint, fontSize: 14 }}>Loading...</div>
        ) : portfolios.length === 0 ? (
          <div style={{ border: '2px dashed ' + c.borderStrong, borderRadius: 16, padding: '64px 32px', textAlign: 'center', cursor: 'pointer' }} onClick={createPortfolio}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>✦</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 600, marginBottom: 8, color: c.text }}>Create your first portfolio</div>
            <p style={{ fontSize: 14, color: c.textFaint, marginBottom: 24 }}>Drag, drop, and publish in minutes</p>
            <button style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Get started →</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {portfolios.map(p => (
              <div key={p.id} onClick={() => navigate('/editor/' + p.id)}
                style={{ background: c.bgCard, border: '1px solid ' + c.border, borderRadius: 14, padding: 20, cursor: 'pointer', transition: 'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#6366f1'}
                onMouseLeave={e => e.currentTarget.style.borderColor = c.border}
              >
                <div style={{ height: 140, background: c.bgHover, borderRadius: 10, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundImage: 'linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                  <span style={{ fontSize: 32, opacity: 0.3 }}>◈</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4, color: c.text }}>{p.title}</div>
                    <div style={{ fontSize: 12, color: c.textFaint }}>
                      {p.published ? <span style={{ color: '#4ade80' }}>● Published</span> : <span>○ Draft</span>}
                      {' · '}{p.template}
                    </div>
                  </div>
                  <button onClick={(e) => deletePortfolio(p.id, e)} style={{ background: 'transparent', border: '1px solid ' + c.borderStrong, borderRadius: 6, padding: '4px 8px', fontSize: 11, color: c.textFaint, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Delete</button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid ' + c.border }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: c.textFaint }}>
                    <span style={{ color: '#f59e0b' }}>◎</span>
                    <span>{(p.views || 0).toLocaleString()} view{p.views !== 1 ? 's' : ''}</span>
                  </div>
                  {p.published && (
                    <a href={'/p/' + p.slug} target="_blank" onClick={e => e.stopPropagation()} style={{ fontSize: 11, color: c.accentText, textDecoration: 'none' }}>View live ↗</a>
                  )}
                </div>
              </div>
            ))}
            <div onClick={createPortfolio} style={{ background: 'transparent', border: '2px dashed ' + c.borderStrong, borderRadius: 14, padding: 20, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 240, transition: 'border-color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#6366f1'}
              onMouseLeave={e => e.currentTarget.style.borderColor = c.borderStrong}
            >
              <span style={{ fontSize: 28, color: c.borderStrong, marginBottom: 8 }}>+</span>
              <span style={{ fontSize: 13, color: c.textFaint }}>New portfolio</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}