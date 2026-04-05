import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

export default function Register() {
  const { login, token } = useAuth()
  const { c, isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (token) navigate('/dashboard', { replace: true })
  }, [token])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/auth/register', form)
      login(data.token, data.user)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif", background: c.bgPrimary, color: c.text, position: 'relative' }}>

      {/* Theme toggle */}
      <button onClick={toggleTheme} style={{
        position: 'absolute', top: 20, right: 20, zIndex: 10,
        background: c.bgCard, border: '1px solid ' + c.borderStrong,
        borderRadius: 99, padding: '6px 14px', fontSize: 12,
        color: c.textMuted, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif"
      }}>
        {isDark ? '☀ Light' : '🌙 Dark'}
      </button>

      {/* LEFT PANEL */}
      <div style={{
        width: '48%', background: isDark ? '#09090b' : '#f0f0ff', padding: '48px',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        position: 'relative', overflow: 'hidden', borderRight: '1px solid ' + c.border
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(99,102,241,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.07) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div style={{ position: 'absolute', width: 320, height: 320, borderRadius: '50%', background: 'rgba(99,102,241,0.18)', filter: 'blur(80px)', top: -80, right: -80 }} />
        <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'rgba(139,92,246,0.12)', filter: 'blur(80px)', bottom: 100, left: -60 }} />

        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 700, color: isDark ? '#fff' : '#09090b', position: 'relative', zIndex: 1 }}>
          Portify<span style={{ color: '#6366f1' }}>.</span>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 99, padding: '3px 10px 3px 6px', fontSize: 11, color: '#818cf8', marginBottom: 20 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1', display: 'inline-block' }} />
            Now in beta
          </div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 52, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2, color: isDark ? '#fff' : '#09090b', marginBottom: 20 }}>
            Build portfolios<br />that <span style={{ color: '#6366f1' }}>get you hired.</span>
          </h1>
          <p style={{ fontSize: 16, color: c.textMuted, lineHeight: 1.6, maxWidth: 340, fontWeight: 300 }}>
            Drag, drop, publish. Turn your GitHub projects into a stunning portfolio in under 5 minutes.
          </p>
          <div style={{ background: c.bgCard, border: '1px solid ' + c.borderStrong, borderRadius: 16, padding: 20, marginTop: 36 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, color: '#fff' }}>A</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: c.text }}>Aniket Udgirkar</div>
                <div style={{ fontSize: 12, color: c.textFaint }}>Full Stack Developer · Pune</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
              {['React', 'Node.js', 'Supabase'].map(t => (
                <span key={t} style={{ background: c.accentBg, border: '1px solid ' + c.accentBorder, borderRadius: 6, padding: '4px 10px', fontSize: 11, color: c.accentText }}>{t}</span>
              ))}
            </div>
            <div style={{ fontSize: 11, color: c.textFaint, display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}><span>Profile complete</span><span>78%</span></div>
            <div style={{ height: 4, background: c.borderStrong, borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ width: '78%', height: '100%', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', borderRadius: 99 }} />
            </div>
          </div>
        </div>
        <div style={{ fontSize: 12, color: c.textFaint, position: 'relative', zIndex: 1 }}>© 2025 Portify. All rights reserved.</div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{ flex: 1, background: c.bgSecondary, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48 }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 700, letterSpacing: -0.5, marginBottom: 6, color: c.text }}>Create account</h2>
          <p style={{ fontSize: 14, color: c.textMuted, marginBottom: 28, fontWeight: 300 }}>Start building your portfolio today — free forever</p>

          <div style={{ display: 'flex', background: c.bgCard, border: '1px solid ' + c.borderStrong, borderRadius: 10, padding: 4, marginBottom: 28 }}>
            <div style={{ flex: 1, padding: '8px', textAlign: 'center', fontSize: 13, fontWeight: 500, color: c.textFaint, cursor: 'pointer' }} onClick={() => navigate('/login')}>Login</div>
            <div style={{ flex: 1, padding: '8px', textAlign: 'center', fontSize: 13, fontWeight: 500, background: c.accentBg, borderRadius: 7, color: c.accentText }}>Register</div>
          </div>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#f87171', marginBottom: 16 }}>{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            {[
              { label: 'Full name', name: 'name', type: 'text', placeholder: 'Aniket Udgirkar' },
              { label: 'Email address', name: 'email', type: 'email', placeholder: 'you@example.com' },
              { label: 'Password', name: 'password', type: 'password', placeholder: '••••••••' },
            ].map(f => (
              <div key={f.name} style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 12, color: c.textMuted, marginBottom: 6 }}>{f.label}</div>
                <input
                  name={f.name} type={f.type} placeholder={f.placeholder}
                  value={form[f.name]} onChange={handleChange} required
                  style={{ width: '100%', background: c.bgInput, border: '1px solid ' + c.borderStrong, borderRadius: 10, padding: '11px 14px', color: c.text, fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: 'none' }}
                />
              </div>
            ))}
            <button type="submit" disabled={loading} style={{
              width: '100%', background: loading ? '#4338ca' : '#6366f1', color: '#fff',
              border: 'none', borderRadius: 10, padding: '12px', fontSize: 14,
              fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', marginTop: 6, opacity: loading ? 0.7 : 1
            }}>
              {loading ? 'Creating account...' : 'Create free account'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0' }}>
            <div style={{ flex: 1, height: 1, background: c.border }} />
            <span style={{ fontSize: 12, color: c.textFaint }}>or</span>
            <div style={{ flex: 1, height: 1, background: c.border }} />
          </div>

          <a href={(import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : 'http://localhost:5000/api') + '/auth/google'}
  style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
    width: '100%', background: c.bgCard, border: '1px solid ' + c.borderStrong,
    borderRadius: 10, padding: '11px', fontSize: 14, fontWeight: 500,
    color: c.textMuted, textDecoration: 'none'
  }}
>
  <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
  Continue with Google
</a>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: c.textFaint }}>
            Already have an account?{' '}
            <span onClick={() => navigate('/login')} style={{ color: c.accentText, cursor: 'pointer' }}>Login</span>
          </p>
        </div>
      </div>
    </div>
  )
}