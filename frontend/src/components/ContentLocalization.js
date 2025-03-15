import React, { useState } from "react";
import axios from "axios";

const ContentLocalization = () => {
  const [text, setText] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("es");
  const [translatedText, setTranslatedText] = useState("");

  const translateText = async () => {
    try {
      const response = await axios.post("/api/localization/translate", {
        text,
        targetLanguage,
      });
      setTranslatedText(response.data.translatedText);
    } catch (error) {
      console.error("Error translating text:", error);
    }
  };

  return (
    <div>
      <h1>Content Localization</h1>
      <textarea
        placeholder="Enter text to translate"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <select value={targetLanguage} onChange={(e) => setTargetLanguage(e.target.value)}>
        <option value="es">Spanish</option>
        <option value="fr">French</option>
        <option value="zh">Chinese</option>
      </select>
      <button onClick={translateText}>Translate</button>
      {translatedText && (
        <div>
          <h2>Translated Text</h2>
          <p>{translatedText}</p>
        </div>
      )}
    </div>
  );
};

export default ContentLocalization;