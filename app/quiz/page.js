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
                <input
                  type="text"
                  placeholder="e.g. 2023"
                  value={year}
                  onChange={e => setYear(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '8px' }}>Number of Questions</label>
                <select
                  value={count}
                  onChange={e => setCount(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', background: '#fff', boxSizing: 'border-box' }}
                >
                  <option value="5">5 Questions</option>
                  <option value="10">10 Questions</option>
                  <option value="20">20 Questions</option>
                  <option value="30">30 Questions</option>
                </select>
              </div>

              <button
                onClick={startQuiz}
                disabled={!courseId || loading}
                style={{ width: '100%', padding: '14px', background: courseId ? '#065f46' : '#94a3b8', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 700, cursor: courseId ? 'pointer' : 'not-allowed', fontFamily: "'Sora', sans-serif" }}
              >
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
        <NavBar />
        <div style={{ maxWidth: '600px', margin: '60px auto', padding: '0 24px' }}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '40px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>{pct >= 70 ? '🎉' : pct >= 50 ? '👍' : '📚'}</div>
            <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
              {score}/{answers.length}
            </h2>
            <p style={{ fontSize: '18px', color: pct >= 70 ? '#16a34a' : pct >= 50 ? '#d97706' : '#dc2626', fontWeight: 600, marginBottom: '32px' }}>
              {pct}% — {pct >= 70 ? 'Excellent!' : pct >= 50 ? 'Good effort' : 'Keep studying'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px', textAlign: 'left' }}>
              {answers.map((a, i) => {
                const correct = a.selected === a.q.answer;
                return (
                  <div key={i} style={{ padding: '16px', borderRadius: '10px', background: correct ? '#f0fdf4' : '#fef2f2', border: `1px solid ${correct ? '#bbf7d0' : '#fecaca'}` }}>
                    <p style={{ fontSize: '14px', color: '#1e293b', marginBottom: '8px', fontWeight: 500 }}>{renderMath(a.q.content)}</p>
                    {!correct && (
                      <p style={{ fontSize: '13px', color: '#dc2626', margin: 0 }}>Your answer: {renderMath(a.selected) || 'Skipped'}</p>
                    )}
                    <p style={{ fontSize: '13px', color: '#16a34a', margin: 0 }}>Correct: {renderMath(a.q.answer)}</p>
                  </div>
                );
              })}
            </div>

            <button onClick={restart} style={{ width: '100%', padding: '14px', background: '#065f46', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', fontFamily: "'Sora', sans-serif" }}>
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  const q = questions[current];
  const opts = q.options ? q.options.map(stripLetter) : [];

  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <NavBar />
      <div style={{ maxWidth: '600px', margin: '40px auto', padding: '0 24px' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: 500 }}>Question {current + 1} of {questions.length}</span>
          <span style={{ fontSize: '14px', color: '#065f46', fontWeight: 600 }}>{q.courses?.code} • {q.year}</span>
        </div>

        <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
          <p style={{ fontSize: '18px', color: '#1e293b', lineHeight: 1.7, margin: 0, fontWeight: 500 }}>{renderMath(q.content)}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          {opts.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => setSelected(opt)}
              style={{
                width: '100%', padding: '16px 20px', borderRadius: '12px', textAlign: 'left',
                fontSize: '15px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                border: selected === opt ? '2px solid #065f46' : '1px solid #e2e8f0',
                background: selected === opt ? '#f0fdf4' : '#fff',
                color: '#1e293b', fontWeight: selected === opt ? 600 : 400,
                transition: 'all 0.15s'
              }}
            >
              <strong style={{ marginRight: '10px', color: '#065f46' }}>{String.fromCharCode(65 + idx)}.</strong>
              {renderMath(opt)}
            </button>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={!selected}
          style={{ width: '100%', padding: '14px', background: selected ? '#065f46' : '#94a3b8', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 700, cursor: selected ? 'pointer' : 'not-allowed', fontFamily: "'Sora', sans-serif" }}
        >
          {current + 1 === questions.length ? 'Finish Quiz' : 'Next Question →'}
        </button>
      </div>
    </main>
  );
  }
