import sys
import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE
from PIL import Image, ImageDraw, ImageFont

def make_screenshots():
    os.makedirs("assets_ppt", exist_ok=True)
    
    # 1. Background Cover Graphic
    img1 = Image.new('RGB', (1920, 1080), color=(15, 23, 42))
    d1 = ImageDraw.Draw(img1)
    # Draw geometric glowing grid lines and shapes
    for y in range(0, 1080, 80):
        d1.line([(0, y), (1920, y)], fill=(30, 41, 59), width=1)
    for x in range(0, 1920, 80):
        d1.line([(x, 0), (x, 1080)], fill=(30, 41, 59), width=1)
    # glowing circles
    d1.ellipse([1200, -100, 2000, 700], fill=(29, 78, 216))
    d1.ellipse([1400, 300, 1850, 750], fill=(79, 70, 229))
    d1.ellipse([-200, 600, 500, 1300], fill=(14, 116, 144))
    img1.save("assets_ppt/bg_title.png")

    # 2. Mockup Home/Upload UI
    img2 = Image.new('RGB', (1200, 750), color=(248, 250, 252))
    d2 = ImageDraw.Draw(img2)
    # Top navbar
    d2.rectangle([(0, 0), (1200, 70)], fill=(255, 255, 255), outline=(226, 232, 240), width=2)
    d2.rectangle([(40, 20), (220, 50)], fill=(79, 70, 229))
    d2.rectangle([(900, 22), (1020, 48)], fill=(241, 245, 249))
    d2.rectangle([(1040, 22), (1160, 48)], fill=(16, 185, 129)) # Online badge
    
    # Upload Card container
    d2.rectangle([(150, 120), (1050, 680)], fill=(255, 255, 255), outline=(203, 213, 225), width=2)
    # Drag and drop dashed border area
    d2.rectangle([(220, 200), (980, 520)], fill=(241, 245, 249), outline=(99, 102, 241), width=3)
    # Buttons
    d2.rectangle([(300, 560), (580, 620)], fill=(79, 70, 229)) # Upload Button
    d2.rectangle([(620, 560), (900, 620)], fill=(15, 23, 42))  # Quick Demo Sample Resume Button
    img2.save("assets_ppt/mock_upload.png")

    # 3. Mockup Analysis & Job Recommendation UI
    img3 = Image.new('RGB', (1200, 750), color=(248, 250, 252))
    d3 = ImageDraw.Draw(img3)
    # Header
    d3.rectangle([(0, 0), (1200, 70)], fill=(255, 255, 255), outline=(226, 232, 240), width=2)
    d3.rectangle([(40, 20), (260, 50)], fill=(79, 70, 229))
    
    # Left Gauge card
    d3.rectangle([(80, 110), (450, 700)], fill=(255, 255, 255), outline=(226, 232, 240), width=2)
    d3.ellipse([(160, 170), (370, 380)], outline=(16, 185, 129), width=18) # 85% Score circle
    d3.rectangle([(110, 430), (420, 460)], fill=(241, 245, 249))
    d3.rectangle([(110, 480), (420, 510)], fill=(241, 245, 249))
    d3.rectangle([(110, 530), (420, 560)], fill=(241, 245, 249))

    # Right Job Recommendation Cards
    # Card 1 (ML Engineer 94% Match)
    d3.rectangle([(480, 110), (1130, 380)], fill=(255, 255, 255), outline=(99, 102, 241), width=2)
    d3.rectangle([(510, 140), (820, 175)], fill=(30, 41, 59))
    d3.rectangle([(1000, 135), (1100, 175)], fill=(16, 185, 129)) # 94% badge
    # Matched skill chips (Green)
    for i in range(4):
        d3.rectangle([(510 + i * 115, 260), (615 + i * 115, 295)], fill=(209, 250, 229), outline=(16, 185, 129), width=1)
    # Missing skill chips (Amber)
    for i in range(2):
        d3.rectangle([(510 + i * 115, 320), (615 + i * 115, 355)], fill=(254, 243, 199), outline=(245, 158, 11), width=1)

    # Card 2 (NLP Engineer 88% Match)
    d3.rectangle([(480, 410), (1130, 680)], fill=(255, 255, 255), outline=(226, 232, 240), width=2)
    d3.rectangle([(510, 440), (780, 475)], fill=(30, 41, 59))
    d3.rectangle([(1000, 435), (1100, 475)], fill=(59, 130, 246)) # 88% badge
    for i in range(3):
        d3.rectangle([(510 + i * 115, 560), (615 + i * 115, 595)], fill=(209, 250, 229), outline=(16, 185, 129), width=1)
    for i in range(2):
        d3.rectangle([(510 + i * 115, 620), (615 + i * 115, 655)], fill=(254, 243, 199), outline=(245, 158, 11), width=1)

    img3.save("assets_ppt/mock_results.png")
    print("Graphics generated.")

