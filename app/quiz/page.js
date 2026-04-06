'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL;

function stripLetter(opt) {
  if (!opt) return opt;
  return String(opt).replace(/^[A-Da-d][\.\)]\s*/, '').trim();
}

function renderMath(text) {
  if (!text) return text;
  return String(text)
    .replace(/\^2/g, '²').replace(/\^3/g, '³').replace(/\^0/g, '⁰')
    .replace(/\^1/g, '¹').replace(/\^4/g, '⁴').replace(/\^5/g, '⁵')
    .replace(/\^6/g, '⁶').replace(/\^7/g, '⁷').replace(/\^8/g, '⁸')
    .replace(/\^9/g, '⁹').replace(/\^n/g, 'ⁿ').replace(/\^x/g, 'ˣ')
    .replace(/_0/g, '₀').replace(/_1/g, '₁').replace(/_2/g, '₂')
    .replace(/_3/g, '₃').replace(/_n/g, 'ₙ').replace(/_x/g, 'ₓ')
    .replace(/sqrt\(([^)]+)\)/g, '√($1)')
    .replace(/\bpi\b/gi, 'π').replace(/\btheta\b/gi, 'θ')
    .replace(/\balpha\b/gi, 'α').replace(/\bbeta\b/gi, 'β')
    .replace(/\bdelta\b/gi, 'δ').replace(/\bsigma\b/gi, 'σ')
    .replace(/\binfinity\b/gi, '∞')
    .replace(/\b>=\b/g, '≥').replace(/\b<=\b/g, '≤').replace(/\b!=\b/g, '≠');
}

