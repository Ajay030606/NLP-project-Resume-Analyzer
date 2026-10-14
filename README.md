# AI-Based Resume Screening and Job Recommendation System using NLP

A complete, production-ready Natural Language Processing (NLP) college mini-project that automates resume screening, candidate credential parsing, and intelligent job recommendation using TF-IDF vectorization and cosine similarity.

---

## 🌟 Project Highlights

- **End-to-End NLP Architecture**: Demonstrates real text preprocessing concepts (tokenization, stop word elimination, WordNet lemmatization, and regex-based named entity parsing).
- **Intelligent PDF Resume Parser**: Extracts text cleanly from uploaded `.pdf` documents using `pypdf`.
- **Customizable Skill Taxonomy**: Scans for 50+ programming languages, web technologies, AI/ML tools, and databases.
- **TF-IDF + Cosine Similarity Engine**: Computes high-dimensional mathematical vector angles between candidate resumes and 20 industry job descriptions.
- **Top 5 Job Recommendations & Skill-Gap Analysis**: Highlights matched skills in green and missing skills in amber with actionable advice.
- **Modern Full-Stack UI**: Responsive React interface with live Flask status indicator, progress bars, and circular score meters.

---

## 🏗️ Project Architecture & NLP Pipeline

```text
       Uploaded PDF Resume
              │
              ▼
      [pypdf Extractor]  ───> Extracts Name, Email, Phone, Education, Projects
              │
              ▼
      [Text Cleaning]    ───> Strips URLs, emails, phone numbers & non-alphanumeric chars
              │
              ▼
   [Lowercase Conversion] ───> Normalizes text case
              │
              ▼
     [Word Tokenization] ───> Segments text into individual tokens using NLTK
              │
              ▼
    [Stop Word Removal]  ───> Eliminates high-frequency stopwords (NLTK English corpus)
              │
              ▼
    [WordNet Lemmatizer] ───> Reduces tokens to their root dictionary form (lemmas)
              │
              ▼
      [Skill Extractor]  ───> Matches tokens against multi-category skills taxonomy
              │
              ▼
    [TF-IDF Vectorizer]  ───> Converts resume & 20 job descriptions into n-gram vectors
              │
              ▼
     [Cosine Similarity] ───> Calculates mathematical vector cosine angle
              │
              ▼
   [Recommendation API]  ───> Returns top 5 ranked jobs with matched and missing skills
```

---

## 📁 Project Directory Structure

```text
NLP Project/
│
├── backend/
│   ├── app.py                      # Flask Application Factory & Server entry point
│   ├── requirements.txt            # Python dependencies (Flask, NLTK, Scikit-learn, etc.)
│   ├── routes/
│   │   ├── resume_routes.py        # POST /api/resume/upload & /api/resume/analyze
│   │   └── job_routes.py           # GET /api/jobs, POST /api/jobs/match, POST /api/jobs/recommend
│   ├── services/
│   │   ├── pdf_extractor.py        # PDF text parser & entity extractor
│   │   ├── text_preprocessor.py    # NLTK tokenization, stop words, lemmatization
│   │   ├── skill_extractor.py      # Skill taxonomy matcher & categorizer
│   │   └── job_matcher.py          # TF-IDF vectorizer & Cosine similarity calculation
│   ├── data/
│   │   ├── jobs.json               # 20 curated job descriptions across tech roles
│   │   ├── skills_taxonomy.json    # Modular skills dictionary
│   │   └── sample_resume.pdf       # Test resume for instant demonstration
│   ├── utils/
│   │   └── file_helpers.py         # File validation & secure upload handling
│   └── uploads/                    # Temporary upload cache (.gitkeep)
│
├── frontend/
│   ├── src/
│   │   ├── components/             # Reusable UI widgets (Navbar, JobCard, ScoreGauge, SkillBadge)
│   │   ├── pages/                  # 4 Core Pages (Home, Upload, Dashboard, Recommendations)
│   │   ├── services/api.js         # Axios API client configured for http://127.0.0.1:5000/api
│   │   ├── index.css               # Modern, responsive design system
│   │   ├── App.jsx                 # Tab navigation & backend health monitor
│   │   └── main.jsx                # React DOM entry point
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
└── README.md
```

---

## 🚀 Running the Project Locally on Windows

Both the Backend and Frontend are already configured and running on your system! 

If you ever restart your machine or VS Code, here are the two commands:

### Terminal 1 — Backend (Flask API)
```powershell
cd backend
.\venv\Scripts\Activate.ps1
python app.py
```
> Running on: **http://127.0.0.1:5000**  
> Health Check: **http://127.0.0.1:5000/api/health**

### Terminal 2 — Frontend (React + Vite)
```powershell
cd frontend
npm run dev
```
> Running on: **http://localhost:5173**

---

## 🧪 How to Test

1. Open your browser and go to: **[http://localhost:5173](http://localhost:5173)**
2. Click **"Upload Resume"** in the top navigation.
3. Either:
   - Click **"Quick Demo: Load Sample Resume"** to test with 1-click instantly, OR
   - Drag and drop your own PDF resume (or `backend/data/sample_resume.pdf`).
4. Click **"Extract & Analyze Resume"**.
5. Explore the **Analysis Dashboard** to view your overall resume strength score, detected skills, and live NLTK tokenization metrics.
6. Open **Job Recommendations** to see your Top 5 matched roles, matched skills (in green), and missing skills (in amber).
