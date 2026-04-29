'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function Navbar() {
  const supabase = createClient()
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    <nav style={{
      width: '100%',
      padding: '14px 24px',
      background: '#fff',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      {/* Logo */}
      <span
        onClick={() => router.push('/')}
        style={{ fontWeight: '800', fontSize: '1.2rem', cursor: 'pointer', color: '#10b981', letterSpacing: '-0.03em' }}
      >
        PastQ
      </span>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {loading ? null : user ? (
          <>
            <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>
              {user.user_metadata?.full_name?.split(' ')[0] || user.email}
            </span>
            <button onClick={() => router.push('/dashboard')} style={navBtn('#10b981')}>
              Dashboard
            </button>
            <button onClick={handleSignOut} style={navBtn('#ef4444')}>
              Sign out
            </button>
          </>
        ) : (
          <>
            <button onClick={() => router.push('/auth/login')} style={navBtn('#6b7280')}>
              Log in
            </button>
            <button onClick={() => router.push('/auth/signup')} style={navBtn('#10b981')}>
              Sign up
            </button>
          </>
        )}
      </div>
    </nav>
  )
}

function navBtn(bg) {
  return {
    padding: '8px 16px',
    background: bg,
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '0.85rem',
    cursor: 'pointer',
  }
      }
