import React, { useState } from 'react';

const Localization = () => {
  const [language, setLanguage] = useState('en');

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    // Handle language change logic here
    console.log('Selected Language:', e.target.value);
  };

  return (
    <div className="localization">
      <h1>Localization</h1>
      <select value={language} onChange={handleLanguageChange}>
        <option value="en">English</option>
        <option value="fr">French</option>
        <option value="es">Spanish</option>
      </select>
    </div>
  );
};

export default Localization;