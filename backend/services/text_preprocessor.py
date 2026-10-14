import re
import string
from typing import List, Dict, Any
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer

class TextPreprocessor:
    """
    NLP Preprocessing Pipeline for Resumes and Job Descriptions.
    Steps:
      1. Text Cleaning (remove URLs, emails, phone numbers, special characters)
      2. Lowercase Conversion
      3. Word Tokenization
      4. Stop Word Removal (using NLTK English stopwords)
      5. Punctuation Removal
      6. Lemmatization (using WordNetLemmatizer)
    """

    def __init__(self):
        try:
            self.stop_words = set(stopwords.words('english'))
        except LookupError:
            nltk.download('stopwords')
            self.stop_words = set(stopwords.words('english'))

        try:
            self.lemmatizer = WordNetLemmatizer()
        except LookupError:
            nltk.download('wordnet')
            self.lemmatizer = WordNetLemmatizer()

    def clean_text(self, text: str) -> str:
        """
        Removes URLs, emails, numbers, and abnormal characters.
        """
        if not text:
            return ""
        # Remove URLs
        text = re.sub(r'https?://\S+|www\.\S+', ' ', text)
        # Remove Email addresses
        text = re.sub(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', ' ', text)
        # Remove Phone numbers
        text = re.sub(r'\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b', ' ', text)
        # Remove non-alphanumeric characters except basic programming symbols like +, #
        text = re.sub(r'[^\w\s\+\#]', ' ', text)
        # Normalize whitespace
        text = re.sub(r'\s+', ' ', text)
        return text.strip()

    def to_lowercase(self, text: str) -> str:
        """
        Converts all characters to lowercase for case-insensitive processing.
        """
        return text.lower()

    def tokenize(self, text: str) -> List[str]:
        """
        Breaks continuous string into individual tokens/words.
        """
        try:
            tokens = word_tokenize(text)
        except Exception:
            # Fallback regex tokenizer in case punkt dictionary has environment issues
            tokens = re.findall(r'\b[a-zA-Z0-9\+\#]+\b', text)
        return tokens

    def remove_stopwords(self, tokens: List[str]) -> List[str]:
        """
        Filters out common English stopwords ('is', 'and', 'the', etc.).
        Preserves key domain terms.
        """
        return [token for token in tokens if token.lower() not in self.stop_words]

    def remove_punctuation(self, tokens: List[str]) -> List[str]:
        """
        Removes standalone punctuation symbols from tokens.
        """
        punctuation_set = set(string.punctuation)
        # Keep '+' and '#' to recognize 'c++' and 'c#'
        punctuation_set.discard('+')
        punctuation_set.discard('#')
        return [token for token in tokens if token not in punctuation_set and len(token) > 1]

    def lemmatize(self, tokens: List[str]) -> List[str]:
        """
        Reduces tokens to their base lemma root form (e.g. 'developing' -> 'develop').
        """
        return [self.lemmatizer.lemmatize(token.lower()) for token in tokens]

    def process(self, text: str) -> Dict[str, Any]:
        """
        Executes the entire NLP pipeline and returns step-by-step intermediate results
        for educational display and explanation in viva.
        """
        raw_length = len(text) if text else 0
        cleaned = self.clean_text(text)
        lowered = self.to_lowercase(cleaned)
        raw_tokens = self.tokenize(lowered)
        no_stopwords = self.remove_stopwords(raw_tokens)
        no_punct = self.remove_punctuation(no_stopwords)
        lemmatized_tokens = self.lemmatize(no_punct)
        final_processed_text = " ".join(lemmatized_tokens)

        return {
            "raw_text_length": raw_length,
            "cleaned_text": cleaned,
            "lowered_text": lowered,
            "token_count": len(raw_tokens),
            "tokens_sample": raw_tokens[:20],
            "tokens_after_stopwords_count": len(no_stopwords),
            "lemmatized_tokens": lemmatized_tokens,
            "final_processed_text": final_processed_text
        }
