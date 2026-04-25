'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function SignupPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSignup(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: location.origin + '/auth/callback?next=/dashboard' }
    })
    if (error) { setError(error.message); setLoading(false) }
    else { setSuccess(true) }
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: location.origin + '/auth/callback?next=/dashboard' }
    })
  }

  if (success) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ textAlign: 'center', background: '#12121a', border: '1px solid #2a2a3a', borderRadius: '12px', padding: '48px 32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📬</div>
          <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: 800, marginBottom: '12px' }}>Check your email</h2>
          <p style={{ color: '#6b6b80', fontSize: '14px' }}>Confirmation link sent to <strong style={{ color: '#e8e8f0' }}>{email}</strong></p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '400px', background: '#12121a', border: '1px solid #2a2a3a', borderRadius: '12px', padding: '40px 32px' }}>
        <div style={{ marginBottom: '32px' }}>
          <div style={{ color: '#7fff6e', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px' }}>PastQ</div>
          <h1 style={{ color: '#fff', fontSize: '28px', fontWeight: 800, margin: '0 0 8px' }}>Create account</h1>
          <p style={{ color: '#6b6b80', fontSize: '14px', margin: 0 }}>Join thousands of UNIBEN students</p>
        </div>

        <button onClick={handleGoogle} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #2a2a3a', background: '#1a1a26', color: '#e8e8f0', fontSize: '14px', cursor: 'pointer', marginBottom: '24px' }}>
          Continue with Google
        </button>

        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', color: '#e8e8f0', fontSize: '13px', marginBottom: '6px' }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #2a2a3a', background: '#0a0a0f', color: '#e8e8f0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', color: '#e8e8f0', fontSize: '13px', marginBottom: '6px' }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 6 characters" required minLength={6} style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #2a2a3a', background: '#0a0a0f', color: '#e8e8f0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          {error && <p style={{ color: '#ff6b6b', fontSize: '13px', margin: 0 }}>{error}</p>}
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', background: '#7fff6e', color: '#0a0a0f', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ color: '#6b6b80', fontSize: '13px', textAlign: 'center', marginTop: '24px' }}>
          Already have an account?{' '}
          <Link href="/auth/login" style={{ color: '#7fff6e', textDecoration: 'none' }}>Log in</Link>
        </p>
      </div>
    </div>
  )
  }
