import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { translateText, getSupportedLanguages } from '../services/translationService';
import { FaLanguage, FaExchangeAlt, FaCopy } from 'react-icons/fa';

const Translation = ({ userId }) => {
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [languages, setLanguages] = useState([]);
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const data = await getSupportedLanguages();
        setLanguages(data);
      } catch (err) {
        console.error('Language fetch error:', err);
        setError('Failed to load supported languages');
      }
    };

    fetchLanguages();
  }, []);

  const handleTranslate = async () => {
    if (!text.trim()) {
      setError('Please enter text to translate');
      return;
    }

    setIsTranslating(true);
    setError('');
    try {
      const result = await translateText({
        userId,
        text,
        sourceLang,
        targetLang
      });
      setTranslatedText(result.translatedText);
    } catch (err) {
      console.error('Translation error:', err);
      setError('Failed to translate text');
    } finally {
      setIsTranslating(false);
    }
  };

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setText(translatedText);
    setTranslatedText(text);
  };

  const copyToClipboard = (textToCopy) => {
    navigator.clipboard.writeText(textToCopy);
  };

  return (
    <div className="translation-container">
      <h1 className="translation-header">
        <FaLanguage /> Translation Service
      </h1>

      {error && <div className="error">{error}</div>}

      <div className="language-selectors">
        <div className="language-selector">
          <label>From:</label>
          <select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
          >
            {languages.map(lang => (
              <option key={`source-${lang.code}`} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={swapLanguages}
          className="swap-button"
          aria-label="Swap languages"
        >
          <FaExchangeAlt />
        </button>

        <div className="language-selector">
          <label>To:</label>
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
          >
            {languages.map(lang => (
              <option key={`target-${lang.code}`} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="translation-boxes">
        <div className="text-box">
          <textarea
            placeholder={`Enter text in ${languages.find(l => l.code === sourceLang)?.name || sourceLang}`}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          {text && (
            <button
              onClick={() => copyToClipboard(text)}
              className="copy-button"
              title="Copy text"
            >
              <FaCopy />
            </button>
          )}
        </div>

        <div className="text-box">
          <textarea
            placeholder={`Translation in ${languages.find(l => l.code === targetLang)?.name || targetLang}`}
            value={translatedText}
            readOnly
          />
          {translatedText && (
            <button
              onClick={() => copyToClipboard(translatedText)}
              className="copy-button"
              title="Copy translation"
            >
              <FaCopy />
            </button>
          )}
        </div>
      </div>

      <button
        onClick={handleTranslate}
        disabled={isTranslating || !text.trim()}
        className="translate-button"
      >
        {isTranslating ? 'Translating...' : 'Translate'}
      </button>

      <div className="translation-footer">
        <p>
          Translation powered by our AI service. For long documents, consider our
          professional translation service.
        </p>
      </div>
    </div>
  );
};

Translation.propTypes = {
  userId: PropTypes.string.isRequired
};

export default Translation;
