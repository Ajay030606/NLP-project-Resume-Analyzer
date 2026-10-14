import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

export const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Backend server is unreachable.');
  }
};

export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/resume/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const analyzeText = async (text) => {
  const response = await api.post('/resume/analyze', { text });
  return response.data;
};

export const getJobs = async () => {
  const response = await api.get('/jobs');
  return response.data;
};

export const matchJob = async (resumeText, resumeSkills, jobId) => {
  const response = await api.post('/jobs/match', {
    resume_text: resumeText,
    resume_skills: resumeSkills,
    job_id: jobId,
  });
  return response.data;
};

export const recommendJobs = async (resumeText, resumeSkills, topN = 5) => {
  const response = await api.post('/jobs/recommend', {
    resume_text: resumeText,
    resume_skills: resumeSkills,
    top_n: topN,
  });
  return response.data;
};

export const getExperiments = async () => {
  const response = await api.get('/experiments');
  return response.data;
};

export const runExperiment = async (expId, payload = {}) => {
  const response = await api.post(`/experiments/run/${expId}`, payload);
  return response.data;
};

export default api;
