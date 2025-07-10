
import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

const themes = {
  light: {
    background: 'bg-white',
    text: 'text-black',
  },
  dark: {
    background: 'bg-gray-900',
    text: 'text-white',
  },
  blue: {
    background: 'bg-blue-100',
    text: 'text-blue-900',
  },
  green: {
    background: 'bg-green-100',
    text: 'text-green-900',
  },
}

export const ThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = useState('light')

  useEffect(() => {
    document.documentElement.className = '' 
    document.documentElement.classList.add(themes[themeName].background)
    document.documentElement.classList.add(themes[themeName].text)
  }, [themeName])

  return (
    <ThemeContext.Provider value={{ themeName, setThemeName, themes }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
