import { useState, useRef } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { supabase } from '../../lib/supabase'

export default function ImageUpload({ value, onChange }) {
  const { c } = useTheme()
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef()

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { setError('Max file size is 5MB'); return }

    setUploading(true)
    setError('')

    try {
      const ext = file.name.split('.').pop()
      const fileName = 'project-' + Date.now() + '.' + ext
      const { error: uploadError } = await supabase.storage
        .from('portfolio-images')
        .upload(fileName, file, { cacheControl: '3600', upsert: false })

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(fileName)

      onChange(data.publicUrl)
    } catch (err) {
      setError('Upload failed. Try again.')
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    onChange('')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div>
      {value ? (
        <div style={{ position: 'relative', marginTop: 6 }}>
          <img
            src={value}
            alt="Project"
            style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8, border: '1px solid ' + c.borderStrong }}
          />
          <button
            onClick={handleRemove}
            style={{
              position: 'absolute', top: 6, right: 6,
              background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: 99,
              width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, color: '#fff', cursor: 'pointer'
            }}
          >×</button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          style={{
            marginTop: 6, border: '2px dashed ' + c.borderStrong, borderRadius: 8,
            padding: '20px', textAlign: 'center', cursor: uploading ? 'default' : 'pointer',
            transition: 'border-color 0.2s', background: c.bgInput
          }}
          onMouseEnter={e => !uploading && (e.currentTarget.style.borderColor = '#6366f1')}
          onMouseLeave={e => e.currentTarget.style.borderColor = c.borderStrong}
        >
          <div style={{ fontSize: 20, marginBottom: 6 }}>🖼</div>
          <div style={{ fontSize: 12, color: c.textMuted }}>
            {uploading ? 'Uploading...' : 'Click to upload image'}
          </div>
          <div style={{ fontSize: 10, color: c.textFaint, marginTop: 2 }}>PNG, JPG up to 5MB</div>
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
      {error && <div style={{ fontSize: 11, color: '#f87171', marginTop: 4 }}>{error}</div>}
    </div>
  )
}