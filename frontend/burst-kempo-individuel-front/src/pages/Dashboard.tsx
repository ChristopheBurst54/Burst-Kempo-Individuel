import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'
import type { User } from '@supabase/supabase-js'

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
      } else {
        navigate('/login')
      }
    }

    fetchUser()
  }, [navigate])

  const logout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div>
      <h1>Dashboard</h1>
      {user && <p>Bienvenue, {user.email}</p>}
      <button onClick={logout}>Déconnexion</button>
    </div>
  )
}
