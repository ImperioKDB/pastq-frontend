'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

// ── Fade-in hook ──────────────────────────────────────────────────────────────
function useFadeIn(delay = 0) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.opacity = '0'
    el.style.transform = 'translateY(20px)'
    el.style.transition = `opacity 600ms var(--ease-out) ${delay}ms, transform 600ms var(--ease-out) ${delay}ms`
    const raf = requestAnimationFrame(() => {
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
    })
    return () => cancelAnimationFrame(raf)
  }, [delay])
  return ref
}

// ── Animated counter ──────────────────────────────────────────────────────────
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

export default function LandingPage() {
  const badge = useFadeIn(0)
  const hero  = useFadeIn(120)
  const sub   = useFadeIn(240)
  const ctas  = useFadeIn(360)

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-base)', overflowX: 'hidden', fontFamily: 'var(--font-body)' }}>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{
        minHeight: '92vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '80px 24px 60px',
        position: 'relative', isolation: 'isolate',
      }}>

        {/* Ambient glow */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0, zIndex: -1,
          background: 'radial-gradient(ellipse 60% 50% at 50% 20%, rgba(212,160,23,0.07) 0%, transparent 70%)',
        }} />

        {/* Grid lines */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0, zIndex: -1, opacity: 0.25,
          backgroundImage: 'linear-gradient(var(--border-subtle) 1px, transparent 1px), linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 40%, transparent 100%)',
        }} />

        {/* Badge */}
        <div ref={badge} style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '4px 14px 4px 6px',
          borderRadius: 'var(--radius-full)',
          background: 'var(--brand-primary-muted)',
          border: '1px solid var(--brand-primary-glow)',
          marginBottom: '36px',
        }}>
          <span style={{
            fontSize: '10px', background: 'var(--brand-primary)',
            color: 'var(--text-inverse)', borderRadius: 'var(--radius-full)',
            padding: '2px 8px', fontWeight: 700,
            fontFamily: 'var(--font-mono)', letterSpacing: '0.08em',
          }}>LIVE</span>
          <span style={{ fontSize: '13px', color: 'var(--brand-primary)', fontWeight: 500 }}>
            10,000+ questions extracted — UNIBEN, UI, OAU & more
          </span>
        </div>

        {/* Headline */}
        <h1 ref={hero} style={{
          fontSize: 'clamp(32px, 6.5vw, 72px)', fontWeight: 800,
          lineHeight: 1.05, letterSpacing: '-0.03em',
          color: 'var(--text-primary)', marginBottom: '20px',
          maxWidth: '780px', fontFamily: 'var(--font-display)',
        }}>
          3 AM. Your exam is in{' '}
          <span style={{ color: 'var(--brand-primary)', textShadow: '0 0 40px rgba(212,160,23,0.35)' }}>
            5 hours.
          </span>
          <br />We have got you.
        </h1>

        {/* Subhead */}
        <p ref={sub} style={{
          fontSize: 'clamp(16px, 2.2vw, 19px)', color: 'var(--text-secondary)',
          maxWidth: '500px', lineHeight: 1.7, marginBottom: '44px',
        }}>
          Past questions from Nigerian universities. Filtered by course, year, and topic.
          Practiced until you cannot get them wrong.
        </p>

        {/* CTAs */}
        <div ref={ctas} style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/questions">
            <button
              style={{
                padding: '14px 30px', borderRadius: 'var(--radius-md)',
                background: 'var(--brand-primary)', color: 'var(--text-inverse)',
                fontWeight: 700, fontSize: '15px', cursor: 'pointer', border: 'none',
                fontFamily: 'var(--font-body)', boxShadow: 'var(--shadow-glow)',
                transition: 'box-shadow var(--dur-fast) ease, transform var(--dur-fast) ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-glow-strong)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-glow)'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              Start practicing
            </button>
          </Link>
          <Link href="/auth/signup">
            <button
              style={{
                padding: '14px 30px', borderRadius: 'var(--radius-md)',
                background: 'transparent', color: 'var(--text-primary)',
                fontWeight: 600, fontSize: '15px', cursor: 'pointer',
                border: '1px solid var(--border-default)',
                fontFamily: 'var(--font-body)',
                transition: 'border-color var(--dur-fast) ease, color var(--dur-fast) ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--brand-primary)'; e.currentTarget.style.color = 'var(--brand-primary)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.color = 'var(--text-primary)' }}
            >
              Create free account
            </button>
          </Link>
        </div>

        {/* Scroll hint */}
        <div style={{ position: 'absolute', bottom: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', letterSpacing: '0.12em' }}>SCROLL</span>
          <div style={{ width: '1px', height: '32px', background: 'linear-gradient(to bottom, var(--border-default), transparent)' }} />
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────────── */}
      <section style={{
        padding: '64px 24px',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <div style={{
          maxWidth: '840px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '40px', textAlign: 'center',
        }}>
          {[
            { num: 10847, suffix: '',       label: 'Questions extracted' },
            { num: 4302,  suffix: '',       label: 'Students practicing this week' },
            { num: 6,     suffix: '',       label: 'Universities covered' },
            { num: 2019,  suffix: '–2024', label: 'Years available' },
          ].map((s, i) => (
            <div key={i}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 'clamp(28px,4vw,42px)',
                fontWeight: 700, color: 'var(--brand-primary)', lineHeight: 1, marginBottom: '8px',
              }}>
                <Counter target={s.num} suffix={s.suffix} />
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section style={{ padding: '96px 24px' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--brand-primary)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px', textAlign: 'center' }}>
            WHAT STUDENTS SAY
          </p>
          <h2 style={{ fontSize: 'clamp(22px,3.5vw,36px)', fontWeight: 700, letterSpacing: '-0.02em', textAlign: 'center', marginBottom: '56px', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
            Real students. Real results.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px,1fr))', gap: '16px' }}>
            {[
              { quote: 'I found 47 MTH 101 questions from 2019 to 2023. Scored 78% on my test. This thing is serious.', name: 'Chijioke A.', detail: '200L Mechanical Engineering · UNIBEN' },
              { quote: 'Used to pay ₦500 for past questions at the photocopy shop. Now it is free and better organized. No wahala.', name: 'Emeka O.', detail: '100L Economics · University of Ibadan' },
              { quote: 'The AI extraction is scary good. It even caught the diagrams in my PHY 101 past questions.', name: 'Adaobi N.', detail: '300L Medicine · UNN' },
            ].map((t, i) => (
              <div key={i} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '28px' }}>
                <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.75, marginBottom: '20px', fontStyle: 'italic' }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{t.name}</p>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>{t.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────────── */}
      <section style={{ padding: '96px 24px', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-elevated)' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--brand-primary)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px', textAlign: 'center' }}>
            FEATURES
          </p>
          <h2 style={{ fontSize: 'clamp(22px,3.5vw,36px)', fontWeight: 700, letterSpacing: '-0.02em', textAlign: 'center', marginBottom: '56px', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
            Built for how students actually study
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: '2px' }}>
            {[
              { icon: <UploadIcon />,  title: 'Upload anything',        desc: 'PDF, photo, scan — the AI reads every question, option, and answer regardless of format or print quality.' },
              { icon: <SearchIcon />,  title: 'Find in seconds',        desc: 'Filter by course code, year, topic, or difficulty. No more scrolling through 50-page PDFs the night before.' },
              { icon: <QuizIcon />,    title: 'Practice under pressure', desc: 'Randomised MCQ sessions. Submit an answer, see if you were right, review everything after.' },
              { icon: <GrowthIcon />,  title: 'Always growing',         desc: 'Every upload adds to the bank. The more students contribute, the more everyone benefits.' },
            ].map((f, i) => <FeatureCard key={i} {...f} />)}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section style={{ padding: '96px 24px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--brand-primary)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px', textAlign: 'center' }}>
            HOW IT WORKS
          </p>
          <h2 style={{ fontSize: 'clamp(22px,3.5vw,36px)', fontWeight: 700, letterSpacing: '-0.02em', textAlign: 'center', marginBottom: '56px', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
            Stop scrambling. Start practicing.
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {[
              { n: '01', title: 'Snap or upload a past question paper',         body: 'Find any PDF or image of a past exam. Drag it onto the upload page — messy scans included.' },
              { n: '02', title: 'We read the messy scans so you do not have to', body: 'The AI extracts every question, option, and answer. No manual typing, no missed questions.' },
              { n: '03', title: 'Practice until you cannot get them wrong',      body: 'Filter by course and year. Start a quiz. Stop losing marks to questions you have already seen.' },
            ].map((step, i, arr) => (
              <div key={i} style={{ display: 'flex', gap: '24px', paddingBottom: i < arr.length - 1 ? '44px' : '0', position: 'relative' }}>
                {i < arr.length - 1 && (
                  <div style={{ position: 'absolute', left: '19px', top: '44px', bottom: 0, width: '1px', background: 'var(--border-subtle)' }} />
                )}
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                  border: '1px solid var(--border-default)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--bg-elevated)',
                  fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--brand-primary)', zIndex: 1,
                }}>
                  {step.n}
                </div>
                <div style={{ paddingTop: '8px' }}>
                  <p style={{ fontWeight: 600, fontSize: '16px', color: 'var(--text-primary)', marginBottom: '6px' }}>{step.title}</p>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section style={{ padding: '96px 24px', borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{
          maxWidth: '560px', margin: '0 auto',
          padding: '56px 40px', textAlign: 'center',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          background: 'var(--bg-elevated)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 60% at 50% 0%, rgba(212,160,23,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--brand-primary)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '20px' }}>
            FREE · NO CARD NEEDED
          </p>
          <h2 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '12px', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
            Pass your exams. Period.
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '36px' }}>
            Browse questions without an account. Create one to track progress and upload past papers for your coursemates.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/questions">
              <button style={{ padding: '13px 26px', borderRadius: 'var(--radius-md)', background: 'var(--brand-primary)', color: 'var(--text-inverse)', fontWeight: 700, fontSize: '14px', cursor: 'pointer', border: 'none', fontFamily: 'var(--font-body)', boxShadow: 'var(--shadow-glow)' }}>
                Browse questions
              </button>
            </Link>
            <Link href="/auth/signup">
              <button style={{ padding: '13px 26px', borderRadius: 'var(--radius-md)', background: 'transparent', color: 'var(--text-primary)', fontWeight: 600, fontSize: '14px', cursor: 'pointer', border: '1px solid var(--border-default)', fontFamily: 'var(--font-body)' }}>
                Create account
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid var(--border-subtle)', padding: '32px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', maxWidth: '960px', margin: '0 auto' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
          Past<span style={{ color: 'var(--brand-primary)' }}>Q</span>
        </span>
        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          &copy; 2026 · Built for Nigerian university students
        </span>
        <div style={{ display: 'flex', gap: '20px' }}>
          {[['Browse', '/questions'], ['Quiz', '/quiz'], ['Sign up', '/auth/signup']].map(([label, href]) => (
            <Link key={href} href={href} style={{ fontSize: '13px', color: 'var(--text-secondary)', transition: 'color var(--dur-fast) ease' }}
              onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
            >{label}</Link>
          ))}
        </div>
      </footer>
    </main>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────
function FeatureCard({ icon, title, desc }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '32px',
        background: hovered ? 'var(--bg-elevated)' : 'var(--bg-base)',
        border: \`1px solid \${hovered ? 'var(--border-default)' : 'var(--border-subtle)'}\`,
        transition: 'background var(--dur-normal) ease, border-color var(--dur-normal) ease',
        cursor: 'default',
      }}
    >
      <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--brand-primary-muted)', marginBottom: '20px', color: 'var(--brand-primary)' }}>
        {icon}
      </div>
      <p style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text-primary)', marginBottom: '8px' }}>{title}</p>
      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{desc}</p>
    </div>
  )
}

// ── SVG Icons ─────────────────────────────────────────────────────────────────
function UploadIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  )
}
function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  )
}
function QuizIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </svg>
  )
}
function GrowthIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
    </svg>
  )
}
