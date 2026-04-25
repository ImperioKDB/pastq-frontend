'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback?next=/dashboard` },
    })
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0f',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', fontFamily: 'sans-serif'
    }}>
      <div style={{
        width: '100%', maxWidth: '400px',
        background: '#12121a', border: '1px solid #2a2a3a',
        borderRadius: '12px', padding: '40px 32px'
      }}>
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            fontFamily: 'monospace', fontSize: '11px', letterSpacing: '0.15em',
            textTransform: 'uppercase', color: '#7fff6e',
            background: 'rgba(127,255,110,0.08)', border: '1px solid rgba(127,255,110,0.2)',
            padding: '4px 12px', borderRadius: '2px', display: 'inline-block', marginBottom: '16px'
          }}>PastQ</div>
          <h1 style={{ color: '#fff', fontSize: '28px', fontWeight: '800', margin: '0 0 8px' }}>
            Welcome back
          </h1>
          <p style={{ color: '#6b6b80', fontSize: '14px', margin: 0 }}>
            Log in to access your questions
          </p>
        </div>

        <button onClick={handleGoogle} style={{
          width: '100%', padding: '12px', borderRadius: '8px',
          border: '1px solid #2a2a3a', background: '#1a1a26',
          color: '#e8e8f0', fontSize: '14px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
          marginBottom: '24px'
        }}>
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.2l6.7-6.7C35.8 2.5 30.3 0 24 0 14.7 0 6.7 5.4 2.7 13.3l7.8 6C12.4 13 17.8 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4 7.1-10 7.1-17z"/>
            <path fill="#FBBC05" d="M10.5 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.8-6A23.9 23.9 0 0 0 0 24c0 3.9.9 7.5 2.7 10.7l7.8-6z"/>
            <path fill="#34A853" d="M24 48c6.3 0 11.6-2.1 15.4-5.6l-7.5-5.8c-2.1 1.4-4.8 2.3-7.9 2.3-6.2 0-11.5-4.2-13.4-9.8l-7.8 6C6.7 42.6 14.7 48 24 48z"/>
          </svg>
          Continue with Google
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{ flex: 1, height: '1px', background: '#2a2a3a' }} />
          <span style={{ color: '#6b6b80', fontSize: '12px' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: '#2a2a3a' }} />
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', color: '#e8e8f0', fontSize: '13px', marginBottom: '6px' }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com" required
              style={{
                width: '100%', padding: '10px 14px', borderRadius: '6px',
                border: '1px solid #2a2a3a', background: '#0a0a0f',
                color: '#e8e8f0', fontSize: '14px', outline: 'none', boxSizing: 'border-box'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', color: '#e8e8f0', fontSize: '13px', marginBottom: '6px' }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" required
              style={{
                width: '100%', padding: '10px 14px', borderRadius: '6px',
                border: '1px solid #2a2a3a', background: '#0a0a0f',
                color: '#e8e8f0', fontSize: '14px', outline: 'none', boxSizing: 'border-box'
              }}
            />
          </div>

          {error && <p style={{ color: '#ff6b6b', fontSize: '13px', margin: 0 }}>{error}</p>}

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '12px', borderRadius: '8px',
            border: 'none', background: '#7fff6e', color: '#0a0a0f',
            fontSize: '14px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p style={{ color: '#6b6b80', fontSize: '13px', textAlign: 'center', marginTop: '24px' }}>
          No account?{' '}
          <Link href="/auth/signup" style={{ color: '#7fff6e', textDecoration: 'none' }}>Sign up</Link>
        </p>
      </div>
    </div>
  )
}
