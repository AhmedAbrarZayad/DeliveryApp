import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../Hooks/useAuth';
import { NavLink, useNavigate } from 'react-router';
import axios from 'axios';
import useAxiosSecure from '../../Hooks/useAxiosSecure';

const Register = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const { register: registerUser, loginWithGoogle, loading, updateUserProfile, logout } = useAuth();
    const navigate = useNavigate();
    const [authError, setAuthError] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [passwordValidation, setPasswordValidation] = useState({
        minLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecialChar: false
    });
    const [currentPassword, setCurrentPassword] = useState('');
    const axiosSecure = useAxiosSecure();

    const validatePassword = (value) => {
        setCurrentPassword(value);
        setPasswordValidation({
            minLength: value.length >= 8,
            hasUppercase: /[A-Z]/.test(value),
            hasLowercase: /[a-z]/.test(value),
            hasNumber: /\d/.test(value),
            hasSpecialChar: /[@$!%*?&]/.test(value)
        });
    };

    const handleRegister = async (data) => {
        setAuthError('');
        setIsRegistering(true);

        // Check if passwords match
        if (data.password !== data.confirmPassword) {
            setAuthError('Passwords do not match');
            setIsRegistering(false);
            return;
        }

        try {
            // Step 1: Create user account
            await registerUser(data.email, data.password, data.name);

            // Step 2: Upload image
            const imageFile = data.photo[0];
            const formData = new FormData();
            formData.append('image', imageFile);
            const url = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_Image_API_KEY}`;

            await axios.post(url, formData)
                .then(async res => {
                    //console.log("ImageResponse: ", res);
                    //console.log("ImageResponse: ", imageResponse);

                    // create user in database
                    const userInfo = {
                        email: data.email,
                        name: data.name,
                        photoURL: res.data.data.url
                    };
                    await axiosSecure.post('/users', userInfo)
                        .then(response => {
                            if (response.data.insertedId) {
                                console.log('User created in database');
                            }
                        });
                    // Step 3: Update profile with photo
                    const userProfile = {
                        displayName: data.name,
                        photoURL: res.data.data.url
                    };

                    await updateUserProfile(userProfile);

                    // Step 4: Navigate to home only after everything succeeds
                    navigate('/');
                    return res;
                })
                .catch(err => console.error(err));

        } catch (error) {
            // Handle errors
            if (error.code === 'auth/email-already-in-use') {
                setAuthError('An account with this email already exists');
            } else if (error.code === 'auth/invalid-email') {
                setAuthError('Invalid email address');
            } else if (error.code === 'auth/weak-password') {
                setAuthError('Password is too weak');
            } else if (error.response) {
                setAuthError('Failed to upload photo. Please try again');
            } else {
                setAuthError('Failed to create account. Please try again');
            }
            console.error('Registration error:', error);
        } finally {
            setIsRegistering(false);
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
            await axiosSecure.post('/users', userInfo);
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
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-[#0f172a] relative overflow-hidden transition-colors duration-300 py-10">
            {/* Background elements */}
            <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/30 rounded-full blur-[100px]" />
            <div className="absolute bottom[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-500/30 rounded-full blur-[100px]" />

            <div className="card w-full max-w-lg bg-white/80 dark:bg-black/40 backdrop-blur-xl shadow-2xl border border-white/20 dark:border-white/10 relative z-10 m-4">
                <div className="card-body">
                    <h2 className="text-3xl font-bold text-center mb-6 dark:text-white">Create Account</h2>

                    <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
                        {authError && (
                            <div className="alert alert-error text-sm py-2 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span>{authError}</span>
                            </div>
                        )}

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium dark:text-gray-300">Name</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Your full name"
                                className="input input-bordered w-full bg-transparent focus:border-blue-500 transition-colors dark:text-white"
                                {...register("name", { required: true })}
                            />
                            {errors.name?.type === 'required' && <span className="text-error text-xs mt-1">Name is required</span>}
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium dark:text-gray-300">Photo</span>
                            </label>
                            <input
                                type="file"
                                className="file-input file-input-bordered w-full bg-transparent focus:border-blue-500 transition-colors dark:text-white"
                                {...register("photo", { required: true })}
                            />
                            {errors.photo?.type === 'required' && <span className="text-error text-xs mt-1">Photo is required</span>}
                        </div>

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
                                placeholder="Create a strong password"
                                className="input input-bordered w-full bg-transparent focus:border-blue-500 transition-colors dark:text-white"
                                {...register("password", {
                                    required: true,
                                    pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                    onChange: (e) => validatePassword(e.target.value)
                                })}
                            />
                            {errors.password?.type === 'required' && <span className="text-error text-xs mt-1 block">Password is required</span>}

                            <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
                                <div className={`${passwordValidation.minLength ? 'text-success' : 'text-base-content/50'} flex items-center gap-1`}>
                                    {passwordValidation.minLength ? <span className="text-lg">✓</span> : <span>○</span>} Min 8 chars
                                </div>
                                <div className={`${passwordValidation.hasUppercase ? 'text-success' : 'text-base-content/50'} flex items-center gap-1`}>
                                    {passwordValidation.hasUppercase ? <span className="text-lg">✓</span> : <span>○</span>} Uppercase
                                </div>
                                <div className={`${passwordValidation.hasLowercase ? 'text-success' : 'text-base-content/50'} flex items-center gap-1`}>
                                    {passwordValidation.hasLowercase ? <span className="text-lg">✓</span> : <span>○</span>} Lowercase
                                </div>
                                <div className={`${passwordValidation.hasNumber ? 'text-success' : 'text-base-content/50'} flex items-center gap-1`}>
                                    {passwordValidation.hasNumber ? <span className="text-lg">✓</span> : <span>○</span>} Number
                                </div>
                                <div className={`${passwordValidation.hasSpecialChar ? 'text-success' : 'text-base-content/50'} flex items-center gap-1`}>
                                    {passwordValidation.hasSpecialChar ? <span className="text-lg">✓</span> : <span>○</span>} Special char
                                </div>
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium dark:text-gray-300">Confirm Password</span>
                            </label>
                            <input
                                type="password"
                                placeholder="Confirm your password"
                                className="input input-bordered w-full bg-transparent focus:border-blue-500 transition-colors dark:text-white"
                                {...register("confirmPassword", {
                                    required: true,
                                    validate: value => value === currentPassword || "Passwords do not match"
                                })}
                            />
                            {errors.confirmPassword?.type === 'required' && <span className="text-error text-xs mt-1 block">Confirm Password is required</span>}
                            {errors.confirmPassword?.type === 'validate' && <span className="text-error text-xs mt-1 block">{errors.confirmPassword.message}</span>}
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-full shadow-lg shadow-blue-500/30 border-0 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white mt-4"
                            disabled={isRegistering || loading}
                        >
                            {isRegistering ? (
                                <>
                                    <span className="loading loading-spinner loading-md"></span>
                                    Creating Account...
                                </>
                            ) : 'Create Account'}
                        </button>
                    </form>

                    <div className="divider dark:text-gray-500">OR</div>

                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="btn btn-outline w-full hover:bg-gray-100 dark:hover:bg-white/10 dark:text-white dark:border-gray-600 gap-2"
                        disabled={isRegistering || loading}
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
                        Already have an account?{' '}
                        <NavLink to="../login" className="text-blue-500 hover:text-blue-600 font-semibold hover:underline">
                            Log in
                        </NavLink>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;