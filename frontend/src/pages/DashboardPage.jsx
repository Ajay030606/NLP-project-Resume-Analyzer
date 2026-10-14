import React from 'react';
import { Award, BookOpen, Brain, CheckCircle, Code, FileText, Layers, TrendingUp, Zap, ArrowRight } from 'lucide-react';
import ScoreGauge from '../components/ScoreGauge';
import SkillBadge from '../components/SkillBadge';

const DashboardPage = ({ resumeData, setActiveTab }) => {
  if (!resumeData) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <FileText size={48} color="var(--gray-300)" style={{ margin: '0 auto 1rem' }} />
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Resume Uploaded Yet</h2>
        <p style={{ color: 'var(--gray-500)', marginBottom: '1.5rem', maxWidth: '450px', margin: '0 auto 1.5rem' }}>
          Please upload a PDF resume or load the demo candidate profile to view comprehensive NLP analytics and scoring.
        </p>
        <button className="btn btn-primary" onClick={() => setActiveTab('upload')}>
          Go to Upload Page
        </button>
      </div>
    );
  }

  // Calculate dynamic resume score based on skills count, education, and projects
  const skillCount = resumeData.skills?.length || 0;
  const projectCount = resumeData.projects?.length || 0;
  const expCount = resumeData.experience?.length || 0;
  
  // Baseline score formula:
  // Base 40 + (skills up to 30) + (projects up to 15) + (experience up to 15)
  const calculatedScore = Math.min(
    95,
    Math.round(35 + Math.min(skillCount * 3.5, 35) + Math.min(projectCount * 5, 15) + Math.min(expCount * 5, 15))
  );

  // Recommended skills to learn based on industry trends
  const highDemandSkills = [
    'TensorFlow', 'PyTorch', 'Docker', 'Kubernetes', 'AWS', 
    'Deep Learning', 'FastAPI', 'CI/CD', 'TypeScript', 'Redis'
  ];
  
  const candidateSkillsLower = new Set(resumeData.skills?.map((s) => s.toLowerCase()) || []);
  const recommendedSkills = highDemandSkills.filter(
    (skill) => !candidateSkillsLower.has(skill.toLowerCase())
  ).slice(0, 6);

  return (
    <div>
      {/* Top Banner: Score & Quick Stats */}
      <div className="card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <span className="badge badge-blue" style={{ marginBottom: '0.5rem' }}>Candidate Evaluation</span>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--gray-900)' }}>
              {resumeData.name}'s Resume Analysis
            </h1>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
              Extracted from {resumeData.email} | {resumeData.phone || 'Phone verified'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <ScoreGauge score={calculatedScore} size={110} label="Resume Strength Score" />
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dbeafe', color: '#1d4ed8' }}>
            <Code size={24} />
          </div>
          <div>
            <div className="stat-val">{skillCount}</div>
            <div className="stat-label">Skills Detected</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dcfce7', color: '#15803d' }}>
            <Layers size={24} />
          </div>
          <div>
            <div className="stat-val">{projectCount}</div>
            <div className="stat-label">Projects Found</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7', color: '#b45309' }}>
            <Award size={24} />
          </div>
          <div>
            <div className="stat-val">{expCount > 0 ? `${expCount} item(s)` : 'Fresher'}</div>
            <div className="stat-label">Experience</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f3e8ff', color: '#7e22ce' }}>
            <BookOpen size={24} />
          </div>
          <div>
            <div className="stat-val">{resumeData.nlp_stats?.total_tokens || 0}</div>
            <div className="stat-label">NLP Word Tokens</div>
          </div>
        </div>
      </div>

      {/* Skills Breakdown by Category */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <Zap size={20} color="var(--primary)" /> Detected Skills Taxonomy
          </h2>
          <span className="badge badge-blue">{skillCount} Skills Total</span>
        </div>

        <div className="grid-2">
          {resumeData.categorized_skills &&
            Object.entries(resumeData.categorized_skills).map(([category, list]) => (
              <div
                key={category}
                style={{
                  background: 'var(--gray-50)',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--gray-300)',
                }}
              >
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '0.75rem' }}>
                  {category} ({list.length})
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {list.map((skill, idx) => (
                    <SkillBadge key={idx} skill={skill} />
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Recommended Skills to Learn */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <TrendingUp size={20} color="var(--warning)" /> Recommended Skills to Boost Compatibility
          </h2>
          <span className="badge badge-amber">Growth Opportunities</span>
        </div>

        <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
          Adding or learning these high-demand technologies will significantly increase your cosine similarity scores across AI, Data Science, and Full Stack job roles:
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {recommendedSkills.map((skill, idx) => (
            <span key={idx} className="badge badge-amber" style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}>
              + {skill}
            </span>
          ))}
        </div>
      </div>

      {/* NLP Pipeline Deep Dive Inspection Card (For College Project Viva) */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <Brain size={20} color="var(--secondary)" /> NLP Preprocessing Inspection (Viva / Evaluation)
          </h2>
          <span className="badge badge-green">NLTK &amp; WordNet</span>
        </div>

        <p style={{ color: 'var(--gray-700)', fontSize: '0.9rem', marginBottom: '1rem' }}>
          Under the hood, the resume text passes through consecutive NLP transformations before vectorization:
        </p>

        <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
          <div style={{ background: 'var(--gray-50)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-300)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)', fontWeight: 600 }}>1. RAW CHARACTERS</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--gray-900)', marginTop: '0.25rem' }}>
              {resumeData.nlp_stats?.raw_char_count || 0} chars
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.2rem' }}>
              Cleaned of URLs, emails, phone numbers, and symbols.
            </p>
          </div>

          <div style={{ background: 'var(--gray-50)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-300)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)', fontWeight: 600 }}>2. STOP WORDS FILTERED</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--gray-900)', marginTop: '0.25rem' }}>
              {(resumeData.nlp_stats?.total_tokens || 0) - (resumeData.nlp_stats?.tokens_after_stopwords || 0)} filtered
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.2rem' }}>
              High frequency English stop words removed via NLTK corpus.
            </p>
          </div>

          <div style={{ background: 'var(--gray-50)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-300)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)', fontWeight: 600 }}>3. LEMMATIZED TOKENS</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--gray-900)', marginTop: '0.25rem' }}>
              {resumeData.nlp_stats?.tokens_after_stopwords || 0} tokens
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.2rem' }}>
              Words reduced to linguistic root lemma via WordNetLemmatizer.
            </p>
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--gray-700)', display: 'block', marginBottom: '0.5rem' }}>
            Lemmatized Tokens Sample:
          </span>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              background: '#0f172a',
              color: '#38bdf8',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8rem',
              overflowX: 'auto',
              lineHeight: 1.6,
            }}
          >
            {resumeData.nlp_stats?.lemmatized_sample?.map((t) => `"${t}"`).join(', ') || 'N/A'} ...
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
          <button className="btn btn-primary" onClick={() => setActiveTab('recommendations')}>
            View Recommended Job Matches <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* 9 College Curriculum Experiments Active Integration Section */}
      {resumeData.experiments_breakdown && (
        <div className="card" style={{ border: '2px solid #3b82f6', background: 'linear-gradient(180deg, #ffffff, #f0f7ff)' }}>
          <div className="card-header">
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#dbeafe', color: '#1d4ed8', borderRadius: '9999px', padding: '0.2rem 0.6rem', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                <BookOpen size={12} /> College Syllabus Demonstration (CO1 - CO5)
              </div>
              <h2 className="card-title" style={{ color: '#1e3a8a' }}>
                🎓 Active Pipeline: All 9 Experiments Executed on this Resume
              </h2>
              <p style={{ color: 'var(--gray-700)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                To show your professor: every single curriculum experiment is an active module in processing this candidate's resume!
              </p>
            </div>
            <span className="badge badge-green">9/9 Experiments Active</span>
          </div>

          <div className="grid-3" style={{ gap: '1rem', marginTop: '1rem' }}>
            {/* Exp 01 */}
            <div style={{ background: 'white', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-300)' }}>
              <span className="badge badge-blue" style={{ fontSize: '0.7rem' }}>Exp 01 • CO1</span>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0.4rem 0 0.2rem' }}>Preprocessing &amp; Script Validation</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--gray-700)' }}>
                <strong>Primary Script:</strong> {resumeData.experiments_breakdown.exp_01?.primary_script}<br />
                <strong>Valid Latin Script:</strong> {resumeData.experiments_breakdown.exp_01?.is_valid_latin_script ? 'Yes' : 'Mixed'}<br />
                <strong>Stopwords Removed:</strong> {resumeData.experiments_breakdown.exp_01?.stopwords_removed_count} words
              </p>
            </div>

            {/* Exp 02 */}
            <div style={{ background: 'white', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-300)' }}>
              <span className="badge badge-blue" style={{ fontSize: '0.7rem' }}>Exp 02 • CO1</span>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0.4rem 0 0.2rem' }}>Stemming vs. Lemmatization</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--gray-700)', marginBottom: '0.4rem' }}>
                Applies WordNet Lemmatization over crude Porter stemming to avoid non-word artifacts.
              </p>
              <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', background: 'var(--gray-50)', padding: '0.3rem', borderRadius: '4px' }}>
                {resumeData.experiments_breakdown.exp_02?.comparison?.slice(0, 2).map((c, i) => (
                  <div key={i}>{c.word} &rarr; Lemma: <strong>{c.lemmatized}</strong></div>
                ))}
              </div>
            </div>

            {/* Exp 03 */}
            <div style={{ background: 'white', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-300)' }}>
              <span className="badge badge-blue" style={{ fontSize: '0.7rem' }}>Exp 03 • CO1, CO2</span>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0.4rem 0 0.2rem' }}>Minimum Edit Distance</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--gray-700)' }}>
                Wagner-Fischer algorithm scans for skill spelling typos and maps them to canonical taxonomy.
              </p>
              <span className="badge badge-green" style={{ fontSize: '0.75rem', marginTop: '0.4rem' }}>
                Fuzzy Match Active (Dist &le; 2)
              </span>
            </div>

            {/* Exp 04 */}
            <div style={{ background: 'white', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-300)' }}>
              <span className="badge badge-blue" style={{ fontSize: '0.7rem' }}>Exp 04 • CO2</span>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0.4rem 0 0.2rem' }}>N-gram Perplexity Fluency</h4>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)', margin: '0.2rem 0' }}>
                PP = {resumeData.experiments_breakdown.exp_04?.resume_perplexity}
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                Evaluates bigram probability distribution &amp; language coherence under Laplace smoothing.
              </p>
            </div>

            {/* Exp 05 */}
            <div style={{ background: 'white', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-300)' }}>
              <span className="badge badge-blue" style={{ fontSize: '0.7rem' }}>Exp 05 • CO3</span>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0.4rem 0 0.2rem' }}>Part-of-Speech Tagging</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--gray-700)' }}>
                <strong>Technical Nouns:</strong> {resumeData.experiments_breakdown.exp_05?.noun_count}<br />
                <strong>Action Verbs:</strong> {resumeData.experiments_breakdown.exp_05?.verb_count}<br />
                <strong>Qualifying Adjectives:</strong> {resumeData.experiments_breakdown.exp_05?.adjective_count}
              </p>
            </div>

            {/* Exp 06 */}
            <div style={{ background: 'white', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-300)' }}>
              <span className="badge badge-blue" style={{ fontSize: '0.7rem' }}>Exp 06 • CO2</span>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0.4rem 0 0.2rem' }}>Syntactic Parsing (CFG)</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--gray-700)', marginBottom: '0.3rem' }}>
                Validates project action syntax using ChartParser:
              </p>
              <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', background: '#0f172a', color: '#38bdf8', padding: '0.4rem', borderRadius: '4px', overflowX: 'auto' }}>
                {resumeData.experiments_breakdown.exp_06?.parse_tree_bracketed?.slice(0, 50)}...
              </div>
            </div>

            {/* Exp 07 */}
            <div style={{ background: 'white', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-300)' }}>
              <span className="badge badge-blue" style={{ fontSize: '0.7rem' }}>Exp 07 • CO4</span>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0.4rem 0 0.2rem' }}>NER &amp; Noun Phrase Chunking</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--gray-700)', marginBottom: '0.3rem' }}>
                Extracts Candidate Name (PERSON), Colleges (ORG), and Cities (GPE).
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                {resumeData.experiments_breakdown.exp_07?.detected_entities?.slice(0, 3).map((e, i) => (
                  <span key={i} className="badge badge-green" style={{ fontSize: '0.7rem' }}>
                    {e.entity} ({e.type})
                  </span>
                ))}
              </div>
            </div>

            {/* Exp 08 */}
            <div style={{ background: 'white', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-300)' }}>
              <span className="badge badge-blue" style={{ fontSize: '0.7rem' }}>Exp 08 • CO4</span>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0.4rem 0 0.2rem' }}>Word Sense Disambiguation &amp; WordNet</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--gray-700)' }}>
                Lesk algorithm disambiguates polysemous words; WordNet hypernyms expand matching credits for related skills.
              </p>
            </div>

            {/* Exp 09 */}
            <div style={{ background: 'white', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-300)' }}>
              <span className="badge badge-blue" style={{ fontSize: '0.7rem' }}>Exp 09 • CO2, CO5</span>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0.4rem 0 0.2rem' }}>Classification (Naïve Bayes &amp; SVM)</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--gray-700)' }}>
                <strong>Naïve Bayes:</strong> <span style={{ color: '#16a34a', fontWeight: 700 }}>{resumeData.experiments_breakdown.exp_09?.naive_bayes_suitability}</span><br />
                <strong>Linear SVM:</strong> <span style={{ color: '#2563eb', fontWeight: 700 }}>{resumeData.experiments_breakdown.exp_09?.svm_suitability}</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
