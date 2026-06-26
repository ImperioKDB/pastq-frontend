'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { colors, spacing, typography, radii, shadows } from './design-system/tokens'
import { buttonStyles } from './design-system/components'

function useFadeIn(delay = 0) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.opacity = '0'
    el.style.transform = 'translateY(20px)'
    el.style.transition = `opacity 800ms var(--ease-out) ${delay}ms, transform 800ms var(--ease-out) ${delay}ms`
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
    <main style={{ minHeight: '100vh', background: colors.bg.base, overflowX: 'hidden', fontFamily: typography.font.body, position: 'relative' }}>
      
      {/* HERO */}
      <section style={{
        minHeight: '92vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        padding: `${spacing[8]} ${spacing[5]} ${spacing[7]}`, position: 'relative', isolation: 'isolate',
      }}>
        {/* Sophisticated Fading Grid Background */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0, zIndex: -2, opacity: 0.4,
          backgroundImage: `linear-gradient(${colors.border.subtle} 1px, transparent 1px), linear-gradient(90deg, ${colors.border.subtle} 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 60% 50% at 50% 40%, black 20%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse 60% 50% at 50% 40%, black 20%, transparent 70%)',
        }} />
        
        {/* Illuminated Glow behind text */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0, zIndex: -1,
          background: `radial-gradient(ellipse 50% 40% at 50% 30%, ${colors.brand.primaryGlow} 0%, transparent 70%)`,
          filter: 'blur(40px)',
        }} />

        <div ref={badge} style={{
          display: 'inline-flex', alignItems: 'center', gap: spacing[2],
          padding: `${spacing[1]} 14px ${spacing[1]} 6px`, borderRadius: radii.full,
          background: colors.brand.primaryMuted, border: `1px solid ${colors.brand.primaryGlow}`,
          marginBottom: spacing[6], backdropFilter: 'blur(8px)',
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
          fontSize: 'clamp(36px, 7vw, 80px)', fontWeight: 800,
          lineHeight: 1.02, letterSpacing: '-0.03em',
          color: colors.text.primary, marginBottom: spacing[5],
          maxWidth: '820px', fontFamily: typography.font.display,
        }}>
          3 AM. Your exam is in{' '}          <span style={{ 
            color: colors.brand.primary, 
            textShadow: `0 0 60px ${colors.brand.primaryGlow}`,
            fontStyle: 'italic',
            fontWeight: 700,
          }}>
            5 hours.
          </span>
          <br />We have got you.
        </h1>

        <p ref={sub} style={{
          fontSize: 'clamp(16px, 2.2vw, 20px)', color: colors.text.secondary,
          maxWidth: '520px', lineHeight: typography.leading.relaxed, marginBottom: spacing[7],
          fontWeight: 400,
        }}>
          Past questions from Nigerian universities. Filtered by course, year, and topic.
          Practiced until you cannot get them wrong.
        </p>

        <div ref={ctas} style={{ display: 'flex', gap: spacing[3], justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/questions">
            <button style={{
              ...buttonStyles.primary,
              padding: `${spacing[4]} ${spacing[6]}`,
              fontSize: typography.size.base,
              border: `1px solid rgba(212, 160, 23, 0.3)`,
            }}>Start practicing</button>
          </Link>
          <Link href="/auth/signup">
            <button style={{
              ...buttonStyles.secondary,
              padding: `${spacing[4]} ${spacing[6]}`,
              fontSize: typography.size.base,
            }}>Create free account</button>
          </Link>
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding: `${spacing[8]} ${spacing[5]}`, borderTop: `1px solid ${colors.border.subtle}`, borderBottom: `1px solid ${colors.border.subtle}` }}>
        <div style={{
          maxWidth: '900px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: spacing[6], textAlign: 'center',
        }}>
          {[
            { num: 10847, suffix: '', label: 'Questions extracted' },
            { num: 4302, suffix: '', label: 'Students practicing this week' },
            { num: 6, suffix: '', label: 'Universities covered' },            { num: 2019, suffix: '–2024', label: 'Years available' },
          ].map((s, i) => (
            <StatItem key={i} num={s.num} suffix={s.suffix} label={s.label} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: `${spacing[9]} ${spacing[5]}`, borderTop: `1px solid ${colors.border.subtle}` }}>
        <div style={{
          maxWidth: '600px', margin: '0 auto', padding: spacing[8],
          textAlign: 'center', border: `1px solid ${colors.border.subtle}`,
          borderRadius: radii.xl, background: colors.bg.elevated,
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Subtle inner glow */}
          <div aria-hidden="true" style={{ 
            position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
            width: '60%', height: '1px',
            background: `linear-gradient(90deg, transparent, ${colors.brand.primary}, transparent)`,
            opacity: 0.5,
          }} />
          
          <p style={{ fontFamily: typography.font.mono, fontSize: '11px', color: colors.brand.primary, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: spacing[5] }}>
            FREE · NO CARD NEEDED
          </p>
          <h2 style={{ fontSize: 'clamp(24px,4.5vw,36px)', fontWeight: 700, letterSpacing: typography.tracking.tight, marginBottom: spacing[3], color: colors.text.primary, fontFamily: typography.font.display }}>
            Pass your exams. Period.
          </h2>
          <p style={{ fontSize: typography.size.base, color: colors.text.secondary, lineHeight: typography.leading.relaxed, marginBottom: spacing[7] }}>
            Browse questions without an account. Create one to track progress and upload past papers for your coursemates.
          </p>
          <div style={{ display: 'flex', gap: spacing[3], justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/questions"><button style={{...buttonStyles.primary, padding: `${spacing[3]} ${spacing[6]}`}}>Browse questions</button></Link>
            <Link href="/auth/signup"><button style={{...buttonStyles.secondary, padding: `${spacing[3]} ${spacing[6]}`}}>Create account</button></Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${colors.border.subtle}`, padding: `${spacing[6]} ${spacing[5]}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: spacing[4], maxWidth: '960px', margin: '0 auto' }}>
        <span style={{ fontFamily: typography.font.mono, fontSize: typography.size.sm, fontWeight: 700, color: colors.text.primary }}>
          Past<span style={{ color: colors.brand.primary }}>Q</span>
        </span>
        <span style={{ fontSize: typography.size.sm, color: colors.text.secondary }}>
          © 2026 · Built for Nigerian university students
        </span>
      </footer>
    </main>
  )}

function StatItem({ num, suffix, label }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div 
      onMouseEnter={() => setHovered(true)} 
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: spacing[5],
        borderRadius: radii.lg,
        background: hovered ? 'rgba(28, 25, 23, 0.5)' : 'transparent',
        border: `1px solid ${hovered ? colors.border.default : 'transparent'}`,
        transition: 'all 300ms var(--ease-out)',
        cursor: 'default',
      }}
    >
      <div style={{ fontFamily: typography.font.mono, fontSize: 'clamp(32px,4.5vw,48px)', fontWeight: 700, color: colors.brand.primary, lineHeight: 1, marginBottom: spacing[2] }}>
        <Counter target={num} suffix={suffix} />
      </div>
      <div style={{ fontSize: typography.size.sm, color: colors.text.secondary, fontWeight: 500 }}>{label}</div>
    </div>
  )
}