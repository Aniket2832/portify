import { useState, useRef } from 'react'
import { useEditorStore } from '../../store/editorStore'
import { useTheme } from '../../context/ThemeContext'

export default function ResumeParser() {
  const { c } = useTheme()
  const { updateData, setTitle } = useEditorStore()
  const [parsing, setParsing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [preview, setPreview] = useState(null)
  const inputRef = useRef()

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setParsing(true)
    setError('')
    setSuccess(false)
    setPreview(null)

    try {
      const formData = new FormData()
      formData.append('resume', file)

      const token = localStorage.getItem('token')
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
      const response = await fetch(baseUrl + '/resume/parse', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + token },
        body: formData
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.message)

      setPreview(data)
    } catch (err) {
      setError(err.message || 'Failed to parse resume. Try again.')
    } finally {
      setParsing(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const applyAll = () => {
    if (!preview) return
    if (preview.hero) updateData('hero', preview.hero)
    if (preview.skills) updateData('skills', preview.skills)
    if (preview.projects) updateData('projects', preview.projects)
    if (preview.experience) updateData('experience', preview.experience)
    if (preview.contact) updateData('contact', preview.contact)
    if (preview.hero?.name) setTitle(preview.hero.name + "'s Portfolio")
    setSuccess(true)
    setPreview(null)
    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <div style={{ margin: '8px 12px 4px', padding: '12px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 8 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 14 }}>📄</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#f59e0b' }}>Resume Parser</span>
      </div>

      <p style={{ fontSize: 11, color: c.textMuted, marginBottom: 10, lineHeight: 1.5 }}>
        Upload your resume — AI will auto-fill all sections instantly.
      </p>

      {/* Upload button */}
      {!preview && (
        <button
          onClick={() => inputRef.current?.click()}
          disabled={parsing}
          style={{
            width: '100%', background: parsing ? 'rgba(245,158,11,0.1)' : 'rgba(245,158,11,0.15)',
            border: '1px solid rgba(245,158,11,0.3)', borderRadius: 7,
            padding: '9px', fontSize: 12, fontWeight: 600,
            color: '#f59e0b', cursor: parsing ? 'default' : 'pointer',
            fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s'
          }}
        >
          {parsing ? '⏳ Parsing resume...' : '📤 Upload PDF or Word'}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFile}
        style={{ display: 'none' }}
      />

      {error && (
        <div style={{ fontSize: 11, color: '#f87171', marginTop: 8, padding: '6px 8px', background: 'rgba(239,68,68,0.08)', borderRadius: 6 }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{ fontSize: 11, color: '#4ade80', marginTop: 8, padding: '6px 8px', background: 'rgba(74,222,128,0.08)', borderRadius: 6 }}>
          ✓ All sections filled successfully!
        </div>
      )}

      {/* Preview */}
      {preview && (
        <div style={{ marginTop: 10 }}>
          <div style={{ fontSize: 11, color: c.textFaint, marginBottom: 8 }}>Found:</div>
          <div style={{ background: c.bgCard, border: '1px solid ' + c.borderStrong, borderRadius: 7, padding: 10, marginBottom: 10, fontSize: 11, color: c.textMuted, lineHeight: 1.8 }}>
            {preview.hero?.name && <div>👤 <strong style={{ color: c.text }}>{preview.hero.name}</strong></div>}
            {preview.hero?.tagline && <div>💼 {preview.hero.tagline}</div>}
            {preview.skills?.length > 0 && <div>⚡ {preview.skills.length} skills found</div>}
            {preview.experience?.length > 0 && <div>🏢 {preview.experience.length} experience entries</div>}
            {preview.projects?.length > 0 && <div>⊞ {preview.projects.length} projects found</div>}
            {preview.contact?.email && <div>✉ {preview.contact.email}</div>}
          </div>

          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={applyAll} style={{
              flex: 1, background: '#f59e0b', color: '#000', border: 'none',
              borderRadius: 7, padding: '8px', fontSize: 12, fontWeight: 700,
              cursor: 'pointer', fontFamily: "'DM Sans', sans-serif"
            }}>
              ✓ Auto-fill all sections
            </button>
            <button onClick={() => setPreview(null)} style={{
              background: 'transparent', border: '1px solid ' + c.borderStrong,
              borderRadius: 7, padding: '8px 10px', fontSize: 12, color: c.textFaint,
              cursor: 'pointer', fontFamily: "'DM Sans', sans-serif"
            }}>✕</button>
          </div>
        </div>
      )}
    </div>
  )
}