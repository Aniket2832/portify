import { useState } from 'react'
import { useEditorStore } from '../../store/editorStore'
import { useTheme } from '../../context/ThemeContext'
import api from '../../api/axios'

export default function SlugEditor() {
  const { slug, portfolioId, setSlug } = useEditorStore()
  const { c } = useTheme()
  const [editing, setEditing] = useState(false)
  const [val, setVal] = useState(slug)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSave = async () => {
    setError('')
    try {
      const { data } = await api.put('/portfolios/' + portfolioId, { slug: val })
      setSlug(data.slug)
      setVal(data.slug)
      setEditing(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update URL')
    }
  }

  return (
    <div style={{ margin: '8px 12px 4px', padding: '12px', background: c.bgCard, border: '1px solid ' + c.borderStrong, borderRadius: 8 }}>
      <div style={{ fontSize: 11, color: c.textFaint, marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase' }}>Public URL</div>
      {editing ? (
        <>
          <div style={{ display: 'flex', gap: 6 }}>
            <input value={val} onChange={e => setVal(e.target.value)}
              style={{ flex: 1, background: c.bgInput, border: '1px solid #6366f1', borderRadius: 6, padding: '6px 8px', color: c.text, fontSize: 12, fontFamily: "'DM Sans', sans-serif", outline: 'none' }} />
            <button onClick={handleSave} style={{ background: '#6366f1', border: 'none', borderRadius: 6, padding: '6px 10px', fontSize: 12, color: '#fff', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Save</button>
            <button onClick={() => { setEditing(false); setVal(slug); setError('') }} style={{ background: 'transparent', border: '1px solid ' + c.borderStrong, borderRadius: 6, padding: '6px 8px', fontSize: 12, color: c.textFaint, cursor: 'pointer' }}>✕</button>
          </div>
          {error && <div style={{ fontSize: 11, color: '#f87171', marginTop: 6 }}>{error}</div>}
        </>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, color: success ? '#4ade80' : c.accentText, wordBreak: 'break-all' }}>
            {success ? '✓ Updated!' : '/p/' + slug}
          </span>
          <button onClick={() => { setEditing(true); setVal(slug) }} style={{ background: 'transparent', border: 'none', fontSize: 11, color: c.textFaint, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", flexShrink: 0, marginLeft: 8 }}>Edit</button>
        </div>
      )}
    </div>
  )
}