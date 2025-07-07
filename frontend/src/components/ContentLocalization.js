import React, { useState } from "react";
import axios from "axios";
import PropTypes from 'prop-types';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ar', name: 'Arabic' }
];

const ContentLocalization = ({ initialText = '' }) => {
  const [text, setText] = useState(initialText);
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const MAX_CHARS = 5000;

  const translateText = async () => {
    if (!text.trim()) {
      setError('Please enter text to translate');
      return;
    }
    if (text.length > MAX_CHARS) {
      setError(`Text exceeds ${MAX_CHARS} character limit`);
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      const response = await axios.post("/api/localization/translate", {
        text,
        sourceLanguage,
        targetLanguage
      });
      setTranslatedText(response.data.translatedText);
    } catch (error) {
      setError('Translation failed. Please try again.');
      console.error("Translation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    setText(translatedText);
    setTranslatedText(text);
  };

  return (
    <div className="localization-container">
      <h1>Content Localization</h1>
      {error && <div className="error">{error}</div>}
      
      <div className="language-selectors">
        <div className="language-selector">
          <label>Source Language</label>
          <select 
            value={sourceLanguage} 
            onChange={(e) => setSourceLanguage(e.target.value)}
          >
            {LANGUAGES.map(lang => (
              <option key={`src-${lang.code}`} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
        
        <button 
          className="swap-button"
          onClick={handleSwapLanguages}
          disabled={isLoading}
        >
          ⇄
        </button>
        
        <div className="language-selector">
          <label>Target Language</label>
          <select 
            value={targetLanguage} 
            onChange={(e) => setTargetLanguage(e.target.value)}
          >
            {LANGUAGES.map(lang => (
              <option key={`tgt-${lang.code}`} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="translation-boxes">
        <div className="text-box">
          <textarea
            placeholder={`Enter text in ${LANGUAGES.find(l => l.code === sourceLanguage)?.name || sourceLanguage}...`}
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={MAX_CHARS}
          />
          <div className="char-count">{text.length}/{MAX_CHARS}</div>
        </div>
        
        <div className="text-box">
          <textarea
            placeholder={`Translation in ${LANGUAGES.find(l => l.code === targetLanguage)?.name || targetLanguage}...`}
            value={translatedText}
            readOnly
          />
          {translatedText && (
            <button 
              className="copy-button"
              onClick={() => navigator.clipboard.writeText(translatedText)}
            >
              Copy
            </button>
          )}
        </div>
      </div>
      
      <button 
        onClick={translateText} 
        disabled={isLoading || !text.trim()}
        className="translate-button"
      >
        {isLoading ? 'Translating...' : 'Translate'}
      </button>
    </div>
  );
};

ContentLocalization.propTypes = {
  initialText: PropTypes.string
};

export default ContentLocalization;
