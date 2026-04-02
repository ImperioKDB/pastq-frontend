'use client';
import { useState } from 'react';

export default function TestUpload() {
  const [file, setFile] = useState(null);
  const [courseId, setCourseId] = useState('');
  const [year, setYear] = useState('2023');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleUpload() {
    if (!file || !courseId) {
      alert('Please select a file and enter a course ID');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('course_id', courseId);
    formData.append('course_code', 'CSC 101');
    formData.append('year', year);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/uploads`,
        { method: 'POST', body: formData }
      );
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: '32px', fontFamily: 'sans-serif', maxWidth: '500px' }}>
      <h2>📤 PastQ Upload Test</h2>

      <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        <div>
          <label>Course ID</label><br />
          <input
            value={courseId}
            onChange={e => setCourseId(e.target.value)}
            placeholder="paste uuid here"
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </div>

        <div>
          <label>Year</label><br />
          <input
            value={year}
            onChange={e => setYear(e.target.value)}
            placeholder="2023"
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </div>

        <div>
          <label>Select PDF</label><br />
          <input
            type="file"
            accept="application/pdf"
            onChange={e => setFile(e.target.files[0])}
            style={{ marginTop: '4px' }}
          />
        </div>

        <button
          onClick={handleUpload}
          disabled={loading}
          style={{
            padding: '12px',
            background: loading ? '#ccc' : '#16a34a',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Extracting questions...' : 'Upload & Extract'}
        </button>

      </div>

      {result && (
        <div style={{
          marginTop: '24px',
          padding: '16px',
          background: result.error ? '#fee2e2' : '#dcfce7',
          borderRadius: '8px'
        }}>
          <strong>{result.error ? '❌ Error' : result.message}</strong>
          {result.questions && (
            <div style={{ marginTop: '12px' }}>
              {result.questions.map((q, i) => (
                <div key={i} style={{
                  background: 'white',
                  padding: '12px',
                  marginTop: '8px',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}>
                  <strong>Q{i + 1}:</strong> {q.content}<br />
                  <span style={{ color: '#6b7280' }}>
                    Type: {q.type} · Topic: {q.topic} · Difficulty: {q.difficulty}
                  </span>
                </div>
              ))}
            </div>
          )}
          {result.error && <p style={{ color: '#dc2626' }}>{result.error}</p>}
        </div>
      )}
    </main>
  );
  }
