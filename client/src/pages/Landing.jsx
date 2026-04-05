import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

const FEATURES = [
  { icon: '⠿', title: 'Drag & Drop Editor', desc: 'Reorder sections, edit content inline — no code needed.' },
  { icon: '◈', title: '4 Stunning Templates', desc: 'Minimal, Bold, Glass, Terminal — switch with one click.' },
  { icon: '✦', title: 'AI Bio Generator', desc: 'Type your skills, get a professional bio in seconds.' },
  { icon: '⌥', title: 'GitHub Import', desc: 'Auto-import your repos and turn them into project cards.' },
  { icon: '↗', title: 'Publish Instantly', desc: 'Get a public URL in one click. Share it anywhere.' },
  { icon: '◎', title: 'Analytics', desc: 'See how many people viewed your portfolio.' },
]

const TEMPLATES = [
  { name: 'Minimal', color: '#6366f1', bg: '#09090b', desc: 'Clean & elegant' },
  { name: 'Bold', color: '#ff4d00', bg: '#0a0a0a', desc: 'Big & striking' },
  { name: 'Glass', color: '#a78bfa', bg: '#302b63', desc: 'Blurred & vibrant' },
  { name: 'Terminal', color: '#3fb950', bg: '#0d1117', desc: 'Hacker aesthetic' },
]

const STEPS = [
  { num: '01', title: 'Create account', desc: 'Sign up free in 30 seconds. No credit card required.' },
  { num: '02', title: 'Pick a template', desc: 'Choose from 4 professionally designed templates.' },
  { num: '03', title: 'Fill your content', desc: 'Add your skills, projects, experience — or import from GitHub.' },
  { num: '04', title: 'Publish & share', desc: 'Get your public URL and share it with recruiters.' },
]

