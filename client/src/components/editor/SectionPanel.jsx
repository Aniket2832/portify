import { useState } from 'react'
import { useEditorStore } from '../../store/editorStore'
import { useTheme } from '../../context/ThemeContext'
import GitHubImport from './GitHubImport'
import ImageUpload from './ImageUpload'

const headingStyle = { fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 20 }

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 11, color: '#71717a', letterSpacing: 0.3 }}>{label}</div>
      {children}
    </div>
  )
}

function useInputStyle() {
  const { c } = useTheme()
  return {
    width: '100%', background: c.bgInput, border: '1px solid ' + c.borderStrong,
    borderRadius: 8, padding: '9px 12px', color: c.text, fontSize: 13,
    fontFamily: "'DM Sans', sans-serif", outline: 'none', marginTop: 6,
    boxSizing: 'border-box',
  }
}

function AIBioGenerator({ onInsert }) {
  const { c } = useTheme()
  const inputStyle = useInputStyle()
  const [keywords, setKeywords] = useState('')
  const [generating, setGenerating] = useState(false)
  const [preview, setPreview] = useState('')
  const [error, setError] = useState('')

  const generate = async () => {
    if (!keywords.trim()) return
    setGenerating(true)
    setPreview('')
    setError('')
    try {
      const token = localStorage.getItem('token')
    const response = await fetch(
  (import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + '/ai/generate-bio',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({ keywords })
  }
)
      const data = await response.json()
      if (!response.ok) throw new Error(data.message)
      setPreview(data.bio)
    } catch {
      setError('Generation failed. Try again.')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 10, padding: 14, marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span>✦</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#818cf8' }}>AI Bio Generator</span>
      </div>
      <div style={{ fontSize: 11, color: c.textMuted, marginBottom: 6 }}>Your skills / keywords</div>
      <input
        value={keywords} onChange={e => setKeywords(e.target.value)}
        placeholder="React, Node.js, 2 years exp..."
        style={{ ...inputStyle, marginTop: 0, marginBottom: 10 }}
        onKeyDown={e => e.key === 'Enter' && generate()}
      />
      <button onClick={generate} disabled={generating || !keywords.trim()} style={{
        width: '100%', background: generating ? '#4338ca' : '#6366f1', color: '#fff',
        border: 'none', borderRadius: 7, padding: '8px', fontSize: 12, fontWeight: 600,
        cursor: generating ? 'default' : 'pointer', fontFamily: "'DM Sans', sans-serif",
        opacity: generating ? 0.7 : 1, marginBottom: preview ? 12 : 0
      }}>
        {generating ? '✦ Generating...' : '✦ Generate Bio'}
      </button>
      {error && <div style={{ fontSize: 11, color: '#f87171', marginTop: 8 }}>{error}</div>}
      {preview && (
        <div>
          <div style={{ fontSize: 11, color: c.textFaint, marginBottom: 6 }}>Preview:</div>
          <div style={{ background: c.bgCard, border: '1px solid ' + c.borderStrong, borderRadius: 7, padding: 10, fontSize: 12, color: c.textMuted, lineHeight: 1.7, marginBottom: 10 }}>
            {preview}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => { onInsert(preview); setPreview(''); setKeywords('') }} style={{
              flex: 1, background: '#4ade80', color: '#09090b', border: 'none',
              borderRadius: 7, padding: '7px', fontSize: 12, fontWeight: 700,
              cursor: 'pointer', fontFamily: "'DM Sans', sans-serif"
            }}>✓ Use this bio</button>
            <button onClick={generate} style={{
              background: 'transparent', border: '1px solid ' + c.borderStrong, borderRadius: 7,
              padding: '7px 12px', fontSize: 12, color: c.textFaint,
              cursor: 'pointer', fontFamily: "'DM Sans', sans-serif"
            }}>↺</button>
          </div>
        </div>
      )}
    </div>
  )
}

