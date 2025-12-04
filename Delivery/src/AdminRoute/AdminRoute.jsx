import React from 'react';
import { useAuth } from '../Hooks/useAuth';
import { Navigate, useLocation } from 'react-router';
import useRole from '../Hooks/useRole';

const AdminRoute = ({children}) => {
    const {user, loading} = useAuth();
    const {role, isLoading:roleLoading} = useRole();
    const location = useLocation();

    if(loading || roleLoading){
        return <div>Loading...</div>;
    }

    if(!user){
        return <Navigate to="/auth/login" state={{from: location}} replace></Navigate>;
    }

    if(role !== 'admin'){
        return <Navigate to="/forbidden" state={{from: location}} replace></Navigate>;
    }

    return children;
};

export default AdminRoute;