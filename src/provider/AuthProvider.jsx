import { createContext, useCallback, useEffect, useState } from "react";
import axiosSecure from "../utils/axios/axiosSecure.js";
import axiosPublic from "../utils/axios/axiosPublic.js";
import toast from "react-hot-toast";
import axios from "axios";


export const AuthContext = createContext(
    {
        user: null,
        loading: true,
        setLoading: (newState) => { {/* Its to avoid error/warning */ } },
        fetchUser: () => Promise.resolve({ role: null }), // role:null to avoid 'void' warning
        logout: (bypass) => { },
        axiosSecure: axiosSecure,
        axiosPublic: axiosPublic,
        isServerWaking: false
    }
);


// Main Auth Provider
const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isServerWaking, setIsServerWaking] = useState(false);

    // Check if the server is starting
    useEffect(() => {
        let interval;
        const checkServer = async () => {
            try {
                // If this succeeds immediately, server is already awake
                await axios.get(`${import.meta.env.VITE_API_BASE_URL}/server/health-check`, { timeout: 3000 });
                setIsServerWaking(false);
            } catch (err) {
                // If it fails or times out, the server is likely spinning up
                setIsServerWaking(true);

                // Keep polling until it's up
                interval = setInterval(async () => {
                    try {
                        await axios.get(`${import.meta.env.VITE_API_BASE_URL}/server/health-check`);
                        setIsServerWaking(false);
                        clearInterval(interval);
                    } catch (e) { /* still waking up */ }
                }, 5000);
            }
        };
        checkServer();

        // CLEANUP: This stops the polling if the component unmounts
        return () => {
            if (interval) clearInterval(interval);
        };
    }, []);

    console.log(user);

    // logout sets state, then conditionally calls backend
    const logout = useCallback(async (bypassBackendCall = false) => {
        // 1. Immediate State Cleanup
        setUser(null);
        setLoading(false);

        if (!bypassBackendCall) {
            try {
                const res = await axiosSecure.post('/auth/logout');
                console.log("Logout message", res?.data?.message);
                toast.success(res?.data?.message);
            } catch (error) {
                console.error("Backend logout failed", error);
            }
        }
    }, [])


    // fetch user
    const fetchUser = useCallback(async () => {
        try {
            const res = await axiosSecure.get('/users/me');
            setUser(res?.data);
            return res?.data;
        } catch (error) {
            console.log(error);
            if (error.response?.status === 401) {
                // This is a known state: User is just not logged in.
                setUser(null);
                console.log("Token expires/No active session found/login again.");
            } else {
                console.error("Actual error while fetching user", error);
            }
            return null;
        } finally {
            setLoading(false);
        }
    }, []);


    // Initial Session Check on mount
    useEffect(() => {
        fetchUser();
    }, [fetchUser]);


    const authInfo = {
        user,
        loading,
        setLoading,
        logout,
        fetchUser,
        axiosPublic,
        axiosSecure,
        isServerWaking
    }


    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;