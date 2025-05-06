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
    <div>
      <h1>Connexion</h1>
      <button onClick={loginWithGoogle}>Connexion avec Google</button>
    </div>
  )
}
