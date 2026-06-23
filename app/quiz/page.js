'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { renderMath } from '@/lib/utils/math';

const API = process.env.NEXT_PUBLIC_API_URL;

function stripLetter(opt) {
  if (!opt) return opt;
  return String(opt).replace(/^[A-Ea-e][.)]\s*/, '').trim();
}

// Fisher-Yates — unbiased shuffle (replaces data.sort(() => Math.random() - 0.5))
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Defined at module level — NOT inside QuizPage — so React never remounts it
function QuizNav() {
  return (
    <nav style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '18px 32px', background: '#fff', borderBottom: '1px solid #e2e8f0'
    }}>
      <Link href="/">
        <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: '22px', color: '#065f46', cursor: 'pointer' }}>
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
}

export default function QuizPage() {
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState('');
  const [year, setYear] = useState('');
  const [count, setCount] = useState('10');

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch(`${API}/api/courses`);
        const data = await res.json();
        if (Array.isArray(data)) setCourses(data);
      } catch (e) {
        console.error('Error fetching courses', e);
      }
    }
    fetchCourses();
  }, []);

  async function startQuiz() {
    setLoading(true);
    try {
      let url = `${API}/api/questions?type=mcq&limit=200&course_id=${courseId}`;
      if (year) url += '&year=' + year;

      const res = await fetch(url);
      const json = await res.json();
      const data = Array.isArray(json) ? json : (json.data ?? []);

      if (data.length === 0) {
        alert('No MCQ questions found for this course.');
        setLoading(false);
        return;
      }

      // Fisher-Yates replaces biased sort shuffle
      const shuffled = shuffle(data).slice(0, parseInt(count));
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

  if (!started) {
    return (
      <main style={{ minHeight: '100vh', background: '#f8fafc' }}>
        <QuizNav />
        <div style={{ maxWidth: '500px', margin: '60px auto', padding: '0 24px' }}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '40px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
            <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: '24px', fontWeight: 700, textAlign: 'center', marginBottom: '8px' }}>Practice Quiz</h1>
            <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '14px', marginBottom: '32px' }}>Test your knowledge with randomised MCQs</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '8px' }}>Select Course</label>
                <select value={courseId} onChange={e => setCourseId(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', background: '#fff', boxSizing: 'border-box' }}>
                  <option value="">Choose a course...</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.code} — {c.title}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '8px' }}>Year (Optional)</label>
                <input type="text" placeholder="e.g. 2023" value={year} onChange={e => setYear(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '8px' }}>Number of Questions</label>
                <select value={count} onChange={e => setCount(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', background: '#fff', boxSizing: 'border-box' }}>
                  <option value="5">5 Questions</option>
                  <option value="10">10 Questions</option>
                  <option value="20">20 Questions</option>
                  <option value="30">30 Questions</option>
                </select>
              </div>

              <button onClick={startQuiz} disabled={!courseId || loading}
                style={{ padding: '14px', background: !courseId ? '#e2e8f0' : '#065f46', color: !courseId ? '#94a3b8' : '#fff', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 700, cursor: courseId ? 'pointer' : 'not-allowed' }}>
                {loading ? 'Loading...' : 'Start Quiz →'}
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (done) {
    return (
      <main style={{ minHeight: '100vh', background: '#f8fafc' }}>
        <QuizNav />
        <div style={{ maxWidth: '600px', margin: '60px auto', padding: '0 24px' }}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '40px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>{pct >= 70 ? '🎉' : pct >= 50 ? '👍' : '📚'}</div>
            <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>{score}/{answers.length} Correct</h2>
            <p style={{ fontSize: '18px', color: '#6b7280', marginBottom: '32px' }}>{pct}% Score</p>
            <button onClick={restart} style={{ padding: '14px 32px', background: '#065f46', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 700, cursor: 'pointer' }}>
              Try Again
            </button>
          </div>

          <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {answers.map((a, i) => {
              const correct = a.selected === a.q.answer;
              return (
                <div key={i} style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: `1px solid ${correct ? '#86efac' : '#fca5a5'}` }}>
                  <p style={{ fontWeight: 600, marginBottom: '12px', color: '#0f172a' }}>{i + 1}. {renderMath(a.q.content)}</p>
                  <p style={{ fontSize: '14px', color: correct ? '#16a34a' : '#dc2626' }}>
                    Your answer: {renderMath(stripLetter(a.selected)) || 'Skipped'}
                  </p>
                  {!correct && <p style={{ fontSize: '14px', color: '#16a34a', marginTop: '4px' }}>Correct: {renderMath(stripLetter(a.q.answer))}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    );
  }

  const q = questions[current];
  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <QuizNav />
      <div style={{ maxWidth: '600px', margin: '40px auto', padding: '0 24px' }}>
        <div style={{ background: '#fff', borderRadius: '20px', padding: '32px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>Question {current + 1} of {questions.length}</span>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#065f46' }}>{q.courses?.code} {q.year}</span>
          </div>

          <div style={{ height: '4px', background: '#f1f5f9', borderRadius: '2px', marginBottom: '24px' }}>
            <div style={{ height: '100%', width: `${((current + 1) / questions.length) * 100}%`, background: '#065f46', borderRadius: '2px', transition: 'width 0.3s' }} />
          </div>

          <p style={{ fontSize: '18px', fontWeight: 600, lineHeight: 1.6, color: '#0f172a', marginBottom: '24px' }}>
            {renderMath(q.content)}
          </p>

          {q.options && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {q.options.map((opt, idx) => {
                const clean = stripLetter(opt);
                const isSelected = selected === opt;
                return (
                  <button key={idx} onClick={() => setSelected(opt)}
                    style={{ padding: '14px 18px', borderRadius: '10px', textAlign: 'left', fontSize: '15px', cursor: 'pointer', fontWeight: isSelected ? 600 : 400, background: isSelected ? '#f0fdf4' : '#f8fafc', border: `2px solid ${isSelected ? '#16a34a' : '#e2e8f0'}`, color: '#0f172a', transition: 'all 0.15s' }}>
                    <strong>{String.fromCharCode(65 + idx)}.</strong> {renderMath(clean)}
                  </button>
                );
              })}
            </div>
          )}

          <button onClick={handleNext}
            style={{ width: '100%', padding: '14px', background: '#065f46', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 700, cursor: 'pointer' }}>
            {current + 1 === questions.length ? 'Finish Quiz' : 'Next Question →'}
          </button>
        </div>
      </div>
    </main>
  );
}
