import { useEditorStore } from '../../store/editorStore'
import { useTheme } from '../../context/ThemeContext'

const TEMPLATES = [
  { id: 'minimal', label: 'Minimal', desc: 'Clean & elegant', color: '#6366f1' },
  { id: 'bold', label: 'Bold', desc: 'Big & striking', color: '#ff4d00' },
  { id: 'glass', label: 'Glass', desc: 'Blurred & vibrant', color: '#a78bfa' },
  { id: 'terminal', label: 'Terminal', desc: 'Hacker aesthetic', color: '#3fb950' },
]

export default function TemplateSelector() {
  const { template, setTemplate } = useEditorStore()
  const { c } = useTheme()

  return (
    <div style={{ margin: '8px 12px 4px', padding: '12px', background: c.bgCard, border: '1px solid ' + c.borderStrong, borderRadius: 8 }}>
      <div style={{ fontSize: 11, color: c.textFaint, marginBottom: 10, letterSpacing: 1, textTransform: 'uppercase' }}>Template</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {TEMPLATES.map(t => (
          <div key={t.id} onClick={() => setTemplate(t.id)} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '8px 10px', borderRadius: 6, cursor: 'pointer',
            background: template === t.id ? c.accentBg : 'transparent',
            border: template === t.id ? '1px solid ' + c.accentBorder : '1px solid transparent',
            transition: 'all 0.15s'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: t.color, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 12, fontWeight: 500, color: template === t.id ? c.text : c.textMuted }}>{t.label}</div>
                <div style={{ fontSize: 10, color: c.textFaint }}>{t.desc}</div>
              </div>
            </div>
            {template === t.id && <span style={{ fontSize: 10, color: c.accentText }}>✓</span>}
          </div>
        ))}
      </div>
    </div>
  )
}