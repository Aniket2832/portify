import { useState } from 'react'
import { useEditorStore } from '../../store/editorStore'
import { useTheme } from '../../context/ThemeContext'
import api from '../../api/axios'

export default function GitHubImport() {
  const { c } = useTheme()
  const { data, updateData } = useEditorStore()
  const [username, setUsername] = useState('')
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState([])
  const [imported, setImported] = useState(false)

  const fetchRepos = async () => {
    if (!username.trim()) return
    setLoading(true)
    setError('')
    setRepos([])
    setSelected([])
    setImported(false)
    try {
      const { data: repos } = await api.get('/github/' + username.trim())
      setRepos(repos)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch repos')
    } finally {
      setLoading(false)
    }
  }

  const toggleSelect = (repo) => {
    setSelected(prev =>
      prev.find(r => r.name === repo.name)
        ? prev.filter(r => r.name !== repo.name)
        : [...prev, repo]
    )
  }

  const importSelected = () => {
    if (!selected.length) return
    const existing = data.projects || []
    const newProjects = selected.map(r => ({
      name: r.name,
      desc: r.desc,
      url: r.url,
      tech: r.tech,
    }))
    const merged = [...existing]
    newProjects.forEach(np => {
      if (!merged.find(p => p.name === np.name)) merged.push(np)
    })
    updateData('projects', merged)
    setImported(true)
    setSelected([])
    setTimeout(() => setImported(false), 3000)
  }

  const isSelected = (repo) => !!selected.find(r => r.name === repo.name)

  return (
    <div style={{ background: 'rgba(63,185,80,0.06)', border: '1px solid rgba(63,185,80,0.2)', borderRadius: 10, padding: 14, marginBottom: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 14 }}>⌥</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#3fb950' }}>GitHub Import</span>
      </div>

      {/* Username input */}
      <div style={{ fontSize: 11, color: c.textMuted, marginBottom: 6 }}>GitHub username</div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
        <input
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="e.g. aniketudigirkar"
          onKeyDown={e => e.key === 'Enter' && fetchRepos()}
          style={{ flex: 1, background: c.bgInput, border: '1px solid ' + c.borderStrong, borderRadius: 7, padding: '8px 10px', color: c.text, fontSize: 12, fontFamily: "'DM Sans', sans-serif", outline: 'none' }}
        />
        <button onClick={fetchRepos} disabled={loading || !username.trim()} style={{
          background: loading ? '#1a3a1a' : 'rgba(63,185,80,0.15)',
          border: '1px solid rgba(63,185,80,0.3)', borderRadius: 7,
          padding: '8px 12px', fontSize: 12, color: '#3fb950',
          cursor: loading ? 'default' : 'pointer', fontFamily: "'DM Sans', sans-serif",
          opacity: !username.trim() ? 0.5 : 1
        }}>
          {loading ? '...' : 'Fetch'}
        </button>
      </div>

      {error && <div style={{ fontSize: 11, color: '#f87171', marginBottom: 8 }}>{error}</div>}

      {/* Repo list */}
      {repos.length > 0 && (
        <>
          <div style={{ fontSize: 11, color: c.textFaint, marginBottom: 8 }}>
            {repos.length} repos found · select to import
          </div>
          <div style={{ maxHeight: 240, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
            {repos.map(repo => (
              <div
                key={repo.name}
                onClick={() => toggleSelect(repo)}
                style={{
                  background: isSelected(repo) ? 'rgba(63,185,80,0.1)' : c.bgCard,
                  border: '1px solid ' + (isSelected(repo) ? 'rgba(63,185,80,0.4)' : c.borderStrong),
                  borderRadius: 8, padding: '10px 12px', cursor: 'pointer',
                  transition: 'all 0.15s', display: 'flex', alignItems: 'flex-start', gap: 10
                }}
              >
                {/* Checkbox */}
                <div style={{
                  width: 16, height: 16, borderRadius: 4, flexShrink: 0, marginTop: 1,
                  background: isSelected(repo) ? '#3fb950' : 'transparent',
                  border: '1px solid ' + (isSelected(repo) ? '#3fb950' : c.borderStrong),
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#000'
                }}>
                  {isSelected(repo) && '✓'}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 2 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: c.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {repo.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                      {repo.stars > 0 && (
                        <span style={{ fontSize: 10, color: '#f59e0b' }}>★ {repo.stars}</span>
                      )}
                      {repo.tech && (
                        <span style={{ fontSize: 10, color: c.accentText, background: c.accentBg, border: '1px solid ' + c.accentBorder, borderRadius: 4, padding: '1px 6px' }}>
                          {repo.tech}
                        </span>
                      )}
                    </div>
                  </div>
                  {repo.desc && (
                    <div style={{ fontSize: 11, color: c.textFaint, lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {repo.desc}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Import button */}
          <button
            onClick={importSelected}
            disabled={!selected.length}
            style={{
              width: '100%', background: selected.length ? '#3fb950' : c.bgCard,
              color: selected.length ? '#000' : c.textFaint,
              border: '1px solid ' + (selected.length ? '#3fb950' : c.borderStrong),
              borderRadius: 7, padding: '8px', fontSize: 12, fontWeight: 700,
              cursor: selected.length ? 'pointer' : 'default',
              fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s'
            }}
          >
            {imported
              ? '✓ Imported successfully!'
              : selected.length
                ? 'Import ' + selected.length + ' repo' + (selected.length > 1 ? 's' : '') + ' →'
                : 'Select repos to import'}
          </button>
        </>
      )}
    </div>
  )
}