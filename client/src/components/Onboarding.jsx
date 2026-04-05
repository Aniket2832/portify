import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'

const STEPS = [
  {
    icon: '◈',
    title: 'Welcome to Portify!',
    desc: 'Build a stunning developer portfolio in minutes. Let\'s show you how it works.',
    tip: null,
  },
  {
    icon: '⊞',
    title: 'Pick a template',
    desc: 'Choose from 4 beautiful templates — Minimal, Bold, Glass, or Terminal. Switch anytime.',
    tip: '💡 You can change your template anytime from the left sidebar in the editor.',
  },
  {
    icon: '⌥',
    title: 'Import from GitHub',
    desc: 'Enter your GitHub username in the Projects section to auto-import your repos as project cards.',
    tip: '💡 No API key needed — it uses GitHub\'s free public API.',
  },
  {
    icon: '↗',
    title: 'Publish instantly',
    desc: 'Hit Publish and get a shareable public URL. Send it to recruiters, add it to your resume.',
    tip: '💡 You can customise your URL from the slug editor in the sidebar.',
  },
]

export default function Onboarding({ onDone }) {
  const { c } = useTheme()
  const [step, setStep] = useState(0)
  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'DM Sans', sans-serif"
    }}>
      <div style={{
        background: c.bgSecondary, border: '1px solid ' + c.borderStrong,
        borderRadius: 20, padding: '40px 40px 32px', width: '100%', maxWidth: 460,
        position: 'relative', boxShadow: '0 24px 80px rgba(0,0,0,0.5)'
      }}>
        {/* Step dots */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 32 }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{
              height: 4, flex: i === step ? 2 : 1, borderRadius: 99,
              background: i <= step ? '#6366f1' : c.borderStrong,
              transition: 'all 0.3s'
            }} />
          ))}
        </div>

        {/* Icon */}
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 24, marginBottom: 24, color: '#818cf8'
        }}>
          {current.icon}
        </div>

        {/* Content */}
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 700, letterSpacing: -0.5, marginBottom: 12, color: c.text }}>
          {current.title}
        </h2>
        <p style={{ fontSize: 15, color: c.textMuted, lineHeight: 1.7, marginBottom: current.tip ? 16 : 32 }}>
          {current.desc}
        </p>

        {/* Tip */}
        {current.tip && (
          <div style={{ background: c.bgCard, border: '1px solid ' + c.border, borderRadius: 10, padding: '10px 14px', fontSize: 13, color: c.textMuted, marginBottom: 32, lineHeight: 1.6 }}>
            {current.tip}
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={onDone}
            style={{ background: 'transparent', border: 'none', fontSize: 13, color: c.textFaint, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
          >
            Skip tour
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)} style={{
                background: 'transparent', border: '1px solid ' + c.borderStrong,
                borderRadius: 8, padding: '9px 18px', fontSize: 13, color: c.textMuted,
                cursor: 'pointer', fontFamily: "'DM Sans', sans-serif"
              }}>← Back</button>
            )}
            <button onClick={() => isLast ? onDone() : setStep(s => s + 1)} style={{
              background: '#6366f1', border: 'none', borderRadius: 8,
              padding: '9px 24px', fontSize: 13, fontWeight: 600,
              color: '#fff', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif"
            }}>
              {isLast ? 'Get started →' : 'Next →'}
            </button>
          </div>
        </div>

        {/* Step counter */}
        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 11, color: c.textFaint }}>
          {step + 1} of {STEPS.length}
        </div>
      </div>
    </div>
  )
}