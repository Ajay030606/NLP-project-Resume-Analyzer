import os
from flask import Blueprint, request, jsonify, current_app
from services.pdf_extractor import PDFExtractor, PDFExtractionError
from services.text_preprocessor import TextPreprocessor
from services.skill_extractor import SkillExtractor
from services.comprehensive_nlp_pipeline import ComprehensiveNLPPipeline
from utils.file_helpers import is_allowed_file, save_uploaded_file

resume_bp = Blueprint('resume_bp', __name__)
preprocessor = TextPreprocessor()
skill_extractor = SkillExtractor()
curriculum_pipeline = ComprehensiveNLPPipeline()

@resume_bp.route('/upload', methods=['POST'])
def upload_resume():
    """
    POST /api/resume/upload
    Accepts multipart/form-data with a 'file' parameter containing a PDF resume.
    Performs PDF extraction, NLP text cleaning, entity parsing, skill detection,
    and runs all 9 College NLP Curriculum Experiments.
    """
    if 'file' not in request.files:
        return jsonify({
            "status": "error",
            "message": "No file uploaded. Please upload a PDF resume using key 'file'."
        }), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({
            "status": "error",
            "message": "No file selected. Please select a valid PDF file."
        }), 400
        
    if not is_allowed_file(file.filename):
        return jsonify({
            "status": "error",
            "message": "Invalid file type. Only PDF documents (.pdf) are supported."
        }), 400

    saved_file_path = None
    try:
        upload_folder = current_app.config['UPLOAD_FOLDER']
        saved_file_path = save_uploaded_file(file, upload_folder)
        
        # 1. Text & Entity Extraction
        parsed_data = PDFExtractor.parse_resume(saved_file_path)
        raw_text = parsed_data["raw_text"]

        # 2. NLP Preprocessing (cleaning, tokenization, lemmatization)
        nlp_data = preprocessor.process(raw_text)

        # 3. Skill Extraction & Categorization
        skills_data = skill_extractor.extract_skills(raw_text)

        # 4. Run all 9 College NLP Experiments on this candidate's resume
        experiments_data = curriculum_pipeline.analyze_resume_curriculum_experiments(
            raw_text, skills_data["skills"], parsed_data.get("projects", [])
        )

        return jsonify({
            "status": "success",
            "message": "Resume uploaded, extracted, and evaluated across all 9 NLP experiments successfully",
            "data": {
                "name": parsed_data["name"],
                "email": parsed_data["email"],
                "phone": parsed_data["phone"],
                "education": parsed_data["education"],
                "experience": parsed_data["experience"],
                "projects": parsed_data["projects"],
                "skills": skills_data["skills"],
                "categorized_skills": skills_data["categorized"],
                "skill_count": skills_data["count"],
                "nlp_stats": {
                    "raw_char_count": nlp_data["raw_text_length"],
                    "total_tokens": nlp_data["token_count"],
                    "tokens_after_stopwords": nlp_data["tokens_after_stopwords_count"],
                    "lemmatized_sample": nlp_data["lemmatized_tokens"][:15]
                },
                "processed_text": nlp_data["final_processed_text"],
                "raw_text": raw_text,
                "experiments_breakdown": experiments_data
            }
        }), 200

    except PDFExtractionError as pe:
        return jsonify({
            "status": "error",
            "message": str(pe)
        }), 422

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"An error occurred while analyzing the resume: {str(e)}"
        }), 500

    finally:
        if saved_file_path and os.path.exists(saved_file_path):
            try:
                os.remove(saved_file_path)
            except Exception:
                pass

@resume_bp.route('/analyze', methods=['POST'])
def analyze_text():
    """
    POST /api/resume/analyze
    Allows submitting raw resume text directly (useful for pasting text or manual testing).
    """
    payload = request.get_json(silent=True) or {}
    text = payload.get("text", "").strip()

    if not text:
        return jsonify({
            "status": "error",
            "message": "No text provided in request body under 'text'."
        }), 400

    nlp_data = preprocessor.process(text)
    skills_data = skill_extractor.extract_skills(text)
    experiments_data = curriculum_pipeline.analyze_resume_curriculum_experiments(
        text, skills_data["skills"], []
    )

    return jsonify({
        "status": "success",
        "data": {
            "skills": skills_data["skills"],
            "categorized_skills": skills_data["categorized"],
            "skill_count": skills_data["count"],
            "nlp_analysis": nlp_data,
            "experiments_breakdown": experiments_data
        }
    }), 200
