import React from 'react';
import BgDark from '../../assets/Dashboard dark.webp';
import { Outlet } from 'react-router';
const AuthRoot = () => {
    return (
        <div className='flex md:justify-between'>
            <div className='auth-image hidden md:flex md:w-1/2 lg:w-2/3' style={{ backgroundImage: `url(${BgDark})`, backgroundSize: 'cover', minHeight: '100vh' }}>

            </div>
            <div className='auth-form flex-1 flex items-center justify-center h-screen' >
                <Outlet />
            </div>
        </div>
    );
};

export default AuthRoot;