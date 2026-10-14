import React, { useState, useEffect } from 'react';
import { Briefcase, Filter, Sparkles, AlertCircle, Loader2, Search, CheckCircle2, SlidersHorizontal } from 'lucide-react';
import { recommendJobs, getJobs, matchJob } from '../services/api';
import JobCard from '../components/JobCard';

const RecommendationsPage = ({ resumeData, setActiveTab }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedJobId, setSelectedJobId] = useState('');
  const [singleMatchResult, setSingleMatchResult] = useState(null);
  const [matchingSingle, setMatchingSingle] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  // Fetch top recommendations on mount or when resume changes
  useEffect(() => {
    fetchRecommendations();
    fetchAllJobs();
  }, [resumeData]);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError('');
    try {
      const resumeText = resumeData?.raw_text || '';
      const resumeSkills = resumeData?.skills || [];
      const res = await recommendJobs(resumeText, resumeSkills, 5);
      if (res.status === 'success') {
        setRecommendations(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load recommendations.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllJobs = async () => {
    try {
      const res = await getJobs();
      if (res.status === 'success') {
        setAllJobs(res.data);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
    }
  };

  const handleCustomJobMatch = async (e) => {
    e.preventDefault();
    if (!selectedJobId) return;

    setMatchingSingle(true);
    setSingleMatchResult(null);
    try {
      const resumeText = resumeData?.raw_text || '';
      const resumeSkills = resumeData?.skills || [];
      const res = await matchJob(resumeText, resumeSkills, selectedJobId);
      if (res.status === 'success') {
        setSingleMatchResult(res.data);
      }
    } catch (err) {
      setError('Failed to compute job match: ' + (err.message || 'Error'));
    } finally {
      setMatchingSingle(false);
    }
  };

  const filteredRecommendations = recommendations.filter((job) =>
    job.job_title?.toLowerCase().includes(searchFilter.toLowerCase()) ||
    job.company?.toLowerCase().includes(searchFilter.toLowerCase()) ||
    job.matched_skills?.some((s) => s.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  return (
    <div>
      {/* Top Banner */}
      <div className="card">
        <div className="card-header">
          <div>
            <span className="badge badge-blue" style={{ marginBottom: '0.4rem' }}>
              Cosine Similarity &amp; Skill Matching
            </span>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--gray-900)' }}>
              Top Job Recommendations
            </h1>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
              Ranked dynamically by evaluating your resume text &amp; skills against 20 verified industry roles.
            </p>
          </div>

          {resumeData ? (
            <div style={{ textAlign: 'right' }}>
              <span className="badge badge-green">Candidate: {resumeData.name}</span>
              <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginTop: '0.25rem' }}>
                {resumeData.skills?.length || 0} skills evaluated
              </div>
            </div>
          ) : (
            <button className="btn btn-primary btn-sm" onClick={() => setActiveTab('upload')}>
              Upload Resume First
            </button>
          )}
        </div>

        {/* NLP Disclaimer Alert */}
        <div className="alert alert-info" style={{ marginBottom: 0 }}>
          <Sparkles size={18} style={{ flexShrink: 0 }} />
          <span>
            <strong>NLP Explanation:</strong> Match scores represent combined vector similarity (TF-IDF Cosine Similarity) and skill keyword coverage. They serve as an automated screening estimate rather than a definitive hiring guarantee.
          </span>
        </div>
      </div>

      {/* Compare With Any Specific Job Role Form */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title" style={{ fontSize: '1.05rem' }}>
            <SlidersHorizontal size={18} color="var(--primary)" /> Test Match Against a Specific Role
          </h3>
          <span className="badge badge-gray">20 Roles Available</span>
        </div>

        <form onSubmit={handleCustomJobMatch} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            style={{
              flex: 1,
              minWidth: '240px',
              padding: '0.65rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--gray-300)',
              fontSize: '0.95rem',
              fontFamily: 'inherit',
              background: 'white',
            }}
          >
            <option value="">-- Choose a target role to calculate match --</option>
            {allJobs.map((j) => (
              <option key={j.job_id} value={j.job_id}>
                {j.job_title} ({j.company}) - {j.experience}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={!selectedJobId || matchingSingle}
          >
            {matchingSingle ? (
              <>
                <Loader2 size={16} className="spin-animate" /> Calculating...
              </>
            ) : (
              'Calculate Compatibility'
            )}
          </button>
        </form>

        {/* Single Match Custom Result */}
        {singleMatchResult && (
          <div style={{ marginTop: '1.25rem' }}>
            <JobCard job={singleMatchResult} />
          </div>
        )}
      </div>

      {/* Search & Top 5 Recommendations */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--gray-900)' }}>
          Top 5 Recommended Jobs for You
        </h2>

        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-500)' }} />
          <input
            type="text"
            placeholder="Filter by title, skill, company..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem 1rem 0.5rem 2.2rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--gray-300)',
              fontSize: '0.85rem',
              fontFamily: 'inherit',
            }}
          />
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Loader2 size={36} color="var(--primary)" className="spin-animate" style={{ margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--gray-500)', fontSize: '0.95rem' }}>
            Computing TF-IDF vector matrices and ranking job matches...
          </p>
        </div>
      ) : filteredRecommendations.length > 0 ? (
        filteredRecommendations.map((job, idx) => (
          <JobCard key={job.job_id || idx} job={job} rank={idx + 1} />
        ))
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Briefcase size={36} color="var(--gray-300)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>No Matching Jobs Found</h3>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', marginTop: '0.35rem' }}>
            Try clearing your search filter or uploading a resume with more technical skills.
          </p>
        </div>
      )}
    </div>
  );
};

export default RecommendationsPage;
