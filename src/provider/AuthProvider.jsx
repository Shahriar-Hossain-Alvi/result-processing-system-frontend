import { createContext, useCallback, useEffect, useState } from "react";
import axiosSecure from "../utils/axios/axiosSecure.js";
import axiosPublic from "../utils/axios/axiosPublic.js";


export const AuthContext = createContext(
    {
        user: null,
        loading: true,
        setLoading: (newState) => { {/* Its to avoid error/warning */ } },
        // fetchUser: () => Promise.resolve({ role: null }), // role:null to avoid 'void' warning
        fetchUser: () => Promise.resolve({ role: null }), // role:null to avoid 'void' warning
        logout: (bypass) => { },
        axiosSecure: axiosSecure,
        axiosPublic: axiosPublic
    }
);

// Main Auth Provider
const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

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
        axiosSecure
    }


    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;