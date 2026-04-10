'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL;

function stripLetter(opt) {
  if (!opt) return opt;
  return String(opt).replace(/^[A-Ea-e][\.\)]\s*/, '').trim();
}

function renderMath(text) {
  if (!text) return text;
  return String(text)
    .replace(/\^-1/g, '⁻¹').replace(/\^-2/g, '⁻²').replace(/\^-3/g, '⁻³')
    .replace(/\^2/g, '²').replace(/\^3/g, '³')
    .replace(/sqrt\(([^)]+)\)/g, '√($1)')
    .replace(/\bpi\b/gi, 'π').replace(/\btheta\b/gi, 'θ');
}

export default function QuizPage() {
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]); // New state for courses
  const [courseId, setCourseId] = useState('');
  const [year, setYear] = useState('');
  const [count, setCount] = useState('10');

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [done, setDone] = useState(false);

  // Fetch courses on mount
  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch(`${API}/api/courses`);
        const data = await res.json();
        if (Array.isArray(data)) setCourses(data);
      } catch (e) {
        console.error("Error fetching courses", e);
      }
    }
    fetchCourses();
  }, []);

  async function startQuiz() {
    setLoading(true);
    try {
      let url = `${API}/api/questions?type=mcq&course_id=${courseId}`;
      if (year) url += '&year=' + year;

      const res = await fetch(url);
      const data = await res.json();

      if (!Array.isArray(data) || data.length === 0) {
        alert('No MCQ questions found for this course.');
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
        <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: '22px', color: '#065f46', cursor: 'pointer' }}>
          Past<span style={{ color: '#f59e0b' }}>Q</span>
        </span>
      </Link>
      <Link href="/questions">
        <button style={{ padding: '8px 18px', background: 'transparent', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#374151', fontWeight: 500, cursor: 'pointer', fontSize: '14px' }}>Browse</button>
      </Link>
    </nav>
  );

  if (!started) {
    return (
      <main style={{ minHeight: '100vh', background: '#f8fafc' }}>
        <NavBar />
        <div style={{ maxWidth: '500px', margin: '60px auto', padding: '0 24px' }}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '40px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
            <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: '24px', fontWeight: 700, textAlign: 'center', marginBottom: '8px' }}>Practice Quiz</h1>
            <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '14px', marginBottom: '32px' }}>Test your knowledge with randomized MCQs</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Updated Course Selector */}
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '8px' }}>Select Course</label>
                <select 
                  value={courseId} 
                  onChange={e => setCourseId(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', background: '#fff', boxSizing: 'border-box' }}
                >
                  <option value="">Choose a course...</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.code} — {c.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '8px' }}>Year (Optional)</label>
                <input type="text" placeholder="e.g. 2023" value={year} onChange={e => setYear(e.target.value)} style={{ width: '100%', padding: '12px 14px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', boxSizing: 'border-box' }} />
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

              <button onClick={startQuiz} disabled={loading || !courseId} style={{ padding: '14px', background: loading ? '#94a3b8' : '#065f46', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: 700, fontSize: '16px', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '8px' }}>
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
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>{pct >= 50 ? '🎉' : '📚'}</div>
            <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Quiz Completed!</h2>
            <div style={{ fontSize: '48px', fontWeight: 800, color: scoreColor, margin: '20px 0' }}>{pct}%</div>
            <p style={{ color: '#6b7280', marginBottom: '32px' }}>You got {score} out of {questions.length} correct.</p>
            <button onClick={restart} style={{ padding: '14px 32px', background: '#065f46', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Try Another Course</button>
          </div>

          <div style={{ background: '#fff', borderRadius: '20px', padding: '32px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>Review Answers</h3>
            {answers.map((a, i) => {
              const correct = a.selected === a.q.answer;
              return (
                <div key={i} style={{ padding: '16px 0', borderBottom: i === answers.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: correct ? '#16a34a' : '#dc2626' }}>{correct ? '✓ Correct' : '✕ Incorrect'}</span>
                    {a.q.topic && <span style={{ fontSize: '10px', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', color: '#64748b' }}>{a.q.topic}</span>}
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
          {q.topic && <span style={{ fontSize: '11px', fontWeight: 700, color: '#065f46', background: '#ecfdf5', padding: '4px 10px', borderRadius: '6px', display: 'inline-block', marginBottom: '12px' }}>{q.topic.toUpperCase()}</span>}
          <div style={{ fontSize: '18px', color: '#0f172a', fontWeight: 500, lineHeight: 1.6, marginBottom: '24px' }}>{renderMath(q.content)}</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {q.options.map((opt, j) => (
              <button key={j} onClick={() => setSelected(opt)} style={{ textAlign: 'left', padding: '16px', borderRadius: '12px', border: `2px solid ${selected === opt ? '#065f46' : '#f1f5f9'}`, background: selected === opt ? '#f0fdf4' : '#fff', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: selected === opt ? '#065f46' : '#f1f5f9', color: selected === opt ? '#fff' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700 }}>
                  {String.fromCharCode(65 + j)}
                </span>
                {renderMath(stripLetter(opt))}
              </button>
            ))}
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
