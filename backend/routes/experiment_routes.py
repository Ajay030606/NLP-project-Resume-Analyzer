from flask import Blueprint, request, jsonify
from services.nlp_experiments import NLPExperimentsService

experiment_bp = Blueprint('experiment_bp', __name__)
exp_service = NLPExperimentsService()

EXPERIMENT_CATALOG = [
    {
        "id": "01",
        "title": "Text Preprocessing: Tokenization, Script Validation, and Stop-Word Removal",
        "co": "CO1",
        "description": "Validates Unicode character scripts, tokenizes sentences/words, and eliminates non-discriminative stop words.",
        "default_input": "Welcome to Ajay's AI Resume Screening & Job Recommendation System! Created using Python, NLTK, React, and MongoDB."
    },
    {
        "id": "02",
        "title": "Stemming and Lemmatization Techniques: Comparison and Analysis",
        "co": "CO1",
        "description": "Compares rule-based Porter and Lancaster stemmers against dictionary-based WordNet lemmatization.",
        "default_input": "studies studying developer developed developing models optimization easily better connectivity"
    },
    {
        "id": "03",
        "title": "Minimum Edit Distance Algorithm for Spelling Correction",
        "co": "CO1, CO2",
        "description": "Dynamic Programming Levenshtein distance matrix calculation and fuzzy spelling correction for technical resume skills.",
        "default_source": "pithon",
        "default_target": "python"
    },
    {
        "id": "04",
        "title": "N-gram Language Models and Perplexity Evaluation",
        "co": "CO2",
        "description": "Builds unigram, bigram, and trigram probability tables, applies Laplace smoothing, and evaluates sequence perplexity.",
        "default_corpus": "natural language processing is fun. natural language processing enables computers to understand text. machine learning and natural language processing are essential skills for ai engineers.",
        "default_test": "natural language processing enables machine learning models"
    },
    {
        "id": "05",
        "title": "Part-of-Speech (POS) Tagging: Rule-Based vs. Probabilistic Approaches",
        "co": "CO3",
        "description": "Evaluates tagging agreement and accuracy between regex suffix rule tagger and probabilistic Averaged Perceptron tagger.",
        "default_sentence": "Ajay developed a smart machine learning model for automated resume screening."
    },
    {
        "id": "06",
        "title": "Syntactic Parsing using a Context-Free Grammar (CFG)",
        "co": "CO2",
        "description": "Formal grammar rules (S -> NP VP) and top-down/bottom-up chart parsing generating hierarchical syntactic parse trees.",
        "default_sentence": "the engineer builds a model"
    },
    {
        "id": "07",
        "title": "Named Entity Recognition (NER) and Noun Phrase Chunking",
        "co": "CO4",
        "description": "Extracts grammatical noun phrase chunks and classifies real-world entities (PERSON, ORGANIZATION, GPE).",
        "default_text": "Ajay Jaiswal worked at Google in Bengaluru developing Python and NLP software."
    },
    {
        "id": "08",
        "title": "Word Sense Disambiguation using Lesk Algorithm and WordNet Relations",
        "co": "CO4",
        "description": "Resolves contextual polysemy using the Lesk overlap algorithm and discovers WordNet synonyms, antonyms, and hypernyms.",
        "default_word": "bank",
        "default_sentence": "I deposited money into my account at the bank."
    },
    {
        "id": "09",
        "title": "Text Classification using Naïve Bayes and SVM for Sentiment Analysis",
        "co": "CO2, CO5",
        "description": "Trains and evaluates Multinomial Naive Bayes and Linear SVM models for candidate sentiment/feedback classification.",
        "default_review": "Candidate shows excellent machine learning skills and impressive problem solving ability."
    }
]

@experiment_bp.route('', methods=['GET'])
def list_experiments():
    """
    GET /api/experiments
    Returns catalogue of all 9 college NLP experiments.
    """
    return jsonify({
        "status": "success",
        "total": len(EXPERIMENT_CATALOG),
        "data": EXPERIMENT_CATALOG
    }), 200

@experiment_bp.route('/run/<exp_id>', methods=['POST'])
def run_experiment(exp_id: str):
    """
    POST /api/experiments/run/<exp_id>
    Executes specified experiment with provided or default parameters.
    """
    payload = request.get_json(silent=True) or {}
    
    try:
        if exp_id == "01" or exp_id == "1":
            text = payload.get("text", "")
            result = exp_service.experiment_01_preprocessing(text)
        elif exp_id == "02" or exp_id == "2":
            text = payload.get("text", "")
            result = exp_service.experiment_02_stemming_lemmatization(text)
        elif exp_id == "03" or exp_id == "3":
            source = payload.get("source", "")
            target = payload.get("target", "")
            result = exp_service.experiment_03_edit_distance(source, target)
        elif exp_id == "04" or exp_id == "4":
            corpus = payload.get("corpus", "")
            test = payload.get("test_sentence", "")
            result = exp_service.experiment_04_ngrams_perplexity(corpus, test)
        elif exp_id == "05" or exp_id == "5":
            sentence = payload.get("sentence", "")
            result = exp_service.experiment_05_pos_tagging(sentence)
        elif exp_id == "06" or exp_id == "6":
            sentence = payload.get("sentence", "")
            result = exp_service.experiment_06_cfg_parsing(sentence)
        elif exp_id == "07" or exp_id == "7":
            text = payload.get("text", "")
            result = exp_service.experiment_07_ner_chunking(text)
        elif exp_id == "08" or exp_id == "8":
            word = payload.get("word", "bank")
            sentence = payload.get("sentence", "")
            result = exp_service.experiment_08_wsd_wordnet(word, sentence)
        elif exp_id == "09" or exp_id == "9":
            review = payload.get("review", "")
            result = exp_service.experiment_09_text_classification(review)
        else:
            return jsonify({
                "status": "error",
                "message": f"Experiment id '{exp_id}' is invalid. Supported IDs are 01 to 09."
            }), 404

        return jsonify({
            "status": "success",
            "data": result
        }), 200

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Experiment execution failed: {str(e)}"
        }), 500
