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
        const res = await fetch(API + '/api/courses');
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
      const res = await fetch(API + '/api/uploads', { method: 'POST', body: formData });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: err.message });
    } finally {
      setLoading(false);
    }  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-base)', padding: '48px 24px', fontFamily: 'var(--font-body)' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--brand-primary)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px' }}>
          ADMIN TOOL
        </p>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
          Upload Past Questions
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', fontSize: '14px' }}>
          AI will extract and save all questions automatically in the background.
        </p>

        <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-xl)', padding: '32px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Select Course</label>
            <select
              value={courseId}
              onChange={e => setCourseId(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', fontSize: '14px', background: 'var(--bg-base)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', outline: 'none' }}
            >
              <option value="">Choose a course...</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.code} — {c.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Exam Year</label>
            <input
              type="text"
              value={year}
              onChange={e => setYear(e.target.value)}
              placeholder="e.g. 2023"
              style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', fontSize: '14px', background: 'var(--bg-base)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>PDF File</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={e => setFile(e.target.files[0])}
              style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', fontSize: '14px', background: 'var(--bg-base)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}
            />
          </div>
          <button
            onClick={handleUpload}
            disabled={loading || !courseId || !file}
            style={{
              padding: '14px', 
              background: (loading || !courseId || !file) ? 'var(--border-default)' : 'var(--brand-primary)',
              color: (loading || !courseId || !file) ? 'var(--text-tertiary)' : 'var(--text-inverse)',
              border: 'none', 
              borderRadius: 'var(--radius-md)', 
              fontSize: '15px',
              fontWeight: 700, 
              cursor: (loading || !courseId || !file) ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-body)',
              boxShadow: (loading || !courseId || !file) ? 'none' : 'var(--shadow-glow)',
              transition: 'all 200ms var(--ease-out)'
            }}
          >
            {loading ? 'Extracting in background...' : 'Upload & Extract'}
          </button>
        </div>

        {result && (
          <div style={{
            marginTop: '24px', 
            padding: '20px', 
            borderRadius: 'var(--radius-lg)',
            background: result.error ? 'var(--error-muted)' : 'var(--success-muted)',
            border: '1px solid ' + (result.error ? 'var(--error)' : 'var(--success)'),
            color: result.error ? 'var(--error)' : 'var(--success)'
          }}>
            <strong style={{ fontSize: '14px' }}>
              {result.error ? 'Upload failed: ' + result.error : result.message}
            </strong>
            {result.questions && result.questions.length > 0 && (
              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {result.questions.map((q, i) => (
                  <div key={i} style={{ background: 'var(--bg-elevated)', padding: '12px', borderRadius: 'var(--radius-sm)', fontSize: '14px', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}>
                    <strong>Q{i + 1}:</strong> {q.content}<br />
                    <span style={{ color: 'var(--text-tertiary)', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
                      {q.type} · {q.topic} · {q.difficulty}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>  );
}