def build_presentation():
    prs = Presentation()
    prs.slide_width = Inches(13.333) # 16:9 Widescreen
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Colors
    NAVY = RGBColor(15, 23, 42)
    BLUE = RGBColor(37, 99, 235)
    INDIGO = RGBColor(79, 70, 229)
    GRAY = RGBColor(71, 85, 105)
    LIGHT_BG = RGBColor(248, 250, 252)
    WHITE = RGBColor(255, 255, 255)
    GREEN = RGBColor(16, 185, 129)
    CARD_BG = RGBColor(255, 255, 255)

    def set_slide_bg(slide, color):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = color
        bg.line.fill.background()
        return bg

    def add_header(slide, title, category="COLLEGE MINI-PROJECT PRESENTATION"):
        # Category tag
        cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.5), Inches(0.35))
        tf_cat = cat_box.text_frame
        tf_cat.word_wrap = True
        p_cat = tf_cat.paragraphs[0]
        p_cat.text = category.upper()
        p_cat.font.size = Pt(11)
        p_cat.font.bold = True
        p_cat.font.color.rgb = INDIGO

        # Main Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.7), Inches(11.5), Inches(0.65))
        tf_title = title_box.text_frame
        tf_title.word_wrap = True
        p_title = tf_title.paragraphs[0]
        p_title.text = title
        p_title.font.size = Pt(24)
        p_title.font.bold = True
        p_title.font.color.rgb = NAVY

    # ==========================================
    # SLIDE 1: Title Slide
    # ==========================================
    slide1 = prs.slides.add_slide(blank_layout)
    set_slide_bg(slide1, NAVY)
    
    # Add abstract background image
    if os.path.exists("assets_ppt/bg_title.png"):
        slide1.shapes.add_picture("assets_ppt/bg_title.png", 0, 0, width=Inches(13.333), height=Inches(7.5))

    # Dark overlay box for title contrast
    overlay = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.0), Inches(11.733), Inches(5.5))
    overlay.fill.solid()
    overlay.fill.fore_color.rgb = RGBColor(10, 15, 30)
    overlay.line.color.rgb = RGBColor(99, 102, 241)
    overlay.line.width = Pt(1.5)

    # Title box
    tb = slide1.shapes.add_textbox(Inches(1.2), Inches(1.4), Inches(10.9), Inches(2.2))
    tf = tb.text_frame
    tf.word_wrap = True
    
    p = tf.paragraphs[0]
    p.text = "AI-BASED RESUME SCREENING & JOB RECOMMENDATION SYSTEM"
    p.font.size = Pt(32)
    p.font.bold = True
    p.font.color.rgb = WHITE

    p2 = tf.add_paragraph()
    p2.text = "Natural Language Processing (NLP) • TF-IDF Vectorization • Cosine Similarity • Full-Stack Web Architecture"
    p2.font.size = Pt(15)
    p2.font.color.rgb = RGBColor(147, 197, 253)
    p2.space_before = Pt(10)

    # Details Box (Names, Mam/Guide, College)
    det_box = slide1.shapes.add_textbox(Inches(1.2), Inches(3.9), Inches(5.3), Inches(2.2))
    tf_det = det_box.text_frame
    tf_det.word_wrap = True
    
    p3 = tf_det.paragraphs[0]
    p3.text = "PRESENTED BY:"
    p3.font.size = Pt(13)
    p3.font.bold = True
    p3.font.color.rgb = RGBColor(99, 102, 241)
    
    p4 = tf_det.add_paragraph()
    p4.text = "• Ajay & Team Members\n  [Roll Nos: __________________]\n  Department of Computer Science & Engineering"
    p4.font.size = Pt(13)
    p4.font.color.rgb = RGBColor(226, 232, 240)
    p4.space_before = Pt(4)

    guide_box = slide1.shapes.add_textbox(Inches(6.8), Inches(3.9), Inches(5.3), Inches(2.2))
    tf_guide = guide_box.text_frame
    tf_guide.word_wrap = True
    
    p5 = tf_guide.paragraphs[0]
    p5.text = "PROJECT MENTOR / GUIDE:"
    p5.font.size = Pt(13)
    p5.font.bold = True
    p5.font.color.rgb = RGBColor(99, 102, 241)

    p6 = tf_guide.add_paragraph()
    p6.text = "• Guided by: [Insert Mam's Name / Faculty Guide]\n  Assistant Professor / Department of CSE\n  [College / University Name]"
    p6.font.size = Pt(13)
    p6.font.color.rgb = RGBColor(226, 232, 240)
    p6.space_before = Pt(4)

    # ==========================================
    # SLIDE 2: Introduction & Problem Statement
    # ==========================================
    slide2 = prs.slides.add_slide(blank_layout)
    set_slide_bg(slide2, LIGHT_BG)
    add_header(slide2, "Introduction & Problem Statement")

    # Card 1: The Problem
    card1 = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.5), Inches(5.6), Inches(5.4))
    card1.fill.solid()
    card1.fill.fore_color.rgb = WHITE
    card1.line.color.rgb = RGBColor(226, 232, 240)
    
    tb_c1 = slide2.shapes.add_textbox(Inches(1.1), Inches(1.8), Inches(5.0), Inches(4.8))
    tf_c1 = tb_c1.text_frame
    tf_c1.word_wrap = True
    p = tf_c1.paragraphs[0]
    p.text = "⚠️ The Existing Problem"
    p.font.size = Pt(20)
    p.font.bold = True
    p.font.color.rgb = RGBColor(225, 29, 72)
    
    bullets1 = [
        ("High Manual Volume", "Recruiters receive hundreds of resumes per job opening, making manual review slow, tedious, and prone to fatigue."),
        ("Human Bias & Fatigue", "Manual screening often suffers from subjective evaluation, inconsistent standards, and unconscious hiring biases."),
        ("Keyword Flaws", "Traditional keyword filters fail to understand synonyms, lemmatized forms, or technical context."),
        ("No Candidate Feedback", "Applicants receive no constructive feedback regarding missing skills or areas for career growth.")
    ]
    for title, desc in bullets1:
        p_b = tf_c1.add_paragraph()
        p_b.text = f"• {title}: {desc}"
        p_b.font.size = Pt(13)
        p_b.font.color.rgb = GRAY
        p_b.space_before = Pt(12)

    # Card 2: Proposed Solution
    card2 = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.5), Inches(5.7), Inches(5.4))
    card2.fill.solid()
    card2.fill.fore_color.rgb = WHITE
    card2.line.color.rgb = RGBColor(99, 102, 241)
    
    tb_c2 = slide2.shapes.add_textbox(Inches(7.1), Inches(1.8), Inches(5.1), Inches(4.8))
    tf_c2 = tb_c2.text_frame
    tf_c2.word_wrap = True
    p = tf_c2.paragraphs[0]
    p.text = "💡 Our Proposed AI Solution"
    p.font.size = Pt(20)
    p.font.bold = True
    p.font.color.rgb = INDIGO
    
    bullets2 = [
        ("Automated PDF Parsing", "Extracts candidate information, contact info, and credentials from unstructured PDFs automatically via pypdf."),
        ("Linguistic Preprocessing", "Applies NLTK tokenization, stop-word filtering, and WordNet lemmatization for normalized text representation."),
        ("Mathematical Alignment", "Computes high-dimensional vector similarity angles between candidate resumes and 20 industry job profiles."),
        ("Skill-Gap Intelligence", "Provides clear visual metrics: Top 5 matching jobs, matched skills (green badges), and missing skills (amber badges).")
    ]
    for title, desc in bullets2:
        p_b = tf_c2.add_paragraph()
        p_b.text = f"• {title}: {desc}"
        p_b.font.size = Pt(13)
        p_b.font.color.rgb = GRAY
        p_b.space_before = Pt(12)

    # ==========================================
    # SLIDE 3: Project Objectives
    # ==========================================
    slide3 = prs.slides.add_slide(blank_layout)
    set_slide_bg(slide3, LIGHT_BG)
    add_header(slide3, "Project Objectives & Scope")

    objectives = [
        ("01", "Automated Resume Extraction", "Extract raw unstructured text cleanly from PDF resumes using pypdf, isolating name, contact credentials, projects, and education."),
        ("02", "Complete NLP Preprocessing Pipeline", "Implement real text normalization using NLTK: tokenization, lowercase conversion, English stopword elimination, and WordNet lemmatization."),
        ("03", "Modular Skill Taxonomy Engine", "Scan and identify 50+ modern technical competencies across Programming, AI/ML, Cloud, Databases, and Web Development frameworks."),
        ("04", "Mathematical Vector Similarity", "Build a high-performance TF-IDF vectorizer and compute Cosine Similarity scores against 20 benchmark industry tech roles."),
        ("05", "Interactive Full-Stack Web Portal", "Deliver a responsive React.js web interface featuring live backend health check, resume score gauges, and transparent skill-gap analysis.")
    ]

    for idx, (num, title, desc) in enumerate(objectives):
        col = idx % 3
        row = idx // 3
        
        w = Inches(3.7) if row == 0 else Inches(5.7)
        x = Inches(0.8 + col * 4.0) if row == 0 else Inches(0.8 + (idx - 3) * 6.0)
        y = Inches(1.6 + row * 2.7)
        h = Inches(2.3)

        card = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, w, h)
        card.fill.solid()
        card.fill.fore_color.rgb = WHITE
        card.line.color.rgb = RGBColor(226, 232, 240)

        tb_o = slide3.shapes.add_textbox(x + Inches(0.2), y + Inches(0.2), w - Inches(0.4), h - Inches(0.4))
        tf_o = tb_o.text_frame
        tf_o.word_wrap = True
        
        p = tf_o.paragraphs[0]
        p.text = f"🎯 Objective {num}"
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = INDIGO

        p_t = tf_o.add_paragraph()
        p_t.text = title
        p_t.font.size = Pt(15)
        p_t.font.bold = True
        p_t.font.color.rgb = NAVY
        p_t.space_before = Pt(4)

        p_d = tf_o.add_paragraph()
        p_d.text = desc
        p_d.font.size = Pt(11)
        p_d.font.color.rgb = GRAY
        p_d.space_before = Pt(6)

    # ==========================================
    # SLIDE 4: Website Flow & NLP Pipeline (with Screenshot 1)
    # ==========================================
    slide4 = prs.slides.add_slide(blank_layout)
    set_slide_bg(slide4, LIGHT_BG)
    add_header(slide4, "System Architecture & Website Flow")

    # Left: Step-by-Step Flow
    steps_card = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.4), Inches(5.5), Inches(5.6))
    steps_card.fill.solid()
    steps_card.fill.fore_color.rgb = WHITE
    steps_card.line.color.rgb = RGBColor(226, 232, 240)

    tb_s = slide4.shapes.add_textbox(Inches(1.0), Inches(1.6), Inches(5.1), Inches(5.2))
    tf_s = tb_s.text_frame
    tf_s.word_wrap = True
    
    p = tf_s.paragraphs[0]
    p.text = "🔄 End-to-End Processing Flow"
    p.font.size = Pt(17)
    p.font.bold = True
    p.font.color.rgb = INDIGO

    flow_items = [
        ("1. PDF Upload / Demo", "User uploads resume (.pdf) or clicks 'Load Sample Resume' on React UI."),
        ("2. Text Extraction", "pypdf extracts text streams; Regex parses phone, email, and links."),
        ("3. NLTK Text Cleaning", "Lowercased, tokenized, punctuation/stopwords removed, lemmatized to roots."),
        ("4. Skill Taxonomy Scan", "Tokens matched against multi-category 50+ technology dictionary."),
        ("5. TF-IDF & Cosine Similarity", "Vectorized into high-dimensional matrix & calculated against 20 curated jobs."),
        ("6. Dashboard & Insights", "React UI renders score gauges, top 5 ranked jobs, and missing skill advice.")
    ]
    for num_t, desc in flow_items:
        p_step = tf_s.add_paragraph()
        p_step.text = f"• {num_t}: {desc}"
        p_step.font.size = Pt(11)
        p_step.font.color.rgb = NAVY
        p_step.space_before = Pt(8)

    # Right: Website UI Screenshot (Upload / Home Screen)
    if os.path.exists("assets_ppt/mock_upload.png"):
        slide4.shapes.add_picture("assets_ppt/mock_upload.png", Inches(6.6), Inches(1.4), width=Inches(5.9), height=Inches(3.7))
    
    # Caption box under image
    cap_box = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.6), Inches(5.3), Inches(5.9), Inches(1.7))
    cap_box.fill.solid()
    cap_box.fill.fore_color.rgb = WHITE
    cap_box.line.color.rgb = RGBColor(203, 213, 225)
    
    tb_cap = slide4.shapes.add_textbox(Inches(6.8), Inches(5.4), Inches(5.5), Inches(1.5))
    tf_cap = tb_cap.text_frame
    tf_cap.word_wrap = True
    p_c1 = tf_cap.paragraphs[0]
    p_c1.text = "🖥️ Live Application UI (Upload & Demo)"
    p_c1.font.size = Pt(13)
    p_c1.font.bold = True
    p_c1.font.color.rgb = INDIGO

    p_c2 = tf_cap.add_paragraph()
    p_c2.text = "The frontend runs on http://localhost:5173 with direct API communication to the Flask backend on port 5000. Features instant 1-click sample demo testing."
    p_c2.font.size = Pt(10.5)
    p_c2.font.color.rgb = GRAY
    p_c2.space_before = Pt(4)

    # ==========================================
    # SLIDE 5: Technology Stack & Recommendations (with Screenshot 2)
    # ==========================================
    slide5 = prs.slides.add_slide(blank_layout)
    set_slide_bg(slide5, LIGHT_BG)
    add_header(slide5, "Technologies Used & Job Recommendation Results")

    # Left: Tech Stack cards
    tech_box = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.4), Inches(5.5), Inches(5.6))
    tech_box.fill.solid()
    tech_box.fill.fore_color.rgb = WHITE
    tech_box.line.color.rgb = RGBColor(226, 232, 240)

    tb_t = slide5.shapes.add_textbox(Inches(1.0), Inches(1.6), Inches(5.1), Inches(5.2))
    tf_t = tb_t.text_frame
    tf_t.word_wrap = True
    
    p = tf_t.paragraphs[0]
    p.text = "🛠️ Technologies & Libraries"
    p.font.size = Pt(17)
    p.font.bold = True
    p.font.color.rgb = INDIGO

    tech_items = [
        ("Frontend", "React 18, Vite, Lucide-React Icons, Responsive CSS Design System"),
        ("Backend Server", "Python 3, Flask REST API, Flask-CORS, Werkzeug file security"),
        ("NLP Engine", "NLTK (punkt, stopwords corpus, WordNet Lemmatizer)"),
        ("Machine Learning", "Scikit-Learn (TfidfVectorizer, cosine_similarity matrix)"),
        ("PDF Extraction", "pypdf library for robust local PDF document stream extraction"),
        ("Dataset & Taxonomy", "20 Curated Tech Role Descriptions & 50+ Structured Skills Taxonomy")
    ]
    for name, stack in tech_items:
        p_t = tf_t.add_paragraph()
        p_t.text = f"• {name}: {stack}"
        p_t.font.size = Pt(11)
        p_t.font.color.rgb = NAVY
        p_t.space_before = Pt(8)

    # Right: Results / Recommendation Screenshot
    if os.path.exists("assets_ppt/mock_results.png"):
        slide5.shapes.add_picture("assets_ppt/mock_results.png", Inches(6.6), Inches(1.4), width=Inches(5.9), height=Inches(3.7))

    # Caption box
    res_cap = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.6), Inches(5.3), Inches(5.9), Inches(1.7))
    res_cap.fill.solid()
    res_cap.fill.fore_color.rgb = WHITE
    res_cap.line.color.rgb = RGBColor(203, 213, 225)
    
    tb_rc = slide5.shapes.add_textbox(Inches(6.8), Inches(5.4), Inches(5.5), Inches(1.5))
    tf_rc = tb_rc.text_frame
    tf_rc.word_wrap = True
    p_rc1 = tf_rc.paragraphs[0]
    p_rc1.text = "📊 Live Recommendation & Skill-Gap Analysis"
    p_rc1.font.size = Pt(13)
    p_rc1.font.bold = True
    p_rc1.font.color.rgb = GREEN

    p_rc2 = tf_rc.add_paragraph()
    p_rc2.text = "Calculates exact similarity percentages (e.g. 94% ML Engineer). Clearly displays Matched Skills in Green and Missing Skills in Amber to help candidates upskill."
    p_rc2.font.size = Pt(10.5)
    p_rc2.font.color.rgb = GRAY
    p_rc2.space_before = Pt(4)

    # ==========================================
    # SLIDE 6: Conclusion, Future Scope & Q&A
    # ==========================================
    slide6 = prs.slides.add_slide(blank_layout)
    set_slide_bg(slide6, NAVY)

    # Future Scope Box (Left)
    f_card = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.2), Inches(5.6), Inches(5.4))
    f_card.fill.solid()
    f_card.fill.fore_color.rgb = RGBColor(24, 34, 53)
    f_card.line.color.rgb = RGBColor(79, 70, 229)
    
    tb_f = slide6.shapes.add_textbox(Inches(1.1), Inches(1.5), Inches(5.0), Inches(4.8))
    tf_f = tb_f.text_frame
    tf_f.word_wrap = True
    
    p = tf_f.paragraphs[0]
    p.text = "🚀 Future Scope & Enhancements"
    p.font.size = Pt(20)
    p.font.bold = True
    p.font.color.rgb = RGBColor(147, 197, 253)

    future_points = [
        ("Transformer Models (BERT/LLMs)", "Upgrade from TF-IDF to contextual embeddings (Sentence-BERT) for deep semantic comprehension."),
        ("Live Job Scraping & API", "Integrate LinkedIn and Indeed APIs for real-time live job market synchronization."),
        ("Multi-format Support", "Extend parser to accept DOCX, RTF, and scanned image resumes via OCR (Tesseract)."),
        ("Automated Feedback Generator", "Generate tailored resume improvement suggestions using Generative AI.")
    ]
    for t, d in future_points:
        p_fut = tf_f.add_paragraph()
        p_fut.text = f"• {t}: {d}"
        p_fut.font.size = Pt(12)
        p_fut.font.color.rgb = RGBColor(203, 213, 225)
        p_fut.space_before = Pt(12)

    # Right Box: Thank you & Questions
    t_card = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.2), Inches(5.7), Inches(5.4))
    t_card.fill.solid()
    t_card.fill.fore_color.rgb = RGBColor(24, 34, 53)
    t_card.line.color.rgb = RGBColor(16, 185, 129)
    
    tb_t = slide6.shapes.add_textbox(Inches(7.1), Inches(2.2), Inches(5.1), Inches(4.0))
    tf_t = tb_t.text_frame
    tf_t.word_wrap = True
    
    p = tf_t.paragraphs[0]
    p.text = "THANK YOU!"
    p.alignment = PP_ALIGN.CENTER
    p.font.size = Pt(36)
    p.font.bold = True
    p.font.color.rgb = WHITE

    p_sub = tf_t.add_paragraph()
    p_sub.text = "Any Questions or Suggestions?"
    p_sub.alignment = PP_ALIGN.CENTER
    p_sub.font.size = Pt(20)
    p_sub.font.bold = True
    p_sub.font.color.rgb = RGBColor(52, 211, 153)
    p_sub.space_before = Pt(14)

    p_team = tf_t.add_paragraph()
    p_team.text = "AI-Based Resume Screening & Job Recommendation System\nProject Demo is available on localhost:5173"
    p_team.alignment = PP_ALIGN.CENTER
    p_team.font.size = Pt(13)
    p_team.font.color.rgb = RGBColor(148, 163, 184)
    p_team.space_before = Pt(24)

    prs.save("Resume_Screening_NLP_Presentation.pptx")
    print("Presentation saved successfully as Resume_Screening_NLP_Presentation.pptx")

if __name__ == "__main__":
    make_screenshots()
    build_presentation()
