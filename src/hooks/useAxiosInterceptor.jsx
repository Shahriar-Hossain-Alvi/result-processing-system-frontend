import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from './useAuth.jsx';

const useAxiosInterceptor = () => {
    // This runs inside the Router context (via MainLayout)
    const navigate = useNavigate();
    const { logout, setLoading, axiosSecure } = useAuth();


    useEffect(() => {

        const interceptorId = axiosSecure.interceptors.response.use(
            (response) => response,
            async (error) => {
                const status = error.response?.status;
                const url = error.config?.url;

                // 1. Bypass public endpoints
                // If the 401/403 came from login or logout, ignore it.
                // The calling component (SignIn.jsx or the logout function) handles these.
                if (url && (url.endsWith('/auth/login') || url.endsWith('/auth/logout'))) {
                    return Promise.reject(error);
                }

                // 2. Handle Protected route failure (401/403)
                if (status === 401 || status === 403) {
                    console.error("Session expired/Invalid. Interceptor redirecting...", error);

                    // Call logout with "true" to skip redundant backend call
                    await logout(true);
                    setLoading(false);
                    navigate('/signin');
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