function HeroPanel({ data, update }) {
  const { c } = useTheme()
  const inputStyle = useInputStyle()
  const d = data.hero
  return (
    <div>
      <div style={headingStyle}>Hero Section</div>
      <AIBioGenerator onInsert={(bio) => update('hero', { ...d, bio })} />
      <Field label="Full name">
        <input style={inputStyle} value={d.name} placeholder="Aniket Udgirkar" onChange={e => update('hero', { ...d, name: e.target.value })} />
      </Field>
      <Field label="Tagline">
        <input style={inputStyle} value={d.tagline} placeholder="Full Stack Developer" onChange={e => update('hero', { ...d, tagline: e.target.value })} />
      </Field>
      <Field label="Bio">
        <textarea style={{ ...inputStyle, minHeight: 100, resize: 'vertical' }} value={d.bio} placeholder="A short description about yourself..." onChange={e => update('hero', { ...d, bio: e.target.value })} />
      </Field>
    </div>
  )
}

function SkillsPanel({ data, update }) {
  const { c } = useTheme()
  const inputStyle = useInputStyle()
  const skills = data.skills || []
  const addSkill = () => update('skills', [...skills, { name: '', level: 80 }])
  const updateSkill = (i, field, val) => {
    const updated = [...skills]; updated[i] = { ...updated[i], [field]: val }; update('skills', updated)
  }
  const removeSkill = (i) => update('skills', skills.filter((_, idx) => idx !== i))

  return (
    <div>
      <div style={headingStyle}>Skills</div>
      {skills.map((s, i) => (
        <div key={i} style={{ background: c.bgCard, border: '1px solid ' + c.borderStrong, borderRadius: 8, padding: 12, marginBottom: 10 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <input style={{ ...inputStyle, marginTop: 0, flex: 1 }} value={s.name} placeholder="React" onChange={e => updateSkill(i, 'name', e.target.value)} />
            <button onClick={() => removeSkill(i)} style={{ background: 'transparent', border: '1px solid ' + c.borderStrong, borderRadius: 6, padding: '0 10px', color: c.textFaint, cursor: 'pointer', fontSize: 16 }}>×</button>
          </div>
          <div style={{ fontSize: 11, color: c.textMuted }}>Level: {s.level}%</div>
          <input type="range" min="0" max="100" value={s.level}
            onChange={e => updateSkill(i, 'level', Number(e.target.value))}
            style={{ width: '100%', accentColor: '#6366f1', marginTop: 6 }} />
        </div>
      ))}
      <button onClick={addSkill} style={{ width: '100%', background: 'transparent', border: '1px dashed ' + c.borderStrong, borderRadius: 8, padding: '9px', fontSize: 13, color: c.textFaint, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
        + Add skill
      </button>
    </div>
  )
}

function ProjectsPanel({ data, update }) {
  const { c } = useTheme()
  const inputStyle = useInputStyle()
  const projects = data.projects || []
  const add = () => update('projects', [...projects, { name: '', desc: '', url: '', tech: '', image: '' }])
  const upd = (i, field, val) => { const u = [...projects]; u[i] = { ...u[i], [field]: val }; update('projects', u) }
  const rem = (i) => update('projects', projects.filter((_, idx) => idx !== i))

  return (
    <div>
      <div style={headingStyle}>Projects</div>
      <GitHubImport />
      {projects.map((p, i) => (
        <div key={i} style={{ background: c.bgCard, border: '1px solid ' + c.borderStrong, borderRadius: 8, padding: 12, marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: c.textFaint }}>Project {i + 1}</span>
            <button onClick={() => rem(i)} style={{ background: 'transparent', border: 'none', color: c.textFaint, cursor: 'pointer', fontSize: 16 }}>×</button>
          </div>
          <Field label="Project name">
            <input style={inputStyle} value={p.name} placeholder="Portify" onChange={e => upd(i, 'name', e.target.value)} />
          </Field>
          <Field label="Description">
            <textarea style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }} value={p.desc} placeholder="What does it do?" onChange={e => upd(i, 'desc', e.target.value)} />
          </Field>
          <Field label="Tech stack">
            <input style={inputStyle} value={p.tech} placeholder="React, Node.js, Supabase" onChange={e => upd(i, 'tech', e.target.value)} />
          </Field>
          <Field label="URL">
            <input style={inputStyle} value={p.url} placeholder="https://github.com/..." onChange={e => upd(i, 'url', e.target.value)} />
          </Field>
          <Field label="Project image">
            <ImageUpload value={p.image || ''} onChange={val => upd(i, 'image', val)} />
          </Field>
        </div>
      ))}
      <button onClick={add} style={{ width: '100%', background: 'transparent', border: '1px dashed ' + c.borderStrong, borderRadius: 8, padding: '9px', fontSize: 13, color: c.textFaint, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
        + Add project manually
      </button>
    </div>
  )
}

function ExperiencePanel({ data, update }) {
  const { c } = useTheme()
  const inputStyle = useInputStyle()
  const exp = data.experience || []
  const add = () => update('experience', [...exp, { company: '', role: '', period: '', desc: '' }])
  const upd = (i, field, val) => { const u = [...exp]; u[i] = { ...u[i], [field]: val }; update('experience', u) }
  const rem = (i) => update('experience', exp.filter((_, idx) => idx !== i))

  return (
    <div>
      <div style={headingStyle}>Experience</div>
      {exp.map((e, i) => (
        <div key={i} style={{ background: c.bgCard, border: '1px solid ' + c.borderStrong, borderRadius: 8, padding: 12, marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: c.textFaint }}>Experience {i + 1}</span>
            <button onClick={() => rem(i)} style={{ background: 'transparent', border: 'none', color: c.textFaint, cursor: 'pointer', fontSize: 16 }}>×</button>
          </div>
          <Field label="Company"><input style={inputStyle} value={e.company} placeholder="Google" onChange={ev => upd(i, 'company', ev.target.value)} /></Field>
          <Field label="Role"><input style={inputStyle} value={e.role} placeholder="Software Engineer" onChange={ev => upd(i, 'role', ev.target.value)} /></Field>
          <Field label="Period"><input style={inputStyle} value={e.period} placeholder="Jan 2024 – Present" onChange={ev => upd(i, 'period', ev.target.value)} /></Field>
          <Field label="Description">
            <textarea style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }} value={e.desc} placeholder="What did you do?" onChange={ev => upd(i, 'desc', ev.target.value)} />
          </Field>
        </div>
      ))}
      <button onClick={add} style={{ width: '100%', background: 'transparent', border: '1px dashed ' + c.borderStrong, borderRadius: 8, padding: '9px', fontSize: 13, color: c.textFaint, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
        + Add experience
      </button>
    </div>
  )
}

function ContactPanel({ data, update }) {
  const { c } = useTheme()
  const inputStyle = useInputStyle()
  const cont = data.contact
  return (
    <div>
      <div style={headingStyle}>Contact</div>
      <Field label="Email"><input style={inputStyle} value={cont.email} placeholder="aniket@example.com" onChange={e => update('contact', { ...cont, email: e.target.value })} /></Field>
      <Field label="GitHub URL"><input style={inputStyle} value={cont.github} placeholder="https://github.com/aniket" onChange={e => update('contact', { ...cont, github: e.target.value })} /></Field>
      <Field label="LinkedIn URL"><input style={inputStyle} value={cont.linkedin} placeholder="https://linkedin.com/in/aniket" onChange={e => update('contact', { ...cont, linkedin: e.target.value })} /></Field>
    </div>
  )
}

export default function SectionPanel({ sectionId }) {
  const { data, updateData } = useEditorStore()
  const panels = {
    hero: <HeroPanel data={data} update={updateData} />,
    skills: <SkillsPanel data={data} update={updateData} />,
    projects: <ProjectsPanel data={data} update={updateData} />,
    experience: <ExperiencePanel data={data} update={updateData} />,
    contact: <ContactPanel data={data} update={updateData} />,
  }
  return panels[sectionId] || <div style={{ color: '#52525b', fontSize: 14 }}>Select a section</div>
}