import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import api from '../api/axios'
import { useEditorStore } from '../store/editorStore'
import { useTheme } from '../context/ThemeContext'
import SortableSection from '../components/editor/SortableSection'
import SectionPanel from '../components/editor/SectionPanel'
import LivePreview from '../components/editor/LivePreview'
import SlugEditor from '../components/editor/SlugEditor'
import TemplateSelector from '../components/editor/TemplateSelector'
import ColorPicker from '../components/editor/ColorPicker'
import { downloadHTML, generateHTML } from '../utils/exportHTML'

export default function Editor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { c, isDark, toggleTheme } = useTheme()
  const {
    title, slug, published, template, accentColor, sections, activeSection, saved, saving,
    setPortfolio, setActiveSection, reorderSections, setTitle,
    setSaving, setSaved, setPublished
  } = useEditorStore()

  const [loading, setLoading] = useState(true)
  const [publishMsg, setPublishMsg] = useState('')
  const [fullscreen, setFullscreen] = useState(false)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/portfolios/' + id)
        setPortfolio(data.id, data.title, data.slug, data.published, data.template, data.accentColor, data.data, data.sections)
      } catch {
        navigate('/dashboard')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const handleSave = async () => {
    setSaving(true)
    try {
      const state = useEditorStore.getState()
      await api.put('/portfolios/' + id, {
        title: state.title,
        data: state.data,
        sections: state.sections,
        template: state.template,
        accentColor: state.accentColor,
      })
      setSaved(true)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handlePublish = async () => {
    try {
      const state = useEditorStore.getState()
      const newPublished = !state.published
      await api.put('/portfolios/' + id, { published: newPublished })
      setPublished(newPublished)
      if (newPublished) {
        const url = window.location.origin + '/p/' + state.slug
        setPublishMsg(url)
        setTimeout(() => setPublishMsg(''), 6000)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = sections.findIndex(s => s.id === active.id)
    const newIndex = sections.findIndex(s => s.id === over.id)
    reorderSections(arrayMove(sections, oldIndex, newIndex))
  }

  const getFullscreenHTML = () => {
    const state = useEditorStore.getState()
    return generateHTML(state.title, state.data, state.sections, isDark ? 'dark' : 'light', state.template, state.accentColor)
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: c.bgPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.textFaint, fontFamily: "'DM Sans', sans-serif" }}>
      Loading editor...
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: c.bgPrimary, fontFamily: "'DM Sans', sans-serif", color: c.text }}>

      {/* FULLSCREEN MODAL */}
      {fullscreen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#000', display: 'flex', flexDirection: 'column' }}>
          <div style={{ height: 48, background: '#0e0e12', borderBottom: '1px solid #1f1f23', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, color: '#fff' }}>
                Portify<span style={{ color: accentColor || '#6366f1' }}>.</span>
              </div>
              <div style={{ width: 1, height: 16, background: '#27272a' }} />
              <span style={{ fontSize: 12, color: '#52525b' }}>Fullscreen Preview</span>
              <span style={{ fontSize: 11, color: accentColor || '#818cf8', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 4, padding: '2px 8px' }}>{template}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                onClick={() => { downloadHTML(title, useEditorStore.getState().data, sections, isDark ? 'dark' : 'light', template, accentColor) }}
                style={{ background: 'transparent', border: '1px solid #27272a', borderRadius: 6, padding: '6px 12px', fontSize: 12, color: '#a1a1aa', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
              >Export ↓</button>
              <button
                onClick={() => setFullscreen(false)}
                style={{ background: '#ef4444', border: 'none', borderRadius: 6, padding: '6px 14px', fontSize: 12, fontWeight: 600, color: '#fff', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
              >✕ Close</button>
            </div>
          </div>
          <iframe
            srcDoc={getFullscreenHTML()}
            style={{ flex: 1, border: 'none', width: '100%' }}
            title="Fullscreen Preview"
          />
        </div>
      )}

      {/* TOP BAR */}
      <div style={{ height: 56, background: c.bgSecondary, borderBottom: '1px solid ' + c.border, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => navigate('/dashboard')} style={{ background: 'transparent', border: 'none', color: c.textFaint, cursor: 'pointer', fontSize: 20, lineHeight: 1, padding: 0 }}>←</button>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, color: c.text }}>
            Portify<span style={{ color: accentColor || '#6366f1' }}>.</span>
          </div>
          <div style={{ width: 1, height: 20, background: c.borderStrong }} />
          <input
            value={title} onChange={e => setTitle(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: c.text, fontSize: 14, fontWeight: 500, outline: 'none', fontFamily: "'DM Sans', sans-serif", width: 200 }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={toggleTheme} style={{ background: 'transparent', border: '1px solid ' + c.borderStrong, borderRadius: 8, padding: '6px 12px', fontSize: 12, color: c.textMuted, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
            {isDark ? '☀' : '🌙'}
          </button>
          <button onClick={() => setFullscreen(true)} style={{ background: 'transparent', border: '1px solid ' + c.borderStrong, borderRadius: 8, padding: '6px 12px', fontSize: 12, color: c.textMuted, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
            ⛶ Preview
          </button>
          <span style={{ fontSize: 12, color: saving ? '#818cf8' : saved ? '#4ade80' : '#f59e0b' }}>
            {saving ? '● Saving...' : saved ? '● Saved' : '● Unsaved'}
          </span>
          <button onClick={handleSave} disabled={saving || saved} style={{
            background: saved ? c.bgCard : accentColor || '#6366f1',
            color: saved ? c.textFaint : '#fff',
            border: 'none', borderRadius: 8, padding: '7px 16px', fontSize: 13,
            fontWeight: 600, cursor: saved ? 'default' : 'pointer', fontFamily: "'DM Sans', sans-serif"
          }}>Save</button>
          <button onClick={() => {
            const state = useEditorStore.getState()
            downloadHTML(state.title, state.data, state.sections, isDark ? 'dark' : 'light', state.template, state.accentColor)
          }} style={{
            background: 'transparent', border: '1px solid ' + c.borderStrong, borderRadius: 8,
            padding: '7px 16px', fontSize: 13, color: c.textMuted, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif"
          }}>Export ↓</button>
          <button onClick={handlePublish} style={{
            background: published ? 'rgba(74,222,128,0.1)' : accentColor || '#6366f1',
            color: published ? '#4ade80' : '#fff',
            border: published ? '1px solid rgba(74,222,128,0.3)' : 'none',
            borderRadius: 8, padding: '7px 16px', fontSize: 13,
            fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif"
          }}>
            {published ? '● Published' : 'Publish ↗'}
          </button>
        </div>
      </div>

      {publishMsg && (
        <div style={{ background: 'rgba(99,102,241,0.1)', borderBottom: '1px solid rgba(99,102,241,0.2)', padding: '10px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13, color: '#818cf8', flexShrink: 0 }}>
          <span>🎉 Live at: <a href={publishMsg} target="_blank" style={{ color: '#a5b4fc', fontWeight: 500 }}>{publishMsg}</a></span>
          <button onClick={() => navigator.clipboard.writeText(publishMsg)} style={{ background: 'rgba(99,102,241,0.2)', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 12, color: '#818cf8', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Copy link</button>
        </div>
      )}

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* LEFT SIDEBAR */}
        <div style={{ width: 220, background: c.bgSecondary, borderRight: '1px solid ' + c.border, padding: '16px 0', overflowY: 'auto' }}>
          <TemplateSelector />
          <ColorPicker />
          <SlugEditor />
          <div style={{ fontSize: 11, color: c.textFaint, margin: '12px 0 10px 20px', letterSpacing: 1, textTransform: 'uppercase' }}>Sections</div>
          <div style={{ padding: '0 12px' }}>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                {sections.map(section => (
                  <SortableSection key={section.id} section={section} isActive={activeSection === section.id} onClick={() => setActiveSection(section.id)} />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </div>

        {/* MIDDLE */}
        <div style={{ width: 340, borderRight: '1px solid ' + c.border, overflowY: 'auto', padding: 24, background: c.bgPrimary }}>
          <SectionPanel sectionId={activeSection} />
        </div>

        {/* RIGHT */}
        <div style={{ flex: 1, overflow: 'hidden', background: c.bgCard }}>
          <LivePreview />
        </div>
      </div>
    </div>
  )
}