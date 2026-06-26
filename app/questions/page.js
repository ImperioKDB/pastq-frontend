'use client'
import { useState, useEffect, useCallback } from 'react'
import { renderMath } from '@/lib/utils/math'

const API = process.env.NEXT_PUBLIC_API_URL

export default function QuestionsPage() {
  const [questions, setQuestions] = useState([])
  const [courses, setCourses]     = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)
  const [courseId, setCourseId]   = useState('')
  const [year, setYear]           = useState('')
  const [type, setType]           = useState('')

  const fetchQuestions = useCallback(async ({ courseId = '', year = '', type = '' } = {}) => {
    setLoading(true)
    setError(null)
    try {
      let url = `${API}/api/questions?limit=50`
      if (courseId) url += `&course_id=${courseId}`
      if (year)     url += `&year=${year}`
      if (type)     url += `&type=${type}`

      const res  = await fetch(url)
      if (!res.ok) throw new Error('Network response was not ok')
      const json = await res.json()
      setQuestions(Array.isArray(json) ? json : (json.data ?? []))
    } catch {
      setError('Could not connect to the server. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    async function init() {
      try {
        const res  = await fetch(`${API}/api/courses`)
        const data = await res.json()
        if (Array.isArray(data)) setCourses(data)
      } catch {}
      await fetchQuestions()
    }
    init()
  }, [fetchQuestions])

  function handleClear() {
    setCourseId(''); setYear(''); setType('')
    fetchQuestions({})  }

  const availableYears = [...new Set(questions.map(q => q.year).filter(Boolean))].sort((a, b) => b - a)

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'var(--font-sans)', padding: '48px 24px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--brand-primary)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px' }}>
            LIBRARY
          </p>
          <h1 style={{ fontSize: 'clamp(28px, 4.5vw, 36px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '8px', fontFamily: 'var(--font-display)' }}>
            Question Bank
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--muted)' }}>
            {loading ? 'Scanning the archives…' : `${questions.length} question${questions.length !== 1 ? 's' : ''} available`}
          </p>
        </div>

        {/* Filters */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px', marginBottom: '40px', padding: '20px',
          background: 'var(--surface)', border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
        }}>
          <FilterSelect label="Course" value={courseId} onChange={e => { setCourseId(e.target.value); fetchQuestions({ courseId: e.target.value, year, type }) }}>
            <option value="">All courses</option>
            {courses.map(c => <option key={c.id} value={c.id}>{c.code}</option>)}
          </FilterSelect>
          <FilterSelect label="Year" value={year} onChange={e => { setYear(e.target.value); fetchQuestions({ courseId, year: e.target.value, type }) }}>
            <option value="">All years</option>
            {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
          </FilterSelect>
          <FilterSelect label="Type" value={type} onChange={e => { setType(e.target.value); fetchQuestions({ courseId, year, type: e.target.value }) }}>
            <option value="">MCQ + Theory</option>
            <option value="mcq">MCQ only</option>
            <option value="theory">Theory only</option>
          </FilterSelect>
          {(courseId || year || type) && (
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button onClick={handleClear} style={{ 
                width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)', 
                background: 'transparent', color: 'var(--muted)', cursor: 'pointer', 
                border: '1px dashed var(--border-2)', fontSize: '13px', fontFamily: 'var(--font-sans)',
                transition: 'all 200ms ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--text-secondary)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.borderColor = 'var(--border-2)' }}              >
                Clear filters ×
              </button>
            </div>
          )}
        </div>

        {/* Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {loading ? (
            [...Array(3)].map((_, i) => <QuestionSkeleton key={i} />)
          ) : error ? (
            <ConnectionErrorState onRetry={() => fetchQuestions({ courseId, year, type })} />
          ) : questions.length === 0 ? (
            <EmptyState onClear={handleClear} hasFilters={!!(courseId || year || type)} />
          ) : (
            questions.map((q, i) => <QuestionCard key={q.id} q={q} index={i} />)
          )}
        </div>
      </div>
    </main>
  )
}

function FilterSelect({ label, value, onChange, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: '6px', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        {label}
      </label>
      <select value={value} onChange={onChange} style={{
        width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)', 
        border: '1px solid var(--border-default)', background: 'var(--bg-base)', 
        color: 'var(--text-primary)', fontSize: '14px', fontFamily: 'var(--font-sans)', 
        cursor: 'pointer', outline: 'none', appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23A8A29E' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
      }}>
        {children}
      </select>
    </div>
  )
}

function ConnectionErrorState({ onRetry }) {
  return (
    <div style={{ textAlign: 'center', padding: '80px 24px', background: 'var(--surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)' }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--error-muted)', border: '1px solid rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--error)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="2" x2="12" y2="12"></line>          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', fontFamily: 'var(--font-display)' }}>
        Connection interrupted
      </h3>
      <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px', lineHeight: 1.6 }}>
        We couldn't reach the question bank. This usually means the backend is waking up or there's a network issue.
      </p>
      <button onClick={onRetry} style={{
        padding: '10px 24px', borderRadius: 'var(--radius-md)', background: 'var(--brand-primary)', 
        color: 'var(--text-inverse)', fontWeight: 600, fontSize: '14px', cursor: 'pointer', 
        border: 'none', fontFamily: 'var(--font-body)', transition: 'opacity 200ms ease',
      }}
      onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
      >
        Try again
      </button>
    </div>
  )
}

function EmptyState({ onClear, hasFilters }) {
  return (
    <div style={{ textAlign: 'center', padding: '80px 24px', background: 'var(--surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)' }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--brand-primary-muted)', border: '1px solid var(--brand-primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--brand-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>
      <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', fontFamily: 'var(--font-display)' }}>
        {hasFilters ? 'No questions match your filters' : 'The library is empty'}
      </h3>
      <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px', lineHeight: 1.6 }}>
        {hasFilters ? 'Try adjusting your course, year, or type to find what you need.' : 'Questions will appear here once they are uploaded and processed.'}
      </p>
      {hasFilters && (
        <button onClick={onClear} style={{
          padding: '10px 24px', borderRadius: 'var(--radius-md)', background: 'transparent', 
          color: 'var(--text-primary)', fontWeight: 600, fontSize: '14px', cursor: 'pointer', 
          border: '1px solid var(--border-default)', fontFamily: 'var(--font-body)', transition: 'all 200ms ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--brand-primary)'; e.currentTarget.style.color = 'var(--brand-primary)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.color = 'var(--text-primary)' }}
        >
          Clear all filters
        </button>
      )}    </div>
  )
}

function QuestionCard({ q, index }) {
  const [revealed, setRevealed] = useState(false)
  const [hovered, setHovered] = useState(false)
  const isMCQ = q.type === 'mcq'

  return (
    <div 
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'var(--bg-elevated)' : 'var(--surface)', 
        border: `1px solid ${hovered ? 'var(--border-default)' : 'var(--border-subtle)'}`,
        borderLeft: `3px solid ${hovered ? 'var(--brand-primary)' : 'transparent'}`,
        padding: '24px',
        borderRadius: 'var(--radius-md)',
        transition: 'all 250ms var(--ease-out)',
        cursor: 'default',
      }}
    >
      {/* Meta */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
        {q.courses?.code && <Tag>{q.courses.code}</Tag>}
        {q.year && <Tag>{q.year}</Tag>}
        {q.type && <Tag variant={q.type === 'mcq' ? 'brand' : 'default'}>{q.type.toUpperCase()}</Tag>}
        {q.topic && <span style={{ fontSize: '12px', color: 'var(--muted-2)', alignSelf: 'center', fontFamily: 'var(--font-mono)' }}>{q.topic}</span>}
      </div>

      {/* Content */}
      <p style={{ fontSize: '16px', lineHeight: 1.7, color: 'var(--text)', marginBottom: isMCQ ? '20px' : '16px', fontWeight: 500 }}>
        {renderMath(q.content)}
      </p>

      {/* MCQ options */}
      {isMCQ && q.options && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
          {q.options.map((opt, i) => {
            const isAnswer = opt === q.answer
            return (
              <div key={i} style={{
                padding: '12px 14px', borderRadius: 'var(--radius-sm)', fontSize: '14px',
                background: isAnswer ? 'var(--success-muted)' : 'var(--bg-base)',
                border: `1px solid ${isAnswer ? 'rgba(34, 197, 94, 0.3)' : 'var(--border-subtle)'}`,
                color: isAnswer ? 'var(--success)' : 'var(--text-secondary)',
                display: 'flex', gap: '10px', alignItems: 'flex-start',
                transition: 'all 200ms ease',
              }}>                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600, flexShrink: 0, paddingTop: '1px', color: isAnswer ? 'var(--success)' : 'var(--muted)' }}>
                  {String.fromCharCode(65 + i)}.
                </span>
                <span style={{ lineHeight: 1.5 }}>{renderMath(opt)}</span>
              </div>
            )
          })}
        </div>
      )}

      {/* Theory answer */}
      {!isMCQ && q.answer && (
        !revealed
          ? <button onClick={() => setRevealed(true)} style={{ 
              fontSize: '13px', color: 'var(--brand-primary)', background: 'none', border: 'none', 
              cursor: 'pointer', padding: 0, fontFamily: 'var(--font-mono)', fontWeight: 500,
              display: 'flex', alignItems: 'center', gap: '6px',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              Reveal answer
            </button>
          : <div style={{ marginTop: '16px', padding: '16px 20px', background: 'var(--success-muted)', border: '1px solid rgba(34, 197, 94, 0.2)', borderRadius: 'var(--radius-sm)', fontSize: '15px', color: 'var(--text)', lineHeight: 1.7 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--success)', display: 'block', marginBottom: '8px', letterSpacing: '0.1em', fontWeight: 700 }}>ANSWER</span>
              {q.answer}
            </div>
      )}
    </div>
  )
}

function Tag({ children, variant = 'default' }) {
  const styles = {
    default: { background: 'var(--surface-2)', color: 'var(--muted)', border: '1px solid var(--border-subtle)' },
    brand:   { background: 'var(--brand-primary-muted)', color: 'var(--brand-primary)', border: '1px solid var(--brand-primary-glow)' },
  }
  return (
    <span style={{ padding: '3px 10px', borderRadius: '4px', fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 600, letterSpacing: '0.04em', ...styles[variant] }}>
      {children}
    </span>
  )
}

function QuestionSkeleton() {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border-subtle)', borderLeft: '3px solid transparent', padding: '24px', borderRadius: 'var(--radius-md)' }}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <Shimmer w="70px" h="22px" /><Shimmer w="45px" h="22px" />
      </div>
      <Shimmer h="18px" style={{ marginBottom: '10px' }} />
      <Shimmer h="18px" w="80%" style={{ marginBottom: '20px' }} />      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <Shimmer h="42px" /><Shimmer h="42px" /><Shimmer h="42px" /><Shimmer h="42px" />
      </div>
    </div>
  )
}

function Shimmer({ w = '100%', h = '16px', style: extra }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: '4px',
      background: 'linear-gradient(90deg, var(--surface-2) 25%, var(--border-subtle) 50%, var(--surface-2) 75%)',
      backgroundSize: '200% 100%', animation: 'shimmer 1.5s ease-in-out infinite',
      ...extra
    }} />
  )
}