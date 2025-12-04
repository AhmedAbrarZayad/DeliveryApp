import './App.css'
import BgDark from './assets/Dashboard dark.webp';
import { ThemeProvider } from '@mui/material/styles';
import { darkTheme, lightTheme } from './Themes/Themes';
import { useState } from 'react';
import NavBar from './Components/NavBar/NavBar';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <div style={{ backgroundImage: `url(${BgDark})`, backgroundSize: 'cover', minHeight: '100vh'}}>
        <NavBar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        <h1>Hello</h1>
      </div>
    </ThemeProvider>
  )
}

export default App
