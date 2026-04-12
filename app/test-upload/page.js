'use client';
import { useState, useEffect } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL;

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [courseId, setCourseId] = useState('');
  const [courses, setCourses] = useState([]);
  const [year, setYear] = useState('2023');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch(`${API}/api/courses`);
        const data = await res.json();
        if (Array.isArray(data)) setCourses(data);
      } catch (e) {
        console.error('Failed to fetch courses', e);
      }
    }
    fetchCourses();
  }, []);

  async function handleUpload() {
    if (!file || !courseId) {
      alert('Please select a course and a file');
      return;
    }

    const selectedCourse = courses.find(c => c.id === courseId);

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('course_id', courseId);
    formData.append('course_code', selectedCourse?.code || '');
    formData.append('year', year);

    try {
      const res = await fetch(`${API}/api/uploads`, { method: 'POST', body: formData });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', padding: '40px 24px', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>

        <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: '24px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
          📤 Upload Past Questions
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '32px' }}>Admin only — AI will extract and save all questions automatically.</p>

        <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '20px' }}>

          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '8px' }}>Select Course</label>
            <select
              value={courseId}
              onChange={e => setCourseId(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', background: '#fff' }}
            >
              <option value="">Choose a course...</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.code} — {c.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '8px' }}>Exam Year</label>
            <input
              type="text"
              value={year}
              onChange={e => setYear(e.target.value)}
              placeholder="e.g. 2023"
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '8px' }}>PDF File</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={e => setFile(e.target.files[0])}
              style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', background: '#f8fafc' }}
            />
          </div>

          <button
            onClick={handleUpload}
            disabled={loading || !courseId || !file}
            style={{
              padding: '14px', background: loading || !courseId || !file ? '#94a3b8' : '#065f46',
              color: '#fff', border: 'none', borderRadius: '10px', fontSize: '16px',
              fontWeight: 700, cursor: loading || !courseId || !file ? 'not-allowed' : 'pointer',
              fontFamily: "'Sora', sans-serif"
            }}
          >
            {loading ? '⏳ Extracting questions...' : 'Upload & Extract →'}
          </button>

        </div>

        {result && (
          <div style={{
            marginTop: '24px', padding: '20px', borderRadius: '12px',
            background: result.error ? '#fef2f2' : '#f0fdf4',
            border: `1px solid ${result.error ? '#fecaca' : '#bbf7d0'}`
          }}>
            <strong style={{ color: result.error ? '#dc2626' : '#16a34a' }}>
              {result.error ? '❌ ' + result.error : result.message}
            </strong>
            {result.questions && (
              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {result.questions.map((q, i) => (
                  <div key={i} style={{ background: '#fff', padding: '12px', borderRadius: '8px', fontSize: '14px', border: '1px solid #e2e8f0' }}>
                    <strong>Q{i + 1}:</strong> {q.content}<br />
                    <span style={{ color: '#6b7280', fontSize: '12px' }}>
                      {q.type} · {q.topic} · {q.difficulty}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </main>
  );
                    }
