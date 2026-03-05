import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from './useAuth.jsx';
import axios from 'axios';

const useAxiosInterceptor = () => {
    // This runs inside the Router context (via MainLayout)
    const navigate = useNavigate();
    const { logout, setLoading, axiosSecure } = useAuth();


    useEffect(() => {

        const interceptorId = axiosSecure.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;
                const status = error.response?.status;
                const url = error.config?.url;

                // 1. Bypass public endpoints
                // If the 401/403 came from login or logout, ignore it.
                // The calling component (SignIn.jsx or the logout function) handles these.
                if (url && (url.endsWith('/auth/login') || url.endsWith('/auth/logout') || url.endsWith('/auth/refresh'))) {
                    return Promise.reject(error);
                }


                // 2. Handle Protected route failure (403)
                // originalRequest._retry confirms that this is the first retry not a subsequent retry(loop)
                if (status === 401 && !originalRequest._retry) {
                    try {
                        console.log("Access token expired. Attempting to refresh...");

                        // call the /refresh route
                        const response = await axios.post('/auth/refresh', {}, { withCredentials: true });
                        console.log("Token refreshed successfully");

                        return axiosSecure(originalRequest); // send the original request again
                    } catch (refreshError) {
                        console.log("Refresh token also expired or invalid. Logging out");

                        // if refresh token also expired, logout
                        await logout(true);
                        setLoading(false);
                        navigate('/signin');
                        return Promise.reject(refreshError);
                    }
                }
                // 3. Handle Unauthorized route failure (403)
                if (status === 403) {
                    console.error("Forbidden access. Interceptor redirecting...", error);

                    // Call logout with "true" to skip redundant backend call
                    await logout(true);
                    setLoading(false);
                    navigate('/signin');
                    return Promise.reject(error);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            // Cleanup on unmount/re-run
            axiosSecure.interceptors.response.eject(interceptorId);
        }
    }, [navigate, logout, setLoading, axiosSecure])

};

export default useAxiosInterceptor;