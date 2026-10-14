import React, { useState } from 'react';
import { Building2, MapPin, Briefcase, ChevronDown, ChevronUp, CheckCircle, AlertTriangle } from 'lucide-react';
import SkillBadge from './SkillBadge';

const JobCard = ({ job, rank }) => {
  const [expanded, setExpanded] = useState(false);

  const matchScore = job.match_score || 0;
  let scoreClass = 'badge-green';
  if (matchScore < 50) scoreClass = 'badge-amber';
  else if (matchScore < 75) scoreClass = 'badge-blue';

  return (
    <div className="card" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            {rank && (
              <span
                style={{
                  background: 'var(--primary)',
                  color: 'white',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}
              >
                #{rank}
              </span>
            )}
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--gray-900)' }}>
              {job.job_title}
            </h3>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', color: 'var(--gray-500)', fontSize: '0.85rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <Building2 size={14} /> {job.company}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <MapPin size={14} /> {job.location}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <Briefcase size={14} /> {job.experience}
            </span>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div className={`badge ${scoreClass}`} style={{ fontSize: '1rem', padding: '0.4rem 0.85rem' }}>
            Match: {matchScore}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.25rem' }}>
            TF-IDF: {job.tfidf_score || 0}% | Skill: {job.skill_score || 0}%
          </div>
        </div>
      </div>

      {/* Matched & Missing Skills Summary */}
      <div style={{ marginTop: '1.25rem' }}>
        <div style={{ marginBottom: '0.6rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--gray-700)', display: 'block', marginBottom: '0.4rem' }}>
            Matched Skills ({job.matched_skills?.length || 0}):
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {job.matched_skills && job.matched_skills.length > 0 ? (
              job.matched_skills.map((s, idx) => <SkillBadge key={idx} skill={s} type="matched" />)
            ) : (
              <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>None matched yet</span>
            )}
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--gray-700)', display: 'block', marginBottom: '0.4rem' }}>
            Missing Skills ({job.missing_skills?.length || 0}):
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {job.missing_skills && job.missing_skills.length > 0 ? (
              job.missing_skills.map((s, idx) => <SkillBadge key={idx} skill={s} type="missing" />)
            ) : (
              <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>All required skills matched!</span>
            )}
          </div>
        </div>
      </div>

      {/* Collapsible Details */}
      {expanded && (
        <div
          style={{
            marginTop: '1.25rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--gray-100)',
            fontSize: '0.9rem',
            color: 'var(--gray-700)',
          }}
        >
          <h4 style={{ fontWeight: 600, marginBottom: '0.4rem' }}>Job Description:</h4>
          <p style={{ lineHeight: 1.6, marginBottom: '0.75rem' }}>{job.description}</p>
          
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', background: 'var(--gray-50)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
            <div>
              <strong style={{ fontSize: '0.8rem', color: 'var(--gray-500)', display: 'block' }}>Preferred Skills:</strong>
              <span style={{ fontSize: '0.85rem' }}>{job.preferred_skills?.join(', ') || 'N/A'}</span>
            </div>
            <div>
              <strong style={{ fontSize: '0.8rem', color: 'var(--gray-500)', display: 'block' }}>NLP Note:</strong>
              <span style={{ fontSize: '0.85rem', color: 'var(--gray-700)' }}>{job.score_disclaimer}</span>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          className="btn btn-outline btn-sm"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <>
              Hide Details <ChevronUp size={14} />
            </>
          ) : (
            <>
              View Details <ChevronDown size={14} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default JobCard;
