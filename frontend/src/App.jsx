import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import DashboardPage from './pages/DashboardPage';
import RecommendationsPage from './pages/RecommendationsPage';
import { checkHealth } from './services/api';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [resumeData, setResumeData] = useState(null);
  const [backendStatus, setBackendStatus] = useState('checking');

  useEffect(() => {
    const verifyBackend = async () => {
      try {
        await checkHealth();
        setBackendStatus('online');
      } catch (err) {
        setBackendStatus('offline');
      }
    };

    verifyBackend();
    const interval = setInterval(verifyBackend, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-container">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        backendStatus={backendStatus}
      />

      <main className="main-content">
        {activeTab === 'home' && (
          <HomePage setActiveTab={setActiveTab} resumeData={resumeData} />
        )}
        {activeTab === 'upload' && (
          <UploadPage
            setResumeData={setResumeData}
            resumeData={resumeData}
            setActiveTab={setActiveTab}
          />
        )}
        {activeTab === 'dashboard' && (
          <DashboardPage
            resumeData={resumeData}
            setActiveTab={setActiveTab}
          />
        )}
        {activeTab === 'recommendations' && (
          <RecommendationsPage
            resumeData={resumeData}
            setActiveTab={setActiveTab}
          />
        )}
      </main>

      <footer
        style={{
          borderTop: '1px solid var(--gray-300)',
          background: 'white',
          padding: '1.5rem',
          textAlign: 'center',
          fontSize: '0.85rem',
          color: 'var(--gray-500)',
        }}
      >
        <p style={{ fontWeight: 600, color: 'var(--gray-700)', marginBottom: '0.25rem' }}>
          AI-Based Resume Screening and Job Recommendation System using NLP
        </p>
        <p>
          College NLP Mini Project | Python Flask • NLTK &amp; spaCy • scikit-learn (TF-IDF + Cosine Similarity) • React &amp; Vite
        </p>
      </footer>
    </div>
  );
}

export default App;
