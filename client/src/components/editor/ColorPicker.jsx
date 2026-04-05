import { useEditorStore } from '../../store/editorStore'
import { useTheme } from '../../context/ThemeContext'

const PRESETS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e',
  '#f59e0b', '#10b981', '#06b6d4', '#3b82f6',
  '#ff4d00', '#84cc16', '#ffffff', '#a1a1aa',
]

export default function ColorPicker() {
  const { c } = useTheme()
  const { accentColor, setAccentColor } = useEditorStore()

  return (
    <div style={{ margin: '8px 12px 4px', padding: '12px', background: c.bgCard, border: '1px solid ' + c.borderStrong, borderRadius: 8 }}>
      <div style={{ fontSize: 11, color: c.textFaint, marginBottom: 10, letterSpacing: 1, textTransform: 'uppercase' }}>Accent Color</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
        {PRESETS.map(color => (
          <div
            key={color}
            onClick={() => setAccentColor(color)}
            style={{
              width: 22, height: 22, borderRadius: 99, background: color,
              cursor: 'pointer', transition: 'transform 0.15s',
              border: accentColor === color ? '2px solid ' + c.text : '2px solid transparent',
              transform: accentColor === color ? 'scale(1.2)' : 'scale(1)',
              boxShadow: color === '#ffffff' ? 'inset 0 0 0 1px ' + c.borderStrong : 'none'
            }}
          />
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input
          type="color"
          value={accentColor || '#6366f1'}
          onChange={e => setAccentColor(e.target.value)}
          style={{ width: 32, height: 28, border: 'none', borderRadius: 6, cursor: 'pointer', background: 'transparent', padding: 0 }}
        />
        <span style={{ fontSize: 11, color: c.textFaint, fontFamily: 'monospace' }}>{accentColor || '#6366f1'}</span>
      </div>
    </div>
  )
}