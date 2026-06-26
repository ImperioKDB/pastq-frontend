'use client'
import { useReducer, useState, useEffect } from 'react'
import Link from 'next/link'
import { renderMath } from '@/lib/utils/math'

const API = process.env.NEXT_PUBLIC_API_URL

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
    case 'START':   return { ...state, phase: 'question', questions: action.questions, current: 0, selected: null, answers: [] }
    case 'SELECT':  return { ...state, selected: action.option }
    case 'SUBMIT': {
      const ans = [...state.answers, { question: state.questions[state.current], selected: state.selected }]
      return { ...state, answers: ans, phase: state.current + 1 >= state.questions.length ? 'done' : 'result' }
    }
    case 'NEXT':    return { ...state, current: state.current + 1, selected: null, phase: 'question' }
    case 'RESTART': return { ...init }
    case 'SET':     return { ...state, [action.key]: action.val }
    default:        return state
  }
}

export default function QuizPage() {
  const [state, dispatch] = useReducer(reducer, init)
  const [courses,  setCourses]  = useState([])
  const [loading,  setLoading]  = useState(false)
  const [loadErr,  setLoadErr]  = useState(null)

  useEffect(() => {
    fetch(API + '/api/courses').then(r => r.json()).then(d => { if (Array.isArray(d)) setCourses(d) }).catch(() => {})
  }, [])

  async function startQuiz() {
    if (!state.courseId) return
    setLoading(true); setLoadErr(null)
    try {
      const res  = await fetch(API + '/api/questions?type=mcq&limit=200&course_id=' + state.courseId)
      const json = await res.json()
      const data = Array.isArray(json) ? json : (json.data ?? [])
      if (data.length === 0) { setLoadErr('No MCQ questions found for this course yet.'); setLoading(false); return }
      dispatch({ type: 'START', questions: shuffle(data).slice(0, parseInt(state.count)) })
    } catch { setLoadErr('Could not load questions. Check your connection.') }
    setLoading(false)
  }

  /* ── SETUP ── */
  if (state.phase === 'setup') return (
    <main style={mainStyle}>
      <div style={{ maxWidth: '440px', margin: '0 auto', padding: '60px 24px' }}>
        <Link href="/" style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-tertiary)', textDecoration: 'none', marginBottom: '48px', display: 'block' }}>
          &larr; Back
        </Link>

        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--brand-primary)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px' }}>
          QUIZ MODE
        </p>
        <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '6px', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
          Practice Quiz
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '40px' }}>
          Randomised MCQs. Exam conditions.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Field label="Course">
            <select
              value={state.courseId}
              onChange={e => dispatch({ type: 'SET', key: 'courseId', val: e.target.value })}
              style={selectStyle}
            >
              <option value="">Select a course</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.code} &mdash; {c.title}</option>)}
            </select>
          </Field>

          <Field label="Number of questions">
            <select
              value={state.count}
              onChange={e => dispatch({ type: 'SET', key: 'count', val: e.target.value })}
              style={selectStyle}
            >
              {[5, 10, 20, 30].map(n => <option key={n} value={n}>{n} questions</option>)}
            </select>
          </Field>

          {loadErr && (
            <p style={{ fontSize: '13px', color: 'var(--error)', padding: '10px 12px', background: 'var(--error-muted)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              {loadErr}
            </p>
          )}

          <button
            onClick={startQuiz}
            disabled={!state.courseId || loading}
            style={{
              padding: '14px', borderRadius: 'var(--radius-md)', border: 'none',
              fontFamily: 'var(--font-body)', fontSize: '15px', fontWeight: 700,
              cursor: !state.courseId || loading ? 'not-allowed' : 'pointer',
              background: !state.courseId || loading ? 'var(--border-default)' : 'var(--brand-primary)',
              color:      !state.courseId || loading ? 'var(--text-tertiary)'  : 'var(--text-inverse)',
              boxShadow:  !state.courseId || loading ? 'none' : 'var(--shadow-glow)',
              transition: 'all var(--dur-normal) var(--ease-out)',
            }}
          >
            {loading ? 'Loading…' : 'Begin →'}
          </button>
        </div>
      </div>
    </main>
  )

  /* ── DONE ── */
  if (state.phase === 'done') {
    const correct = state.answers.filter(a => a.selected === a.question.answer).length
    const pct     = Math.round((correct / state.answers.length) * 100)

    const scoreColor  = pct >= 80 ? 'var(--success)' : pct >= 50 ? 'var(--brand-primary)' : 'var(--error)'
    const scoreBorder = pct >= 80 ? 'rgba(34, 197, 94, 0.25)' : pct >= 50 ? 'rgba(212, 160, 23, 0.25)' : 'rgba(239, 68, 68, 0.25)'
    const scoreMsg    = pct >= 80 ? 'Clean. Keep this momentum.'
                      : pct >= 60 ? "Solid foundation. A few more runs and you're ready."
                      : pct >= 40 ? 'Getting there. Focus on the questions below.'
                      : 'This subject needs more time. Work through these answers.'

    return (
      <main style={mainStyle}>
        <div style={{ maxWidth: '640px', margin: '0 auto', padding: '60px 24px' }}>

          {/* Score card */}
          <div style={{
            padding: '40px',
            border: '1px solid ' + scoreBorder,
            borderRadius: 'var(--radius-lg)',
            background: 'var(--bg-elevated)',
            marginBottom: '40px',
            textAlign: 'center',
          }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-tertiary)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px' }}>
              RESULT
            </p>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '72px', fontWeight: 700, color: scoreColor, lineHeight: 1, marginBottom: '8px' }}>
              {pct}%
            </div>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              {correct} of {state.answers.length} correct
            </p>
            <p style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>
              {scoreMsg}
            </p>
          </div>

          {/* Answer review */}
          <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Review
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '40px' }}>
            {state.answers.map((a, i) => {
              const ok = a.selected === a.question.answer
              return (
                <div key={i} style={{
                  padding: '16px 20px',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderLeft: '3px solid ' + (ok ? 'var(--success)' : 'var(--error)'),
                }}>
                  <p style={{ fontSize: '14px', color: 'var(--text-primary)', marginBottom: '10px', lineHeight: 1.6 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-tertiary)', marginRight: '8px' }}>Q{i + 1}</span>
                    {renderMath(a.question.content)}
                  </p>
                  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '12px', color: ok ? 'var(--success)' : 'var(--error)' }}>
                      Your answer: {stripLetter(a.selected) || 'skipped'}
                    </span>
                    {!ok && (
                      <span style={{ fontSize: '12px', color: 'var(--success)' }}>
                        Correct: {stripLetter(a.question.answer)}
                      </span>
                    )}
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
  const q         = state.questions[state.current]
  const submitted = state.phase === 'result'
  const pct       = Math.round(((state.current + 1) / state.questions.length) * 100)

  return (
    <main style={mainStyle}>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Progress */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', marginBottom: '10px' }}>
          <span>{state.current + 1} / {state.questions.length}</span>
          <span>{state.answers.filter(a => a.selected === a.question.answer).length} correct</span>
        </div>
        <div style={{ height: '3px', background: 'var(--border-default)', borderRadius: '2px', marginBottom: '36px' }}>
          <div style={{ height: '100%', width: pct + '%', background: 'var(--brand-primary)', borderRadius: '2px', transition: 'width 300ms var(--ease-out)' }} />
        </div>

        {/* Question card */}
        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', padding: '28px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            {q.courses?.code && <SmallTag>{q.courses.code}</SmallTag>}
            {q.year && <SmallTag>{q.year}</SmallTag>}
          </div>
          <p style={{ fontSize: '17px', lineHeight: 1.7, color: 'var(--text-primary)' }}>
            {renderMath(q.content)}
          </p>
        </div>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
          {q.options?.map((opt, i) => {
            const letter     = String.fromCharCode(65 + i)
            const isSelected = state.selected === opt
            const isCorrect  = submitted && opt === q.answer
            const isWrong    = submitted && isSelected && !isCorrect
            return (
              <button
                key={i}
                onClick={() => !submitted && dispatch({ type: 'SELECT', option: opt })}
                disabled={submitted}
                aria-pressed={isSelected}
                style={{
                  display: 'flex', gap: '14px', alignItems: 'flex-start',
                  width: '100%', textAlign: 'left',
                  padding: '14px 18px', borderRadius: 'var(--radius-md)',
                  fontFamily: 'var(--font-body)',
                  cursor: submitted ? 'default' : 'pointer',
                  background: isCorrect ? 'var(--success-muted)' : isWrong ? 'var(--error-muted)' : isSelected ? 'var(--surface-2)' : 'var(--bg-elevated)',
                  border: '1.5px solid ' + (isCorrect ? 'rgba(34, 197, 94, 0.4)' : isWrong ? 'rgba(239, 68, 68, 0.4)' : isSelected ? 'var(--border-strong)' : 'var(--border-default)'),
                  transition: 'all 180ms var(--ease-out)',
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: isCorrect ? 'var(--success)' : isWrong ? 'var(--error)' : 'var(--text-tertiary)', flexShrink: 0, paddingTop: '2px', minWidth: '20px' }}>
                  {letter}.
                </span>
                <span style={{ fontSize: '15px', color: 'var(--text-primary)', lineHeight: 1.55, flex: 1 }}>
                  {renderMath(stripLetter(opt))}
                </span>
                {isCorrect && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--success)', flexShrink: 0 }}>✓</span>}
                {isWrong   && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--error)',   flexShrink: 0 }}>✗</span>}
              </button>
            )
          })}
        </div>

        {!submitted
          ? <button
              onClick={() => dispatch({ type: 'SUBMIT' })}
              disabled={!state.selected}
              style={{ ...primaryBtn, width: '100%', opacity: !state.selected ? 0.4 : 1, cursor: !state.selected ? 'not-allowed' : 'pointer' }}
            >
              Submit
            </button>
          : <button
              onClick={() => dispatch({ type: 'NEXT' })}
              style={{ ...primaryBtn, width: '100%' }}
            >
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
      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: '8px', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        {label}
      </label>
      {children}
    </div>
  )
}

function SmallTag({ children }) {
  return (
    <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontFamily: 'var(--font-mono)', background: 'var(--surface-2)', border: '1px solid var(--border-default)', color: 'var(--text-tertiary)' }}>
      {children}
    </span>
  )
}

const mainStyle  = { minHeight: '100vh', background: 'var(--bg-base)', fontFamily: 'var(--font-body)' }
const selectStyle = { width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)', background: 'var(--bg-base)', color: 'var(--text-primary)', fontSize: '14px', fontFamily: 'var(--font-body)', outline: 'none', cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none' }
const primaryBtn  = { padding: '13px 24px', borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--brand-primary)', color: 'var(--text-inverse)', fontSize: '15px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)', boxShadow: 'var(--shadow-glow)', transition: 'opacity var(--dur-fast) var(--ease-out)' }
const outlineBtn  = { padding: '13px 24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'transparent', color: 'var(--text-primary)', fontSize: '15px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }
