import React, { useState } from 'react';

const Translation = () => {
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('');

  const handleTranslate = () => {
    // Handle translation logic here
    setTranslatedText(`Translated: ${text}`);
  };

  return (
    <div className="translation">
      <h1>Translation</h1>
      <textarea
        placeholder="Enter text to translate"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={handleTranslate}>Translate</button>
      <p>{translatedText}</p>
    </div>
  );
};

export default Translation;