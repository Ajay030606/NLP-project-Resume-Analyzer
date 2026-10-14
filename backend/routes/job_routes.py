from flask import Blueprint, request, jsonify
from services.job_matcher import JobMatcher

job_bp = Blueprint('job_bp', __name__)
matcher = JobMatcher()

@job_bp.route('', methods=['GET'])
def get_jobs():
    """
    GET /api/jobs
    Returns all 20 job descriptions in the dataset.
    """
    jobs = matcher.get_all_jobs()
    return jsonify({
        "status": "success",
        "total": len(jobs),
        "data": jobs
    }), 200

@job_bp.route('/<job_id>', methods=['GET'])
def get_job_by_id(job_id: str):
    """
    GET /api/jobs/<job_id>
    Returns details for a single job by id.
    """
    for job in matcher.get_all_jobs():
        if job["job_id"] == job_id:
            return jsonify({
                "status": "success",
                "data": job
            }), 200
            
    return jsonify({
        "status": "error",
        "message": f"Job with id '{job_id}' not found."
    }), 404

@job_bp.route('/match', methods=['POST'])
def match_single_job():
    """
    POST /api/jobs/match
    Body JSON:
    {
      "resume_text": "...",
      "resume_skills": ["Python", "SQL"],
      "job_id": "job_001"
    }
    Calculates detailed similarity breakdown against one target job.
    """
    payload = request.get_json(silent=True) or {}
    resume_text = payload.get("resume_text", "")
    resume_skills = payload.get("resume_skills", [])
    job_id = payload.get("job_id", "")

    if not job_id:
        return jsonify({
            "status": "error",
            "message": "Missing 'job_id' in request body."
        }), 400

    target_job = None
    for job in matcher.get_all_jobs():
        if job["job_id"] == job_id:
            target_job = job
            break

    if not target_job:
        return jsonify({
            "status": "error",
            "message": f"Job with id '{job_id}' not found."
        }), 404

    match_result = matcher.match_resume_with_job(resume_text, resume_skills, target_job)
    return jsonify({
        "status": "success",
        "data": match_result
    }), 200

@job_bp.route('/recommend', methods=['GET', 'POST'])
def recommend_jobs():
    """
    POST or GET /api/jobs/recommend
    Accepts:
      POST body: { "resume_text": "...", "resume_skills": [...], "top_n": 5 }
      or GET query parameters.
    Returns ranked top 5 job recommendations based on TF-IDF cosine similarity
    and skill requirement overlap.
    """
    if request.method == 'POST':
        payload = request.get_json(silent=True) or {}
        resume_text = payload.get("resume_text", "")
        resume_skills = payload.get("resume_skills", [])
        top_n = payload.get("top_n", 5)
    else:
        resume_text = request.args.get("resume_text", "")
        skills_param = request.args.get("skills", "")
        resume_skills = [s.strip() for s in skills_param.split(",") if s.strip()] if skills_param else []
        top_n = int(request.args.get("top_n", 5))

    # If no resume text or skills provided, return sample top 5
    if not resume_text and not resume_skills:
        # Fallback preview of first 5 jobs
        sample_jobs = matcher.get_all_jobs()[:top_n]
        return jsonify({
            "status": "success",
            "message": "No resume provided; returning top featured jobs",
            "count": len(sample_jobs),
            "data": sample_jobs
        }), 200

    recommendations = matcher.recommend_top_jobs(resume_text, resume_skills, top_n=top_n)
    return jsonify({
        "status": "success",
        "count": len(recommendations),
        "data": recommendations
    }), 200
