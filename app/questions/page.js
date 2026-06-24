'use client'
import { useState, useEffect, useCallback } from 'react'

const API = process.env.NEXT_PUBLIC_API_URL

function renderMath(text) {
  if (!text) return text
  return String(text)
    .replace(/\^-3/g, '⁻³').replace(/\^-2/g, '⁻²').replace(/\^-1/g, '⁻¹')
    .replace(/\^2/g, '²').replace(/\^3/g, '³')
    .replace(/sqrt\(([^)]+)\)/g, '√($1)')
    .replace(/_2/g, '₂').replace(/_3/g, '₃')
    .replace(/\bpi\b/gi, 'π').replace(/\btheta\b/gi, 'θ')
    .replace(/\bdelta\b/gi, 'δ').replace(/\bsigma\b/gi, 'σ')
    .replace(/\binfinity\b/gi, '∞')
}

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
      const json = await res.json()
      setQuestions(Array.isArray(json) ? json : (json.data ?? []))
    } catch {
      setError('Could not connect to the server.')
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
    fetchQuestions({})
  }

  const availableYears = [...new Set(questions.map(q => q.year).filter(Boolean))].sort((a, b) => b - a)

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'var(--font-sans)', padding: '40px 24px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '6px' }}>
            Question Bank
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--muted)' }}>
            {loading ? 'Loading…' : `${questions.length} question${questions.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Filters */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '10px', marginBottom: '32px', padding: '16px',
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
        }}>
          <select value={courseId} onChange={e => { setCourseId(e.target.value); fetchQuestions({ courseId: e.target.value, year, type }) }}
            style={selectStyle} aria-label="Filter by course">
            <option value="">All courses</option>
            {courses.map(c => <option key={c.id} value={c.id}>{c.code}</option>)}
          </select>

          <select value={year} onChange={e => { setYear(e.target.value); fetchQuestions({ courseId, year: e.target.value, type }) }}
            style={selectStyle} aria-label="Filter by year">
            <option value="">All years</option>
            {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
          </select>

          <select value={type} onChange={e => { setType(e.target.value); fetchQuestions({ courseId, year, type: e.target.value }) }}
            style={selectStyle} aria-label="Filter by type">
            <option value="">MCQ + Theory</option>
            <option value="mcq">MCQ only</option>
            <option value="theory">Theory only</option>
          </select>

          {(courseId || year || type) && (
            <button onClick={handleClear} style={{ ...selectStyle, background: 'transparent', color: 'var(--muted)', cursor: 'pointer', border: '1px dashed var(--border-2)' }}>
              Clear filters ×
            </button>
          )}
        </div>

        {/* Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {loading ? (
            [...Array(4)].map((_, i) => <QuestionSkeleton key={i} />)
          ) : error ? (
            <EmptyState icon="⚠" title="Connection failed" message={error} />
          ) : questions.length === 0 ? (
            <EmptyState icon="○" title="No questions match" message="Try different filters or browse all." action={<button onClick={handleClear} style={actionBtn}>Clear filters</button>} />
          ) : (
            questions.map((q, i) => <QuestionCard key={q.id} q={q} index={i} />)
          )}
        </div>

      </div>
    </main>
  )
}

function QuestionCard({ q, index }) {
  const [revealed, setRevealed] = useState(false)
  const isMCQ = q.type === 'mcq'
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderLeft: '3px solid var(--border-2)',
      padding: '20px 24px',
      transition: 'border-left-color 200ms',
    }}
    onMouseEnter={e => e.currentTarget.style.borderLeftColor = 'var(--green)'}
    onMouseLeave={e => e.currentTarget.style.borderLeftColor = 'var(--border-2)'}
    >
      {/* Meta */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
        {q.courses?.code && <Tag>{q.courses.code}</Tag>}
        {q.year && <Tag>{q.year}</Tag>}
        {q.type && <Tag variant={q.type === 'mcq' ? 'green' : 'default'}>{q.type.toUpperCase()}</Tag>}
        {q.topic && <span style={{ fontSize: '12px', color: 'var(--muted-2)', alignSelf: 'center' }}>{q.topic}</span>}
      </div>

      {/* Content */}
      <p style={{ fontSize: '15px', lineHeight: 1.7, color: 'var(--text)', marginBottom: isMCQ ? '16px' : '12px' }}>
        {renderMath(q.content)}
      </p>

      {/* MCQ options */}
      {isMCQ && q.options && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
          {q.options.map((opt, i) => {
            const isAnswer = opt === q.answer
            return (
              <div key={i} style={{
                padding: '9px 12px', borderRadius: 'var(--radius-sm)', fontSize: '13px',
                background: isAnswer ? 'var(--green-dim)' : 'var(--surface-2)',
                border: `1px solid ${isAnswer ? 'rgba(127,255,110,0.3)' : 'var(--border)'}`,
                color: isAnswer ? 'var(--green)' : 'var(--muted)',
                display: 'flex', gap: '8px',
              }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', flexShrink: 0, paddingTop: '1px' }}>
                  {String.fromCharCode(65 + i)}.
                </span>
                {renderMath(opt)}
              </div>
            )
          })}
        </div>
      )}

      {/* Theory answer */}
      {!isMCQ && q.answer && (
        !revealed
          ? <button onClick={() => setRevealed(true)} style={{ fontSize: '13px', color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Show answer ↓</button>
          : <div style={{ marginTop: '12px', padding: '12px 16px', background: 'var(--green-dim)', border: '1px solid rgba(127,255,110,0.2)', borderRadius: 'var(--radius-sm)', fontSize: '14px', color: 'var(--text)', lineHeight: 1.6 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--green)', display: 'block', marginBottom: '6px', letterSpacing: '0.1em' }}>ANSWER</span>
              {q.answer}
            </div>
      )}
    </div>
  )
}

function Tag({ children, variant = 'default' }) {
  const styles = {
    default: { background: 'var(--surface-2)', color: 'var(--muted)', border: '1px solid var(--border)' },
    green:   { background: 'var(--green-dim)',  color: 'var(--green)', border: '1px solid rgba(127,255,110,0.2)' },
  }
  return (
    <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 500, letterSpacing: '0.04em', ...styles[variant] }}>
      {children}
    </span>
  )
}

function QuestionSkeleton() {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderLeft: '3px solid var(--border)', padding: '20px 24px' }}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
        <Shimmer w="64px" h="20px" /><Shimmer w="40px" h="20px" />
      </div>
      <Shimmer h="16px" style={{ marginBottom: '8px' }} />
      <Shimmer h="16px" w="75%" style={{ marginBottom: '16px' }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <Shimmer h="36px" /><Shimmer h="36px" /><Shimmer h="36px" /><Shimmer h="36px" />
      </div>
    </div>
  )
}

function Shimmer({ w = '100%', h = '16px', style: extra }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: '4px',
      background: 'linear-gradient(90deg, var(--surface-2) 25%, var(--border) 50%, var(--surface-2) 75%)',
      backgroundSize: '200% 100%', animation: 'shimmer 1.4s ease-in-out infinite',
      ...extra
    }} />
  )
}

function EmptyState({ icon, title, message, action }) {
  return (
    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '32px', color: 'var(--border-2)', marginBottom: '16px' }}>{icon}</div>
      <p style={{ fontWeight: 600, fontSize: '16px', marginBottom: '6px' }}>{title}</p>
      <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: action ? '20px' : '0' }}>{message}</p>
      {action}
    </div>
  )
}

const selectStyle = { width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '13px', fontFamily: 'var(--font-sans)', cursor: 'pointer', outline: 'none' }
const actionBtn = { padding: '8px 18px', borderRadius: 'var(--radius-sm)', background: 'transparent', border: '1px solid var(--border-2)', color: 'var(--text)', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-sans)' }
