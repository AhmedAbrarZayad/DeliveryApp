import React from 'react';
import { Outlet, useOutletContext } from 'react-router';

const MyDashboard = () => {
    const { isDarkMode, toggleTheme } = useOutletContext();
    
    return (
        <div className={isDarkMode ? 'bg-[#0f172a]' : 'bg-white'}>
            <Outlet context={{ isDarkMode, toggleTheme }} />
        </div>
    );
};

export default MyDashboard;