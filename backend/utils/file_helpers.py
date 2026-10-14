import os
from werkzeug.utils import secure_filename

ALLOWED_EXTENSIONS = {'pdf'}

def is_allowed_file(filename: str) -> bool:
    """
    Check if the uploaded file has an allowed extension (.pdf).
    """
    if '.' not in filename:
        return False
    ext = filename.rsplit('.', 1)[1].lower()
    return ext in ALLOWED_EXTENSIONS

def save_uploaded_file(file, upload_folder: str) -> str:
    """
    Safely saves an uploaded file to the upload directory and returns the absolute path.
    """
    os.makedirs(upload_folder, exist_ok=True)
    filename = secure_filename(file.filename)
    if not filename:
        filename = "uploaded_resume.pdf"
    file_path = os.path.join(upload_folder, filename)
    file.save(file_path)
    return file_path
