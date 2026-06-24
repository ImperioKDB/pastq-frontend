'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function Navbar() {
  const supabase  = createClient()
  const router    = useRouter()
  const pathname  = usePathname()
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoading(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  // Don't render navbar on auth pages
  const isAuthPage = pathname?.startsWith('/auth')
  if (isAuthPage) return null

  const navStyle = {
    position: 'sticky', top: 0, zIndex: 100,
    width: '100%',
    padding: '0 24px',
    height: '60px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    background: scrolled ? 'rgba(8,8,16,0.85)' : 'transparent',
    backdropFilter: scrolled ? 'blur(16px)' : 'none',
    borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
    transition: 'background 300ms var(--ease), border-color 300ms var(--ease), backdrop-filter 300ms var(--ease)',
  }

  const links = [
    { href: '/questions', label: 'Browse' },
    { href: '/quiz',      label: 'Quiz' },
    ...(user ? [{ href: '/dashboard', label: 'Dashboard' }] : []),
  ]

  return (
    <nav style={navStyle} role="navigation" aria-label="Main navigation">
      {/* Wordmark */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '1px', textDecoration: 'none' }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: 700,
          color: 'var(--text)', letterSpacing: '-0.02em',
        }}>Past</span>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: 700,
          color: 'var(--green)', letterSpacing: '-0.02em',
        }}>Q</span>
      </Link>

      {/* Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {links.map(({ href, label }) => {
          const active = pathname === href
          return (
            <Link key={href} href={href} style={{
              padding: '6px 14px', borderRadius: 'var(--radius-sm)',
              fontSize: '14px', fontWeight: 500,
              color: active ? 'var(--green)' : 'var(--muted)',
              background: active ? 'var(--green-dim)' : 'transparent',
              transition: 'color var(--dur) var(--ease), background var(--dur) var(--ease)',
            }}>
              {label}
            </Link>
          )
        })}

        {!loading && (
          <>
            {user ? (
              <button onClick={handleSignOut} style={ghostBtn}>
                Sign out
              </button>
            ) : (
              <>
                <Link href="/auth/login" style={{ ...ghostBtn, display: 'inline-flex', alignItems: 'center' }}>
                  Log in
                </Link>
                <Link href="/auth/signup" style={{
                  padding: '7px 16px', borderRadius: 'var(--radius-sm)',
                  fontSize: '14px', fontWeight: 600,
                  background: 'var(--green)', color: '#080810',
                  display: 'inline-flex', alignItems: 'center',
                  transition: 'opacity var(--dur) var(--ease)',
                }}>
                  Sign up
                </Link>
              </>
            )}
          </>
        )}
      </div>
    </nav>
  )
}

const ghostBtn = {
  padding: '7px 14px', borderRadius: 'var(--radius-sm)',
  fontSize: '14px', fontWeight: 500, cursor: 'pointer',
  color: 'var(--muted)', background: 'transparent', border: 'none',
  transition: 'color var(--dur) var(--ease)',
}