export default function Landing() {
  const navigate = useNavigate()
  const { c, isDark, toggleTheme } = useTheme()

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: c.bgPrimary, color: c.text, minHeight: '100vh' }}>

      {/* NAV */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: isDark ? 'rgba(9,9,11,0.8)' : 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(12px)', borderBottom: '1px solid ' + c.border,
        padding: '0 48px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 700, color: c.text }}>
          Portify<span style={{ color: '#6366f1' }}>.</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={toggleTheme} style={{ background: 'transparent', border: '1px solid ' + c.borderStrong, borderRadius: 99, padding: '5px 12px', fontSize: 12, color: c.textMuted, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
            {isDark ? '☀ Light' : '🌙 Dark'}
          </button>
          <button onClick={() => navigate('/login')} style={{ background: 'transparent', border: '1px solid ' + c.borderStrong, borderRadius: 8, padding: '7px 16px', fontSize: 13, color: c.text, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
            Login
          </button>
          <button onClick={() => navigate('/register')} style={{ background: '#6366f1', border: 'none', borderRadius: 8, padding: '7px 18px', fontSize: 13, fontWeight: 600, color: '#fff', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
            Get started free →
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '100px 48px 80px', textAlign: 'center', maxWidth: 900, margin: '0 auto' }}>
        {/* Background orbs */}
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'rgba(99,102,241,0.12)', filter: 'blur(100px)', top: -100, left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'rgba(139,92,246,0.08)', filter: 'blur(80px)', bottom: 0, right: 0, pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: c.accentBg, border: '1px solid ' + c.accentBorder, borderRadius: 99, padding: '5px 14px 5px 8px', fontSize: 12, color: '#818cf8', marginBottom: 28 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1', display: 'inline-block' }} />
            Free forever · No credit card needed
          </div>

          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(40px, 7vw, 80px)', fontWeight: 800, letterSpacing: -3, lineHeight: 1.0, marginBottom: 24, color: c.text }}>
            The portfolio builder<br />
            <span style={{ color: '#6366f1' }}>that gets you hired.</span>
          </h1>

          <p style={{ fontSize: 18, color: c.textMuted, lineHeight: 1.7, maxWidth: 560, margin: '0 auto 40px', fontWeight: 300 }}>
            Build a stunning developer portfolio in minutes. Drag, drop, publish. Import your GitHub projects automatically.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/register')} style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: 12, padding: '14px 32px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif', letterSpacing: -0.3" }}>
              Build my portfolio →
            </button>
            <button onClick={() => navigate('/p/demo')} style={{ background: c.bgCard, color: c.text, border: '1px solid ' + c.borderStrong, borderRadius: 12, padding: '14px 24px', fontSize: 15, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
              See demo ↗
            </button>
          </div>

          <p style={{ fontSize: 12, color: c.textFaint, marginTop: 16 }}>
            Join developers building their dream portfolios
          </p>
        </div>
      </section>

      {/* TEMPLATE SHOWCASE */}
      <section style={{ padding: '60px 48px', maxWidth: 1100, margin: '0 auto' }}>
        <p style={{ fontSize: 11, color: '#6366f1', letterSpacing: 3, textTransform: 'uppercase', textAlign: 'center', marginBottom: 12 }}>Templates</p>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, letterSpacing: -1.5, textAlign: 'center', marginBottom: 48, color: c.text }}>
          4 unique styles. One click to switch.
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {TEMPLATES.map(t => (
            <div key={t.name} style={{ background: t.bg, border: '1px solid #27272a', borderRadius: 16, padding: 24, cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
              onClick={() => navigate('/register')}
            >
              <div style={{ width: 32, height: 32, borderRadius: 8, background: t.color, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>◈</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{t.name}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{t.desc}</div>
              <div style={{ marginTop: 20, height: 60, background: 'rgba(255,255,255,0.04)', borderRadius: 8, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 12px', gap: 6 }}>
                <div style={{ height: 6, borderRadius: 99, background: t.color, width: '70%', opacity: 0.7 }} />
                <div style={{ height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.15)', width: '90%' }} />
                <div style={{ height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.1)', width: '60%' }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES GRID */}
      <section style={{ padding: '60px 48px', maxWidth: 1100, margin: '0 auto' }}>
        <p style={{ fontSize: 11, color: '#6366f1', letterSpacing: 3, textTransform: 'uppercase', textAlign: 'center', marginBottom: 12 }}>Features</p>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, letterSpacing: -1.5, textAlign: 'center', marginBottom: 48, color: c.text }}>
          Everything you need to stand out.
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {FEATURES.map(f => (
            <div key={f.title} style={{ background: c.bgCard, border: '1px solid ' + c.border, borderRadius: 14, padding: '24px 28px', transition: 'border-color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#6366f1'}
              onMouseLeave={e => e.currentTarget.style.borderColor = c.border}
            >
              <div style={{ fontSize: 24, color: '#6366f1', marginBottom: 14 }}>{f.icon}</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 17, fontWeight: 700, marginBottom: 8, color: c.text }}>{f.title}</div>
              <div style={{ fontSize: 14, color: c.textMuted, lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '60px 48px', maxWidth: 900, margin: '0 auto' }}>
        <p style={{ fontSize: 11, color: '#6366f1', letterSpacing: 3, textTransform: 'uppercase', textAlign: 'center', marginBottom: 12 }}>How it works</p>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, letterSpacing: -1.5, textAlign: 'center', marginBottom: 48, color: c.text }}>
          From zero to published in 5 minutes.
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 24 }}>
          {STEPS.map((s, i) => (
            <div key={s.num} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 48, fontWeight: 800, color: c.accentBg === 'rgba(99,102,241,0.12)' ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.12)', marginBottom: 12, lineHeight: 1 }}>{s.num}</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 8, color: c.text }}>{s.title}</div>
              <div style={{ fontSize: 13, color: c.textMuted, lineHeight: 1.6 }}>{s.desc}</div>
              {i < STEPS.length - 1 && (
                <div style={{ display: 'none' }} />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section style={{ padding: '80px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'rgba(99,102,241,0.1)', filter: 'blur(80px)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(32px,5vw,56px)', fontWeight: 800, letterSpacing: -2, marginBottom: 20, color: c.text }}>
            Ready to get hired?
          </h2>
          <p style={{ fontSize: 16, color: c.textMuted, marginBottom: 36, fontWeight: 300 }}>
            Create your portfolio for free. No credit card required.
          </p>
          <button onClick={() => navigate('/register')} style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: 12, padding: '16px 40px', fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
            Start building for free →
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid ' + c.border, padding: '28px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, color: c.text }}>
          Portify<span style={{ color: '#6366f1' }}>.</span>
        </div>
        <div style={{ fontSize: 12, color: c.textFaint }}>© 2025 Portify. Built with ♥ by Aniket</div>
        <div style={{ display: 'flex', gap: 16 }}>
          <span onClick={() => navigate('/login')} style={{ fontSize: 13, color: c.textMuted, cursor: 'pointer' }}>Login</span>
          <span onClick={() => navigate('/register')} style={{ fontSize: 13, color: '#818cf8', cursor: 'pointer' }}>Register</span>
        </div>
      </footer>
    </div>
  )
}