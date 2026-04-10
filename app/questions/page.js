'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL;

// This helper makes math look nice (e.g., ^2 becomes ²)
function renderMath(text) {
  if (!text) return text;
  return String(text)
    .replace(/\^-1/g, '⁻¹').replace(/\^-2/g, '⁻²')
    .replace(/\^2/g, '²').replace(/\^3/g, '³')
    .replace(/sqrt\(([^)]+)\)/g, '√($1)')
    .replace(/\bpi\b/gi, 'π').replace(/\btheta\b/gi, 'θ');
}

export default function QuestionsPage() {
  const [courses, setCourses] = useState([]);   // List of subjects
  const [topics, setTopics] = useState([]);     // List of topics
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [courseId, setCourseId] = useState('');
  const [year, setYear] = useState('');
  const [topic, setTopic] = useState('');

  // 1. Load the list of Courses and Topics when the page opens
  useEffect(() => {
    async function loadFilters() {
      try {
        const [cRes, tRes] = await Promise.all([
          fetch(`${API}/api/courses`),
          fetch(`${API}/api/questions/topics`)
        ]);
        const cData = await cRes.json();
        const tData = await tRes.json();
        
        if (Array.isArray(cData)) setCourses(cData);
        if (Array.isArray(tData)) setTopics(tData);
      } catch (e) {
        console.error("Filter load error:", e);
      }
    }
    loadFilters();
    fetchQuestions(); // Load all questions initially
  }, []);

  // 2. The function that actually gets the questions based on your selection
  async function fetchQuestions(e) {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      let url = `${API}/api/questions?`;
      if (courseId) url += `course_id=${courseId}&`;
      if (year) url += `year=${year}&`;
      if (topic) url += `topic=${topic}&`;

      const res = await fetch(url);
      const data = await res.json();
      setQuestions(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Fetch error:", e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '18px 32px', background: '#fff', borderBottom: '1px solid #e2e8f0' }}>
        <Link href="/"><span style={{ fontWeight: 800, fontSize: '22px', color: '#065f46', cursor: 'pointer' }}>PastQ</span></Link>
        <Link href="/quiz">
          <button style={{ padding: '8px 18px', background: '#065f46', color: '#fff', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Take Quiz</button>
        </Link>
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '24px', color: '#0f172a' }}>Browse Questions</h1>

        {/* --- THE FILTER BAR --- */}
        <form onSubmit={fetchQuestions} style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0', marginBottom: '32px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          
          {/* COURSE DROPDOWN (Replacing the text box) */}
          <div style={{ flex: 2, minWidth: '180px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '6px' }}>Course / Subject</label>
            <select 
              value={courseId} 
              onChange={(e) => setCourseId(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff' }}
            >
              <option value="">All Subjects</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.code} — {c.title}</option>
              ))}
            </select>
          </div>

          {/* YEAR INPUT */}
          <div style={{ width: '100px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '6px' }}>Year</label>
            <input 
              type="text" 
              placeholder="2024"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
            />
          </div>

          {/* TOPIC DROPDOWN */}
          <div style={{ flex: 2, minWidth: '180px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '6px' }}>Topic</label>
            <select 
              value={topic} 
              onChange={(e) => setTopic(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff' }}
            >
              <option value="">All Topics</option>
              {topics.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <button type="submit" style={{ padding: '11px 24px', background: '#065f46', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
            Search
          </button>
        </form>

        {/* --- QUESTIONS LIST --- */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px', color: '#64748b' }}>Searching database...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {questions.map((q) => (
              <div key={q.id} style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, background: '#f1f5f9', padding: '3px 8px', borderRadius: '4px', color: '#64748b' }}>{q.year || 'N/A'}</span>
                  <span style={{ fontSize: '10px', fontWeight: 800, background: '#ecfdf5', padding: '3px 8px', borderRadius: '4px', color: '#059669' }}>{q.topic || 'GENERAL'}</span>
                </div>
                <div style={{ fontSize: '16px', color: '#0f172a', lineHeight: 1.6 }}>{renderMath(q.content)}</div>
                {q.answer && (
                  <div style={{ marginTop: '16px', padding: '12px', background: '#f0fdf4', borderRadius: '8px', color: '#16a34a', fontSize: '14px', border: '1px solid #dcfce7' }}>
                    <strong>Answer:</strong> {renderMath(q.answer)}
                  </div>
                )}
              </div>
            ))}
            {questions.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '12px', border: '1px dashed #cbd5e1', color: '#64748b' }}>
                No questions found. Try selecting a different course or year.
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
