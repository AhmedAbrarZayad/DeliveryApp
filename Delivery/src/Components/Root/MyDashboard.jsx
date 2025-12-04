import React from 'react';
import { Outlet } from 'react-router';

const MyDashboard = () => {
    return (
        <div>
            <Outlet />
        </div>
    );
};

export default MyDashboard;