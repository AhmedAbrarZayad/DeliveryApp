import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import NavBar from '../NavBar/NavBar';
import Footer from '../Footer/Footer';
import { ThemeProvider } from '@emotion/react';
import { darkTheme, lightTheme } from '../../Themes/Themes';

const Root = () => {
    const location = useLocation();
    console.log('Current location:', location.pathname);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark bg-[#0f172a]' : 'bg-white'}`} data-theme={isDarkMode ? "dark" : "light"}>
            <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
                {
                    location.pathname === '/' ? (<></>) : <NavBar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                }

                <div className="grow">
                    <Outlet context={{ isDarkMode, toggleTheme }} />
                </div>

                <Footer className="mt-auto" />
            </ThemeProvider>
        </div>
    );
};

export default Root;
