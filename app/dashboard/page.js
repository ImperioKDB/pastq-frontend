'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function DashboardPage() {
  const supabase = createClient()
  const router   = useRouter()

  const [profile, setProfile] = useState(null)
  const [stats,   setStats]   = useState(null)
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { router.push('/auth/login'); return }
        setUser(user)

        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*, schools(name), departments(name), courses(id, title, code)')
          .eq('user_id', user.id)
          .single()

        if (!profile) { router.push('/onboarding'); return }
        setProfile(profile)

        const { data: questions } = await supabase
          .from('questions')
          .select('type')
          .eq('course_id', profile.course_id)

        if (questions) {
          const total  = questions.length
          const mcq    = questions.filter(q => q.type === 'mcq').length
          const theory = questions.filter(q => q.type === 'theory').length
          setStats({ total, mcq, theory })
        }
      } catch {
        setError('Failed to load dashboard. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-3)' }}>
        <div style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2px solid var(--border-default)', borderTopColor: 'var(--brand-primary)', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>LOADING</p>
      </div>
    </div>
  )

  if (error) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-5)' }}>
      <p style={{ color: 'var(--error)', fontSize: '14px', textAlign: 'center' }}>{error}</p>
    </div>
  )

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Scholar'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', fontFamily: 'var(--font-body)', padding: 'var(--space-7) var(--space-5)' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 'var(--space-7)' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--brand-primary)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 'var(--space-2)' }}>
            DASHBOARD
          </p>
          <h1 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', fontFamily: 'var(--font-display)', marginBottom: 'var(--space-2)', lineHeight: 1.1 }}>
            How far, {displayName}.
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {profile?.courses?.code} &middot; {profile?.courses?.title} &middot; {profile?.schools?.name}
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
          <StatCard value={stats?.total  ?? 0} label="Total"  accent="var(--brand-primary)" />
          <StatCard value={stats?.mcq    ?? 0} label="MCQ"    accent="var(--success)" />
          <StatCard value={stats?.theory ?? 0} label="Theory" accent="var(--warning)" />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-7)' }}>
          <ActionRow
            title="Start a quiz"
            desc="Randomised MCQs from your course"
            onClick={() => router.push('/quiz')}
            primary
          />
          <ActionRow
            title="Browse questions"
            desc="Filter by year, topic, and type"
            onClick={() => router.push('/questions')}
          />
          <ActionRow
            title="Change course"
            desc="Switch to a different subject"
            onClick={() => router.push('/onboarding')}
          />
        </div>

        {/* Sign out */}
        <SignOutBtn supabase={supabase} router={router} />

      </div>
    </div>
  )
}

function StatCard({ value, label, accent }) {
  return (
    <div style={{
      background:    'var(--bg-elevated)',
      border:        '1px solid var(--border-subtle)',
      borderRadius:  'var(--radius-lg)',
      padding:       'var(--space-5)',
    }}>
      <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'clamp(22px, 3.5vw, 32px)', fontWeight: 700, color: accent, lineHeight: 1, marginBottom: 'var(--space-1)' }}>
        {value.toLocaleString()}
      </span>
      <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        {label}
      </span>
    </div>
  )
}

function ActionRow({ title, desc, onClick, primary }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '100%', textAlign: 'left',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding:      'var(--space-5)',
        background:   hovered && primary ? 'var(--brand-primary-muted)' : 'var(--bg-elevated)',
        border:       '1px solid ' + (hovered ? (primary ? 'var(--brand-primary-glow)' : 'var(--border-default)') : 'var(--border-subtle)'),
        borderRadius: 'var(--radius-lg)',
        cursor:       'pointer',
        transition:   'border-color var(--dur-normal) var(--ease-out), background var(--dur-normal) var(--ease-out)',
        fontFamily:   'var(--font-body)',
      }}
    >
      <div>
        <p style={{ fontSize: '15px', fontWeight: 600, color: primary ? 'var(--brand-primary)' : 'var(--text-primary)', marginBottom: '2px' }}>
          {title}
        </p>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{desc}</p>
      </div>
      <span style={{ color: primary ? 'var(--brand-primary)' : 'var(--text-tertiary)', fontSize: '16px', flexShrink: 0, marginLeft: 'var(--space-4)' }}>
        &rarr;
      </span>
    </button>
  )
}

function SignOutBtn({ supabase, router }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={async () => { await supabase.auth.signOut(); router.push('/auth/login') }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background:  'none',
        border:      'none',
        color:       hovered ? 'var(--error)' : 'var(--text-tertiary)',
        cursor:      'pointer',
        fontSize:    '13px',
        fontFamily:  'var(--font-body)',
        padding:     '0',
        transition:  'color var(--dur-fast) var(--ease-out)',
      }}
    >
      Sign out
    </button>
  )
}
