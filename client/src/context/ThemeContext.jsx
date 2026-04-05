import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext(null)

const dark = {
  bgPrimary: '#09090b',
  bgSecondary: '#0e0e12',
  bgCard: '#141417',
  bgHover: '#1c1c20',
  bgInput: '#141417',
  border: '#1f1f23',
  borderStrong: '#27272a',
  text: '#ffffff',
  textMuted: '#71717a',
  textFaint: '#52525b',
  accent: '#6366f1',
  accentText: '#818cf8',
  accentBg: 'rgba(99,102,241,0.12)',
  accentBorder: 'rgba(99,102,241,0.3)',
}

const light = {
  bgPrimary: '#ffffff',
  bgSecondary: '#f4f4f6',
  bgCard: '#ffffff',
  bgHover: '#e8e8f0',
  bgInput: '#f4f4f6',
  border: '#e4e4e7',
  borderStrong: '#d4d4d8',
  text: '#09090b',
  textMuted: '#52525b',
  textFaint: '#a1a1aa',
  accent: '#6366f1',
  accentText: '#4f46e5',
  accentBg: 'rgba(99,102,241,0.08)',
  accentBorder: 'rgba(99,102,241,0.25)',
}

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('portify-theme')
    return saved ? saved === 'dark' : false // default light
  })

  const toggleTheme = () => {
    setIsDark(prev => {
      localStorage.setItem('portify-theme', !prev ? 'dark' : 'light')
      return !prev
    })
  }

  const c = isDark ? dark : light

  useEffect(() => {
    document.body.style.background = c.bgPrimary
    document.body.style.color = c.text
  }, [isDark])

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, c }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)