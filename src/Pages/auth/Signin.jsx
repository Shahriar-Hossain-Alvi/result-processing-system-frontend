import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEyeSlash } from 'react-icons/fa';
import { FaEye } from 'react-icons/fa6';
import useAxiosPublic from '../../hooks/useAxiosPublic.jsx';
import useAuth from '../../hooks/useAuth.jsx';
import { useNavigate } from 'react-router-dom';
// @ts-ignore
import axiosSecure from '../../utils/axios/axiosSecure.js';
import useAxiosSecure from '../../hooks/useAxiosSecure.jsx';
import toast, { Toaster } from 'react-hot-toast';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';

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

            if (res?.data?.message === "Login successful") {
                toast.success(res?.data?.message);
                // 2: Fetch user info using the new cookie
                const userData = await fetchUser();
                // 3: Redirect based on the fetched data 
                if (userData?.role === "admin") {
                    navigate('/admin');
                } else if (userData?.role === "teacher") {
                    navigate('/teacher');
                } else if (userData?.role === "student") {
                    navigate('/student')
                }
            }
        } catch (error) {
            setLoading(false);
            console.error(error);
        } finally {
            setFormLoading(false);
        }
    }




    return (
        <div className="hero min-h-screen">
            <div className="p-8 bg-base-200 rounded-2xl flex-col w-3/4 lg:w-1/3">
                <div className="text-center">
                    <h1 className="text-5xl font-bold">Login</h1>
                    <p className="py-6">
                        Use your email and password to login
                    </p>
                </div>
                <div className="card bg-base-100 w-full shrink-0 shadow-2xl">
                    <form onSubmit={handleSubmit(signInUser)} className="card-body">
                        <fieldset className="fieldset">
                            <div className={`w-full ${errors.email && "tooltip tooltip-open tooltip-top tooltip-error"}`} data-tip={errors.email && errors.email.message}>
                                <input
                                    type="email"
                                    {...register("email", { required: "Email is required" })} className="input w-full"
                                    placeholder="Email"
                                />
                            </div>

                            <div className='relative my-3'>
                                <div className={`w-full ${errors.password && "tooltip tooltip-open tooltip-bottom tooltip-error"}`} data-tip={errors.password && errors.password.message}>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="input w-full"

                                        {...register("password",
                                            {
                                                required: "Password is required",
                                                minLength: { value: 6, message: "Password must be at least 6 characters" },
                                                maxLength: { value: 32, message: "Password must be at most 32 characters" }
                                            })}
                                        placeholder="Password"
                                    />
                                    {/* {errors.password && <span className="text-error">{errors.password.message}</span>} */}
                                </div>

                                {
                                    showPassword ?
                                        <button type='button' onClick={() => setShowPassword(false)} className="btn btn-sm bg-base-100 btn-ghost absolute z-10 right-4 top-1/2 transform -translate-y-1/2 tooltip tooltip-right tooltip-primary" data-tip="Hide Password">
                                            <FaEyeSlash />
                                        </button>
                                        :
                                        <button type='button' onClick={() => setShowPassword(true)} className="btn btn-sm bg-base-100 btn-ghost absolute z-10 right-4 top-1/2 transform -translate-y-1/2 tooltip tooltip-right tooltip-warning" data-tip="Show Password">
                                            <FaEye />
                                        </button>
                                }
                            </div>

                            <div><a className="link link-hover">Forgot password?</a></div>
                            <button className={`btn mt-4 ${formLoading ? "btn-disabled" : "btn-primary"}`} type='submit'>Login</button>
                        </fieldset>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signin;