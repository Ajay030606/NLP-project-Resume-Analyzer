import React, { useState, useEffect } from 'react';
import { 
  FlaskConical, Play, CheckCircle2, AlertCircle, BookOpen, 
  HelpCircle, ChevronRight, Layers, Table, Code2, Sparkles, RefreshCw
} from 'lucide-react';
import { getExperiments, runExperiment } from '../services/api';

const ExperimentsPage = () => {
  const [catalog, setCatalog] = useState([]);
  const [selectedExpId, setSelectedExpId] = useState('01');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Form states for experiments
  const [input01, setInput01] = useState("Welcome to Ajay's AI Resume Screening & Job Recommendation System! Created using Python, NLTK, React, and MongoDB.");
  const [input02, setInput02] = useState("studies studying developer developed developing models optimization easily better connectivity");
  const [source03, setSource03] = useState("pithon");
  const [target03, setTarget03] = useState("python");
  const [corpus04, setCorpus04] = useState("natural language processing is fun. natural language processing enables computers to understand text. machine learning and natural language processing are essential skills for ai engineers.");
  const [test04, setTest04] = useState("natural language processing enables machine learning models");
  const [sentence05, setSentence05] = useState("Ajay developed a smart machine learning model for automated resume screening.");
  const [sentence06, setSentence06] = useState("the engineer builds a model");
  const [text07, setText07] = useState("Ajay Jaiswal worked at Google in Bengaluru developing Python and NLP software.");
  const [word08, setWord08] = useState("bank");
  const [sentence08, setSentence08] = useState("I deposited money into my account at the bank.");
  const [review09, setReview09] = useState("Candidate shows excellent machine learning skills and impressive problem solving ability.");

  useEffect(() => {
    loadCatalog();
  }, []);

  const loadCatalog = async () => {
    try {
      const res = await getExperiments();
      if (res.status === 'success') {
        setCatalog(res.data);
        handleRun('01');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectExp = (id) => {
    setSelectedExpId(id);
    setResult(null);
    setError('');
  };

  const handleRun = async (expIdToRun) => {
    const id = expIdToRun || selectedExpId;
    setLoading(true);
    setError('');
    
    let payload = {};
    if (id === '01') payload = { text: input01 };
    else if (id === '02') payload = { text: input02 };
    else if (id === '03') payload = { source: source03, target: target03 };
    else if (id === '04') payload = { corpus: corpus04, test_sentence: test04 };
    else if (id === '05') payload = { sentence: sentence05 };
    else if (id === '06') payload = { sentence: sentence06 };
    else if (id === '07') payload = { text: text07 };
    else if (id === '08') payload = { word: word08, sentence: sentence08 };
    else if (id === '09') payload = { review: review09 };

    try {
      const res = await runExperiment(id, payload);
      if (res.status === 'success') {
        setResult(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Execution error');
    } finally {
      setLoading(false);
    }
  };

  const currentExp = catalog.find((e) => e.id === selectedExpId) || {
    id: selectedExpId,
    title: 'Loading experiment...',
    co: 'CO1',
    description: ''
  };

  return (
    <div>
      {/* Top Banner */}
      <div className="card">
        <div className="card-header">
          <div>
            <span className="badge badge-blue" style={{ marginBottom: '0.4rem' }}>
              College NLP Syllabus Alignment
            </span>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--gray-900)' }}>
              NLP Lab Experiments (Exp 01 - Exp 09)
            </h1>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
              Interactive implementations covering Course Outcomes CO1 through CO5 with side-by-side algorithms, mathematical matrices, and viva notes.
            </p>
          </div>
          <span className="badge badge-green" style={{ fontSize: '0.85rem' }}>
            9 Experiments Implemented
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 320px) 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Left Side: Experiment Selector Sidebar */}
        <div className="card" style={{ padding: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', paddingLeft: '0.5rem', color: 'var(--gray-900)' }}>
            Select Experiment:
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {catalog.map((exp) => (
              <button
                key={exp.id}
                onClick={() => {
                  handleSelectExp(exp.id);
                  handleRun(exp.id);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: selectedExpId === exp.id ? '1px solid var(--primary)' : '1px solid transparent',
                  background: selectedExpId === exp.id ? 'var(--primary-light)' : 'transparent',
                  color: selectedExpId === exp.id ? 'var(--primary)' : 'var(--gray-700)',
                  fontWeight: selectedExpId === exp.id ? 700 : 500,
                  fontSize: '0.85rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span
                    style={{
                      background: selectedExpId === exp.id ? 'var(--primary)' : 'var(--gray-300)',
                      color: 'white',
                      borderRadius: '4px',
                      padding: '0.15rem 0.35rem',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                    }}
                  >
                    Exp {exp.id}
                  </span>
                  <span style={{ lineHeight: 1.3 }}>{exp.title.split(':')[0]}</span>
                </div>
                <span className="badge badge-gray" style={{ fontSize: '0.7rem' }}>
                  {exp.co}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Experiment Interactive Workspace */}
        <div>
          <div className="card">
            <div className="card-header">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                  <span className="badge badge-blue">Experiment {currentExp.id}</span>
                  <span className="badge badge-amber">{currentExp.co}</span>
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--gray-900)' }}>
                  {currentExp.title}
                </h2>
                <p style={{ color: 'var(--gray-500)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                  {currentExp.description}
                </p>
              </div>
            </div>

            {/* Dynamic Input Form for each experiment */}
            <div style={{ background: 'var(--gray-50)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', border: '1px solid var(--gray-300)' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.6rem', color: 'var(--gray-900)' }}>
                Input Parameters:
              </h4>

              {selectedExpId === '01' && (
                <div>
                  <textarea
                    rows={3}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--gray-300)', fontFamily: 'inherit' }}
                    value={input01}
                    onChange={(e) => setInput01(e.target.value)}
                  />
                </div>
              )}

              {selectedExpId === '02' && (
                <div>
                  <input
                    type="text"
                    style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--gray-300)', fontFamily: 'inherit' }}
                    value={input02}
                    onChange={(e) => setInput02(e.target.value)}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.2rem', display: 'block' }}>
                    Space-separated words to evaluate stemming vs. lemmatization.
                  </span>
                </div>
              )}

              {selectedExpId === '03' && (
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray-700)' }}>Source Word (Typo):</label>
                    <input
                      type="text"
                      style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--gray-300)' }}
                      value={source03}
                      onChange={(e) => setSource03(e.target.value)}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray-700)' }}>Target Word (Dictionary):</label>
                    <input
                      type="text"
                      style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--gray-300)' }}
                      value={target03}
                      onChange={(e) => setTarget03(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {selectedExpId === '04' && (
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray-700)' }}>Training Corpus:</label>
                  <textarea
                    rows={2}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--gray-300)', marginBottom: '0.5rem' }}
                    value={corpus04}
                    onChange={(e) => setCorpus04(e.target.value)}
                  />
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray-700)' }}>Test Sequence (Perplexity Evaluation):</label>
                  <input
                    type="text"
                    style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--gray-300)' }}
                    value={test04}
                    onChange={(e) => setTest04(e.target.value)}
                  />
                </div>
              )}

              {selectedExpId === '05' && (
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray-700)' }}>Input Sentence for POS Tagging:</label>
                  <input
                    type="text"
                    style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--gray-300)' }}
                    value={sentence05}
                    onChange={(e) => setSentence05(e.target.value)}
                  />
                </div>
              )}

              {selectedExpId === '06' && (
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray-700)' }}>Sentence for CFG Parsing:</label>
                  <input
                    type="text"
                    style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--gray-300)' }}
                    value={sentence06}
                    onChange={(e) => setSentence06(e.target.value)}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.2rem', display: 'block' }}>
                    Vocabulary: 'the', 'a', 'engineer', 'model', 'resume', 'builds', 'evaluates'
                  </span>
                </div>
              )}

              {selectedExpId === '07' && (
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray-700)' }}>Text for Entity &amp; Noun Phrase Extraction:</label>
                  <input
                    type="text"
                    style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--gray-300)' }}
                    value={text07}
                    onChange={(e) => setText07(e.target.value)}
                  />
                </div>
              )}

              {selectedExpId === '08' && (
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ width: '150px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray-700)' }}>Target Word:</label>
                    <input
                      type="text"
                      style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--gray-300)' }}
                      value={word08}
                      onChange={(e) => setWord08(e.target.value)}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray-700)' }}>Context Sentence:</label>
                    <input
                      type="text"
                      style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--gray-300)' }}
                      value={sentence08}
                      onChange={(e) => setSentence08(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {selectedExpId === '09' && (
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray-700)' }}>Review / Candidate Assessment Text:</label>
                  <input
                    type="text"
                    style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--gray-300)' }}
                    value={review09}
                    onChange={(e) => setReview09(e.target.value)}
                  />
                </div>
              )}

              <div style={{ marginTop: '1rem' }}>
                <button className="btn btn-primary btn-sm" onClick={() => handleRun()} disabled={loading}>
                  <Play size={14} /> Run Experiment {selectedExpId}
                </button>
              </div>
            </div>

            {error && (
              <div className="alert alert-error">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {/* Results Renderers */}
            {result && (
              <div>
                <div style={{ borderTop: '1px solid var(--gray-300)', paddingTop: '1.25rem', marginTop: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--gray-900)' }}>
                      Execution Results:
                    </h3>
                    <span className="badge badge-green">Computed Successfully</span>
                  </div>

                  {/* Exp 01: Preprocessing Result */}
                  {selectedExpId === '01' && (
                    <div>
                      <div className="grid-3" style={{ marginBottom: '1rem' }}>
                        <div style={{ background: 'white', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--gray-300)' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)', fontWeight: 600 }}>SCRIPT DETECTED</span>
                          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)' }}>
                            {result.script_validation?.primary_script}
                          </div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                            Valid Latin/ASCII: {result.script_validation?.is_valid_latin_ascii ? 'Yes' : 'Contains Non-ASCII'}
                          </span>
                        </div>
                        <div style={{ background: 'white', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--gray-300)' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)', fontWeight: 600 }}>TOKEN COUNT</span>
                          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--gray-900)' }}>
                            {result.tokenization?.word_token_count} words
                          </div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                            {result.tokenization?.sentence_count} sentence(s)
                          </span>
                        </div>
                        <div style={{ background: 'white', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--gray-300)' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)', fontWeight: 600 }}>STOPWORDS FILTERED</span>
                          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#dc2626' }}>
                            {result.stopwords_removal?.stopwords_removed_count} removed
                          </div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                            {result.stopwords_removal?.retained_tokens_count} retained tokens
                          </span>
                        </div>
                      </div>

                      <div style={{ marginBottom: '0.75rem' }}>
                        <strong style={{ fontSize: '0.85rem', color: 'var(--gray-700)', display: 'block', marginBottom: '0.3rem' }}>
                          Retained Non-Stopword Tokens:
                        </strong>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                          {result.stopwords_removal?.cleaned_tokens_sample?.map((t, i) => (
                            <span key={i} className="badge badge-blue">{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Exp 02: Stemming vs Lemmatization Table */}
                  {selectedExpId === '02' && (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                        <thead>
                          <tr style={{ background: 'var(--gray-100)', textAlign: 'left', borderBottom: '2px solid var(--gray-300)' }}>
                            <th style={{ padding: '0.6rem 0.75rem' }}>Original Word</th>
                            <th style={{ padding: '0.6rem 0.75rem' }}>Porter Stemmer</th>
                            <th style={{ padding: '0.6rem 0.75rem' }}>Lancaster Stemmer</th>
                            <th style={{ padding: '0.6rem 0.75rem' }}>WordNet Lemma (Noun)</th>
                            <th style={{ padding: '0.6rem 0.75rem' }}>WordNet Lemma (Verb)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.comparison_table?.map((row, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid var(--gray-100)' }}>
                              <td style={{ padding: '0.5rem 0.75rem', fontWeight: 600 }}>{row.original}</td>
                              <td style={{ padding: '0.5rem 0.75rem', color: row.is_stem_real_word ? 'inherit' : '#d97706' }}>
                                {row.porter_stem}
                              </td>
                              <td style={{ padding: '0.5rem 0.75rem' }}>{row.lancaster_stem}</td>
                              <td style={{ padding: '0.5rem 0.75rem', color: '#16a34a', fontWeight: 600 }}>{row.lemmatized_noun}</td>
                              <td style={{ padding: '0.5rem 0.75rem', color: '#2563eb', fontWeight: 600 }}>{row.lemmatized_verb}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Exp 03: Minimum Edit Distance Matrix */}
                  {selectedExpId === '03' && (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem', background: '#ecfdf5', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                        <div>
                          <span style={{ fontSize: '0.8rem', color: '#047857', fontWeight: 600 }}>LEVENSHTEIN EDIT DISTANCE:</span>
                          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#065f46' }}>
                            {result.minimum_edit_distance}
                          </div>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: '#065f46' }}>
                          Operations required to transform <strong>"{result.source_word}"</strong> into <strong>"{result.target_word}"</strong>.
                        </p>
                      </div>

                      <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem' }}>Dynamic Programming Cost Matrix:</h4>
                      <div style={{ overflowX: 'auto', marginBottom: '1.25rem' }}>
                        <table style={{ borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                          <thead>
                            <tr>
                              <th style={{ padding: '0.4rem 0.6rem', background: '#f1f5f9' }}></th>
                              {result.matrix_cols?.map((c, i) => (
                                <th key={i} style={{ padding: '0.4rem 0.6rem', background: '#f1f5f9' }}>{c}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {result.dp_matrix?.map((row, rIdx) => (
                              <tr key={rIdx}>
                                <th style={{ padding: '0.4rem 0.6rem', background: '#f1f5f9' }}>{result.matrix_rows[rIdx]}</th>
                                {row.map((val, cIdx) => (
                                  <td
                                    key={cIdx}
                                    style={{
                                      padding: '0.4rem 0.6rem',
                                      textAlign: 'center',
                                      border: '1px solid #cbd5e1',
                                      background: rIdx === result.dp_matrix.length - 1 && cIdx === row.length - 1 ? '#bbf7d0' : 'white',
                                      fontWeight: rIdx === result.dp_matrix.length - 1 && cIdx === row.length - 1 ? 800 : 400,
                                    }}
                                  >
                                    {val}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>Fuzzy Resume Skill Correction Examples:</h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {result.sample_skill_corrections?.map((s, i) => (
                          <div key={i} className="badge badge-gray" style={{ fontSize: '0.8rem' }}>
                            <span style={{ textDecoration: 'line-through', color: '#ef4444' }}>{s.typo}</span>
                            <span style={{ margin: '0 0.3rem' }}>&rarr;</span>
                            <span style={{ color: '#15803d', fontWeight: 700 }}>{s.suggested_correction}</span>
                            <span style={{ color: 'var(--gray-500)', marginLeft: '0.3rem' }}>(dist: {s.edit_distance})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Exp 04: N-grams & Perplexity */}
                  {selectedExpId === '04' && (
                    <div>
                      <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--gray-300)', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)', fontWeight: 600 }}>TEST SEQUENCE PERPLEXITY SCORE</span>
                        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)' }}>
                          {result.perplexity}
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>
                          Lower perplexity indicates the language model finds this word sequence natural and probable.
                        </p>
                      </div>

                      <div className="grid-3" style={{ marginBottom: '1rem' }}>
                        <div>
                          <strong style={{ fontSize: '0.85rem', color: 'var(--gray-700)', display: 'block', marginBottom: '0.4rem' }}>Top Unigrams:</strong>
                          <div style={{ fontSize: '0.8rem', background: 'white', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--gray-300)' }}>
                            {result.top_unigrams?.map((u, i) => (
                              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.2rem 0' }}>
                                <span>{u.token}</span>
                                <strong>{u.count}</strong>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <strong style={{ fontSize: '0.85rem', color: 'var(--gray-700)', display: 'block', marginBottom: '0.4rem' }}>Top Bigrams:</strong>
                          <div style={{ fontSize: '0.8rem', background: 'white', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--gray-300)' }}>
                            {result.top_bigrams?.map((b, i) => (
                              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.2rem 0' }}>
                                <span>{b.bigram}</span>
                                <strong>{b.count}</strong>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <strong style={{ fontSize: '0.85rem', color: 'var(--gray-700)', display: 'block', marginBottom: '0.4rem' }}>Top Trigrams:</strong>
                          <div style={{ fontSize: '0.8rem', background: 'white', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--gray-300)' }}>
                            {result.top_trigrams?.map((t, i) => (
                              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.2rem 0' }}>
                                <span>{t.trigram}</span>
                                <strong>{t.count}</strong>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Exp 05: POS Tagging */}
                  {selectedExpId === '05' && (
                    <div>
                      <div style={{ marginBottom: '1rem', background: '#eff6ff', padding: '0.75rem', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between' }}>
                        <span><strong>Tagging Agreement Rate:</strong> {result.agreement_rate}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>NLTK Averaged Perceptron vs Regex Rules</span>
                      </div>
                      <div style={{ overflowX: 'auto', marginBottom: '1rem' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                          <thead>
                            <tr style={{ background: 'var(--gray-100)', textAlign: 'left' }}>
                              <th style={{ padding: '0.5rem' }}>Word</th>
                              <th style={{ padding: '0.5rem' }}>Rule-Based Tag</th>
                              <th style={{ padding: '0.5rem' }}>Probabilistic (Perceptron) Tag</th>
                              <th style={{ padding: '0.5rem' }}>Agreement</th>
                            </tr>
                          </thead>
                          <tbody>
                            {result.comparison?.map((c, i) => (
                              <tr key={i} style={{ borderBottom: '1px solid var(--gray-100)' }}>
                                <td style={{ padding: '0.5rem', fontWeight: 600 }}>{c.word}</td>
                                <td style={{ padding: '0.5rem' }}>{c.rule_based_tag}</td>
                                <td style={{ padding: '0.5rem', color: 'var(--primary)', fontWeight: 600 }}>{c.probabilistic_tag}</td>
                                <td style={{ padding: '0.5rem' }}>
                                  {c.agreement ? (
                                    <span style={{ color: '#15803d' }}>&check; Agree</span>
                                  ) : (
                                    <span style={{ color: '#d97706' }}>Differs</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Exp 06: CFG Parsing */}
                  {selectedExpId === '06' && (
                    <div>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>Context-Free Grammar Production Rules:</h4>
                      <div style={{ fontFamily: 'var(--font-mono)', background: 'var(--gray-50)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', marginBottom: '1rem' }}>
                        {result.grammar_rules?.map((r, i) => <div key={i}>{r}</div>)}
                      </div>

                      <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>Generated Syntactic Parse Tree:</h4>
                      <pre style={{ fontFamily: 'var(--font-mono)', background: '#0f172a', color: '#38bdf8', padding: '1rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', overflowX: 'auto', lineHeight: 1.5 }}>
                        {result.parse_tree}
                      </pre>
                    </div>
                  )}

                  {/* Exp 07: NER & Chunking */}
                  {selectedExpId === '07' && (
                    <div>
                      <div style={{ marginBottom: '1.25rem' }}>
                        <strong style={{ fontSize: '0.85rem', color: 'var(--gray-700)', display: 'block', marginBottom: '0.4rem' }}>
                          Extracted Named Entities:
                        </strong>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                          {result.extracted_named_entities?.map((ne, i) => (
                            <span key={i} className="badge badge-green" style={{ fontSize: '0.85rem' }}>
                              {ne.entity} &bull; <em style={{ fontSize: '0.75rem', opacity: 0.9 }}>{ne.type}</em>
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <strong style={{ fontSize: '0.85rem', color: 'var(--gray-700)', display: 'block', marginBottom: '0.4rem' }}>
                          Extracted Noun Phrase Chunks (NP):
                        </strong>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                          {result.extracted_noun_phrases?.map((np, i) => (
                            <span key={i} className="badge badge-blue">{np}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Exp 08: Lesk & WordNet */}
                  {selectedExpId === '08' && (
                    <div>
                      <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--gray-300)', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)', fontWeight: 600 }}>LESK DISAMBIGUATED SENSE</span>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.2rem' }}>
                          {result.lesk_disambiguation?.selected_synset}
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--gray-700)', marginTop: '0.25rem' }}>
                          <strong>Definition:</strong> "{result.lesk_disambiguation?.definition}"
                        </p>
                      </div>

                      <div className="grid-2">
                        <div style={{ background: 'white', padding: '0.75rem', border: '1px solid var(--gray-300)', borderRadius: 'var(--radius-sm)' }}>
                          <strong style={{ fontSize: '0.85rem', color: 'var(--gray-700)' }}>Synonyms:</strong>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.4rem' }}>
                            {result.wordnet_relations?.synonyms?.map((s, i) => <span key={i} className="badge badge-blue">{s}</span>)}
                          </div>
                        </div>

                        <div style={{ background: 'white', padding: '0.75rem', border: '1px solid var(--gray-300)', borderRadius: 'var(--radius-sm)' }}>
                          <strong style={{ fontSize: '0.85rem', color: 'var(--gray-700)' }}>Hypernyms (Broader Concept):</strong>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.4rem' }}>
                            {result.wordnet_relations?.hypernyms_broader_category?.map((h, i) => <span key={i} className="badge badge-green">{h}</span>)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Exp 09: Text Classification (Naive Bayes vs SVM) */}
                  {selectedExpId === '09' && (
                    <div>
                      <div className="grid-2" style={{ marginBottom: '1.25rem' }}>
                        <div style={{ background: 'white', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--gray-300)' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)', fontWeight: 600 }}>MULTINOMIAL NAÏVE BAYES</span>
                          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>
                            {result.models_comparison?.multinomial_naive_bayes?.accuracy}
                          </div>
                          <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.2rem' }}>
                            {result.models_comparison?.multinomial_naive_bayes?.type}
                          </p>
                        </div>

                        <div style={{ background: 'white', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--gray-300)' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)', fontWeight: 600 }}>SUPPORT VECTOR MACHINE (SVM)</span>
                          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#16a34a' }}>
                            {result.models_comparison?.support_vector_machine_svm?.accuracy}
                          </div>
                          <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.2rem' }}>
                            {result.models_comparison?.support_vector_machine_svm?.type}
                          </p>
                        </div>
                      </div>

                      <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--gray-300)' }}>
                        <strong style={{ fontSize: '0.85rem', color: 'var(--gray-700)', display: 'block', marginBottom: '0.4rem' }}>
                          Model Prediction on Input Sample:
                        </strong>
                        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                          <div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>Naïve Bayes Prediction:</span>
                            <div style={{ fontWeight: 700, textTransform: 'uppercase', color: result.user_sample_test?.naive_bayes_prediction === 'positive' ? '#16a34a' : '#dc2626' }}>
                              {result.user_sample_test?.naive_bayes_prediction}
                            </div>
                          </div>
                          <div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>Linear SVM Prediction:</span>
                            <div style={{ fontWeight: 700, textTransform: 'uppercase', color: result.user_sample_test?.svm_prediction === 'positive' ? '#16a34a' : '#dc2626' }}>
                              {result.user_sample_test?.svm_prediction}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Educational Notes Box for Viva Voce */}
                  {result.educational_notes && (
                    <div style={{ marginTop: '1.25rem', background: '#fffbeb', border: '1px solid #fde68a', padding: '1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: '#92400e' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                        <HelpCircle size={16} /> Viva / Evaluation Theory:
                      </div>
                      <p>{result.educational_notes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperimentsPage;
