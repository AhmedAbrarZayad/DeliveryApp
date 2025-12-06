import React from 'react';
import { Outlet } from 'react-router';
const AuthRoot = () => {
    return (
        <div className='min-h-screen w-full'>
            <Outlet />
        </div>
    );
};

export default AuthRoot;