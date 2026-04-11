'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL;

function renderMath(text) {
  if (!text) return text;
  return String(text)
    .replace(/\^-1/g, '⁻¹').replace(/\^-2/g, '⁻²').replace(/\^2/g, '²').replace(/\^3/g, '³')
    .replace(/_2/g, '₂').replace(/_3/g, '₃')
    .replace(/\bpi\b/gi, 'π').replace(/\btheta\b/gi, 'θ')
    .replace(/\bdelta\b/gi, 'δ').replace(/\bsigma\b/gi, 'σ')
    .replace(/\binfinity\b/gi, '∞');
}

export default function QuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [courseId, setCourseId] = useState('');
  const [topic, setTopic] = useState('');
  const [year, setYear] = useState('');

  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        const cRes = await fetch(`${API}/api/courses`);
        const cData = await cRes.json();
        if (Array.isArray(cData)) setCourses(cData);

        const qRes = await fetch(`${API}/api/questions`);
        const qData = await qRes.json();
        if (Array.isArray(qData)) setQuestions(qData);
      } catch (e) {
        setError('Failed to connect to the server.');
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const handleFilter = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let url = `${API}/api/questions?`;
      if (courseId) url += `course_id=${courseId}&`;
      if (year) url += `year=${year}&`;
      if (topic) url += `topic=${encodeURIComponent(topic)}&`;

      const res = await fetch(url);
      const data = await res.json();
      setQuestions(Array.isArray(data) ? data : []);
    } catch (e) {
      setError('Error filtering questions.');
    }
    setLoading(false);
  };

  const handleClear = () => {
    setCourseId('');
    setTopic('');
    setYear('');
    window.location.reload();
  };

  const availableYears = [...new Set(questions.map(q => q.year).filter(Boolean))].sort((a, b) => b - a);
  const availableTopics = [...new Set(questions.map(q => q.topic).filter(Boolean))].sort();

  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', padding: '40px 24px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: '28px', fontWeight: 700, color: '#0f172a' }}>
            Browse Questions
          </h1>
          <p style={{ color: '#6b7280' }}>{questions.length} questions found</p>
        </div>

        <form onSubmit={handleFilter} style={{
          background: '#fff', padding: '24px', borderRadius: '12px',
          border: '1px solid #e2e8f0', display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px',
          marginBottom: '32px'
        }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>COURSE</label>
            <select
              value={courseId}
              onChange={e => setCourseId(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '4px' }}
            >
              <option value="">Select Course</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.code} - {c.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>YEAR</label>
            <select
              value={year}
              onChange={e => setYear(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '4px' }}
            >
              <option value="">All Years</option>
              {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>TOPIC</label>
            <select
              value={topic}
              onChange={e => setTopic(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '4px' }}
            >
              <option value="">All Topics</option>
              {availableTopics.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
            <button type="submit" style={{ flex: 1, padding: '10px', background: '#065f46', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
              Filter
            </button>
            <button type="button" onClick={handleClear} style={{ padding: '10px', background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              Clear
            </button>
          </div>
        </form>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#dc2626' }}>{error}</div>
        ) : questions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>No questions found.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {questions.map((q) => (
              <div key={q.id} style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '12px', background: '#f0fdf4', color: '#166534', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>
                    {q.courses?.code} • {q.year}
                  </span>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>{q.topic}</span>
                </div>
                <p style={{ fontSize: '16px', color: '#1e293b', lineHeight: 1.6 }}>{renderMath(q.content)}</p>

                {q.options && (
                  <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {q.options.map((opt, idx) => (
                      <div key={idx} style={{
                        padding: '10px', border: '1px solid #f1f5f9', borderRadius: '6px', fontSize: '14px',
                        background: opt === q.answer ? '#dcfce7' : '#f8fafc'
                      }}>
                        <strong>{String.fromCharCode(65 + idx)}.</strong> {renderMath(opt)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
  }
