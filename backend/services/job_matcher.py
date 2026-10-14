import os
import json
from typing import List, Dict, Any, Tuple
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from services.text_preprocessor import TextPreprocessor

class JobMatcher:
    """
    Job Matching Engine combining:
    1. TF-IDF (Term Frequency-Inverse Document Frequency) Vectorization
    2. Cosine Similarity Calculation
    3. Direct Skill Overlap Analysis (Matched vs Missing skills)
    4. Composite Score Generation (Weighted combination of Semantic & Skill scores)
    """

    def __init__(self, jobs_file: str = None):
        if jobs_file is None:
            base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
            jobs_file = os.path.join(base_dir, 'data', 'jobs.json')
        
        self.jobs_file = jobs_file
        self.jobs = self._load_jobs()
        self.preprocessor = TextPreprocessor()

    def _load_jobs(self) -> List[Dict[str, Any]]:
        """
        Loads the job dataset from jobs.json.
        """
        if os.path.exists(self.jobs_file):
            with open(self.jobs_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        return []

    def get_all_jobs(self) -> List[Dict[str, Any]]:
        """
        Returns list of all available jobs.
        """
        return self.jobs

    def calculate_tfidf_similarity(self, resume_text: str, job_text: str) -> float:
        """
        Calculates cosine similarity between preprocessed resume text and job description
        using scikit-learn's TfidfVectorizer.
        Returns a float between 0.0 and 1.0.
        """
        if not resume_text or not job_text:
            return 0.0

        # Preprocess both texts
        clean_resume = self.preprocessor.process(resume_text)["final_processed_text"]
        clean_job = self.preprocessor.process(job_text)["final_processed_text"]

        if not clean_resume or not clean_job:
            return 0.0

        vectorizer = TfidfVectorizer(stop_words='english', ngram_range=(1, 2))
        try:
            tfidf_matrix = vectorizer.fit_transform([clean_resume, clean_job])
            similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
            return float(similarity)
        except Exception:
            return 0.0

    def calculate_skill_overlap(self, resume_skills: List[str], required_skills: List[str], preferred_skills: List[str]) -> Tuple[List[str], List[str], float]:
        """
        Compares candidate's skills against job's required and preferred skills.
        Returns:
          - matched_skills: skills present in both
          - missing_skills: required skills absent from resume
          - skill_score: ratio of matched required skills (0.0 to 1.0)
        """
        resume_skill_set = {s.lower() for s in resume_skills}
        matched: List[str] = []
        missing: List[str] = []

        for req in required_skills:
            if req.lower() in resume_skill_set:
                matched.append(req)
            else:
                missing.append(req)

        # Calculate score: percentage of required skills satisfied
        if required_skills:
            req_ratio = len(matched) / len(required_skills)
        else:
            req_ratio = 1.0

        # Bonus for preferred skills
        preferred_matched = [p for p in preferred_skills if p.lower() in resume_skill_set]
        bonus = (len(preferred_matched) * 0.05)
        skill_score = min(1.0, req_ratio + bonus)

        return matched, missing, float(skill_score)

    def match_resume_with_job(self, resume_text: str, resume_skills: List[str], job: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculates full compatibility analysis between a resume and a single job description.
        """
        job_full_text = f"{job['job_title']} {job['description']} {' '.join(job.get('required_skills', []))} {' '.join(job.get('preferred_skills', []))}"
        
        # 1. TF-IDF Semantic Similarity
        tfidf_sim = self.calculate_tfidf_similarity(resume_text, job_full_text)

        # 2. Skill-based Matching
        required_skills = job.get('required_skills', [])
        preferred_skills = job.get('preferred_skills', [])
        matched_skills, missing_skills, skill_score = self.calculate_skill_overlap(
            resume_skills, required_skills, preferred_skills
        )

        # 3. Composite Compatibility Score
        # Formula: 40% TF-IDF Textual Match + 60% Required Skills Overlap
        composite_score = (0.40 * tfidf_sim) + (0.60 * skill_score)
        match_percentage = round(composite_score * 100, 1)

        return {
            "job_id": job["job_id"],
            "job_title": job["job_title"],
            "company": job["company"],
            "location": job["location"],
            "experience": job["experience"],
            "description": job["description"],
            "match_score": match_percentage,
            "tfidf_score": round(tfidf_sim * 100, 1),
            "skill_score": round(skill_score * 100, 1),
            "matched_skills": matched_skills,
            "missing_skills": missing_skills,
            "required_skills": required_skills,
            "preferred_skills": preferred_skills,
            "score_disclaimer": "This score represents an NLP statistical similarity estimate and skill keyword alignment, not a guarantee of hiring."
        }

    def recommend_top_jobs(self, resume_text: str, resume_skills: List[str], top_n: int = 5) -> List[Dict[str, Any]]:
        """
        Compares resume against every job in the dataset, ranks by match score,
        and returns the top N recommendations.
        """
        scored_jobs = []
        for job in self.jobs:
            analysis = self.match_resume_with_job(resume_text, resume_skills, job)
            scored_jobs.append(analysis)

        # Sort in descending order by match_score
        scored_jobs.sort(key=lambda x: x["match_score"], reverse=True)
        return scored_jobs[:top_n]
