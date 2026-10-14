import re
from typing import Dict, Any, List
from pypdf import PdfReader

class PDFExtractionError(Exception):
    """Custom exception raised when PDF text extraction fails."""
    pass

class PDFExtractor:
    """
    Service responsible for reading PDF files and parsing initial structured data
    such as contact info, candidate name, education, experience, and projects.
    """

    @staticmethod
    def extract_text(file_path: str) -> str:
        """
        Extract raw text content from all pages of a PDF document using pypdf.
        """
        try:
            reader = PdfReader(file_path)
            extracted_pages: List[str] = []
            
            for page_idx, page in enumerate(reader.pages):
                page_text = page.extract_text()
                if page_text:
                    extracted_pages.append(page_text)
            
            combined_text = "\n".join(extracted_pages).strip()
            # Clean common bullet and non-printable characters
            combined_text = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f\uf000-\uf8ff]', '', combined_text)
            combined_text = re.sub(r'^[•\-\*\u007f\uf0b7\uf0a7]\s*', '', combined_text, flags=re.MULTILINE)
            
            if not combined_text or len(combined_text) < 15:
                raise PDFExtractionError(
                    "The PDF appears to be empty or contains scanned images without selectable text. "
                    "Please upload a text-based PDF resume."
                )
            
            return combined_text
        except PDFExtractionError:
            raise
        except Exception as e:
            raise PDFExtractionError(f"Failed to read PDF file: {str(e)}")

    @staticmethod
    def extract_email(text: str) -> str:
        """
        Extract email address using regex pattern.
        """
        email_pattern = r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+'
        matches = re.findall(email_pattern, text)
        return matches[0] if matches else ""

    @staticmethod
    def extract_phone(text: str) -> str:
        """
        Extract phone number using patterns supporting Indian and international formats.
        Examples: +91 9876543210, 9876543210, (123) 456-7890, +1-555-555-5555
        """
        phone_pattern = r'(?:(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\b\d{10}\b)'
        matches = re.findall(phone_pattern, text)
        for match in matches:
            cleaned = re.sub(r'[\s\-\(\)\.]', '', match)
            if 10 <= len(cleaned) <= 13:
                return match.strip()
        return ""

    @staticmethod
    def extract_name(text: str) -> str:
        """
        Extract candidate name from the top header lines of the resume.
        Candidates typically put their name in the first 1-4 lines.
        """
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        
        # Stopwords or headings that shouldn't be considered a person's name
        ignore_keywords = {
            'resume', 'curriculum', 'vitae', 'cv', 'profile', 'contact',
            'summary', 'experience', 'education', 'skills', 'objective', 'email', 'phone'
        }
        
        for line in lines[:5]:
            # Skip lines containing email, urls, or phone numbers
            if '@' in line or 'http' in line or 'www' in line or re.search(r'\d{5,}', line):
                continue
            
            cleaned_line = re.sub(r'[^a-zA-Z\s]', '', line).strip()
            tokens = cleaned_line.split()
            
            # A realistic name typically has 2 to 4 words (First [Middle] Last)
            if 1 <= len(tokens) <= 4:
                if not any(token.lower() in ignore_keywords for token in tokens):
                    return " ".join([t.capitalize() for t in tokens])
        
        return "Candidate"

    @staticmethod
    def extract_education(text: str) -> List[str]:
        """
        Extract education lines and degrees matching common academic credentials.
        """
        education_keywords = [
            r'b\.?tech\b', r'b\.?e\.?\b', r'm\.?tech\b', r'm\.?e\.?\b',
            r'b\.?sc\b', r'm\.?sc\b', r'bca\b', r'mca\b', r'bachelor',
            r'master', r'phd\b', r'diploma\b', r'secondary\b', r'higher secondary\b',
            r'cbse\b', r'icse\b', r'university\b', r'college\b', r'institute\b'
        ]
        
        pattern = re.compile('|'.join(education_keywords), re.IGNORECASE)
        found_education: List[str] = []
        
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        for line in lines:
            if pattern.search(line) and len(line) < 120:
                clean = re.sub(r'^[•\-\*\u007f\uf0b7\uf0a7\s]+', '', line).strip()
                if clean and clean not in found_education:
                    found_education.append(clean)
        
        return found_education[:5]

    @staticmethod
    def extract_experience(text: str) -> List[str]:
        """
        Extract work experience or roles mentioned in the resume.
        """
        exp_pattern = re.compile(
            r'\b(intern|internship|developer|engineer|analyst|associate|lead|trainee|manager|specialist)\b',
            re.IGNORECASE
        )
        found_exp: List[str] = []
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        
        for line in lines:
            if exp_pattern.search(line) and len(line) < 100:
                clean = re.sub(r'^[•\-\*\u007f\uf0b7\uf0a7\s]+', '', line).strip()
                if clean and clean not in found_exp:
                    found_exp.append(clean)
                    
        return found_exp[:5]

    @staticmethod
    def extract_projects(text: str) -> List[str]:
        """
        Detect project section items from the resume text.
        """
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        found_projects: List[str] = []
        in_projects_section = False
        
        section_headers = {'projects', 'academic projects', 'personal projects', 'key projects'}
        other_headers = {'skills', 'technical skills', 'education', 'experience', 'work experience', 'certifications', 'achievements', 'declaration'}
        
        for line in lines:
            lower_line = line.lower().strip(': -')
            if lower_line in section_headers:
                in_projects_section = True
                continue
            elif in_projects_section and lower_line in other_headers:
                in_projects_section = False
                break
                
            if in_projects_section and len(line) > 5 and len(line) < 100:
                clean = re.sub(r'^[•\-\*\u007f\uf0b7\uf0a7\s]+', '', line).strip()
                if clean and clean not in found_projects:
                    found_projects.append(clean)
        
        # If no explicit projects section found, return empty list
        return found_projects[:5]

    @classmethod
    def parse_resume(cls, file_path: str) -> Dict[str, Any]:
        """
        Full extraction pipeline: extracts raw text and parses candidate profile information.
        """
        raw_text = cls.extract_text(file_path)
        
        name = cls.extract_name(raw_text)
        email = cls.extract_email(raw_text)
        phone = cls.extract_phone(raw_text)
        education = cls.extract_education(raw_text)
        experience = cls.extract_experience(raw_text)
        projects = cls.extract_projects(raw_text)
        
        return {
            "name": name,
            "email": email,
            "phone": phone,
            "education": education,
            "experience": experience,
            "projects": projects,
            "raw_text": raw_text
        }
