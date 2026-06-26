'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function SignupPage() {
  const supabase = createClient()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState(false)
  const [loading, setLoading]   = useState(false)

  async function handleSignup(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: location.origin + '/auth/callback?next=/dashboard' }
    })
    if (error) { 
      setError(error.message.includes('already') ? "That email is already registered. Try logging in instead?" : "That doesn't look like a valid email. Try again?")
      setLoading(false) 
    } else { 
      setSuccess(true) 
    }
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: location.origin + '/auth/callback?next=/dashboard' },
    })
  }

  if (success) {
    return (
      <div style={pageStyle}>
        <div style={{ ...cardStyle, textAlign: 'center', padding: '56px 36px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--success-muted)', border: '1px solid rgba(34, 197, 94, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--success)' }}>
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px', fontFamily: 'var(--font-display)' }}>Check your inbox</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            We sent a confirmation link to<br />
            <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{email}</span>          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={{ marginBottom: '32px' }}>
          <Link href="/" style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 700, textDecoration: 'none' }}>
            Past<span style={{ color: 'var(--brand-primary)' }}>Q</span>
          </Link>
          <h1 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em', marginTop: '24px', marginBottom: '6px', fontFamily: 'var(--font-display)' }}>
            Join the scholars.
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Join UNIBEN, UI, and OAU students already using PastQ.</p>
        </div>

        <button onClick={handleGoogle} style={googleBtn}>
          <GoogleIcon />
          Continue with your school email
        </button>

        <div style={dividerStyle}>
          <div style={dividerLine} /><span style={dividerText}>or</span><div style={dividerLine} />
        </div>

        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={labelStyle} htmlFor="signup-email">Email</label>
            <input id="signup-email" type="email" value={email}
              onChange={e => setEmail(e.target.value)} placeholder="you@uniben.edu" required
              style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle} htmlFor="signup-pw">Password</label>
            <input id="signup-pw" type="password" value={password}
              onChange={e => setPassword(e.target.value)} placeholder="Min. 6 characters"
              required minLength={6} style={inputStyle} />
          </div>
          
          {error && (
            <p role="alert" style={{ fontSize: '13px', color: 'var(--error)', padding: '10px 12px', background: 'var(--error-muted)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} style={{ ...submitBtn, opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Creating account…' : 'Create account'}          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)', marginTop: '24px' }}>
          Already have an account?{' '}
          <Link href="/auth/login" style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>Log in</Link>
        </p>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.2l6.7-6.7C35.8 2.5 30.3 0 24 0 14.7 0 6.7 5.4 2.7 13.3l7.8 6C12.4 13 17.8 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4 7.1-10 7.1-17z"/>
      <path fill="#FBBC05" d="M10.5 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.8-6A23.9 23.9 0 0 0 0 24c0 3.9.9 7.5 2.7 10.7l7.8-6z"/>
      <path fill="#34A853" d="M24 48c6.3 0 11.6-2.1 15.4-5.6l-7.5-5.8c-2.1 1.4-4.8 2.3-7.9 2.3-6.2 0-11.5-4.2-13.4-9.8l-7.8 6C6.7 42.6 14.7 48 24 48z"/>
    </svg>
  )
}

const pageStyle = { minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'var(--font-body)' }
const cardStyle = { width: '100%', maxWidth: '400px', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '40px 36px' }
const googleBtn = { width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'var(--bg-base)', color: 'var(--text-primary)', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '24px', fontFamily: 'var(--font-body)', fontWeight: 500, transition: 'border-color 200ms' }
const dividerStyle = { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }
const dividerLine = { flex: 1, height: '1px', background: 'var(--border-subtle)' }
const dividerText = { fontSize: '12px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.05em' }
const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }
const inputStyle = { width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'var(--bg-base)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--font-body)', transition: 'border-color 200ms' }
const submitBtn = { width: '100%', padding: '13px', borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--brand-primary)', color: 'var(--text-inverse)', fontSize: '14px', fontWeight: 700, fontFamily: 'var(--font-body)', boxShadow: 'var(--shadow-glow)', transition: 'opacity 200ms' }