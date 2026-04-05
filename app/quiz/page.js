'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL;

export default function QuizPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [year, setYear] = useState('');
  const [count, setCount] = useState('10');

  async function startQuiz() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('course_id', '0f912f44-96f0-403f-82a2-03ffcaf17df0');
      params.append('type', 'mcq');
      if (year) params.append('year', year);

      const res = await fetch(`${API}/api/questions?${params.toString()}`);
      const data = await res.json();

      if (!Array.isArray(data) || data.length === 0) {
        alert('No MCQ questions found. Upload a past question first.');
        setLoading(false);
        return;
      }

      // Shuffle and limit
      const shuffled = data.sort(() => Math.random() - 0.5).slice(0, parseInt(count));
      setQuestions(shuffled);
      setAnswers([]);
      setCurrent(0);
      setSelected(null);
      setShowResult(false);
      setQuizStarted(true);
    } catch (e) {
      alert('Could not load questions. Try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleSelect(opt) {
    if (selected !== null) return; // Already answered
    setSelected(opt);
  }

  function handleNext() {
    const q = questions[current];
    const newAnswers = [...answers, { question: q, selected }];
    setAnswers(newAnswers);

    if (current + 1 >= questions.length) {
      setShowResult(true);
    } else {
      setCurrent(current + 1);
      setSelected(null);
    }
  }

  function restartQuiz() {
    setQuizStarted(false);
    setShowResult(false);
    setAnswers([]);
    setCurrent(0);
    setSelected(null);
    setQuestions([]);
  }

  const score = answers.filter(a => a.selected === a.question.answer).length;
  const percent = answers.length > 0 ? Math.round((score / answers.length) * 100) : 0;

  const scoreColor = percent >= 70 ? '#16a34a' : percent >= 50 ? '#d97706' : '#dc2626';
  const scoreLabel = percent >= 70 ? '🎉 Excellent!' : percent >= 50 ? '👍 Good effort!' : '📚 Keep studying!';

  if (!quizStarted) {
    return (
      <main style={{ minHeight: '100vh', background: '#f8fafc' }}>
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
            <button style={{
              padding: '8px 18px', background: 'transparent', border: '1px solid #e2e8f0',
              borderRadius: '8px', color: '#374151', fontWeight: 500, cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif", fontSize: '14px'
            }}>Browse Questions</button>
          </Link>
        </nav>

        <div style={{ maxWidth: '480px', margin: '80px auto', padding: '0 24px' }}>
          <div style={{
            background: '#fff', borderRadius: '20px', padding: '40px',
            border: '1px solid #e2e8f0', boxShadow: '0 4px 24px rgba(0,0,0,0.06)'
          }}>
            <div style={{ fontSize: '48px', textAlign: 'center', marginBottom: '16px' }}>📝</div>
            <h1 style={{
              fontFamily: "'Sora', sans-serif", fontSize: '26px', fontWeight: 700,
              color: '#0f172a', textAlign: 'center', margin: '0 0 8px'
            }}>Quiz Mode</h1>
            <p style={{ color: '#6b7280', textAlign: 'center', margin: '0 0 32px', fontSize: '15px' }}>
              Test yourself with past exam questions
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '8px' }}>
                  Year (optional)
                </label>
                <input
                  value={year}
                  onChange={e => setYear(e.target.value)}
                  placeholder="e.g. 2023 or leave blank for all"
                  style={{
                    width: '100%', padding: '12px 14px', border: '1px solid #e2e8f0',
                    borderRadius: '10px', fontSize: '14px', fontFamily: "'DM Sans', sans-serif"
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '8px' }}>
                  Number of Questions
                </label>
                <select
                  value={count}
                  onChange={e => setCount(e.target.value)}
                  style={{
                    width: '100%', padding: '12px 14px', border: '1px solid #e2e8f0',
                    borderRadius: '10px', fontSize: '14px', fontFamily: "'DM Sans', sans-serif",
                    background: '#fff'
                  }}
                >
                  <option value="5">5 Questions</option>
                  <option value="10">10 Questions</option>
                  <option value="20">20 Questions</option>
                  <option value="30">30 Questions</option>
                </select>
              </div>
              <button
                onClick={startQuiz}
                disabled={loading}
                style={{
                  padding: '14px', background: loading ? '#94a3b8' : '#065f46', border: 'none',
                  borderRadius: '10px', color: '#fff', fontWeight: 700, fontSize: '16px',
                  cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'Sora', sans-serif",
                  marginTop: '8px'
                }}
              >
                {loading ? 'Loading...' : 'Start Quiz →'}
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (showResult) {
    return (
      <main style={{ minHeight: '100vh', background: '#f8fafc', padding: '40px 24px' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>

          {/* Score card */}
          <div style={{
            background: '#fff', borderRadius: '20px', padding: '40px',
            border: '1px solid #e2e8f0', textAlign: 'center', marginBottom: '24px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)'
          }}>
            <div style={{ fontSize: '56px', marginBottom: '8px' }}>
              {percent >= 70 ? '🏆' : percent >= 50 ? '👍' : '📚'}
            </div>
            <div style={{
              fontFamily: "'Sora', sans-serif", fontSize: '56px', fontWeight: 800,
              color: scoreColor, lineHeight: 1
            }}>{percent}%</div>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '22px', fontWeight: 600, color: '#0f172a', marginTop: '8px' }}>
              {scoreLabel}
            </div>
            <p style={{ color: '#6b7280', margin: '12px 0 28px', fontSize: '15px' }}>
              You got <strong>{score}</strong> out of <strong>{answers.length}</strong> questions correct
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={restartQuiz}
                style={{
                  padding: '12px 28px', background: '#065f46', border: 'none',
                  borderRadius: '10px', color: '#fff', fontWeight: 600, fontSize: '15px',
                  cursor: 'pointer', fontFamily: "'DM Sans', sans-serif"
                }}
              >Try Again</button>
              <Link href="/questions">
                <button style={{
                  padding: '12px 28px', background: 'transparent', border: '1px solid #e2e8f0',
                  borderRadius: '10px', color: '#374151', fontWeight: 600, fontSize: '15px',
                  cursor: 'pointer', fontFamily: "'DM Sans', sans-serif"
                }}>Browse Questions</button>
              </Link>
            </div>
          </div>

          {/* Answer review */}
          <h2 style={{
            fontFamily: "'Sora', sans-serif", fontSize: '18px',
            fontWeight: 700, color: '#0f172a', marginBottom: '16px'
          }}>Review Your Answers</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {answers.map((a, i) => {
              const correct = a.selected === a.question.answer;
              return (
                <div key={i} style={{
                  background: '#fff', borderRadius: '12px', padding: '16px 20px',
                  border: `1px solid ${correct ? '#86efac' : '#fca5a5'}`
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8' }}>Q{i + 1}</span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: correct ? '#16a34a' : '#dc2626' }}>
                      {correct ? '✓ Correct' : '✗ Wrong'}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 10px', fontSize: '14px', color: '#0f172a', fontWeight: 500 }}>
                    {a.question.content}
                  </p>
                  {!correct && (
                    <div style={{ fontSize: '13px', color: '#6b7280' }}>
                      Your answer: <span style={{ color: '#dc2626', fontWeight: 600 }}>{a.selected || 'Not answered'}</span>
                      <br />
                      Correct: <span style={{ color: '#16a34a', fontWeight: 600 }}>{a.question.answer}</span>
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

  // Quiz in progress
  const q = questions[current];
  const progress = ((current) / questions.length) * 100;

  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', padding: '40px 24px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>

        {/* Progress */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: 500 }}>
              Question {current + 1} of {questions.length}
            </span>
            <Link href="/" style={{ fontSize: '13px', color: '#6b7280' }}>✕ Exit</Link>
          </div>
          <div style={{ background: '#e2e8f0', borderRadius: '100px', height: '6px' }}>
            <div style={{
              background: '#065f46', borderRadius: '100px', height: '6px',
              width: `${progress}%`, transition: 'width 0.3s'
            }} />
          </div>
        </div>

        {/* Question card */}
        <div style={{
          background: '#fff', borderRadius: '20px', padding: '32px',
          border: '1px solid #e2e8f0', boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          marginBottom: '20px'
        }}>
          {q.topic && (
            <span style={{
              fontSize: '12px', fontWeight: 600, padding: '3px 10px',
              background: '#f1f5f9', color: '#475569', borderRadius: '100px',
              display: 'inline-block', marginBottom: '16px'
            }}>
              {q.topic}
            </span>
          )}
          <p style={{
            fontFamily: "'Sora', sans-serif", fontSize: '18px', fontWeight: 600,
            color: '#0f172a', lineHeight: 1.6, margin: '0 0 28px'
          }}>
            {q.content}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {q.options && q.options.map((opt, j) => {
              let bg = '#f8fafc';
              let border = '#e2e8f0';
              let color = '#374151';

              if (selected !== null) {
                if (opt === q.answer) { bg = '#dcfce7'; border = '#86efac'; color = '#15803d'; }
                else if (opt === selected && opt !== q.answer) { bg = '#fee2e2'; border = '#fca5a5'; color = '#dc2626'; }
              } else if (selected === opt) {
                bg = '#eff6ff'; border = '#93c5fd'; color = '#1d4ed8';
              }

              return (
                <button
                  key={j}
                  onClick={() => handleSelect(opt)}
                  style={{
                    padding: '14px 16px', background: bg, border: `2px solid ${border}`,
                    borderRadius: '10px', color, fontWeight: 500, fontSize: '15px',
                    cursor: selected !== null ? 'default' : 'pointer',
                    textAlign: 'left', display: 'flex', alignItems: 'center', gap: '12px',
                    fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s'
                  }}
                >
                  <span style={{
                    width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                    background: selected !== null && opt === q.answer ? '#16a34a' :
                      selected === opt && opt !== q.answer ? '#dc2626' : '#e2e8f0',
                    color: (selected !== null && (opt === q.answer || opt === selected)) ? '#fff' : '#6b7280',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '13px', fontWeight: 700
                  }}>
                    {String.fromCharCode(65 + j)}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {selected !== null && (
          <button
            onClick={handleNext}
            style={{
              width: '100%', padding: '15px', background: '#065f46', border: 'none',
              borderRadius: '12px', color: '#fff', fontWeight: 700, fontSize: '16px',
              cursor: 'pointer', fontFamily: "'Sora', sans-serif"
            }}
          >
            {current + 1 >= questions.length ? 'See Results →' : 'Next Question →'}
          </button>
        )}
      </div>
    </main>
  );
}
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
  
