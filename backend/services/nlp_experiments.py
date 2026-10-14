import re
import math
import unicodedata
from collections import Counter, defaultdict
from typing import Dict, Any, List, Tuple

import nltk
from nltk.corpus import stopwords, wordnet as wn
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.stem import PorterStemmer, LancasterStemmer, WordNetLemmatizer
from nltk.wsd import lesk
from nltk.tag import RegexpTagger

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB
from sklearn.svm import LinearSVC
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, confusion_matrix

class NLPExperimentsService:
    """
    Complete implementation of College NLP Lab Experiments (Exp 01 - Exp 09).
    Designed to demonstrate practical concepts aligned with Course Outcomes CO1-CO5.
    """

    def __init__(self):
        self.stop_words = set(stopwords.words('english'))
        self.porter = PorterStemmer()
        self.lancaster = LancasterStemmer()
        self.lemmatizer = WordNetLemmatizer()

    # -------------------------------------------------------------------------
    # EXPERIMENT 01 (CO1): Text Preprocessing (Tokenization, Script Validation, Stopwords)
    # -------------------------------------------------------------------------
    def experiment_01_preprocessing(self, text: str) -> Dict[str, Any]:
        """
        Tokenization, script validation (Unicode/ASCII/Language script), and stop-word removal.
        """
        if not text:
            text = "Welcome to AI Resume Screening & Job Recommendation! Here is Ajay's CV: ajay@example.com, built with Python & React."

        # 1. Script Validation
        script_counter = Counter()
        non_ascii_chars = []
        for char in text:
            if char.isspace() or unicodedata.category(char).startswith('P'):
                continue
            name = unicodedata.name(char, 'UNKNOWN')
            script = name.split()[0] if name != 'UNKNOWN' else 'SPECIAL'
            script_counter[script] += 1
            if ord(char) > 127:
                non_ascii_chars.append(char)

        primary_script = script_counter.most_common(1)[0][0] if script_counter else 'LATIN'
        is_valid_latin = len(non_ascii_chars) == 0

        # 2. Tokenization
        sentences = sent_tokenize(text)
        words = word_tokenize(text)

        # 3. Stop Word Removal
        filtered_tokens = [w for w in words if w.lower() not in self.stop_words and w.isalnum()]
        removed_stopwords = [w for w in words if w.lower() in self.stop_words]

        return {
            "experiment": "01",
            "title": "Text Preprocessing: Tokenization, Script Validation, and Stop-Word Removal",
            "co": "CO1",
            "input_text": text,
            "script_validation": {
                "primary_script": primary_script,
                "is_valid_latin_ascii": is_valid_latin,
                "non_ascii_characters_found": list(set(non_ascii_chars)),
                "detected_script_distribution": dict(script_counter.most_common(5))
            },
            "tokenization": {
                "sentence_count": len(sentences),
                "sentences": sentences,
                "word_token_count": len(words),
                "word_tokens": words[:30]
            },
            "stopwords_removal": {
                "original_word_count": len(words),
                "stopwords_removed_count": len(removed_stopwords),
                "retained_tokens_count": len(filtered_tokens),
                "removed_stopwords_sample": list(set(removed_stopwords))[:15],
                "cleaned_tokens_sample": filtered_tokens[:25]
            },
            "educational_notes": (
                "Script validation ensures documents adhere to target character encodings (e.g. ASCII/Latin). "
                "Tokenization splits text into sentences and word atoms. "
                "Stop-word filtering removes frequent grammatical words that contain little semantic topic signal."
            )
        }

    # -------------------------------------------------------------------------
    # EXPERIMENT 02 (CO1): Stemming vs. Lemmatization
    # -------------------------------------------------------------------------
    def experiment_02_stemming_lemmatization(self, text: str) -> Dict[str, Any]:
        """
        Compare Porter Stemmer, Lancaster Stemmer, and WordNet Lemmatizer.
        """
        if not text:
            text = "studies studying developer developed developing models optimization easily better connectivity"

        tokens = [t.lower() for t in word_tokenize(text) if t.isalnum()]

        comparison_table = []
        for word in tokens:
            porter_stem = self.porter.stem(word)
            lancaster_stem = self.lancaster.stem(word)
            lemmatized_noun = self.lemmatizer.lemmatize(word, pos='n')
            lemmatized_verb = self.lemmatizer.lemmatize(word, pos='v')

            comparison_table.append({
                "original": word,
                "porter_stem": porter_stem,
                "lancaster_stem": lancaster_stem,
                "lemmatized_noun": lemmatized_noun,
                "lemmatized_verb": lemmatized_verb,
                "is_stem_real_word": wn.synsets(porter_stem) != []
            })

        return {
            "experiment": "02",
            "title": "Stemming and Lemmatization Techniques: Comparison and Analysis",
            "co": "CO1",
            "input_words": tokens,
            "comparison_table": comparison_table,
            "analysis": {
                "porter_characteristics": "Rule-based heuristic that removes common suffixes. Faster but can create non-words (e.g., 'easili').",
                "lancaster_characteristics": "Aggressive stemming algorithm. Prone to over-stemming (e.g., reduces words excessively).",
                "lemmatization_characteristics": "Uses morphological vocabulary analysis (WordNet) to return the actual dictionary root lemma based on part-of-speech context."
            },
            "educational_notes": (
                "Stemming strips suffixes mechanically without dictionary verification. "
                "Lemmatization uses morphological analysis with WordNet, preserving linguistic integrity."
            )
        }

    # -------------------------------------------------------------------------
    # EXPERIMENT 03 (CO1, CO2): Minimum Edit Distance (Levenshtein Distance)
    # -------------------------------------------------------------------------
    def experiment_03_edit_distance(self, source: str = "pithon", target: str = "python") -> Dict[str, Any]:
        """
        Dynamic Programming Wagner-Fischer algorithm for Minimum Edit Distance.
        """
        source = (source or "pithon").strip().lower()
        target = (target or "python").strip().lower()

        m, n = len(source), len(target)
        dp = [[0] * (n + 1) for _ in range(m + 1)]

        # Initialize base cases
        for i in range(m + 1):
            dp[i][0] = i
        for j in range(n + 1):
            dp[0][j] = j

        # Fill table
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if source[i - 1] == target[j - 1]:
                    cost = 0
                else:
                    cost = 1  # substitution cost = 1 (or 2 in Levenshtein with standard weights)

                dp[i][j] = min(
                    dp[i - 1][j] + 1,      # Deletion
                    dp[i][j - 1] + 1,      # Insertion
                    dp[i - 1][j - 1] + cost # Substitution
                )

        min_distance = dp[m][n]

        # Common resume technical skill spelling corrections
        sample_corrections = []
        candidate_typos = ["machne", "recat", "javascrpt", "sqll", "flsk", "pithon"]
        known_skills = ["machine", "react", "javascript", "sql", "flask", "python"]

        for typo in candidate_typos:
            closest_skill = min(known_skills, key=lambda skill: self._compute_distance(typo, skill))
            dist = self._compute_distance(typo, closest_skill)
            sample_corrections.append({
                "typo": typo,
                "suggested_correction": closest_skill,
                "edit_distance": dist
            })

        return {
            "experiment": "03",
            "title": "Minimum Edit Distance Algorithm for Spelling Correction",
            "co": "CO1, CO2",
            "source_word": source,
            "target_word": target,
            "minimum_edit_distance": min_distance,
            "dp_matrix": dp,
            "matrix_rows": ["#"] + list(source),
            "matrix_cols": ["#"] + list(target),
            "sample_skill_corrections": sample_corrections,
            "educational_notes": (
                "Minimum Edit Distance calculates the smallest number of character edit operations "
                "(insertion, deletion, substitution) needed to convert string A into string B. "
                "It is the mathematical foundation for spell checkers, query correction, and resume skill fuzzy matching."
            )
        }

    def _compute_distance(self, s1: str, s2: str) -> int:
        m, n = len(s1), len(s2)
        dp = [[0] * (n + 1) for _ in range(m + 1)]
        for i in range(m + 1): dp[i][0] = i
        for j in range(n + 1): dp[0][j] = j
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                cost = 0 if s1[i - 1] == s2[j - 1] else 1
                dp[i][j] = min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost)
        return dp[m][n]

    # -------------------------------------------------------------------------
    # EXPERIMENT 04 (CO2): N-gram Language Models and Perplexity
    # -------------------------------------------------------------------------
    def experiment_04_ngrams_perplexity(self, text: str = None, test_sentence: str = None) -> Dict[str, Any]:
        """
        Unigram, Bigram, Trigram frequency modeling, probability estimation with Laplace smoothing, and perplexity.
        """
        if not text:
            text = (
                "natural language processing is fun. natural language processing enables computers to understand text. "
                "machine learning and natural language processing are essential skills for ai engineers. "
                "ai engineers build machine learning models using python."
            )
        if not test_sentence:
            test_sentence = "natural language processing enables machine learning models"

        tokens = [t.lower() for t in word_tokenize(text) if t.isalnum()]
        unigrams = Counter(tokens)
        V = len(unigrams)
        N = len(tokens)

        # Bigrams
        bigrams = Counter(zip(tokens[:-1], tokens[1:]))
        # Trigrams
        trigrams = Counter(zip(tokens[:-2], tokens[1:-1], tokens[2:]))

        # Evaluate Test Sentence using Bigram model with Laplace (Add-1) Smoothing
        test_tokens = [t.lower() for t in word_tokenize(test_sentence) if t.isalnum()]
        test_bigrams = list(zip(test_tokens[:-1], test_tokens[1:]))

        log_prob_sum = 0.0
        step_probabilities = []

        for w1, w2 in test_bigrams:
            count_w1_w2 = bigrams.get((w1, w2), 0)
            count_w1 = unigrams.get(w1, 0)
            # Laplace smoothing: P(w2|w1) = (C(w1, w2) + 1) / (C(w1) + V)
            prob = (count_w1_w2 + 1) / (count_w1 + V)
            log_prob = math.log2(prob)
            log_prob_sum += log_prob

            step_probabilities.append({
                "bigram": f"({w1}, {w2})",
                "count": count_w1_w2,
                "context_count": count_w1,
                "smoothed_probability": round(prob, 4)
            })

        # Perplexity calculation: PP(W) = 2 ^ (-1/k * sum(log2(P)))
        k = len(test_bigrams) if test_bigrams else 1
        perplexity = 2 ** (-log_prob_sum / k) if k > 0 else 0.0

        return {
            "experiment": "04",
            "title": "N-gram Language Models and Perplexity Evaluation",
            "co": "CO2",
            "vocabulary_size": V,
            "total_corpus_tokens": N,
            "top_unigrams": [{"token": k, "count": v} for k, v in unigrams.most_common(8)],
            "top_bigrams": [{"bigram": f"{k[0]} {k[1]}", "count": v} for k, v in bigrams.most_common(8)],
            "top_trigrams": [{"trigram": f"{k[0]} {k[1]} {k[2]}", "count": v} for k, v in trigrams.most_common(6)],
            "test_sentence": test_sentence,
            "bigram_step_probabilities": step_probabilities,
            "perplexity": round(perplexity, 2),
            "educational_notes": (
                "N-gram language models predict the probability of word sequences. "
                "Laplace Add-1 smoothing prevents zero-probability assignments for unseen combinations. "
                "Perplexity measures how well the model predicts sample text: a lower perplexity score indicates higher predictive confidence."
            )
        }

    # -------------------------------------------------------------------------
    # EXPERIMENT 05 (CO3): Part-of-Speech (POS) Tagging (Rule-based vs. Probabilistic)
    # -------------------------------------------------------------------------
    def experiment_05_pos_tagging(self, sentence: str = None) -> Dict[str, Any]:
        """
        Compare Rule-Based POS Tagger (RegexTagger) with Probabilistic / Pretrained Averaged Perceptron Tagger.
        """
        if not sentence:
            sentence = "Ajay developed a smart machine learning model for automated resume screening."

        tokens = word_tokenize(sentence)

        # 1. Rule-Based Tagger (Regex rules)
        patterns = [
            (r'.*ing$', 'VBG'),               # gerunds
            (r'.*ed$', 'VBD'),                # simple past
            (r'.*es$', 'VBZ'),                # 3rd singular present
            (r'.*ould$', 'MD'),               # modals
            (r'.*\'s$', 'NN$'),               # possessive nouns
            (r'.*s$', 'NNS'),                 # plural nouns
            (r'^-?[0-9]+(\.[0-9]+)?$', 'CD'), # cardinal numbers
            (r'^[A-Z].*', 'NNP'),             # proper nouns
            (r'.*', 'NN')                     # default noun
        ]
        rule_tagger = RegexpTagger(patterns)
        rule_based_tags = rule_tagger.tag(tokens)

        # 2. Probabilistic / Machine Learning Tagger (NLTK Averaged Perceptron)
        probabilistic_tags = nltk.pos_tag(tokens)

        # Compare accuracy / agreements
        agreements = 0
        comparison = []
        for (w1, r_tag), (w2, p_tag) in zip(rule_based_tags, probabilistic_tags):
            match = (r_tag == p_tag)
            if match: agreements += 1
            comparison.append({
                "word": w1,
                "rule_based_tag": r_tag,
                "probabilistic_tag": p_tag,
                "agreement": match
            })

        agreement_rate = round((agreements / len(tokens)) * 100, 1) if tokens else 0.0

        return {
            "experiment": "05",
            "title": "Part-of-Speech Tagging: Rule-Based vs. Probabilistic Approaches",
            "co": "CO3",
            "sentence": sentence,
            "comparison": comparison,
            "agreement_rate": f"{agreement_rate}%",
            "pos_glossary": {
                "NNP": "Proper Noun, Singular",
                "VBD": "Verb, Past Tense",
                "DT": "Determiner",
                "JJ": "Adjective",
                "NN": "Noun, Singular",
                "IN": "Preposition / Conjunction",
                "VBG": "Verb, Gerund / Present Participle"
            },
            "educational_notes": (
                "Rule-based taggers apply morphological suffix heuristics, but fail with contextual ambiguities. "
                "Probabilistic taggers use statistical probabilities and sequence features to achieve higher tagging accuracy."
            )
        }

    # -------------------------------------------------------------------------
    # EXPERIMENT 06 (CO2): Syntactic Parsing with Context-Free Grammar (CFG)
    # -------------------------------------------------------------------------
    def experiment_06_cfg_parsing(self, sentence: str = None) -> Dict[str, Any]:
        """
        Syntactic parsing using Context-Free Grammar (CFG) with ChartParser.
        """
        cfg_grammar_text = """
            S -> NP VP
            NP -> Det N | N | Det Adj N | NP PP
            VP -> V NP | V | VP PP
            PP -> P NP
            Det -> 'the' | 'a'
            Adj -> 'smart' | 'automated'
            N -> 'engineer' | 'resume' | 'model' | 'python'
            V -> 'builds' | 'evaluates' | 'developed'
            P -> 'with' | 'for'
        """

        if not sentence:
            sentence = "the engineer builds a model"

        tokens = [t.lower() for t in sentence.split()]
        grammar = nltk.CFG.fromstring(cfg_grammar_text)
        chart_parser = nltk.ChartParser(grammar)

        trees = []
        try:
            for tree in chart_parser.parse(tokens):
                trees.append(str(tree))
        except Exception as e:
            trees = [f"Parsing error: {str(e)}"]

        return {
            "experiment": "06",
            "title": "Syntactic Parsing using Context-Free Grammar (CFG)",
            "co": "CO2",
            "sentence": sentence,
            "grammar_rules": [r.strip() for r in cfg_grammar_text.strip().split("\n") if r.strip()],
            "number_of_parses": len(trees),
            "parse_tree": trees[0] if trees else "No valid parse tree found for the given grammar rules.",
            "educational_notes": (
                "A Context-Free Grammar (CFG) mathematically formalizes the syntactic hierarchy of natural language. "
                "Parsing maps linear token sequences into structured syntactic parse trees ($S \\rightarrow NP + VP$)."
            )
        }

    # -------------------------------------------------------------------------
    # EXPERIMENT 07 (CO4): Named Entity Recognition (NER) and Noun Phrase Chunking
    # -------------------------------------------------------------------------
    def experiment_07_ner_chunking(self, text: str = None) -> Dict[str, Any]:
        """
        Noun Phrase (NP) chunking and Named Entity Recognition (NER) using NLTK.
        """
        if not text:
            text = "Ajay Jaiswal worked at Google in Bengaluru developing Python and NLP software."

        tokens = word_tokenize(text)
        pos_tags = nltk.pos_tag(tokens)

        # 1. Noun Phrase Chunking with RegexpParser
        chunk_grammar = r"""
            NP: {<DT>?<JJ>*<NN.*>+}   # Chunk determiner, adjective, and nouns
            VP: {<VB.*><NP|PP>*}      # Chunk verbs
        """
        chunk_parser = nltk.RegexpParser(chunk_grammar)
        chunk_tree = chunk_parser.parse(pos_tags)

        noun_phrases = []
        for subtree in chunk_tree.subtrees(filter=lambda t: t.label() == 'NP'):
            phrase = " ".join([word for word, tag in subtree.leaves()])
            noun_phrases.append(phrase)

        # 2. Named Entity Recognition with NLTK ne_chunk
        ne_tree = nltk.ne_chunk(pos_tags)
        named_entities = []
        for subtree in ne_tree:
            if hasattr(subtree, 'label'):
                entity_name = " ".join([leaf[0] for leaf in subtree.leaves()])
                entity_type = subtree.label()
                named_entities.append({"entity": entity_name, "type": entity_type})

        return {
            "experiment": "07",
            "title": "Named Entity Recognition (NER) and Noun Phrase Chunking",
            "co": "CO4",
            "input_text": text,
            "pos_tagged_tokens": [{"token": w, "pos": t} for w, t in pos_tags],
            "extracted_noun_phrases": noun_phrases,
            "extracted_named_entities": named_entities,
            "educational_notes": (
                "Chunking segments sentences into non-overlapping grammatical phrases like Noun Phrases (NP). "
                "Named Entity Recognition identifies real-world objects like PERSON (Ajay Jaiswal), "
                "ORGANIZATION (Google), and GPE/Location (Bengaluru)."
            )
        }

    # -------------------------------------------------------------------------
    # EXPERIMENT 08 (CO4): Word Sense Disambiguation (Lesk) & WordNet Semantic Relations
    # -------------------------------------------------------------------------
    def experiment_08_wsd_wordnet(self, target_word: str = "bank", sentence: str = None) -> Dict[str, Any]:
        """
        Word Sense Disambiguation using Simplified Lesk Algorithm and WordNet Relations.
        """
        if not sentence:
            sentence = "I deposited money into my account at the bank."

        target_word = (target_word or "bank").lower().strip()
        tokens = word_tokenize(sentence)

        # Lesk WSD
        best_sense = lesk(tokens, target_word)
        sense_definition = best_sense.definition() if best_sense else "No sense found"
        sense_name = best_sense.name() if best_sense else "N/A"
        examples = best_sense.examples() if best_sense else []

        # Semantic Relations for target word
        synsets = wn.synsets(target_word)
        synonyms = set()
        antonyms = set()
        hypernyms = []
        hyponyms = []

        if synsets:
            primary_synset = synsets[0]
            for s in synsets[:3]:
                for lemma in s.lemmas():
                    synonyms.add(lemma.name())
                    if lemma.antonyms():
                        antonyms.add(lemma.antonyms()[0].name())

            for h in primary_synset.hypernyms():
                hypernyms.append(h.name())
            for h in primary_synset.hyponyms()[:5]:
                hyponyms.append(h.name())

        return {
            "experiment": "08",
            "title": "Word Sense Disambiguation using Lesk Algorithm and WordNet Semantic Relations",
            "co": "CO4",
            "target_word": target_word,
            "context_sentence": sentence,
            "lesk_disambiguation": {
                "selected_synset": sense_name,
                "definition": sense_definition,
                "usage_examples": examples
            },
            "wordnet_relations": {
                "synonyms": list(synonyms)[:8],
                "antonyms": list(antonyms)[:5],
                "hypernyms_broader_category": hypernyms,
                "hyponyms_narrower_terms": hyponyms
            },
            "educational_notes": (
                "The Lesk algorithm disambiguates polysemous words by maximizing word overlap between the context "
                "sentence and dictionary glosses in WordNet. "
                "WordNet organizes words into synsets linked by semantic relations (Hypernyms, Hyponyms, Antonyms)."
            )
        }

    # -------------------------------------------------------------------------
    # EXPERIMENT 09 (CO2, CO5): Text Classification (Naïve Bayes & SVM) for Sentiment Analysis
    # -------------------------------------------------------------------------
    def experiment_09_text_classification(self, sample_review: str = None) -> Dict[str, Any]:
        """
        Build and evaluate text classification models (Multinomial Naive Bayes & Linear SVM)
        for sentiment analysis.
        """
        corpus = [
            ("Great resume with excellent machine learning and NLP project experience", "positive"),
            ("Outstanding candidate, strong Python skills and solid academic record", "positive"),
            ("Very good candidate with proven track record in full stack development", "positive"),
            ("Impressive coding skills and strong understanding of algorithms", "positive"),
            ("Highly recommended for software engineering role, great communication", "positive"),
            ("Excellent problem solver with solid experience in database design", "positive"),
            ("Poor resume, lacks required programming skills and experience", "negative"),
            ("Weak candidate, failed basic python and data structure questions", "negative"),
            ("Resume contains multiple typographical errors and incomplete projects", "negative"),
            ("Not qualified for the role, zero relevant experience in machine learning", "negative"),
            ("Disappointing interview, candidate struggled with simple queries", "negative"),
            ("Unsatisfactory background, missing essential skills for backend development", "negative")
        ]

        texts, labels = zip(*corpus)

        vectorizer = TfidfVectorizer(ngram_range=(1, 2))
        X = vectorizer.fit_transform(texts)
        y = list(labels)

        # Train Multinomial Naive Bayes
        nb_model = MultinomialNB()
        nb_model.fit(X, y)

        # Train Linear SVM
        svm_model = LinearSVC(random_state=42)
        svm_model.fit(X, y)

        # Evaluate on the training set / test cases
        y_pred_nb = nb_model.predict(X)
        y_pred_svm = svm_model.predict(X)

        acc_nb = round(accuracy_score(y, y_pred_nb) * 100, 1)
        acc_svm = round(accuracy_score(y, y_pred_svm) * 100, 1)

        # Predict for user's sample review
        if not sample_review:
            sample_review = "Candidate shows excellent machine learning skills and impressive problem solving ability."

        sample_vec = vectorizer.transform([sample_review])
        pred_nb = nb_model.predict(sample_vec)[0]
        pred_svm = svm_model.predict(sample_vec)[0]

        return {
            "experiment": "09",
            "title": "Text Classification using Naïve Bayes and SVM for Sentiment Analysis",
            "co": "CO2, CO5",
            "dataset_size": len(corpus),
            "classes": ["positive", "negative"],
            "models_comparison": {
                "multinomial_naive_bayes": {
                    "accuracy": f"{acc_nb}%",
                    "type": "Probabilistic Generative Model ($P(c|d) \\propto P(c) \\prod P(w|c)$)"
                },
                "support_vector_machine_svm": {
                    "accuracy": f"{acc_svm}%",
                    "type": "Discriminative Maximum-Margin Hyperplane Classifier"
                }
            },
            "user_sample_test": {
                "input_text": sample_review,
                "naive_bayes_prediction": pred_nb,
                "svm_prediction": pred_svm
            },
            "educational_notes": (
                "Naïve Bayes applies Bayes' Theorem with the assumption of conditional word independence. "
                "Support Vector Machine (SVM) finds the optimal separating hyperplane that maximizes the margin "
                "between classes in high-dimensional TF-IDF space."
            )
        }
