import React from 'react';
import { ArrowRight, CheckCircle, Cpu, FileSearch, Sparkles, Target, Zap } from 'lucide-react';

const HomePage = ({ setActiveTab, resumeData }) => {
  const pipelineSteps = [
    { num: '01', title: 'PDF Extraction', desc: 'Reads candidate resumes using pypdf, extracting raw text cleanly from headers, experience, and project sections.' },
    { num: '02', title: 'Text Preprocessing', desc: 'Applies lowercasing, regex cleaning, NLTK word tokenization, stop-word removal, and WordNet lemmatization.' },
    { num: '03', title: 'Skill Identification', desc: 'Scans taxonomy categories for programming languages, AI/ML tools, databases, and frameworks.' },
    { num: '04', title: 'TF-IDF Vectorization', desc: 'Converts unstructured resume text and 20 job descriptions into mathematical n-gram feature vectors.' },
    { num: '05', title: 'Cosine Similarity', desc: 'Computes geometric angle between vectors to evaluate semantic compatibility and ranks top matches.' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, #1e293b, #0f172a)',
          color: 'white',
          padding: '3rem 2.5rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ maxWidth: '750px', position: 'relative', zIndex: 2 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(37, 99, 235, 0.25)',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              borderRadius: '9999px',
              padding: '0.35rem 0.85rem',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#93c5fd',
              marginBottom: '1.25rem',
            }}
          >
            <Sparkles size={14} /> College NLP Mini Project
          </div>

          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            AI Resume Screening &amp; Job Recommendation System
          </h1>

          <p style={{ fontSize: '1.1rem', color: '#94a3b8', lineHeight: 1.7, marginBottom: '2rem' }}>
            Upload your resume and discover jobs that best match your skills. Powered by practical Natural Language Processing, TF-IDF vectorization, and cosine similarity.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary"
              style={{ fontSize: '1.05rem', padding: '0.85rem 1.75rem' }}
              onClick={() => setActiveTab('upload')}
            >
              Upload Resume <ArrowRight size={18} />
            </button>
            {resumeData && (
              <button
                className="btn btn-outline"
                style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
                onClick={() => setActiveTab('recommendations')}
              >
                View Recommendations
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ background: '#dbeafe', color: '#1d4ed8', width: '44px', height: '44px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <FileSearch size={22} />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Smart PDF Parsing</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--gray-500)' }}>
            Automatically parses candidate contact info, degrees, internship experience, and project titles from any PDF document.
          </p>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ background: '#dcfce7', color: '#15803d', width: '44px', height: '44px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <Cpu size={22} />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Full NLP Preprocessing</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--gray-500)' }}>
            Demonstrates tokenization, stop word filtering, and WordNet lemmatization with visible statistics and metrics.
          </p>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ background: '#fef3c7', color: '#b45309', width: '44px', height: '44px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <Target size={22} />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>TF-IDF &amp; Cosine Match</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--gray-500)' }}>
            Evaluates mathematical vector distance between resume keywords and job descriptions across 20 distinct industry roles.
          </p>
        </div>
      </div>

      {/* NLP Pipeline Walkthrough Card */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <Zap size={20} color="var(--primary)" /> Practical NLP Architecture Pipeline
          </h2>
          <span className="badge badge-blue">5 Processing Stages</span>
        </div>

        <p style={{ color: 'var(--gray-700)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
          This project demonstrates the core machine learning workflow required for automated document matching and classification:
        </p>

        <div>
          {pipelineSteps.map((step) => (
            <div key={step.num} className="pipeline-step">
              <span className="step-num">{step.num}</span>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--gray-900)' }}>{step.title}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginTop: '0.2rem' }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <button className="btn btn-primary" onClick={() => setActiveTab('upload')}>
            Try It Now with a Resume <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
