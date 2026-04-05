import { useEditorStore } from '../../store/editorStore'
import { generateHTML } from '../../utils/exportHTML'

export default function LivePreview() {
  const { data, sections, title, template, accentColor } = useEditorStore()
  const html = generateHTML(title, data, sections, 'dark', template, accentColor)

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: '#0e0e12', borderBottom: '1px solid #1f1f23', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#3f3f46' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#3f3f46' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#3f3f46' }} />
        <div style={{ flex: 1, background: '#141417', border: '1px solid #27272a', borderRadius: 6, padding: '3px 12px', fontSize: 11, color: '#52525b', marginLeft: 8 }}>
          portify.app/{title?.toLowerCase().replace(/\s+/g, '-')}
        </div>
        <div style={{ fontSize: 11, color: '#52525b', background: '#141417', border: '1px solid #27272a', borderRadius: 4, padding: '2px 8px' }}>
          {template}
        </div>
      </div>
      <iframe key={template + accentColor} srcDoc={html} style={{ flex: 1, border: 'none', width: '100%' }} title="Live Preview" />
    </div>
  )
}