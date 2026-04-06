'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL;

export default function QuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(null);

  // Filters
  const [year, setYear] = useState('');
  const [type, setType] = useState('');
  const [topic, setTopic] = useState('');

  useEffect(() => {
    fetchQuestions();
  }, []);

  async function fetchQuestions() {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      // Default to CSC 101 for now
      params.append('course_id', '0f912f44-96f0-403f-82a2-03ffcaf17df0');
      if (year) params.append('year', year);
      if (type) params.append('type', type);
      if (topic) params.append('topic', topic);

      const res = await fetch(`${API}/api/questions?${params.toString()}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setQuestions(data);
      } else {
        setError('Failed to load questions');
      }
    } catch (e) {
      setError('Could not connect to server');
    } finally {
      setLoading(false);
    }
  }

  function handleFilter(e) {
    e.preventDefault();
    fetchQuestions();
  }

  const diffColor = { easy: '#16a34a', medium: '#d97706', hard: '#dc2626' };

  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc' }}>

      {/* Navbar */}
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
            <button style={{
              padding: '8px 18px', background: '#065f46', border: 'none',
              borderRadius: '8px', color: '#fff', fontWeight: 600, cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif", fontSize: '14px'
            }}>Take Quiz</button>
          </Link>
          <Link href="/dashboard">
            <button style={{
              padding: '8px 18px', background: 'transparent', border: '1px solid #e2e8f0',
              borderRadius: '8px', color: '#374151', fontWeight: 500, cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif", fontSize: '14px'
            }}>Dashboard</button>
          </Link>
        </div>
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{
            fontFamily: "'Sora', sans-serif", fontSize: '28px',
            fontWeight: 700, color: '#0f172a', margin: '0 0 8px'
          }}>Browse Questions</h1>
          <p style={{ color: '#6b7280', margin: 0 }}>
            {questions.length} questions available · CSC 101
          </p>
        </div>

        {/* Filters */}
        <form onSubmit={handleFilter} style={{
          background: '#fff', borderRadius: '12px', padding: '20px',
          border: '1px solid #e2e8f0', marginBottom: '24px',
          display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end'
        }}>
          <div style={{ flex: 1, minWidth: '120px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: '6px' }}>YEAR</label>
            <input
              value={year}
              onChange={e => setYear(e.target.value)}
              placeholder="e.g. 2023"
              style={{
                width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0',
                borderRadius: '8px', fontSize: '14px', fontFamily: "'DM Sans', sans-serif"
              }}
            />
          </div>
          <div style={{ flex: 1, minWidth: '120px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: '6px' }}>TYPE</label>
            <select
              value={type}
              onChange={e => setType(e.target.value)}
              style={{
                width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0',
                borderRadius: '8px', fontSize: '14px', fontFamily: "'DM Sans', sans-serif",
                background: '#fff'
              }}
            >
              <option value="">All Types</option>
              <option value="mcq">MCQ</option>
              <option value="theory">Theory</option>
            </select>
          </div>
          <div style={{ flex: 2, minWidth: '160px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: '6px' }}>TOPIC</label>
            <input
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g. Mechanics"
              style={{
                width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0',
                borderRadius: '8px', fontSize: '14px', fontFamily: "'DM Sans', sans-serif"
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              padding: '10px 24px', background: '#065f46', border: 'none',
              borderRadius: '8px', color: '#fff', fontWeight: 600, cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif", fontSize: '14px', whiteSpace: 'nowrap'
            }}
          >
            Filter
          </button>
          <button
            type="button"
            onClick={() => { setYear(''); setType(''); setTopic(''); setTimeout(fetchQuestions, 100); }}
            style={{
              padding: '10px 16px', background: 'transparent', border: '1px solid #e2e8f0',
              borderRadius: '8px', color: '#6b7280', fontWeight: 500, cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif", fontSize: '14px'
            }}
          >
            Clear
          </button>
        </form>

        {/* Question List */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
            Loading questions...
          </div>
        )}

        {error && (
          <div style={{
            padding: '16px', background: '#fee2e2', borderRadius: '10px',
            color: '#dc2626', fontSize: '14px'
          }}>{error}</div>
        )}

        {!loading && !error && questions.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '60px', color: '#6b7280',
            background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0'
          }}>
            No questions found. Try different filters.
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {questions.map((q, i) => (
            <div
              key={q.id}
              style={{
                background: '#fff', borderRadius: '12px',
                border: '1px solid #e2e8f0', overflow: 'hidden'
              }}
            >
              {/* Question header */}
              <div
                onClick={() => setExpanded(expanded === q.id ? null : q.id)}
                style={{
                  padding: '16px 20px', cursor: 'pointer',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '11px', fontWeight: 600, padding: '2px 8px',
                      background: q.type === 'mcq' ? '#dbeafe' : '#fef3c7',
                      color: q.type === 'mcq' ? '#1d4ed8' : '#92400e',
                      borderRadius: '100px'
                    }}>
                      {q.type?.toUpperCase()}
                    </span>
                    {q.difficulty && (
                      <span style={{
                        fontSize: '11px', fontWeight: 600, padding: '2px 8px',
                        background: '#f0fdf4', color: diffColor[q.difficulty] || '#16a34a',
                        borderRadius: '100px'
                      }}>
                        {q.difficulty}
                      </span>
                    )}
                    {q.topic && (
                      <span style={{
                        fontSize: '11px', padding: '2px 8px',
                        background: '#f1f5f9', color: '#475569',
                        borderRadius: '100px'
                      }}>
                        {q.topic}
                      </span>
                    )}
                  </div>
                  <p style={{
                    margin: 0, fontSize: '15px', color: '#0f172a',
                    lineHeight: 1.6, fontWeight: 500
                  }}>
                    <span style={{ color: '#94a3b8', marginRight: '8px' }}>Q{i + 1}.</span>
                    {q.content}
                  </p>
                </div>
                <span style={{ color: '#94a3b8', fontSize: '18px', flexShrink: 0 }}>
                  {expanded === q.id ? '▲' : '▼'}
                </span>
              </div>

              {/* Expanded options */}
              {expanded === q.id && (
                <div style={{ padding: '0 20px 20px', borderTop: '1px solid #f1f5f9' }}>
                  {q.options && Array.isArray(q.options) && (
                    <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {q.options.map((opt, j) => (
                        <div
                          key={j}
                          style={{
                            padding: '10px 14px', borderRadius: '8px', fontSize: '14px',
                            background: opt === q.answer ? '#dcfce7' : '#f8fafc',
                            border: `1px solid ${opt === q.answer ? '#86efac' : '#e2e8f0'}`,
                            color: opt === q.answer ? '#15803d' : '#374151',
                            fontWeight: opt === q.answer ? 600 : 400,
                            display: 'flex', alignItems: 'center', gap: '10px'
                          }}
                        >
                          <span style={{
                            width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
                            background: opt === q.answer ? '#16a34a' : '#e2e8f0',
                            color: opt === q.answer ? '#fff' : '#6b7280',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '12px', fontWeight: 700
                          }}>
                            {String.fromCharCode(65 + j)}
                          </span>
                          {opt}
                          {opt === q.answer && <span style={{ marginLeft: 'auto', fontSize: '12px' }}>✓ Answer</span>}
                        </div>
                      ))}
                    </div>
                  )}
                  {q.type === 'theory' && q.answer && (
                    <div style={{
                      marginTop: '16px', padding: '12px 16px',
                      background: '#f0fdf4', borderRadius: '8px',
                      border: '1px solid #86efac', color: '#15803d', fontSize: '14px'
                    }}>
                      <strong>Answer:</strong> {q.answer}
                    </div>
                  )}
                  {q.year && (
                    <p style={{ margin: '12px 0 0', fontSize: '12px', color: '#94a3b8' }}>
                      Year: {q.year}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
             }
        
