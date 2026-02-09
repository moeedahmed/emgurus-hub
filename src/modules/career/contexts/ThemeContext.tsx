/**
 * Theme compatibility shim for Career module.
 * Hub defaults to dark mode; this provides the expected interface.
 */
import { createContext, useContext } from 'react';

interface ThemeContextType {
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeContext.Provider value={{ theme: 'dark', setTheme: () => {} }}>
      {children}
    </ThemeContext.Provider>
  );
}
