import { Button } from '@/components/ui/button'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate();

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/auth/callback',
      },
    })
    if (error) console.error('Erreur OAuth:', error.message)
  }

  return (
    <div className='grid place-items-center h-screen'>
      <img src='logonk.png' className='w-100 h-auto'></img>
      <Button onClick={() => loginWithGoogle()}>Connexion avec Google</Button>
      <Button onClick={() => navigate('/tournament')}>Aller au tableau de bord</Button>
    </div>
  )
}
