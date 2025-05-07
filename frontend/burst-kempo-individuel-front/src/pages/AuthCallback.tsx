import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (data?.session) {
        navigate('/dashboard')
      } else {
        console.error('Erreur de session:', error)
      }
    }

    checkSession()
  }, [navigate])

  return <p>Connexion en cours...</p>
}
