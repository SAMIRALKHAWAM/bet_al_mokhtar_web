import React, { createContext, useContext, useState } from 'react'

const FontContext = createContext()

export const useFont = () => useContext(FontContext)

export const FontProvider = ({ children }) => {
  const [fontSize, setFontSize] = useState('medium')

  return (
    <FontContext.Provider value={{ fontSize, setFontSize }}>
      <div className={`text-${fontSize}`}>{children}</div>
    </FontContext.Provider>
  )
}
