import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc' }}>

      {/* Hero — Navbar is rendered by layout.js, do NOT add another one here */}
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
          Upload past question papers. Our AI extracts and organises every question.
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
              border: '2px solid rgba(255,255,255,0.4)', borderRadius: '10px',
              color: '#fff', fontWeight: 700, fontSize: '16px',
              cursor: 'pointer', fontFamily: "'Sora', sans-serif"
            }}>Take a Quiz</button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 24px', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
          {[
            { icon: '🤖', title: 'AI Extraction', desc: 'Upload any PDF or image. Our AI pulls out every question automatically.' },
            { icon: '📚', title: 'Growing Bank', desc: 'Questions from UNILAG, UNIBEN, UI, ABU and more — always expanding.' },
            { icon: '🎯', title: 'Smart Quizzes', desc: 'Randomised MCQ sessions with instant scoring and answer review.' },
          ].map(f => (
            <div key={f.title} style={{ background: '#fff', borderRadius: '16px', padding: '32px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '36px', marginBottom: '16px' }}>{f.icon}</div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>{f.title}</h3>
              <p style={{ color: '#64748b', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ textAlign: 'center', padding: '32px', color: '#94a3b8', fontSize: '14px', borderTop: '1px solid #e2e8f0' }}>
        PastQ © 2026 · Built for Nigerian University Students
      </footer>

    </main>
  );
}
