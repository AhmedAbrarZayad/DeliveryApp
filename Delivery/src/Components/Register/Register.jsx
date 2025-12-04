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
                    if(response.data.insertedId){
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
        <div>
            <form onSubmit={handleSubmit(handleRegister)}>
                <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4" disabled={isRegistering || loading}>
                {authError && (
                    <div className="alert alert-error mb-4 py-2 px-3 text-sm">
                        {authError}
                    </div>
                )}

                <label className='label'>Name</label>
                <input type="text" className="input" {...register("name", { required: true })} placeholder="Name" />
                {errors.name?.type === 'required' && <span className="text-red-500 text-sm">Name is required</span>}
                
                <label className='label'>Photo</label>
                <input type='file' className="input" {...register("photo", {required: true})} placeholder="Photo URL" />
                {errors.photo?.type === 'required' && <span className="text-red-500 text-sm">Photo is required</span>}

                <label className="label">Email</label>
                <input type="email" className="input" {...register("email", { required: true })} placeholder="Email" />
                {errors.email?.type === 'required' && <span className="text-red-500">Email is required</span>}

                <label className="label">Password</label>
                <input 
                    type="password" 
                    className="input" 
                    {...register("password", { 
                        required: true, 
                        pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                        onChange: (e) => validatePassword(e.target.value)
                    })} 
                    placeholder="Password" 
                />
                {errors.password?.type === 'required' && <span className="text-red-500 text-sm block mt-1">Password is required</span>}
                
                <div className="mt-2 space-y-1 text-sm">
                    <div className={`${passwordValidation.minLength ? 'text-green-500' : 'text-red-500'}`}>
                        {passwordValidation.minLength ? '✓' : '✗'} At least 8 characters
                    </div>
                    <div className={`${passwordValidation.hasUppercase ? 'text-green-500' : 'text-red-500'}`}>
                        {passwordValidation.hasUppercase ? '✓' : '✗'} One uppercase letter
                    </div>
                    <div className={`${passwordValidation.hasLowercase ? 'text-green-500' : 'text-red-500'}`}>
                        {passwordValidation.hasLowercase ? '✓' : '✗'} One lowercase letter
                    </div>
                    <div className={`${passwordValidation.hasNumber ? 'text-green-500' : 'text-red-500'}`}>
                        {passwordValidation.hasNumber ? '✓' : '✗'} One number
                    </div>
                    <div className={`${passwordValidation.hasSpecialChar ? 'text-green-500' : 'text-red-500'}`}>
                        {passwordValidation.hasSpecialChar ? '✓' : '✗'} One special character (@$!%*?&)
                    </div>
                </div>

                <label className="label">Confirm Password</label>
                <input 
                    type="password" 
                    className="input" 
                    {...register("confirmPassword", { 
                        required: true,
                        validate: value => value === currentPassword || "Passwords do not match"
                    })} 
                    placeholder="Confirm Password" 
                />
                {errors.confirmPassword?.type === 'required' && <span className="text-red-500 text-sm block mt-1">Confirm Password is required</span>}
                {errors.confirmPassword?.type === 'validate' && <span className="text-red-500 text-sm block mt-1">{errors.confirmPassword.message}</span>}
                
                <button type="submit" className="btn btn-neutral mt-4 w-full" disabled={isRegistering || loading}>
                    {isRegistering ? (
                        <>
                            <span className="loading loading-spinner loading-sm"></span>
                            Registering...
                        </>
                    ) : 'Register'}
                </button>

                <div className='relative mt-6'>
                    <div className='absolute inset-0 flex items-center'>
                        <div className='w-full border-t border-gray-600'></div>
                    </div>
                    <div className='relative flex justify-center text-sm'>
                        <span className='px-3 bg-base-200 text-gray-400'>Or</span>
                    </div>
                </div>

                <button type="button" onClick={handleGoogleLogin} className="btn bg-white text-black border-[#e5e5e5] hover:bg-gray-100" disabled={isRegistering || loading}>
                    <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
                    {loading ? 'Signing in...' : 'Continue with Google'}
                </button>

                <div className='mt-6 text-center text-sm text-gray-400'>
                    Already have an account? <NavLink to="../login" className='text-blue-400 hover:text-blue-300 font-semibold'>Login</NavLink>
                </div>
                </fieldset> 
            </form>           
        </div>
    );
};

export default Register;