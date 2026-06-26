'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function Navbar() {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/');
  }

  const isAuthPage = pathname?.startsWith('/auth');
  if (isAuthPage) return null;

  const desktopLinks = [
    { href: '/questions', label: 'Browse' },
    { href: '/quiz', label: 'Quiz' },
    ...(user ? [{ href: '/dashboard', label: 'Dashboard' }] : []),
  ];

  // Mobile bottom nav: Strictly SVG icons, no emojis.
  const mobileNav = [
    { href: '/questions', label: 'Browse', icon: <SearchIcon /> },
    { href: '/quiz', label: 'Quiz', icon: <QuizIcon /> },
    { href: user ? '/dashboard' : '/auth/login', label: user ? 'Dashboard' : 'Log in', icon: <DashboardIcon /> },    { href: user ? '/onboarding' : '/auth/signup', label: user ? 'Profile' : 'Sign up', icon: <UserIcon /> },
  ];

  return (
    <>
      {/* ── TOP NAVBAR (Desktop) ── */}
      <nav
        role="navigation"
        aria-label="Main navigation"
        style={{
          position: 'sticky', top: 0, zIndex: 100,
          width: '100%', padding: '0 24px', height: '64px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: scrolled ? 'var(--bg-overlay)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--border-subtle)' : '1px solid transparent',
          transition: 'background var(--dur-normal) var(--ease-out), border-color var(--dur-normal) var(--ease-out)',
        }}
      >
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Past</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '20px', fontWeight: 700, color: 'var(--brand-primary)', letterSpacing: '-0.02em' }}>Q</span>
        </Link>

        {/* Desktop Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="desktop-nav">
          {desktopLinks.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} style={{
                padding: '8px 16px', borderRadius: 'var(--radius-sm)',
                fontSize: '14px', fontWeight: 500,
                color: active ? 'var(--brand-primary)' : 'var(--text-secondary)',
                background: active ? 'var(--brand-primary-muted)' : 'transparent',
                transition: 'color var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out)',
              }}>
                {label}
              </Link>
            );
          })}
        </div>

        {/* Desktop Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="desktop-nav">
          {!loading && (
            <>
              {user ? (
                <button onClick={handleSignOut} style={ghostBtn}>Sign out</button>
              ) : (                <>
                  <Link href="/auth/login" style={{ ...ghostBtn, display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
                    Log in
                  </Link>
                  <Link href="/auth/signup" style={{
                    padding: '8px 18px', borderRadius: 'var(--radius-sm)',
                    fontSize: '14px', fontWeight: 600,
                    background: 'var(--brand-primary)', color: 'var(--text-inverse)',
                    display: 'inline-flex', alignItems: 'center', textDecoration: 'none',
                  }}>
                    Sign up
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </nav>

      {/* ── BOTTOM NAV (Mobile) ── */}
      <nav
        aria-label="Mobile navigation"
        className="mobile-bottom-nav"
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
          height: '64px', paddingBottom: 'env(safe-area-inset-bottom)',
          background: 'var(--bg-overlay)',
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-around',
          padding: '0 8px',
        }}
      >
        {mobileNav.map(({ href, label, icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: '4px', flex: 1, height: '100%',
                color: active ? 'var(--brand-primary)' : 'var(--text-tertiary)',
                textDecoration: 'none',
                transition: 'color var(--dur-fast) var(--ease-out)',
              }}
            >
              <div style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: active ? 1 : 0.7 }}>
                {icon}
              </div>              <span style={{ fontSize: '10px', fontWeight: active ? 600 : 500, fontFamily: 'var(--font-mono)', letterSpacing: '0.02em' }}>
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}

// ── Custom SVG Icons (NO EMOJIS) ──
function SearchIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
}
function QuizIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>;
}
function DashboardIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
}
function UserIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
}

const ghostBtn = {
  padding: '8px 16px', borderRadius: 'var(--radius-sm)',
  fontSize: '14px', fontWeight: 500, cursor: 'pointer',
  color: 'var(--text-secondary)', background: 'transparent', border: 'none',
  fontFamily: 'var(--font-body)',
  transition: 'color var(--dur-fast) var(--ease-out)',
};