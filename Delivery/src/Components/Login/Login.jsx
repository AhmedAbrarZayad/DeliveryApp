import Divider from '@mui/material/Divider';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { NavLink, useNavigate } from 'react-router';
import { useAuth } from '../../Hooks/useAuth';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { LogOut } from 'lucide-react';
import Swal from 'sweetalert2';

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
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Logged in successfully!',
                showConfirmButton: false,
                timer: 1500,
                toast: true
            });
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
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Logged in with Google!',
                showConfirmButton: false,
                timer: 1500,
                toast: true
            });
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
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 dark:bg-[#0f172a] relative overflow-hidden transition-colors duration-300 p-4">
            {/* Background elements */}
            <div className="absolute inset-0 bg-gray-100 dark:bg-[#0f172a] -z-10"></div>
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/30 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/30 rounded-full blur-[100px]" />

            <div className="card w-full max-w-md h-auto bg-white/80 dark:bg-black/40 backdrop-blur-xl shadow-2xl border border-white/20 dark:border-white/10 relative z-10">
                <div className="card-body p-8">
                    <h2 className="text-3xl font-bold text-center mb-6 dark:text-white">Welcome Back</h2>

                    <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
                        {authError && (
                            <div className="alert alert-error text-sm py-2 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span>{authError}</span>
                            </div>
                        )}

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium dark:text-gray-300">Email</span>
                            </label>
                            <input
                                type="email"
                                placeholder="name@example.com"
                                className="input input-bordered w-full bg-transparent focus:border-blue-500 transition-colors dark:text-white"
                                {...register("email", { required: true })}
                            />
                            {errors.email?.type === 'required' && <span className="text-error text-xs mt-1">Email is required</span>}
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium dark:text-gray-300">Password</span>
                            </label>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                className="input input-bordered w-full bg-transparent focus:border-blue-500 transition-colors dark:text-white"
                                {...register("password", { required: true })}
                            />
                            {errors.password?.type === 'required' && <span className="text-error text-xs mt-1">Password is required</span>}
                            <label className="label">
                                <a href="#" className="label-text-alt link link-hover text-blue-500">Forgot password?</a>
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-full shadow-lg shadow-blue-500/30 border-0 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white mt-2"
                            disabled={loading}
                        >
                            {loading ? <span className="loading loading-spinner loading-md"></span> : 'Sign In'}
                        </button>
                    </form>

                    <div className="divider dark:text-gray-500">OR</div>

                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="btn btn-outline w-full hover:bg-gray-100 dark:hover:bg-white/10 dark:text-white dark:border-gray-600 gap-2"
                        disabled={loading}
                    >
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Continue with Google
                    </button>

                    <p className="text-center mt-4 text-sm dark:text-gray-400">
                        Don't have an account?{' '}
                        <NavLink to="../register" className="text-blue-500 hover:text-blue-600 font-semibold hover:underline">
                            Register now
                        </NavLink>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;