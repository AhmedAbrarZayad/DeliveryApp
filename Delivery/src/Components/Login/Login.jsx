import Divider from '@mui/material/Divider';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { NavLink, useNavigate } from 'react-router';
import { useAuth } from '../../Hooks/useAuth';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { LogOut } from 'lucide-react';

const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const axiosSecure = useAxiosSecure();

    const { login, loginWithGoogle, loading, logout } = useAuth();
    const navigate = useNavigate();
    const [authError, setAuthError] = useState('');

    const handleLogin = async (data) => {
        setAuthError('');
        try {
            await login(data.email, data.password);
            navigate('/');
        } catch (error) {
            if (error.code === 'auth/invalid-credential') {
                setAuthError('Invalid email or password');
            } else if (error.code === 'auth/user-not-found') {
                setAuthError('No account found with this email');
            } else if (error.code === 'auth/wrong-password') {
                setAuthError('Incorrect password');
            } else if (error.code === 'auth/too-many-requests') {
                setAuthError('Too many failed attempts. Please try again later');
            } else {
                setAuthError('Failed to login. Please try again');
            }
            console.error('Login error:', error);
        }
    };

    const handleGoogleLogin = async () => {
        setAuthError('');
        try {
            const res = await loginWithGoogle();
            const userEmail = res.user.email;
            const userInfo = {
                email: userEmail,
                name: res.user.displayName,
                photoURL: res.user.photoURL
            };
            const response = await axiosSecure.post('/users', userInfo);
            console.log('User data response:', response);
            console.log('User created in database');
            navigate('/');
        } catch (error) {
            if (error.code === 'auth/account-exists-with-different-credential') {
                setAuthError('An account with this email already exists using email & password. Please log in using email & password.');
            } else {
                setAuthError('Failed to login with Google. Please try again');
            }
            console.error('Google login error:', error);
            logout();
        }
    };
    return (
        <div>
            <form onSubmit={handleSubmit(handleLogin)}>
                <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4" disabled={loading}>
                <legend className="fieldset-legend">Login</legend>

                {authError && (
                    <div className="alert alert-error mb-4 py-2 px-3 text-sm">
                        {authError}
                    </div>
                )}

                <label className="label">Email</label>
                <input type="email" className="input" {...register("email", { required: true })} placeholder="Email" />
                {errors.email?.type === 'required' && <span className="text-red-500 text-sm">Email is required</span>}
                <label className="label">Password</label>
                <input type="password" className="input" {...register("password", { required: true })} placeholder="Password" />
                {errors.password?.type === 'required' && <span className="text-red-500 text-sm">Password is required</span>}

                <button type="submit" className="btn btn-neutral mt-1" disabled={loading}>
                    {loading ? <span className="loading loading-spinner loading-sm"></span> : 'Login'}
                </button>
                <div className='relative mt-6'>
                    <div className='absolute inset-0 flex items-center'>
                        <div className='w-full border-t border-gray-600'></div>
                    </div>
                    <div className='relative flex justify-center text-sm'>
                        <span className='px-3 bg-base-200 text-gray-400'>Or</span>
                    </div>
                </div>
                <button type="button" onClick={handleGoogleLogin} className="btn bg-white text-black border-[#e5e5e5] hover:bg-gray-100" disabled={loading}>
                <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
                {loading ? 'Signing in...' : 'Login with Google'}
                </button>
                <div className='mt-6 text-center text-sm text-gray-400'>
                    Don't have an account? <NavLink to="../register" className='text-blue-400 hover:text-blue-300 font-semibold'>Register</NavLink>
                </div>
                </fieldset>  
            </form>       
        </div>
    );
};

export default Login;