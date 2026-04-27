'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function DashboardPage() {
  const supabase = createClient()
  const router = useRouter()

  const [profile, setProfile] = useState(null)
  const [stats, setStats] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      setUser(user)

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*, schools(name), departments(name), courses(id, name, code)')
        .eq('user_id', user.id)
        .single()

      if (!profile) { router.push('/onboarding'); return }
      setProfile(profile)

      const { data: questions } = await supabase
        .from('questions')
        .select('type')
        .eq('course_id', profile.course_id)

      if (questions) {
        const total = questions.length
        const mcq = questions.filter(q => q.type === 'mcq').length
        const theory = questions.filter(q => q.type === 'theory').length
        setStats({ total, mcq, theory })
      }

      setLoading(false)
    }
    load()
  }, [])

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#6b7280' }}>Loading dashboard...</p>
    </div>
  )

  return (
    <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '4px' }}>Dashboard</h1>
        <p style={{ color: '#6b7280' }}>
          {profile?.courses?.code} · {profile?.courses?.name} · {profile?.schools?.name}
        </p>
        <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '4px' }}>
          {user?.user_metadata?.full_name || user?.email}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <StatCard emoji='📚' value={stats?.total ?? 0} label='Total Questions' color='#10b981' />
        <StatCard emoji='✅' value={stats?.mcq ?? 0} label='MCQ Questions' color='#3b82f6' />
        <StatCard emoji='✏️' value={stats?.theory ?? 0} label='Theory Questions' color='#f59e0b' />
      </div>

      <div style={{ marginTop: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button onClick={() => router.push('/quiz')} style={btnStyle('#10b981')}>Start Quiz</button>
        <button onClick={() => router.push('/browse')} style={btnStyle('#3b82f6')}>Browse Questions</button>
        <button onClick={() => router.push('/onboarding')} style={btnStyle('#6b7280')}>Change Course</button>
      </div>

      <button
        onClick={async () => { await supabase.auth.signOut(); router.push('/auth/login') }}
        style={{ marginTop: '32px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.875rem' }}
      >
        Sign out
      </button>
    </div>
  )
}

function StatCard({ emoji, value, label, color }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px' }}>
      <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{emoji}</div>
      <div style={{ fontSize: '2.5rem', fontWeight: '700', color, marginBottom: '4px' }}>{value}</div>
      <div style={{ color: '#6b7280', fontSize: '0.95rem' }}>{label}</div>
    </div>
  )
}

function btnStyle(bg) {
  return {
    padding: '10px 20px', background: bg, color: '#fff', border: 'none',
    borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '0.9rem'
  }
    }
