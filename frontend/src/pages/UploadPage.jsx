import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import { uploadResume, analyzeText } from '../services/api';
import SkillBadge from '../components/SkillBadge';

const UploadPage = ({ setResumeData, resumeData, setActiveTab }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (selected.type !== 'application/pdf' && !selected.name.endsWith('.pdf')) {
        setError('Please select a valid PDF file (.pdf extension only).');
        setFile(null);
        return;
      }
      if (selected.size > 16 * 1024 * 1024) {
        setError('File size exceeds the 16MB limit.');
        setFile(null);
        return;
      }
      setError('');
      setFile(selected);
      setSuccessMsg('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a PDF file first.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');
    setUploadProgress(20);

    try {
      const interval = setInterval(() => {
        setUploadProgress((prev) => (prev < 80 ? prev + 15 : prev));
      }, 150);

      const response = await uploadResume(file);
      clearInterval(interval);
      setUploadProgress(100);

      if (response.status === 'success') {
        setResumeData(response.data);
        setSuccessMsg('Resume parsed and NLP analysis completed successfully!');
      } else {
        setError(response.message || 'Failed to process resume.');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error communicating with Flask backend.');
    } finally {
      setLoading(false);
    }
  };

  const loadSampleProfile = async () => {
    setLoading(true);
    setError('');
    setSuccessMsg('');
    setUploadProgress(50);

    try {
      const sampleText = `
Ajay Jaiswal
Email: ajay.jaiswal@example.com | Phone: +91 9876543210 | Pune, India
EDUCATION:
- B.Tech in Computer Science and Engineering, ABC Institute of Technology (2020-2024)
- Higher Secondary Certificate (CBSE) - 88%
WORK EXPERIENCE:
- Machine Learning Intern at TechCorp Solutions (Jan 2024 - June 2024)
- Developed automated NLP text tokenization and sentiment classification pipelines.
PROJECTS:
- AI Resume Screening and Job Recommendation System using NLP and TF-IDF
- Twitter Sentiment Analysis with Python, NLTK, and Machine Learning
TECHNICAL SKILLS:
Programming Languages: Python, Java, C++, JavaScript
Machine Learning & NLP: Machine Learning, NLP, Scikit-learn, Pandas, NumPy, Deep Learning
Web & Database: React, HTML, CSS, MongoDB, SQL
      `;

      const response = await analyzeText(sampleText);
      setUploadProgress(100);

      if (response.status === 'success') {
        const fullData = {
          name: 'Ajay Jaiswal',
          email: 'ajay.jaiswal@example.com',
          phone: '+91 9876543210',
          education: [
            'B.Tech in Computer Science and Engineering, ABC Institute of Technology (2020-2024)',
            'Higher Secondary Certificate (CBSE) - 88%',
          ],
          experience: [
            'Machine Learning Intern at TechCorp Solutions (Jan 2024 - June 2024)',
          ],
          projects: [
            'AI Resume Screening and Job Recommendation System using NLP and TF-IDF',
            'Twitter Sentiment Analysis with Python, NLTK, and Machine Learning',
          ],
          skills: response.data.skills,
          categorized_skills: response.data.categorized_skills,
          skill_count: response.data.skill_count,
          nlp_stats: {
            raw_char_count: response.data.nlp_analysis.raw_text_length,
            total_tokens: response.data.nlp_analysis.token_count,
            tokens_after_stopwords: response.data.nlp_analysis.tokens_after_stopwords_count,
            lemmatized_sample: response.data.nlp_analysis.lemmatized_tokens.slice(0, 15),
          },
          processed_text: response.data.nlp_analysis.final_processed_text,
          raw_text: sampleText,
        };

        setResumeData(fullData);
        setSuccessMsg('Sample candidate profile loaded and processed successfully!');
      }
    } catch (err) {
      setError('Failed to load sample profile: ' + (err.message || 'Backend error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <UploadCloud size={24} color="var(--primary)" /> Upload Resume (PDF)
          </h2>
          <button className="btn btn-outline btn-sm" onClick={loadSampleProfile} disabled={loading}>
            <RefreshCw size={14} /> Quick Demo: Load Sample Resume
          </button>
        </div>

        <p style={{ color: 'var(--gray-500)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
          Select or drop your PDF resume. Our NLP pipeline will extract text, parse personal credentials, tokenize text, and extract technical skills.
        </p>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="alert alert-success">
            <CheckCircle2 size={18} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Dropzone */}
        <div
          className="dropzone"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf"
            style={{ display: 'none' }}
          />

          <div style={{ color: 'var(--primary)', marginBottom: '0.75rem' }}>
            <UploadCloud size={48} />
          </div>

          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--gray-900)' }}>
            {file ? file.name : 'Click to select or drag and drop your PDF resume'}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginTop: '0.35rem' }}>
            PDF format only (Max size: 16 MB)
          </p>

          {file && (
            <div style={{ marginTop: '0.75rem' }}>
              <span className="badge badge-blue">
                <FileText size={12} /> {(file.size / 1024).toFixed(1)} KB
              </span>
            </div>
          )}
        </div>

        {/* Upload Progress */}
        {loading && (
          <div style={{ marginTop: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--gray-500)' }}>
              <span>Extracting &amp; Processing NLP Pipeline...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${uploadProgress}%` }}></div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button
            className="btn btn-primary"
            onClick={handleUpload}
            disabled={!file || loading}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="spin-animate" /> Processing Resume...
              </>
            ) : (
              <>
                <UploadCloud size={18} /> Extract &amp; Analyze Resume
              </>
            )}
          </button>
        </div>
      </div>

      {/* Extracted Profile Preview */}
      {resumeData && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <CheckCircle2 size={20} color="var(--success)" /> Extracted Candidate Profile
            </h3>
            <span className="badge badge-green">Parsed Successfully</span>
          </div>

          <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
            <div>
              <strong style={{ fontSize: '0.8rem', color: 'var(--gray-500)', display: 'block' }}>Candidate Name</strong>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--gray-900)' }}>
                {resumeData.name || 'Not detected'}
              </span>
            </div>

            <div>
              <strong style={{ fontSize: '0.8rem', color: 'var(--gray-500)', display: 'block' }}>Email Address</strong>
              <span style={{ fontSize: '1rem', color: 'var(--gray-700)' }}>
                {resumeData.email || 'Not detected'}
              </span>
            </div>

            <div>
              <strong style={{ fontSize: '0.8rem', color: 'var(--gray-500)', display: 'block' }}>Phone Number</strong>
              <span style={{ fontSize: '1rem', color: 'var(--gray-700)' }}>
                {resumeData.phone || 'Not detected'}
              </span>
            </div>
          </div>

          {/* Skills Badges */}
          <div style={{ marginBottom: '1.5rem' }}>
            <strong style={{ fontSize: '0.85rem', color: 'var(--gray-500)', display: 'block', marginBottom: '0.5rem' }}>
              Detected Skills ({resumeData.skill_count || resumeData.skills?.length || 0}):
            </strong>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {resumeData.skills?.map((skill, idx) => (
                <SkillBadge key={idx} skill={skill} />
              ))}
            </div>
          </div>

          {/* Education & Experience & Projects */}
          <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
            <div>
              <strong style={{ fontSize: '0.85rem', color: 'var(--gray-500)', display: 'block', marginBottom: '0.4rem' }}>
                Education ({resumeData.education?.length || 0})
              </strong>
              <ul style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--gray-700)' }}>
                {resumeData.education?.length > 0 ? (
                  resumeData.education.map((item, idx) => <li key={idx} style={{ marginBottom: '0.3rem' }}>{item}</li>)
                ) : (
                  <li style={{ color: 'var(--gray-500)' }}>No education section detected</li>
                )}
              </ul>
            </div>

            <div>
              <strong style={{ fontSize: '0.85rem', color: 'var(--gray-500)', display: 'block', marginBottom: '0.4rem' }}>
                Experience ({resumeData.experience?.length || 0})
              </strong>
              <ul style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--gray-700)' }}>
                {resumeData.experience?.length > 0 ? (
                  resumeData.experience.map((item, idx) => <li key={idx} style={{ marginBottom: '0.3rem' }}>{item}</li>)
                ) : (
                  <li style={{ color: 'var(--gray-500)' }}>Fresher / No corporate experience</li>
                )}
              </ul>
            </div>

            <div>
              <strong style={{ fontSize: '0.85rem', color: 'var(--gray-500)', display: 'block', marginBottom: '0.4rem' }}>
                Projects ({resumeData.projects?.length || 0})
              </strong>
              <ul style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--gray-700)' }}>
                {resumeData.projects?.length > 0 ? (
                  resumeData.projects.map((item, idx) => <li key={idx} style={{ marginBottom: '0.3rem' }}>{item}</li>)
                ) : (
                  <li style={{ color: 'var(--gray-500)' }}>No explicit project entries found</li>
                )}
              </ul>
            </div>
          </div>

          {/* Forward Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid var(--gray-100)', paddingTop: '1.25rem' }}>
            <button className="btn btn-primary" onClick={() => setActiveTab('dashboard')}>
              Go to Analysis Dashboard <ArrowRight size={16} />
            </button>
            <button className="btn btn-outline" onClick={() => setActiveTab('recommendations')}>
              View Recommended Jobs
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadPage;
