'use client'
import { useState, useEffect, useReducer } from 'react'
import Link from 'next/link'

const API = process.env.NEXT_PUBLIC_API_URL

function renderMath(text) {
  if (!text) return text
  return String(text)
    .replace(/\^-3/g, '⁻³').replace(/\^-2/g, '⁻²').replace(/\^-1/g, '⁻¹')
    .replace(/\^2/g, '²').replace(/\^3/g, '³')
    .replace(/sqrt\(([^)]+)\)/g, '√($1)')
    .replace(/\bpi\b/gi, 'π').replace(/\btheta\b/gi, 'θ')
}

function stripLetter(opt) {
  if (!opt) return opt
  return String(opt).replace(/^[A-Ea-e][.)\s]\s*/, '').trim()
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const init = { phase: 'setup', questions: [], current: 0, selected: null, answers: [], courseId: '', count: '10' }

function reducer(state, action) {
  switch (action.type) {
    case 'START':    return { ...state, phase: 'question', questions: action.questions, current: 0, selected: null, answers: [] }
    case 'SELECT':   return { ...state, selected: action.option }
    case 'SUBMIT': {
      const ans = [...state.answers, { question: state.questions[state.current], selected: state.selected }]
      return { ...state, answers: ans, phase: state.current + 1 >= state.questions.length ? 'done' : 'result' }
    }
    case 'NEXT':     return { ...state, current: state.current + 1, selected: null, phase: 'question' }
    case 'RESTART':  return { ...init }
    case 'SET':      return { ...state, [action.key]: action.val }
    default:         return state
  }
}

