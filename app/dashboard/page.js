'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL;

export default function Dashboard() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API}/api/questions?course_id=0f912f44-96f0-403f-82a2-03ffcaf17df0`);
        const data = await res.json();
        if (Array.isArray(data)) setQuestions(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const courseCode = questions[0]?.courses?.code || 'CSC 101';
  const courseTitle = questions[0]?.courses?.title || '';

  const mcqCount = questions.filter(q => q.type === 'mcq').length;
  const theoryCount = questions.filter(q => q.type === 'theory').length;
  const years = [...new Set(questions.map(q => q.year).filter(Boolean))].sort((a, b) => b - a);
  const topics = [...new Set(questions.map(q => q.topic).filter(Boolean))];
  const byYear = years.map(y => ({
    year: y,
    count: questions.filter(q => q.year === y).length
  }));
  const byDifficulty = {
    easy: questions.filter(q => q.difficulty === 'easy').length,
    medium: questions.filter(q => q.difficulty === 'medium').length,
    hard: questions.filter(q => q.difficulty === 'hard').length,
  };

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
          <Link href="/questions">
            <button style={{
              padding: '8px 18px', background: 'transparent', border: '1px solid #e2e8f0',
              borderRadius: '8px', color: '#374151', fontWeight: 500, cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif", fontSize: '14px'
            }}>Browse</button>
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

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>

        <h1 style={{
          fontFamily: "'Sora', sans-serif", fontSize: '28px',
          fontWeight: 700, color: '#0f172a', margin: '0 0 8px'
        }}>Dashboard</h1>
        <p style={{ color: '#6b7280', margin: '0 0 32px' }}>
          {courseCode}{courseTitle ? ` · ${courseTitle}` : ''} · University of Benin
        </p>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>Loading...</div>
        ) : (
          <>
            {/* Stats grid */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '16px', marginBottom: '32px'
            }}>
              {[
                { label: 'Total Questions', value: questions.length, icon: '📚', color: '#065f46' },
                { label: 'MCQ Questions', value: mcqCount, icon: '☑️', color: '#1d4ed8' },
                { label: 'Theory Questions', value: theoryCount, icon: '✏️', color: '#d97706' },
                { label: 'Topics Covered', value: topics.length, icon: '🏷️', color: '#7c3aed' },
              ].map((stat, i) => (
                <div key={i} style={{
                  background: '#fff', borderRadius: '14px', padding: '24px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ fontSize: '28px', marginBottom: '12px' }}>{stat.icon}</div>
                  <div style={{
                    fontFamily: "'Sora', sans-serif", fontSize: '32px',
                    fontWeight: 800, color: stat.color, lineHeight: 1
                  }}>{stat.value}</div>
                  <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '6px' }}>{stat.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>

              {/* Questions by year */}
              <div style={{ background: '#fff', borderRadius: '14px', padding: '24px', border: '1px solid #e2e8f0' }}>
                <h3 style={{
                  fontFamily: "'Sora', sans-serif", fontSize: '16px',
                  fontWeight: 700, color: '#0f172a', margin: '0 0 20px'
                }}>Questions by Year</h3>
                {byYear.length === 0 ? (
                  <p style={{ color: '#94a3b8', fontSize: '14px' }}>No data yet</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {byYear.map(({ year, count }) => (
                      <div key={year}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontSize: '14px', color: '#374151', fontWeight: 500 }}>{year}</span>
                          <span style={{ fontSize: '14px', color: '#6b7280' }}>{count} questions</span>
                        </div>
                        <div style={{ background: '#f1f5f9', borderRadius: '100px', height: '6px' }}>
                          <div style={{
                            background: '#065f46', borderRadius: '100px', height: '6px',
                            width: `${(count / questions.length) * 100}%`
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Difficulty breakdown */}
              <div style={{ background: '#fff', borderRadius: '14px', padding: '24px', border: '1px solid #e2e8f0' }}>
                <h3 style={{
                  fontFamily: "'Sora', sans-serif", fontSize: '16px',
                  fontWeight: 700, color: '#0f172a', margin: '0 0 20px'
                }}>Difficulty Breakdown</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { label: 'Easy', count: byDifficulty.easy, color: '#16a34a' },
                    { label: 'Medium', count: byDifficulty.medium, color: '#d97706' },
                    { label: 'Hard', count: byDifficulty.hard, color: '#dc2626' },
                  ].map(({ label, count, color }) => (
                    <div key={label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '14px', color: '#374151', fontWeight: 500 }}>{label}</span>
                        <span style={{ fontSize: '14px', color: '#6b7280' }}>{count}</span>
                      </div>
                      <div style={{ background: '#f1f5f9', borderRadius: '100px', height: '6px' }}>
                        <div style={{
                          background: color, borderRadius: '100px', height: '6px',
                          width: questions.length > 0 ? `${(count / questions.length) * 100}%` : '0%'
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Topics */}
              <div style={{
                background: '#fff', borderRadius: '14px', padding: '24px',
                border: '1px solid #e2e8f0', gridColumn: '1 / -1'
              }}>
                <h3 style={{
                  fontFamily: "'Sora', sans-serif", fontSize: '16px',
                  fontWeight: 700, color: '#0f172a', margin: '0 0 16px'
                }}>Topics Available</h3>
                {topics.length === 0 ? (
                  <p style={{ color: '#94a3b8', fontSize: '14px' }}>No topics tagged yet</p>
                ) : (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {topics.map(topic => (
                      <Link key={topic} href={`/questions?topic=${encodeURIComponent(topic)}`}>
                        <span style={{
                          padding: '6px 14px', background: '#f1f5f9', borderRadius: '100px',
                          fontSize: '13px', color: '#374151', cursor: 'pointer',
                          border: '1px solid #e2e8f0', fontWeight: 500
                        }}>{topic}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Quick actions */}
            <div style={{
              marginTop: '24px', background: '#065f46', borderRadius: '16px',
              padding: '28px 32px', display: 'flex',
              justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px'
            }}>
              <div>
                <h3 style={{
                  fontFamily: "'Sora', sans-serif", fontSize: '18px',
                  fontWeight: 700, color: '#fff', margin: '0 0 6px'
                }}>Ready to Practice?</h3>
                <p style={{ color: '#a7f3d0', margin: 0, fontSize: '14px' }}>
                  {questions.length} questions available for {courseCode}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <Link href="/quiz">
                  <button style={{
                    padding: '12px 24px', background: '#f59e0b', border: 'none',
                    borderRadius: '10px', color: '#111', fontWeight: 700, fontSize: '14px',
                    cursor: 'pointer', fontFamily: "'Sora', sans-serif"
                  }}>Start Quiz →</button>
                </Link>
                <Link href="/questions">
                  <button style={{
                    padding: '12px 24px', background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '10px', color: '#fff', fontWeight: 600, fontSize: '14px',
                    cursor: 'pointer', fontFamily: "'DM Sans', sans-serif"
                  }}>Browse All</button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
    }'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL;

export default function Dashboard() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API}/api/questions?course_id=0f912f44-96f0-403f-82a2-03ffcaf17df0`);
        const data = await res.json();
        if (Array.isArray(data)) setQuestions(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const courseCode = questions[0]?.courses?.code || 'CSC 101';
  const courseTitle = questions[0]?.courses?.title || '';

  const mcqCount = questions.filter(q => q.type === 'mcq').length;
  const theoryCount = questions.filter(q => q.type === 'theory').length;
  const years = [...new Set(questions.map(q => q.year).filter(Boolean))].sort((a, b) => b - a);
  const topics = [...new Set(questions.map(q => q.topic).filter(Boolean))];
  const byYear = years.map(y => ({
    year: y,
    count: questions.filter(q => q.year === y).length
  }));
  const byDifficulty = {
    easy: questions.filter(q => q.difficulty === 'easy').length,
    medium: questions.filter(q => q.difficulty === 'medium').length,
    hard: questions.filter(q => q.difficulty === 'hard').length,
  };

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
          <Link href="/questions">
            <button style={{
              padding: '8px 18px', background: 'transparent', border: '1px solid #e2e8f0',
              borderRadius: '8px', color: '#374151', fontWeight: 500, cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif", fontSize: '14px'
            }}>Browse</button>
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

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>

        <h1 style={{
          fontFamily: "'Sora', sans-serif", fontSize: '28px',
          fontWeight: 700, color: '#0f172a', margin: '0 0 8px'
        }}>Dashboard</h1>
        <p style={{ color: '#6b7280', margin: '0 0 32px' }}>
          {courseCode}{courseTitle ? ` · ${courseTitle}` : ''} · University of Benin
        </p>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>Loading...</div>
        ) : (
          <>
            {/* Stats grid */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '16px', marginBottom: '32px'
            }}>
              {[
                { label: 'Total Questions', value: questions.length, icon: '📚', color: '#065f46' },
                { label: 'MCQ Questions', value: mcqCount, icon: '☑️', color: '#1d4ed8' },
                { label: 'Theory Questions', value: theoryCount, icon: '✏️', color: '#d97706' },
                { label: 'Topics Covered', value: topics.length, icon: '🏷️', color: '#7c3aed' },
              ].map((stat, i) => (
                <div key={i} style={{
                  background: '#fff', borderRadius: '14px', padding: '24px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ fontSize: '28px', marginBottom: '12px' }}>{stat.icon}</div>
                  <div style={{
                    fontFamily: "'Sora', sans-serif", fontSize: '32px',
                    fontWeight: 800, color: stat.color, lineHeight: 1
                  }}>{stat.value}</div>
                  <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '6px' }}>{stat.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>

              {/* Questions by year */}
              <div style={{ background: '#fff', borderRadius: '14px', padding: '24px', border: '1px solid #e2e8f0' }}>
                <h3 style={{
                  fontFamily: "'Sora', sans-serif", fontSize: '16px',
                  fontWeight: 700, color: '#0f172a', margin: '0 0 20px'
                }}>Questions by Year</h3>
                {byYear.length === 0 ? (
                  <p style={{ color: '#94a3b8', fontSize: '14px' }}>No data yet</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {byYear.map(({ year, count }) => (
                      <div key={year}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontSize: '14px', color: '#374151', fontWeight: 500 }}>{year}</span>
                          <span style={{ fontSize: '14px', color: '#6b7280' }}>{count} questions</span>
                        </div>
                        <div style={{ background: '#f1f5f9', borderRadius: '100px', height: '6px' }}>
                          <div style={{
                            background: '#065f46', borderRadius: '100px', height: '6px',
                            width: `${(count / questions.length) * 100}%`
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Difficulty breakdown */}
              <div style={{ background: '#fff', borderRadius: '14px', padding: '24px', border: '1px solid #e2e8f0' }}>
                <h3 style={{
                  fontFamily: "'Sora', sans-serif", fontSize: '16px',
                  fontWeight: 700, color: '#0f172a', margin: '0 0 20px'
                }}>Difficulty Breakdown</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { label: 'Easy', count: byDifficulty.easy, color: '#16a34a' },
                    { label: 'Medium', count: byDifficulty.medium, color: '#d97706' },
                    { label: 'Hard', count: byDifficulty.hard, color: '#dc2626' },
                  ].map(({ label, count, color }) => (
                    <div key={label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '14px', color: '#374151', fontWeight: 500 }}>{label}</span>
                        <span style={{ fontSize: '14px', color: '#6b7280' }}>{count}</span>
                      </div>
                      <div style={{ background: '#f1f5f9', borderRadius: '100px', height: '6px' }}>
                        <div style={{
                          background: color, borderRadius: '100px', height: '6px',
                          width: questions.length > 0 ? `${(count / questions.length) * 100}%` : '0%'
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Topics */}
              <div style={{
                background: '#fff', borderRadius: '14px', padding: '24px',
                border: '1px solid #e2e8f0', gridColumn: '1 / -1'
              }}>
                <h3 style={{
                  fontFamily: "'Sora', sans-serif", fontSize: '16px',
                  fontWeight: 700, color: '#0f172a', margin: '0 0 16px'
                }}>Topics Available</h3>
                {topics.length === 0 ? (
                  <p style={{ color: '#94a3b8', fontSize: '14px' }}>No topics tagged yet</p>
                ) : (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {topics.map(topic => (
                      <Link key={topic} href={`/questions?topic=${encodeURIComponent(topic)}`}>
                        <span style={{
                          padding: '6px 14px', background: '#f1f5f9', borderRadius: '100px',
                          fontSize: '13px', color: '#374151', cursor: 'pointer',
                          border: '1px solid #e2e8f0', fontWeight: 500
                        }}>{topic}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Quick actions */}
            <div style={{
              marginTop: '24px', background: '#065f46', borderRadius: '16px',
              padding: '28px 32px', display: 'flex',
              justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px'
            }}>
              <div>
                <h3 style={{
                  fontFamily: "'Sora', sans-serif", fontSize: '18px',
                  fontWeight: 700, color: '#fff', margin: '0 0 6px'
                }}>Ready to Practice?</h3>
                <p style={{ color: '#a7f3d0', margin: 0, fontSize: '14px' }}>
                  {questions.length} questions available for {courseCode}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <Link href="/quiz">
                  <button style={{
                    padding: '12px 24px', background: '#f59e0b', border: 'none',
                    borderRadius: '10px', color: '#111', fontWeight: 700, fontSize: '14px',
                    cursor: 'pointer', fontFamily: "'Sora', sans-serif"
                  }}>Start Quiz →</button>
                </Link>
                <Link href="/questions">
                  <button style={{
                    padding: '12px 24px', background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '10px', color: '#fff', fontWeight: 600, fontSize: '14px',
                    cursor: 'pointer', fontFamily: "'DM Sans', sans-serif"
                  }}>Browse All</button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
