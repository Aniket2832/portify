import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useTheme } from '../../context/ThemeContext'

export default function SortableSection({ section, isActive, onClick }) {
  const { c } = useTheme()
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id })

  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }} {...attributes}>
      <div onClick={onClick} style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '9px 10px',
        borderRadius: 8, cursor: 'pointer', marginBottom: 2, fontSize: 13,
        background: isActive ? c.accentBg : 'transparent',
        color: isActive ? c.accentText : c.textMuted,
        fontWeight: isActive ? 500 : 400, transition: 'all 0.15s', userSelect: 'none',
      }}>
        <span {...listeners} style={{ cursor: 'grab', fontSize: 14, color: c.textFaint, flexShrink: 0 }}>⠿</span>
        <span>{section.icon}</span>
        <span>{section.label}</span>
      </div>
    </div>
  )
}