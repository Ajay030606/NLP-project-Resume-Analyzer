import os
from flask import Flask, jsonify
from flask_cors import CORS

def create_app():
    """
    Application factory to initialize Flask with CORS and configurations.
    """
    app = Flask(__name__)
    
    # Enable Cross-Origin Resource Sharing (CORS) so React can communicate with Flask
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    # Configure upload directory
    base_dir = os.path.abspath(os.path.dirname(__file__))
    upload_folder = os.path.join(base_dir, 'uploads')
    os.makedirs(upload_folder, exist_ok=True)
    app.config['UPLOAD_FOLDER'] = upload_folder
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB max limit
    
    # Register route blueprints
    from routes.resume_routes import resume_bp
    from routes.job_routes import job_bp
    from routes.experiment_routes import experiment_bp
    app.register_blueprint(resume_bp, url_prefix='/api/resume')
    app.register_blueprint(job_bp, url_prefix='/api/jobs')
    app.register_blueprint(experiment_bp, url_prefix='/api/experiments')

    @app.route('/api/health', methods=['GET'])
    def health_check():
        """
        Health check endpoint to verify backend status.
        """
        return jsonify({
            "status": "success",
            "message": "AI Resume Screening & Recommendation API is running",
            "version": "1.0.0"
        }), 200

    return app

if __name__ == '__main__':
    app = create_app()
    print("=" * 60)
    print("Flask NLP Backend running on http://127.0.0.1:5000")
    print("Health check URL: http://127.0.0.1:5000/api/health")
    print("Press CTRL+C to stop the server")
    print("=" * 60)
    app.run(host='127.0.0.1', port=5000, debug=True)
