import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc' }}>

      {/* Navbar */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '18px 32px', background: '#fff', borderBottom: '1px solid #e2e8f0',
        position: 'sticky', top: 0, zIndex: 100
      }}>
        <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: '22px', color: '#065f46' }}>
          Past<span style={{ color: '#f59e0b' }}>Q</span>
        </span>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href="/questions">
            <button style={{
              padding: '8px 18px', background: 'transparent', border: '1px solid #065f46',
              borderRadius: '8px', color: '#065f46', fontWeight: 600, cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif", fontSize: '14px'
            }}>Browse</button>
          </Link>
          <Link href="/dashboard">
            <button style={{
              padding: '8px 18px', background: 'transparent', border: '1px solid #065f46',
              borderRadius: '8px', color: '#065f46', fontWeight: 600, cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif", fontSize: '14px'
            }}>Dashboard</button>
          </Link>
          <Link href="/quiz">
            <button style={{
              padding: '8px 18px', background: '#065f46', border: 'none',
              borderRadius: '8px', color: '#fff', fontWeight: 600, cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif", fontSize: '14px'
            }}>Take Quiz</button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        textAlign: 'center', padding: '80px 24px 60px',
        background: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)'
      }}>
        <div style={{
          display: 'inline-block', background: 'rgba(245,158,11,0.15)',
          border: '1px solid rgba(245,158,11,0.4)', borderRadius: '100px',
          padding: '6px 18px', marginBottom: '24px'
        }}>
          <span style={{ color: '#fcd34d', fontSize: '13px', fontWeight: 600 }}>
            🇳🇬 Built for Nigerian Students
          </span>
        </div>
        <h1 style={{
          fontFamily: "'Sora', sans-serif", fontSize: 'clamp(32px, 6vw, 56px)',
          fontWeight: 800, color: '#fff', margin: '0 0 20px', lineHeight: 1.15
        }}>
          Ace Your Exams with<br />
          <span style={{ color: '#f59e0b' }}>AI-Powered</span> Past Questions
        </h1>
        <p style={{
          color: '#a7f3d0', fontSize: '18px', maxWidth: '540px',
          margin: '0 auto 40px', lineHeight: 1.7
        }}>
          Upload past question papers. Our AI extracts and organizes every question.
          Practice smarter, score higher.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/questions">
            <button style={{
              padding: '14px 32px', background: '#f59e0b', border: 'none',
              borderRadius: '10px', color: '#111', fontWeight: 700, fontSize: '16px',
              cursor: 'pointer', fontFamily: "'Sora', sans-serif"
            }}>Browse Questions →</button>
          </Link>
          <Link href="/quiz">
            <button style={{
              padding: '14px 32px', background: 'transparent',
              border: '2px solid rgba(255,255,255,0.4)',
              borderRadius: '10px', color: '#fff', fontWeight: 600, fontSize: '16px',
              cursor: 'pointer', fontFamily: "'DM Sans', sans-serif"
            }}>Take a Quiz</button>
          </Link>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{
        display: 'flex', justifyContent: 'center', gap: '48px', flexWrap: 'wrap',
        padding: '32px 24px', background: '#fff', borderBottom: '1px solid #e2e8f0'
      }}>
        {[
          { value: '1,000+', label: 'Questions Extracted' },
          { value: 'Free', label: 'Always Free to Use' },
          { value: 'AI', label: 'Powered Extraction' },
          { value: 'UNIBEN', label: 'University Supported' },
        ].map((stat, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '28px', fontWeight: 800, color: '#065f46' }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Features */}
      <section style={{ padding: '72px 24px', maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{
          fontFamily: "'Sora', sans-serif", fontSize: '32px', fontWeight: 700,
          color: '#0f172a', textAlign: 'center', marginBottom: '48px'
        }}>
          Everything You Need to Pass
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {[
            { icon: '🤖', title: 'AI Extraction', desc: 'Upload any PDF and our AI automatically extracts every question, option, and answer.' },
            { icon: '🔍', title: 'Smart Search', desc: 'Filter questions by course, year, topic, or difficulty. Find exactly what you need.' },
            { icon: '📝', title: 'Quiz Mode', desc: 'Test yourself with randomized quizzes. Track your score and review wrong answers.' },
            { icon: '📊', title: 'Dashboard', desc: "See question banks by course, track what's available, and monitor your progress." },
          ].map((f, i) => (
            <div key={i} style={{
              background: '#fff', borderRadius: '16px', padding: '28px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ fontSize: '36px', marginBottom: '16px' }}>{f.icon}</div>
              <h3 style={{
                fontFamily: "'Sora', sans-serif", fontSize: '18px',
                fontWeight: 700, color: '#0f172a', margin: '0 0 10px'
              }}>{f.title}</h3>
              <p style={{ color: '#6b7280', lineHeight: 1.65, margin: 0, fontSize: '15px' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        background: '#065f46', borderRadius: '20px',
        padding: '56px 32px', textAlign: 'center', maxWidth: '900px',
        marginLeft: 'auto', marginRight: 'auto', marginBottom: '72px', marginTop: '0'
      }}>
        <h2 style={{
          fontFamily: "'Sora', sans-serif", fontSize: '32px', fontWeight: 800,
          color: '#fff', margin: '0 0 16px'
        }}>Ready to Start Practicing?</h2>
        <p style={{ color: '#a7f3d0', fontSize: '16px', margin: '0 0 32px' }}>
          Hundreds of questions already extracted and ready for you.
        </p>
        <Link href="/questions">
          <button style={{
            padding: '14px 36px', background: '#f59e0b', border: 'none',
            borderRadius: '10px', color: '#111', fontWeight: 700, fontSize: '16px',
            cursor: 'pointer', fontFamily: "'Sora', sans-serif"
          }}>Browse Questions Now →</button>
        </Link>
      </section>

      {/* Footer */}
      <footer style={{
        textAlign: 'center', padding: '24px', color: '#94a3b8',
        fontSize: '13px', borderTop: '1px solid #e2e8f0'
      }}>
        PastQ © 2026 · Built for Nigerian University Students
      </footer>

    </main>
  );
          }
