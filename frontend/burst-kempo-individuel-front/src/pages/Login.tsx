import { Button } from '@/components/ui/button'
import { supabase } from '../supabaseClient'

export default function Login() {
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
    <div className='grid place-items-center h-screen bg-gray-900 text-white'>
      <img src='logonk.png' className='w-100 h-auto mb-1'></img>
      <Button
        onClick={() => loginWithGoogle()}
        className='px-6 py-3 text-lg font-semibold bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg'>
        Connexion avec Google
      </Button>
    </div>
  )
}
