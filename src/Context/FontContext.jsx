// context/FontContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const FontContext = createContext();

export const FontProvider = ({ children }) => {
  const [fontSize, setFontSize] = useState('medium');

  useEffect(() => {
    const root = document.documentElement;

    if (fontSize === 'small') {
      root.style.setProperty('--base-font-size', '14px');
    } else if (fontSize === 'large') {
      root.style.setProperty('--base-font-size', '18px');
    } else {
      root.style.setProperty('--base-font-size', '16px');
    }
  }, [fontSize]);

  return (
    <FontContext.Provider value={{ fontSize, setFontSize }}>
      {children}
    </FontContext.Provider>
  );
};

export const useFont = () => useContext(FontContext);
