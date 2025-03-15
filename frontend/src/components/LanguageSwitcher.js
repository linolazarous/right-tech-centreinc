import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState("en");

  const changeLanguage = (e) => {
    const selectedLanguage = e.target.value;
    i18n.changeLanguage(selectedLanguage);
    setLanguage(selectedLanguage);
  };

  return (
    <select value={language} onChange={changeLanguage}>
      <option value="en">English</option>
      <option value="es">Spanish</option>
      <option value="fr">French</option>
      <option value="zh">Chinese</option>
    </select>
  );
};

export default LanguageSwitcher;