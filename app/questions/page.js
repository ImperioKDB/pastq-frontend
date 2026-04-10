'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL;

function renderMath(text) {
  if (!text) return text;
  return String(text)
    .replace(/\^-1/g, '⁻¹').replace(/\^-2/g, '⁻²').replace(/\^-3/g, '⁻³')
    .replace(/\^-4/g, '⁻⁴').replace(/\^-5/g, '⁻⁵')
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

function stripLetter(opt) {
  if (!opt) return opt;
  return String(opt).replace(/^[A-Ea-e][\.\)]\s*/, '').trim();
}

export default function QuestionsPage() {
  const [courses, setCourses] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(null);

  // Filters
  const [courseId, setCourseId] = useState('');
  const [year, setYear] = useState('');
  const [topic, setTopic] = useState('');
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        // 1. Fetch initial questions
        const res = await fetch(`${API}/api/questions`);
        const data = await res.json();
        if (Array.isArray(data)) setQuestions(data);

        // 2. Fetch all courses for the dropdown
        const cRes = await fetch(`${API}/api/courses`);
        const cData = await cRes.json();
        if (Array.isArray(cData)) setCourses(cData);

        // 3. Fetch topics for filter
        const tRes = await fetch(`${API}/api/questions/topics`);
        const tData = await tRes.json();
        if (Array.isArray(tData)) setTopics(tData);

      } catch (e) {
        setError('Failed to load data from server');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleFilter(e) {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      let url = `${API}/api/questions?`;
      if (courseId) url += `course_id=${courseId}&`;
      if (year) url += `year=${year}&`;
      if (topic) url += `topic=${topic}&`;

      const res = await fetch(url);
      const data = await res.json();
      if (Array.isArray(data)) setQuestions(data);
    } catch (e) {
      setError('Filter failed');
    }
    setLoading(false);
  }

  function handleClear() {
    setCourseId('');
    setYear('');
    setTopic('');
    window.location.reload();
  }

  const selectedCourse = courses.find(c => c.id === courseId);

  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '18px 32px', background: '#fff', borderBottom: '1px solid #e2e8f0',
        position: 'sticky', top: 0, zIndex: 100
      }}>
        <Link href="/">
          <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: '22px', color: '#065f46', cursor: 'pointer' }}>
            Past<span style={{ color: '#f59e0b' }}>Q</span>
          </span>
        </Link>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href="/quiz">
            <button style={{ padding: '8px 18px', background: '#065f46', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: '14px' }}>Take Quiz</button>
          </Link>
          <Link href="/dashboard">
            <button style={{ padding: '8px 18px', background: 'transparent', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#374151', fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: '14px' }}>Dashboard</button>
          </Link>
        </div>
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: '28px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>Browse Questions</h1>
          <p style={{ color: '#6b7280', margin: 0 }}>
            {questions.length} questions available{selectedCourse ? ` · ${selectedCourse.code}` : ''}
          </p>
        </div>

        <form onSubmit={handleFilter} style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0', marginBottom: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          
          {/* Course Dropdown */}
          <div style={{ flex: 2, minWidth: '160px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '6px' }}>Course</label>
            <select 
              value={courseId}
              onChange={e => setCourseId(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', background: '#fff', boxSizing: 'border-box' }}
            >
              <option value="">All Courses</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.code} — {c.title}</option>
              ))}
            </select>
          </div>

          <div style={{ flex: 1, minWidth: '100px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '6px' }}>Year</label>
            <input type="text" placeholder="2023" value={year} onChange={e => setYear(e.target.value)} style={{ width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
          </div>

          <div style={{ flex: 2, minWidth: '160px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '6px' }}>Topic</label>
            <select value={topic} onChange={e => setTopic(e.target.value)} style={{ width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', background: '#fff', boxSizing: 'border-box' }}>
              <option value="">All Topics</option>
              {topics.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <button type="submit" style={{ padding: '10px 24px', background: '#065f46', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '14px', whiteSpace: 'nowrap' }}>Filter</button>
          <button type="button" onClick={handleClear} style={{ padding: '10px 16px', background: 'transparent', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#6b7280', fontWeight: 500, cursor: 'pointer', fontSize: '14px' }}>Clear</button>
        </form>

        {loading && <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>Loading questions...</div>}
        {error && <div style={{ padding: '16px', background: '#fee2e2', borderRadius: '10px', color: '#dc2626', fontSize: '14px' }}>{error}</div>}
        
        {!loading && !error && questions.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            No questions found. Try different filters.
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {questions.map((q, i) => (
            <div key={q.id} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <div onClick={() => setExpanded(expanded === q.id ? null : q.id)} style={{ padding: '16px 20px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '10px', fontWeight: 700, background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', color: '#64748b', textTransform: 'uppercase' }}>{q.type}</span>
                    <span style={{ fontSize: '10px', fontWeight: 700, background: '#ecfdf5', padding: '2px 8px', borderRadius: '4px', color: '#059669', textTransform: 'uppercase' }}>{q.topic || 'General'}</span>
                    <span style={{ fontSize: '10px', fontWeight: 700, background: '#fffbeb', padding: '2px 8px', borderRadius: '4px', color: '#d97706', textTransform: 'uppercase' }}>{q.difficulty}</span>
                  </div>
                  <div style={{ fontSize: '15px', color: '#0f172a', fontWeight: 500, lineHeight: 1.5 }}>
                    {renderMath(q.content)}
                  </div>
                </div>
                <span style={{ color: '#94a3b8', fontSize: '18px' }}>{expanded === q.id ? '−' : '+'}</span>
              </div>

              {expanded === q.id && (
                <div style={{ padding: '0 20px 20px', borderTop: '1px solid #f1f5f9', background: '#fafafa' }}>
                  {q.type === 'mcq' && q.options && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
                      {q.options.map((opt, j) => (
                        <div key={j} style={{
                          padding: '10px 14px', borderRadius: '8px', fontSize: '14px',
                          background: opt === q.answer ? '#dcfce7' : '#f8fafc',
                          border: `1px solid ${opt === q.answer ? '#86efac' : '#e2e8f0'}`,
                          color: opt === q.answer ? '#15803d' : '#374151',
                          fontWeight: opt === q.answer ? 600 : 400,
                          display: 'flex', alignItems: 'center', gap: '10px'
                        }}>
                          <span style={{ width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0, background: opt === q.answer ? '#16a34a' : '#e2e8f0', color: opt === q.answer ? '#fff' : '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>
                            {String.fromCharCode(65 + j)}
                          </span>
                          {renderMath(stripLetter(opt))}
                          {opt === q.answer && <span style={{ marginLeft: 'auto', fontSize: '12px' }}>✓ Answer</span>}
                        </div>
                      ))}
                    </div>
                  )}

                  {q.type === 'theory' && q.answer && (
                    <div style={{ marginTop: '16px', padding: '12px 16px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #86efac', color: '#15803d', fontSize: '14px' }}>
                      <strong>Answer:</strong> {renderMath(q.answer)}
                    </div>
                  )}
                  {q.year && <p style={{ margin: '12px 0 0', fontSize: '12px', color: '#94a3b8' }}>Year: {q.year}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
    }
