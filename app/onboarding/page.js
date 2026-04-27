'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function OnboardingPage() {
  const supabase = createClient()
  const router = useRouter()

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
    supabase.from('courses').select('id, name, code')
      .eq('department_id', selectedDept)
      .then(({ data }) => { if (data) setCourses(data) })
  }, [selectedDept])

  async function handleSave() {
    if (!selectedSchool || !selectedDept || !selectedCourse) {
      setError('Please select all fields')
      return
    }
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { error: err } = await supabase.from('user_profiles').upsert({
      user_id: user.id,
      school_id: selectedSchool,
      department_id: selectedDept,
      course_id: selectedCourse
    }, { onConflict: 'user_id' })

    if (err) {
      setError(err.message)
      setSaving(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: '#f9fafb' }}>
      <div style={{ width: '100%', maxWidth: '480px', background: '#fff', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '8px' }}>Welcome to PastQ 👋</h1>
        <p style={{ color: '#6b7280', marginBottom: '24px' }}>Select your course to get started</p>

        {error && <p style={{ color: '#ef4444', marginBottom: '16px', fontSize: '0.875rem' }}>{error}</p>}

        <label style={labelStyle}>University</label>
        <select style={selectStyle} value={selectedSchool} onChange={e => setSelectedSchool(e.target.value)}>
          <option value=''>Select university</option>
          {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>

        <label style={labelStyle}>Department</label>
        <select style={selectStyle} value={selectedDept} onChange={e => setSelectedDept(e.target.value)} disabled={!selectedSchool}>
          <option value=''>Select department</option>
          {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>

        <label style={labelStyle}>Course</label>
        <select style={selectStyle} value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} disabled={!selectedDept}>
          <option value=''>Select course</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.code} — {c.name}</option>)}
        </select>

        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            width: '100%', padding: '12px', borderRadius: '8px', border: 'none',
            background: saving ? '#9ca3af' : '#10b981', color: '#fff',
            fontWeight: '600', fontSize: '1rem', cursor: saving ? 'not-allowed' : 'pointer',
            marginTop: '8px'
          }}
        >
          {saving ? 'Saving...' : 'Go to Dashboard →'}
        </button>
      </div>
    </div>
  )
}

const labelStyle = { display: 'block', fontWeight: '600', fontSize: '0.875rem', marginBottom: '6px', color: '#374151' }
const selectStyle = {
  width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db',
  fontSize: '0.95rem', marginBottom: '16px', background: '#fff', color: '#111827'
    }
