import os
import json
import re
from typing import Dict, List, Set, Any

class SkillExtractor:
    """
    Skill Extraction module based on regex pattern matching and semantic alias mapping.
    Loads skills from backend/data/skills_taxonomy.json and scans cleaned/raw resume text.
    """

    def __init__(self, taxonomy_file: str = None):
        if taxonomy_file is None:
            base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
            taxonomy_file = os.path.join(base_dir, 'data', 'skills_taxonomy.json')
        
        self.taxonomy_file = taxonomy_file
        self.categories: Dict[str, List[str]] = self._load_taxonomy()
        
        # Skill aliases for common alternate names
        self.aliases: Dict[str, str] = {
            "js": "JavaScript",
            "ts": "TypeScript",
            "reactjs": "React",
            "react.js": "React",
            "nodejs": "Node.js",
            "expressjs": "Express",
            "natural language processing": "NLP",
            "ml": "Machine Learning",
            "dl": "Deep Learning",
            "sklearn": "Scikit-learn",
            "scikit learn": "Scikit-learn",
            "postgres": "PostgreSQL",
            "amazon web services": "AWS",
            "google cloud": "GCP",
            "k8s": "Kubernetes"
        }

    def _load_taxonomy(self) -> Dict[str, List[str]]:
        """
        Loads skill taxonomy from JSON file or provides default dictionary.
        """
        if os.path.exists(self.taxonomy_file):
            try:
                with open(self.taxonomy_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except Exception:
                pass
        
        return {
            "Programming Languages": ["Python", "Java", "C", "C++", "C#", "JavaScript", "TypeScript"],
            "Web Technologies": ["HTML", "CSS", "React", "Node.js", "Express", "Spring Boot", "Django", "Flask"],
            "Data & AI": ["Machine Learning", "Deep Learning", "NLP", "TensorFlow", "PyTorch", "Pandas", "NumPy", "Scikit-learn"],
            "Databases": ["MySQL", "MongoDB", "PostgreSQL", "SQL", "Redis"]
        }

    def extract_skills(self, text: str) -> Dict[str, Any]:
        """
        Extracts skills from text, categorizes them, and returns both flat and grouped lists.
        """
        if not text:
            return {"skills": [], "categorized": {}, "count": 0}

        lowered_text = " " + text.lower() + " "
        detected_set: Set[str] = set()
        categorized_results: Dict[str, List[str]] = {}

        # 1. Check for known aliases first
        for alias, canonical in self.aliases.items():
            pattern = r'(?<!\w)' + re.escape(alias) + r'(?!\w)'
            if re.search(pattern, lowered_text, re.IGNORECASE):
                detected_set.add(canonical)

        # 2. Match against taxonomy
        for category, skills in self.categories.items():
            categorized_results[category] = []
            for skill in skills:
                # Special boundary pattern for C and C++
                if skill == "C":
                    pattern = r'(?<![\w\+\#])C(?![\w\+\#])'
                    # Require context of programming/languages/skills around 'C'
                    if re.search(pattern, text) and ("programming" in lowered_text or "language" in lowered_text or "c++" in lowered_text):
                        detected_set.add("C")
                        categorized_results[category].append("C")
                elif skill == "C++":
                    pattern = r'(?<!\w)C\+\+(?!\w)'
                    if re.search(pattern, text, re.IGNORECASE):
                        detected_set.add("C++")
                        categorized_results[category].append("C++")
                elif skill == "C#":
                    pattern = r'(?<!\w)C\#(?!\w)'
                    if re.search(pattern, text, re.IGNORECASE):
                        detected_set.add("C#")
                        categorized_results[category].append("C#")
                elif skill == "R":
                    pattern = r'(?<![\w\+\#])R(?![\w\+\#])'
                    if re.search(pattern, text) and ("python" in lowered_text or "data" in lowered_text or "statistics" in lowered_text):
                        detected_set.add("R")
                        categorized_results[category].append("R")
                else:
                    pattern = r'(?<!\w)' + re.escape(skill.lower()) + r'(?!\w)'
                    if re.search(pattern, lowered_text):
                        detected_set.add(skill)
                        if skill not in categorized_results[category]:
                            categorized_results[category].append(skill)

        # Ensure all detected skills are reflected in categories
        for skill in detected_set:
            placed = False
            for cat, skill_list in categorized_results.items():
                if skill in skill_list:
                    placed = True
                    break
            if not placed:
                categorized_results.setdefault("Other Skills", []).append(skill)

        # Clean empty categories
        filtered_categorized = {k: v for k, v in categorized_results.items() if len(v) > 0}

        sorted_skills = sorted(list(detected_set), key=lambda x: x.lower())

        return {
            "skills": sorted_skills,
            "categorized": filtered_categorized,
            "count": len(sorted_skills)
        }