export default function QuizPage() {
  const [state, dispatch] = useReducer(reducer, init)
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadErr, setLoadErr] = useState(null)

  useEffect(() => {
    fetch(`${API}/api/courses`).then(r => r.json()).then(d => { if (Array.isArray(d)) setCourses(d) }).catch(() => {})
  }, [])

  async function startQuiz() {
    if (!state.courseId) return
    setLoading(true); setLoadErr(null)
    try {
      const res  = await fetch(`${API}/api/questions?type=mcq&limit=200&course_id=${state.courseId}`)
      const json = await res.json()
      const data = Array.isArray(json) ? json : (json.data ?? [])
      if (data.length === 0) { setLoadErr('No MCQ questions found for this course.'); setLoading(false); return }
      dispatch({ type: 'START', questions: shuffle(data).slice(0, parseInt(state.count)) })
    } catch { setLoadErr('Could not load questions. Check your connection.') }
    setLoading(false)
  }

  /* ── SETUP ── */
  if (state.phase === 'setup') return (
    <main style={mainStyle}>
      <div style={{ maxWidth: '440px', margin: '0 auto', padding: '60px 24px' }}>
        <Link href="/" style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--muted)', textDecoration: 'none', marginBottom: '48px', display: 'block' }}>← Back</Link>
        <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '8px' }}>Practice Quiz</h1>
        <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '40px' }}>Randomised MCQs. Exam conditions.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Field label="Course">
            <select value={state.courseId} onChange={e => dispatch({ type: 'SET', key: 'courseId', val: e.target.value })} style={selectStyle}>
              <option value="">Select a course</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.code} — {c.title}</option>)}
            </select>
          </Field>
          <Field label="Number of questions">
            <select value={state.count} onChange={e => dispatch({ type: 'SET', key: 'count', val: e.target.value })} style={selectStyle}>
              {[5, 10, 20, 30].map(n => <option key={n} value={n}>{n} questions</option>)}
            </select>
          </Field>
          {loadErr && <p style={{ fontSize: '13px', color: 'var(--red)', padding: '10px 12px', background: 'var(--red-dim)', borderRadius: '6px' }}>{loadErr}</p>}
          <button onClick={startQuiz} disabled={!state.courseId || loading}
            style={{ padding: '13px', borderRadius: '8px', border: 'none', fontFamily: 'var(--font-sans)', fontSize: '15px', fontWeight: 700, cursor: !state.courseId || loading ? 'not-allowed' : 'pointer', background: !state.courseId || loading ? 'var(--surface-2)' : 'var(--green)', color: !state.courseId || loading ? 'var(--muted)' : '#080810', transition: 'all 200ms' }}>
            {loading ? 'Loading…' : 'Begin →'}
          </button>
        </div>
      </div>
    </main>
  )

  /* ── DONE ── */
  if (state.phase === 'done') {
    const correct = state.answers.filter(a => a.selected === a.question.answer).length
    const pct = Math.round((correct / state.answers.length) * 100)
    return (
      <main style={mainStyle}>
        <div style={{ maxWidth: '640px', margin: '0 auto', padding: '60px 24px' }}>
          {/* Score card */}
          <div style={{ padding: '40px', border: `1px solid ${pct >= 70 ? 'rgba(127,255,110,0.3)' : 'rgba(255,77,77,0.3)'}`, borderRadius: '16px', background: 'var(--surface)', marginBottom: '40px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '64px', fontWeight: 700, color: pct >= 70 ? 'var(--green)' : 'var(--red)', lineHeight: 1, marginBottom: '8px' }}>{pct}%</div>
            <p style={{ fontSize: '16px', color: 'var(--muted)' }}>{correct} of {state.answers.length} correct</p>
            <p style={{ fontSize: '13px', color: 'var(--muted-2)', marginTop: '6px' }}>
              {pct >= 70 ? 'Above 70% — good result.' : 'Below 70% — review the answers below and try again.'}
            </p>
          </div>

          {/* Answer review */}
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Review</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '40px' }}>
            {state.answers.map((a, i) => {
              const ok = a.selected === a.question.answer
              return (
                <div key={i} style={{ padding: '16px 20px', background: 'var(--surface)', border: '1px solid var(--border)', borderLeft: `3px solid ${ok ? 'rgba(127,255,110,0.6)' : 'var(--red)'}` }}>
                  <p style={{ fontSize: '14px', color: 'var(--text)', marginBottom: '10px', lineHeight: 1.6 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', marginRight: '8px' }}>Q{i + 1}</span>
                    {renderMath(a.question.content)}
                  </p>
                  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '12px', color: ok ? 'var(--green)' : 'var(--red)' }}>
                      Your answer: {stripLetter(a.selected) || 'skipped'}
                    </span>
                    {!ok && <span style={{ fontSize: '12px', color: 'var(--green)' }}>Correct: {stripLetter(a.question.answer)}</span>}
                  </div>
                </div>
              )
            })}
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => dispatch({ type: 'RESTART' })} style={primaryBtn}>Try again</button>
            <Link href="/questions"><button style={outlineBtn}>Browse questions</button></Link>
          </div>
        </div>
      </main>
    )
  }

  /* ── QUESTION / RESULT ── */
  const q          = state.questions[state.current]
  const submitted  = state.phase === 'result'
  const pct        = Math.round(((state.current + 1) / state.questions.length) * 100)

  return (
    <main style={mainStyle}>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 24px' }}>
        {/* Progress */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--muted)', fontFamily: 'var(--font-mono)', marginBottom: '10px' }}>
          <span>{state.current + 1} / {state.questions.length}</span>
          <span>{state.answers.filter(a => a.selected === a.question.answer).length} correct</span>
        </div>
        <div style={{ height: '3px', background: 'var(--border)', borderRadius: '2px', marginBottom: '36px' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: 'var(--green)', borderRadius: '2px', transition: 'width 300ms cubic-bezier(0.16,1,0.3,1)' }} />
        </div>

        {/* Question */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '28px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            {q.courses?.code && <SmallTag>{q.courses.code}</SmallTag>}
            {q.year && <SmallTag>{q.year}</SmallTag>}
          </div>
          <p style={{ fontSize: '17px', lineHeight: 1.7, color: 'var(--text)' }}>{renderMath(q.content)}</p>
        </div>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
          {q.options?.map((opt, i) => {
            const letter    = String.fromCharCode(65 + i)
            const isSelected = state.selected === opt
            const isCorrect  = submitted && opt === q.answer
            const isWrong    = submitted && isSelected && !isCorrect
            return (
              <button key={i} onClick={() => !submitted && dispatch({ type: 'SELECT', option: opt })}
                disabled={submitted} aria-pressed={isSelected}
                style={{
                  display: 'flex', gap: '14px', alignItems: 'flex-start', width: '100%', textAlign: 'left',
                  padding: '14px 18px', borderRadius: '10px', fontFamily: 'var(--font-sans)', cursor: submitted ? 'default' : 'pointer',
                  background: isCorrect ? 'rgba(127,255,110,0.08)' : isWrong ? 'rgba(255,77,77,0.08)' : isSelected ? 'var(--surface-2)' : 'var(--surface)',
                  border: `1.5px solid ${isCorrect ? 'rgba(127,255,110,0.4)' : isWrong ? 'rgba(255,77,77,0.4)' : isSelected ? 'var(--border-2)' : 'var(--border)'}`,
                  transition: 'all 180ms',
                }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: isCorrect ? 'var(--green)' : isWrong ? 'var(--red)' : 'var(--muted)', flexShrink: 0, paddingTop: '2px', minWidth: '20px' }}>
                  {letter}.
                </span>
                <span style={{ fontSize: '15px', color: 'var(--text)', lineHeight: 1.55, flex: 1 }}>{renderMath(stripLetter(opt))}</span>
                {isCorrect && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--green)', flexShrink: 0 }}>✓</span>}
                {isWrong   && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--red)',   flexShrink: 0 }}>✗</span>}
              </button>
            )
          })}
        </div>

        {!submitted
          ? <button onClick={() => dispatch({ type: 'SUBMIT' })} disabled={!state.selected}
              style={{ ...primaryBtn, width: '100%', opacity: !state.selected ? 0.4 : 1, cursor: !state.selected ? 'not-allowed' : 'pointer' }}>
              Submit
            </button>
          : <button onClick={() => dispatch({ type: 'NEXT' })} style={{ ...primaryBtn, width: '100%' }}>
              {state.current + 1 < state.questions.length ? 'Next →' : 'See results →'}
            </button>
        }
      </div>
    </main>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--muted)', marginBottom: '8px', letterSpacing: '0.04em' }}>{label}</label>
      {children}
    </div>
  )
}

function SmallTag({ children }) {
  return <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontFamily: 'var(--font-mono)', background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--muted)' }}>{children}</span>
}

const mainStyle  = { minHeight: '100vh', background: 'var(--bg)', fontFamily: 'var(--font-sans)' }
const selectStyle = { width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '14px', fontFamily: 'var(--font-sans)', outline: 'none' }
const primaryBtn = { padding: '13px 24px', borderRadius: '8px', border: 'none', background: 'var(--green)', color: '#080810', fontSize: '15px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sans)', transition: 'opacity 200ms' }
const outlineBtn = { padding: '13px 24px', borderRadius: '8px', border: '1px solid var(--border-2)', background: 'transparent', color: 'var(--text)', fontSize: '15px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)' }
