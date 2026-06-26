'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { colors, spacing, typography, radii, shadows } from './design-system/tokens'
import { buttonStyles } from './design-system/components'

// Clean animation hook using design system tokens
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
    <main style={{ minHeight: '100vh', background: colors.bg.base, overflowX: 'hidden', fontFamily: typography.font.body }}>
      
      {/* HERO */}
      <section style={{
        minHeight: '92vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        padding: `${spacing[8]} ${spacing[5]} ${spacing[7]}`, position: 'relative', isolation: 'isolate',
      }}>
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0, zIndex: -1,
          background: `radial-gradient(ellipse 60% 50% at 50% 20%, ${colors.brand.primaryGlow} 0%, transparent 70%)`,
        }} />
        
        <div ref={badge} style={{
          display: 'inline-flex', alignItems: 'center', gap: spacing[2],
          padding: `${spacing[1]} 14px ${spacing[1]} 6px`, borderRadius: radii.full,
          background: colors.brand.primaryMuted, border: `1px solid ${colors.brand.primaryGlow}`,
          marginBottom: spacing[6],
        }}>
          <span style={{
            fontSize: typography.size.xs, background: colors.brand.primary,
            color: colors.text.inverse, borderRadius: radii.full,
            padding: `2px ${spacing[2]}`, fontWeight: 700,
            fontFamily: typography.font.mono, letterSpacing: typography.tracking.wider,
          }}>LIVE</span>
          <span style={{ fontSize: typography.size.sm, color: colors.brand.primary, fontWeight: 500 }}>
            10,000+ questions extracted — UNIBEN, UI, OAU & more
          </span>
        </div>

        <h1 ref={hero} style={{
          fontSize: 'clamp(32px, 6.5vw, 72px)', fontWeight: 800,
          lineHeight: 1.05, letterSpacing: typography.tracking.tight,
          color: colors.text.primary, marginBottom: spacing[5],
          maxWidth: '780px', fontFamily: typography.font.display,
        }}>
          3 AM. Your exam is in{' '}
          <span style={{ color: colors.brand.primary, textShadow: `0 0 40px ${colors.brand.primaryGlow}` }}>
            5 hours.
          </span>
          <br />We have got you.
        </h1>

        <p ref={sub} style={{
          fontSize: 'clamp(16px, 2.2vw, 19px)', color: colors.text.secondary,
          maxWidth: '500px', lineHeight: typography.leading.relaxed, marginBottom: spacing[7],
        }}>          Past questions from Nigerian universities. Filtered by course, year, and topic.
          Practiced until you cannot get them wrong.
        </p>

        <div ref={ctas} style={{ display: 'flex', gap: spacing[3], justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/questions">
            <button style={buttonStyles.primary}>Start practicing</button>
          </Link>
          <Link href="/auth/signup">
            <button style={buttonStyles.secondary}>Create free account</button>
          </Link>
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding: `${spacing[7]} ${spacing[5]}`, borderTop: `1px solid ${colors.border.subtle}`, borderBottom: `1px solid ${colors.border.subtle}` }}>
        <div style={{
          maxWidth: '840px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: spacing[6], textAlign: 'center',
        }}>
          {[
            { num: 10847, suffix: '', label: 'Questions extracted' },
            { num: 4302, suffix: '', label: 'Students practicing this week' },
            { num: 6, suffix: '', label: 'Universities covered' },
            { num: 2019, suffix: '–2024', label: 'Years available' },
          ].map((s, i) => (
            <div key={i}>
              <div style={{ fontFamily: typography.font.mono, fontSize: 'clamp(28px,4vw,42px)', fontWeight: 700, color: colors.brand.primary, lineHeight: 1, marginBottom: spacing[2] }}>
                <Counter target={s.num} suffix={s.suffix} />
              </div>
              <div style={{ fontSize: typography.size.sm, color: colors.text.secondary }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: `${spacing[8]} ${spacing[5]}`, borderTop: `1px solid ${colors.border.subtle}` }}>
        <div style={{
          maxWidth: '560px', margin: '0 auto', padding: spacing[7],
          textAlign: 'center', border: `1px solid ${colors.border.subtle}`,
          borderRadius: radii.xl, background: colors.bg.elevated,
        }}>
          <p style={{ fontFamily: typography.font.mono, fontSize: '11px', color: colors.brand.primary, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: spacing[5] }}>
            FREE · NO CARD NEEDED
          </p>
          <h2 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 700, letterSpacing: typography.tracking.tight, marginBottom: spacing[3], color: colors.text.primary, fontFamily: typography.font.display }}>
            Pass your exams. Period.
          </h2>          <p style={{ fontSize: typography.size.sm, color: colors.text.secondary, lineHeight: typography.leading.relaxed, marginBottom: spacing[6] }}>
            Browse questions without an account. Create one to track progress and upload past papers for your coursemates.
          </p>
          <div style={{ display: 'flex', gap: spacing[3], justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/questions"><button style={buttonStyles.primary}>Browse questions</button></Link>
            <Link href="/auth/signup"><button style={buttonStyles.secondary}>Create account</button></Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${colors.border.subtle}`, padding: `${spacing[5]} ${spacing[5]}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: spacing[4], maxWidth: '960px', margin: '0 auto' }}>
        <span style={{ fontFamily: typography.font.mono, fontSize: typography.size.sm, fontWeight: 700, color: colors.text.primary }}>
          Past<span style={{ color: colors.brand.primary }}>Q</span>
        </span>
        <span style={{ fontSize: typography.size.sm, color: colors.text.secondary }}>
          © 2026 · Built for Nigerian university students
        </span>
      </footer>
    </main>
  )
}