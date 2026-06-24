'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

// ── Tiny animation hook ───────────────────────────────────────
function useFadeIn(delay = 0) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.opacity = '0'
    el.style.transform = 'translateY(16px)'
    el.style.transition = `opacity 600ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 600ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`
    const raf = requestAnimationFrame(() => {
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
    })
    return () => cancelAnimationFrame(raf)
  }, [delay])
  return ref
}

// ── Animated counter ──────────────────────────────────────────
function Counter({ target, suffix = '' }) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      observer.disconnect()
      let start = 0
      const step = target / 60
      const tick = () => {
        start = Math.min(start + step, target)
        setVal(Math.floor(start))
        if (start < target) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, { threshold: 0.5 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>
}

// ── Noise texture SVG overlay ─────────────────────────────────
const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`

export default function LandingPage() {
  const hero = useFadeIn(100)
  const sub  = useFadeIn(220)
  const ctas = useFadeIn(340)

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', overflowX: 'hidden', fontFamily: 'var(--font-sans)' }}>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section style={{
        minHeight: '92vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '80px 24px 60px',
        position: 'relative', isolation: 'isolate',
      }}>
        {/* Glow */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0, zIndex: -1,
          background: 'radial-gradient(ellipse 60% 50% at 50% 20%, rgba(127,255,110,0.07) 0%, transparent 70%)',
          backgroundImage: NOISE,
        }} />

        {/* Grid lines */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0, zIndex: -1, opacity: 0.3,
          backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 40%, transparent 100%)',
        }} />

        {/* Badge */}
        <div ref={useFadeIn(0)} style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          padding: '4px 12px 4px 8px',
          borderRadius: '100px',
          background: 'var(--green-dim)',
          border: '1px solid rgba(127,255,110,0.25)',
          marginBottom: '32px',
        }}>
          <span style={{ fontSize: '10px', background: 'var(--green)', color: '#080810', borderRadius: '100px', padding: '2px 8px', fontWeight: 700, fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>
            NEW
          </span>
          <span style={{ fontSize: '13px', color: 'var(--green)', fontWeight: 500 }}>
            AI extraction now live · UNIBEN
          </span>
        </div>

        {/* Headline */}
        <h1 ref={hero} style={{
          fontSize: 'clamp(36px, 7vw, 76px)', fontWeight: 800,
          lineHeight: 1.05, letterSpacing: '-0.03em',
          color: 'var(--text)', marginBottom: '20px',
          maxWidth: '760px',
        }}>
          Every past question.{' '}
          <span style={{
            color: 'var(--green)',
            textShadow: '0 0 40px rgba(127,255,110,0.3)',
          }}>
            One place.
          </span>
        </h1>

        {/* Sub */}
        <p ref={sub} style={{
          fontSize: 'clamp(16px, 2.5vw, 19px)', color: 'var(--muted)',
          maxWidth: '480px', lineHeight: 1.65, marginBottom: '40px',
        }}>
          Upload your past question papers. The AI extracts every question, option, and answer.
          Then you practice until you stop losing marks.
        </p>

        {/* CTAs */}
        <div ref={ctas} style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/questions">
            <button style={{
              padding: '13px 28px', borderRadius: 'var(--radius)',
              background: 'var(--green)', color: '#080810',
              fontWeight: 700, fontSize: '15px', cursor: 'pointer', border: 'none',
              fontFamily: 'var(--font-sans)',
              boxShadow: '0 0 0 0 rgba(127,255,110,0)',
              transition: 'box-shadow 200ms ease, transform 200ms ease',
            }}
            onMouseEnter={e => { e.target.style.boxShadow = '0 0 24px rgba(127,255,110,0.35)'; e.target.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.target.style.boxShadow = '0 0 0 0 rgba(127,255,110,0)'; e.target.style.transform = 'translateY(0)' }}
            >
              Browse questions →
            </button>
          </Link>
          <Link href="/auth/signup">
            <button style={{
              padding: '13px 28px', borderRadius: 'var(--radius)',
              background: 'transparent', color: 'var(--text)',
              fontWeight: 600, fontSize: '15px', cursor: 'pointer',
              border: '1px solid var(--border-2)',
              fontFamily: 'var(--font-sans)',
              transition: 'border-color 200ms ease, color 200ms ease',
            }}
            onMouseEnter={e => { e.target.style.borderColor = 'var(--green)'; e.target.style.color = 'var(--green)' }}
            onMouseLeave={e => { e.target.style.borderColor = 'var(--border-2)'; e.target.style.color = 'var(--text)' }}
            >
              Get started free
            </button>
          </Link>
        </div>

        {/* Scroll hint */}
        <div style={{
          position: 'absolute', bottom: '32px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
        }}>
          <span style={{ fontSize: '11px', color: 'var(--muted-2)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>SCROLL</span>
          <div style={{
            width: '1px', height: '32px',
            background: 'linear-gradient(to bottom, var(--border-2), transparent)',
          }} />
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────── */}
      <section style={{
        padding: '64px 24px',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{
          maxWidth: '800px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '40px', textAlign: 'center',
        }}>
          {[
            { num: 1000,  suffix: '+', label: 'Questions extracted' },
            { num: 100,   suffix: '%', label: 'Free to use' },
            { num: 5,     suffix: '+', label: 'Courses covered' },
            { num: 2024,  suffix: '',  label: 'Questions up to' },
          ].map((s, i) => (
            <div key={i}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 'clamp(28px, 4vw, 40px)',
                fontWeight: 700, color: 'var(--green)', lineHeight: 1,
                marginBottom: '8px',
              }}>
                <Counter target={s.num} suffix={s.suffix} />
              </div>
              <div style={{ fontSize: '13px', color: 'var(--muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────── */}
      <section style={{ padding: '96px 24px', maxWidth: '960px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--green)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px' }}>
            FEATURES
          </p>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text)' }}>
            Built for how students actually study
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2px' }}>
          {[
            {
              icon: '⬆',
              title: 'Upload anything',
              desc: 'PDF, photo, scan. The AI finds the questions regardless of format or print quality.',
            },
            {
              icon: '⌕',
              title: 'Filter instantly',
              desc: 'Course code, year, topic, difficulty — find the exact questions you need in seconds.',
            },
            {
              icon: '◎',
              title: 'Quiz mode',
              desc: 'Randomised MCQ sessions. Submit an answer, see if you were right, review after.',
            },
            {
              icon: '↗',
              title: 'Always growing',
              desc: 'Every upload adds to the bank. The more students upload, the more everyone benefits.',
            },
          ].map((f, i) => (
            <FeatureCard key={i} {...f} />
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────── */}
      <section style={{
        padding: '96px 24px',
        borderTop: '1px solid var(--border)',
        background: 'var(--surface)',
      }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--green)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px', textAlign: 'center' }}>
            HOW IT WORKS
          </p>
          <h2 style={{ fontSize: 'clamp(22px, 3.5vw, 36px)', fontWeight: 700, letterSpacing: '-0.02em', textAlign: 'center', marginBottom: '56px' }}>
            Three steps
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {[
              { n: '01', title: 'Upload a past question paper', body: 'Find a PDF or image of any past exam. Drag it onto the upload page.' },
              { n: '02', title: 'AI extracts the questions',    body: 'The AI reads every question, option, and answer and stores them in the database.' },
              { n: '03', title: 'Browse, filter, practice',     body: "Search by course and year. Start a quiz. Stop losing marks to questions you've already seen." },
            ].map((step, i, arr) => (
              <div key={i} style={{ display: 'flex', gap: '24px', paddingBottom: i < arr.length - 1 ? '40px' : '0', position: 'relative' }}>
                {/* Line */}
                {i < arr.length - 1 && (
                  <div style={{
                    position: 'absolute', left: '19px', top: '40px', bottom: '0',
                    width: '1px', background: 'var(--border)',
                  }} />
                )}
                {/* Number */}
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                  border: '1px solid var(--border-2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--surface-2)',
                  fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--green)',
                  zIndex: 1,
                }}>
                  {step.n}
                </div>
                <div style={{ paddingTop: '8px' }}>
                  <p style={{ fontWeight: 600, fontSize: '16px', color: 'var(--text)', marginBottom: '6px' }}>{step.title}</p>
                  <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.65 }}>{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section style={{ padding: '96px 24px', textAlign: 'center' }}>
        <div style={{
          maxWidth: '560px', margin: '0 auto',
          padding: '56px 40px',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          background: 'var(--surface)',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Inner glow */}
          <div aria-hidden="true" style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse 60% 60% at 50% 0%, rgba(127,255,110,0.06) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '11px',
            color: 'var(--green)', letterSpacing: '0.15em',
            textTransform: 'uppercase', marginBottom: '20px',
          }}>
            FREE · NO CARD NEEDED
          </p>
          <h2 style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '12px' }}>
            Start studying today
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--muted)', lineHeight: 1.65, marginBottom: '32px' }}>
            Questions are available without an account. Create one to track your progress and upload papers.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/questions">
              <button style={primaryBtn}>Browse questions →</button>
            </Link>
            <Link href="/auth/signup">
              <button style={outlineBtn}>Create account</button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '32px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '16px', maxWidth: '960px', margin: '0 auto',
      }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 700 }}>
          Past<span style={{ color: 'var(--green)' }}>Q</span>
        </span>
        <span style={{ fontSize: '13px', color: 'var(--muted)' }}>
          © 2026 · Built for Nigerian university students
        </span>
        <div style={{ display: 'flex', gap: '20px' }}>
          {[['Browse', '/questions'], ['Quiz', '/quiz'], ['Sign up', '/auth/signup']].map(([label, href]) => (
            <Link key={href} href={href} style={{ fontSize: '13px', color: 'var(--muted)', transition: 'color 200ms', textDecoration: 'none' }}
              onMouseEnter={e => e.target.style.color = 'var(--text)'}
              onMouseLeave={e => e.target.style.color = 'var(--muted)'}
            >{label}</Link>
          ))}
        </div>
      </footer>

    </main>
  )
}

function FeatureCard({ icon, title, desc }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '32px',
        background: hovered ? 'var(--surface-2)' : 'var(--surface)',
        border: '1px solid var(--border)',
        transition: 'background 200ms ease',
        cursor: 'default',
      }}
    >
      <div style={{
        width: '36px', height: '36px', borderRadius: 'var(--radius-sm)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--green-dim)', marginBottom: '20px',
        fontSize: '16px', color: 'var(--green)',
        fontFamily: 'var(--font-mono)',
      }}>
        {icon}
      </div>
      <p style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text)', marginBottom: '8px' }}>{title}</p>
      <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.65 }}>{desc}</p>
    </div>
  )
}

const primaryBtn = {
  padding: '12px 24px', borderRadius: 'var(--radius)',
  background: 'var(--green)', color: '#080810',
  fontWeight: 700, fontSize: '14px', cursor: 'pointer', border: 'none',
  fontFamily: 'var(--font-sans)',
}

const outlineBtn = {
  padding: '12px 24px', borderRadius: 'var(--radius)',
  background: 'transparent', color: 'var(--text)',
  fontWeight: 600, fontSize: '14px', cursor: 'pointer',
  border: '1px solid var(--border-2)',
  fontFamily: 'var(--font-sans)',
}
