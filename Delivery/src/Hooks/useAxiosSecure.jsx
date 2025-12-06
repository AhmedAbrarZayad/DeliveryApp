import axios from 'axios';
import React, { useEffect } from 'react';
import { useAuth } from './useAuth';
import { useNavigate } from 'react-router';

const axiosSecure = axios.create({
    baseURL: 'https://delivery-app-ebon.vercel.app/',
})
const useAxiosSecure = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        const reqInterceptor = axiosSecure.interceptors.request.use(async (config) => {
            if (user) {
                const token = await user.getIdToken();
                config.headers.Authorization = `Bearer ${token}`;
            }
            console.log('Request config:', config);
            return config;
        })

        // interceptor response
        const resInterceptor = axiosSecure.interceptors.response.use((response) => {
            return response;
        }, (error) => {
            console.log('Response error:', error);
            const statusCode = error.status;
            if (statusCode === 401 || statusCode === 403) {
                logout()
                    .then(() => {
                        navigate('/auth/login');
                    });
            }
            return Promise.reject(error);
        })

        return () => {
            axiosSecure.interceptors.request.eject(reqInterceptor);
            axiosSecure.interceptors.response.eject(resInterceptor);
        }
    }, [user, logout, navigate])
    return axiosSecure;
};

export default useAxiosSecure;