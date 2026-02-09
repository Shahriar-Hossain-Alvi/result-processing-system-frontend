import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEyeSlash } from 'react-icons/fa';
import { FaEye, FaLock } from 'react-icons/fa6';
import useAxiosPublic from '../../hooks/useAxiosPublic.jsx';
import useAuth from '../../hooks/useAuth.jsx';
import { useNavigate } from 'react-router-dom';
// @ts-ignore
import axiosSecure from '../../utils/axios/axiosSecure.js';
import useAxiosSecure from '../../hooks/useAxiosSecure.jsx';
import toast, { Toaster } from 'react-hot-toast';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';
import errorMessageParser from '../../utils/errorMessageParser/errorMessageParser.js';
// @ts-ignore
import logo from "../../assets/edutrack_logo.png"
import { MdEmail } from 'react-icons/md';

const Signin = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { user, fetchUser, setLoading } = useAuth();


    const signInUser = async (data) => {

        if (user) {
            toast.error("Already logged in!");
            return setTimeout(() => {
                navigate('/');
            }, 2000)
        };

        // Backend expects username and password as formdata
        const formData = new FormData();
        formData.append('username', data.email);
        formData.append('password', data.password);

        // TODO: prevent login if user is already logged in

        try {
            setFormLoading(true);
            // 1: get token in httponly cookie from backend
            const res = await axiosSecure.post('/auth/login', formData);
            console.log(res);
            if (res?.data?.message === "Login successful") {
                toast.success(res?.data?.message);
                // 2: Fetch user info using the new cookie
                const userData = await fetchUser();
                console.log(userData);
                // 3: Redirect based on the fetched data 
                if (userData?.role === "admin" || userData?.role === "super_admin") {
                    navigate('/admin');
                } else if (userData?.role === "teacher") {
                    navigate('/teacher');
                } else if (userData?.role === "student") {
                    navigate('/student')
                }
            }
        } catch (error) {
            console.error(error);
            const message = errorMessageParser(error);
            toast.error(message || "Failed to login. Please check your credentials.");
            setLoading(false);
        } finally {
            setFormLoading(false);
        }
    }




    return (
        <div className="hero min-h-screen bg-primary-tint">
            <div className="flex-col xs:w-3xs w-2xs md:w-lg">
                <div className="text-center">
                    <img src={logo} alt="Logo" className='w-44 md:w-60 lg:w-72 mx-auto' />
                    <p className="py-6 text-black text-lg lg:text-xl">
                        Sign in to your account
                    </p>
                </div>
                <div className="card bg-base-100 shadow-lg hover:shadow-2xl transition ease-in-out duration-500 w-full shrink-0">
                    <form onSubmit={handleSubmit(signInUser)} className="card-body">
                        <fieldset className="fieldset">
                            <div className={`w-full ${errors.email && "tooltip tooltip-open tooltip-top tooltip-error"}`} data-tip={errors.email && errors.email.message}>
                                <p className='font-medium mb-2'>Email Address</p>
                                <label className='input w-full has-focus:input-info transition-colors h-12'>
                                    <MdEmail className='text-gray-400 text-lg' />
                                    <input
                                        type="email"
                                        className='grow'
                                        {...register("email", { required: "Email is required" })}
                                        placeholder="user@email.com"
                                    />
                                </label>
                            </div>

                            <div className='relative my-3'>
                                <div className={`w-full ${errors.password && "tooltip tooltip-open tooltip-bottom tooltip-error"}`} data-tip={errors.password && errors.password.message}>
                                    <p className='font-medium mb-2'>Password</p>
                                    <label className='input w-full has-focus:input-info transition-colors h-12'>
                                        <FaLock className='text-gray-400 text-base' />
                                        <input
                                            className='grow'
                                            type={showPassword ? "text" : "password"}

                                            {...register("password",
                                                {
                                                    required: "Password is required",
                                                    minLength: { value: 6, message: "Password must be at least 6 characters" },
                                                    maxLength: { value: 32, message: "Password must be at most 32 characters" }
                                                })}
                                            placeholder="••••••••"
                                        />
                                    </label>
                                </div>

                                {
                                    showPassword ?
                                        <button type='button' onClick={() => setShowPassword(false)} className="btn btn-sm border-0 bg-transparent hover:bg-transparent  hover:border-0 absolute z-10 right-4 top-1/2 transform -translate-y-0.5 lg:tooltip lg:tooltip-right tooltip-primary" data-tip="Hide Password">
                                            <FaEyeSlash />
                                        </button>
                                        :
                                        <button type='button' onClick={() => setShowPassword(true)} className="btn btn-sm border-0 bg-transparent hover:bg-transparent  hover:border-0 absolute z-10 right-4 top-1/2 transform -translate-y-0.5 lg:tooltip lg:tooltip-right tooltip-warning" data-tip="Show Password">
                                            <FaEye />
                                        </button>
                                }
                            </div>

                            <a className="link link-hover link-info text-right text-sm">Forgot password?</a>
                            <button className={`btn mt-4 ${formLoading ? "btn-disabled" : "bg-primary hover:bg-primary-dark text-white"}`} type='submit'>Login</button>
                        </fieldset>
                    </form>
                </div>
                <p className='text-center my-5 text-xs'>&copy; {new Date().getFullYear()} EDUTRACK. All rights reserved.</p>
            </div>
        </div>
    );
};

export default Signin;