export default function QuizPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [done, setDone] = useState(false);
  const [count, setCount] = useState('10');
  const [year, setYear] = useState('');

  async function startQuiz() {
    setLoading(true);
    try {
      let url = API + '/api/questions?course_id=0f912f44-96f0-403f-82a2-03ffcaf17df0&type=mcq';
      if (year) url += '&year=' + year;
      const res = await fetch(url);
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) {
        alert('No MCQ questions found.');
        setLoading(false);
        return;
      }
      const shuffled = data.sort(() => Math.random() - 0.5).slice(0, parseInt(count));
      setQuestions(shuffled);
      setAnswers([]);
      setCurrent(0);
      setSelected(null);
      setDone(false);
      setStarted(true);
    } catch (e) {
      alert('Could not load questions.');
    }
    setLoading(false);
  }

  function handleNext() {
    const newAnswers = [...answers, { q: questions[current], selected }];
    setAnswers(newAnswers);
    if (current + 1 >= questions.length) {
      setDone(true);
    } else {
      setCurrent(current + 1);
      setSelected(null);
    }
  }

  function restart() {
    setStarted(false);
    setDone(false);
    setAnswers([]);
    setCurrent(0);
    setSelected(null);
    setQuestions([]);
  }

  const score = answers.filter(a => a.selected === a.q.answer).length;
  const pct = answers.length > 0 ? Math.round((score / answers.length) * 100) : 0;

  const NavBar = () => (
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 32px', background: '#fff', borderBottom: '1px solid #e2e8f0' }}>
      <Link href="/">
        <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: '22px', color: '#065f46', cursor: 'pointer' }}>
          Past<span style={{ color: '#f59e0b' }}>Q</span>
        </span>
      </Link>
      <Link href="/questions">
        <button style={{ padding: '8px 18px', background: 'transparent', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#374151', fontWeight: 500, cursor: 'pointer', fontSize: '14px' }}>
          Browse
        </button>
      </Link>
    </nav>
  );

  if (!started) {
    return (
      <main style={{ minHeight: '100vh', background: '#f8fafc' }}>
        <NavBar />
        <div style={{ maxWidth: '480px', margin: '80px auto', padding: '0 24px' }}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '40px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '48px', textAlign: 'center', marginBottom: '16px' }}>📝</div>
            <h1 style={{ fontFamily: "'Sora',sans-serif", fontSize: '26px', fontWeight: 700, color: '#0f172a', textAlign: 'center', margin: '0 0 8px' }}>Quiz Mode</h1>
            <p style={{ color: '#6b7280', textAlign: 'center', margin: '0 0 32px' }}>Test yourself with past exam questions</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '8px' }}>Year (optional)</label>
                <input value={year} onChange={e => setYear(e.target.value)} placeholder="e.g. 2023" style={{ width: '100%', padding: '12px 14px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '8px' }}>Number of Questions</label>
                <select value={count} onChange={e => setCount(e.target.value)} style={{ width: '100%', padding: '12px 14px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', background: '#fff', boxSizing: 'border-box' }}>
                  <option value="5">5 Questions</option>
                  <option value="10">10 Questions</option>
                  <option value="20">20 Questions</option>
                  <option value="30">30 Questions</option>
                </select>
              </div>
              <button onClick={startQuiz} disabled={loading} style={{ padding: '14px', background: loading ? '#94a3b8' : '#065f46', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: 700, fontSize: '16px', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '8px' }}>
                {loading ? 'Loading...' : 'Start Quiz →'}
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (done) {
    const scoreColor = pct >= 70 ? '#16a34a' : pct >= 50 ? '#d97706' : '#dc2626';
    return (
      <main style={{ minHeight: '100vh', background: '#f8fafc', padding: '40px 24px' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '40px', border: '1px solid #e2e8f0', textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '56px', marginBottom: '8px' }}>{pct >= 70 ? '🏆' : pct >= 50 ? '👍' : '📚'}</div>
            <div style={{ fontFamily: "'Sora',sans-serif", fontSize: '56px', fontWeight: 800, color: scoreColor }}>{pct}%</div>
            <p style={{ color: '#6b7280', margin: '12px 0 28px' }}>You got <strong>{score}</strong> of <strong>{answers.length}</strong> correct</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={restart} style={{ padding: '12px 28px', background: '#065f46', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Try Again</button>
              <Link href="/questions">
                <button style={{ padding: '12px 28px', background: 'transparent', border: '1px solid #e2e8f0', borderRadius: '10px', color: '#374151', fontWeight: 600, cursor: 'pointer' }}>Browse Questions</button>
              </Link>
            </div>
          </div>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>Review</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {answers.map((a, i) => {
              const correct = a.selected === a.q.answer;
              return (
                <div key={i} style={{ background: '#fff', borderRadius: '12px', padding: '16px 20px', border: `1px solid ${correct ? '#86efac' : '#fca5a5'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', color: '#94a3b8' }}>Q{i + 1}</span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: correct ? '#16a34a' : '#dc2626' }}>{correct ? '✓ Correct' : '✗ Wrong'}</span>
                  </div>
                  <p style={{ margin: '0 0 8px', fontSize: '14px', color: '#0f172a' }}>{renderMath(a.q.content)}</p>
                  {!correct && (
                    <div style={{ fontSize: '13px', color: '#6b7280' }}>
                      Your answer: <span style={{ color: '#dc2626', fontWeight: 600 }}>{renderMath(stripLetter(a.selected)) || 'None'}</span>
                      {' · '}Correct: <span style={{ color: '#16a34a', fontWeight: 600 }}>{renderMath(stripLetter(a.q.answer))}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    );
  }

  const q = questions[current];
  const progress = (current / questions.length) * 100;

  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', padding: '40px 24px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: '#6b7280' }}>Question {current + 1} of {questions.length}</span>
            <button onClick={restart} style={{ fontSize: '13px', color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer' }}>✕ Exit</button>
          </div>
          <div style={{ background: '#e2e8f0', borderRadius: '100px', height: '6px' }}>
            <div style={{ background: '#065f46', borderRadius: '100px', height: '6px', width: `${progress}%`, transition: 'width 0.3s' }} />
          </div>
        </div>
        <div style={{ background: '#fff', borderRadius: '20px', padding: '32px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
          {q.topic && (
            <span style={{ fontSize: '12px', fontWeight: 600, padding: '3px 10px', background: '#f1f5f9', color: '#475569', borderRadius: '100px', display: 'inline-block', marginBottom: '16px' }}>
              {q.topic}
            </span>
          )}
          <p style={{ fontFamily: "'Sora',sans-serif", fontSize: '18px', fontWeight: 600, color: '#0f172a', lineHeight: 1.6, margin: '0 0 28px' }}>
            {renderMath(q.content)}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {q.options && q.options.map((opt, j) => {
              let bg = '#f8fafc', border = '#e2e8f0', color = '#374151';
              if (selected !== null) {
                if (opt === q.answer) { bg = '#dcfce7'; border = '#86efac'; color = '#15803d'; }
                else if (opt === selected) { bg = '#fee2e2'; border = '#fca5a5'; color = '#dc2626'; }
              }
              return (
                <button key={j} onClick={() => { if (selected === null) setSelected(opt); }}
                  style={{ padding: '14px 16px', background: bg, border: `2px solid ${border}`, borderRadius: '10px', color, fontWeight: 500, fontSize: '15px', cursor: selected !== null ? 'default' : 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0, background: selected !== null && opt === q.answer ? '#16a34a' : selected === opt ? '#dc2626' : '#e2e8f0', color: (selected !== null && (opt === q.answer || opt === selected)) ? '#fff' : '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700 }}>
                    {String.fromCharCode(65 + j)}
                  </span>
                  {renderMath(stripLetter(opt))}
                </button>
              );
            })}
          </div>
        </div>
        {selected !== null && (
          <button onClick={handleNext} style={{ width: '100%', padding: '15px', background: '#065f46', border: 'none', borderRadius: '12px', color: '#fff', fontWeight: 700, fontSize: '16px', cursor: 'pointer' }}>
            {current + 1 >= questions.length ? 'See Results →' : 'Next →'}
          </button>
        )}
      </div>
    </main>
  );
  }
