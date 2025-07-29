
import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

const themes = ['light', 'dark', 'blue', 'green']

export const ThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = useState('light')

  useEffect(() => {

    themes.forEach(theme => document.documentElement.classList.remove(theme))

    document.documentElement.classList.add(themeName)
  }, [themeName])

  return (
    <ThemeContext.Provider value={{ themeName, setThemeName, themes }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
