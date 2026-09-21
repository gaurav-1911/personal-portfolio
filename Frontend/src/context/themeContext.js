import { createContext } from 'react';

// Raw context object, deliberately isolated so provider (component) and
// useTheme (hook) live in separate files for fast-refresh compatibility.
const ThemeContext = createContext(undefined);

export default ThemeContext;