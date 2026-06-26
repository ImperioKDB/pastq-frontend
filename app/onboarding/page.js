'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function OnboardingPage() {
  const supabase = createClient()
  const router   = useRouter()
  
  const [schools, setSchools] = useState([])
  const [departments, setDepartments] = useState([])
  const [courses, setCourses] = useState([])
  
  const [selectedSchool, setSelectedSchool] = useState('')
  const [selectedDept, setSelectedDept] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('')
  
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push('/auth/login')
    })
    supabase.from('schools').select('id, name').then(({ data }) => {
      if (data) setSchools(data)
    })
  }, [])

  useEffect(() => {
    if (!selectedSchool) return
    setSelectedDept('')
    setSelectedCourse('')
    setCourses([])
    supabase.from('departments').select('id, name')
      .eq('school_id', selectedSchool)
      .then(({ data }) => { if (data) setDepartments(data) })
  }, [selectedSchool])

  useEffect(() => {
    if (!selectedDept) return
    setSelectedCourse('')
    supabase.from('courses').select('id, title, code')
      .eq('department_id', selectedDept)
      .then(({ data }) => { if (data) setCourses(data) })
  }, [selectedDept])

  async function handleSave() {
    if (!selectedSchool || !selectedDept || !selectedCourse) {
      setError('Please select all fields to continue.')      return
    }
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { error: err } = await supabase.from('user_profiles').upsert({
      user_id: user.id,
      school_id: selectedSchool,
      department_id: selectedDept,
      course_id: selectedCourse,
    }, { onConflict: 'user_id' })

    if (err) {
      setError('Something went wrong saving your profile. Try again.')
      setSaving(false)
    } else {
      router.push('/dashboard')
    }
  }

  const step = !selectedSchool ? 1 : !selectedDept ? 2 : 3
  const canSave = !saving && selectedSchool && selectedDept && selectedCourse
  
  // Get the selected course code for the final button
  const selectedCourseObj = courses.find(c => c.id === selectedCourse)
  const courseCode = selectedCourseObj?.code || 'your course'

  const stepLabels = ['Where do you study?', 'Which faculty?', "What's your course?"]
  const stepDescs  = [
    "We'll show you past questions from your specific campus.",
    'Narrow it down to your department.',
    'Pick a course to start practicing.',
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-5)', fontFamily: 'var(--font-body)' }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>
        {/* Wordmark */}
        <div style={{ marginBottom: 'var(--space-6)', textAlign: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Past<span style={{ color: 'var(--brand-primary)' }}>Q</span>
          </span>
        </div>

        {/* Card */}
        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-7) var(--space-6)' }}>
          {/* Progress bar */}
          <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
            {[1, 2, 3].map(n => (
              <div key={n} style={{
                flex: 1, height: '3px', borderRadius: '2px',                background: n <= step ? 'var(--brand-primary)' : 'var(--border-default)',
                transition: 'background var(--dur-normal) var(--ease-out)',
              }} />
            ))}
          </div>

          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--brand-primary)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 'var(--space-2)' }}>
            STEP {step} OF 3
          </p>
          <h1 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: 'var(--space-2)', fontFamily: 'var(--font-display)' }}>
            {stepLabels[step - 1]}
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: 'var(--space-6)', lineHeight: 1.6 }}>
            {stepDescs[step - 1]}
          </p>

          {error && (
            <p style={{ fontSize: '13px', color: 'var(--error)', padding: 'var(--space-3) var(--space-4)', background: 'var(--error-muted)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-4)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              {error}
            </p>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div>
              <label style={labelStyle}>University</label>
              <select style={selectStyle} value={selectedSchool} onChange={e => setSelectedSchool(e.target.value)}>
                <option value="">Select university</option>
                {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>

            <div style={{ opacity: selectedSchool ? 1 : 0.45, transition: 'opacity var(--dur-normal) var(--ease-out)' }}>
              <label style={labelStyle}>Department</label>
              <select style={selectStyle} value={selectedDept} onChange={e => setSelectedDept(e.target.value)} disabled={!selectedSchool}>
                <option value="">Select department</option>
                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>

            <div style={{ opacity: selectedDept ? 1 : 0.45, transition: 'opacity var(--dur-normal) var(--ease-out)' }}>
              <label style={labelStyle}>Course</label>
              <select style={selectStyle} value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} disabled={!selectedDept}>
                <option value="">Select course</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.code} — {c.title}</option>)}
              </select>
            </div>

            <button
              onClick={handleSave}
              disabled={!canSave}              style={{
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                background: canSave ? 'var(--brand-primary)' : 'var(--border-default)',
                color: canSave ? 'var(--text-inverse)' : 'var(--text-tertiary)',
                fontWeight: 700,
                fontSize: '15px',
                cursor: canSave ? 'pointer' : 'not-allowed',
                fontFamily: 'var(--font-body)',
                boxShadow: canSave ? 'var(--shadow-glow)' : 'none',
                transition: 'background var(--dur-normal) var(--ease-out), color var(--dur-normal) var(--ease-out), box-shadow var(--dur-normal) var(--ease-out)',
                marginTop: 'var(--space-2)'
              }}
            >
              {saving ? 'Saving…' : `Ready to conquer ${courseCode} →`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const labelStyle = {
  display: 'block', fontSize: '11px', fontWeight: 500, color: 'var(--text-tertiary)',
  marginBottom: 'var(--space-2)', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)', textTransform: 'uppercase',
}

const selectStyle = {
  width: '100%', padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-md)',
  border: '1px solid var(--border-default)', background: 'var(--bg-base)', color: 'var(--text-primary)',
  fontSize: '14px', fontFamily: 'var(--font-body)', outline: 'none', cursor: 'pointer',
  appearance: 'none', WebkitAppearance: 'none', transition: 'border-color var(--dur-normal) var(--ease-out)',
}