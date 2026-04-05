import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AuthCallback() {
  const { login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]))
      login(token, payload)
      navigate('/dashboard')
    } else {
      navigate('/login')
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
      <p>Signing you in...</p>
    </div>
  )
}