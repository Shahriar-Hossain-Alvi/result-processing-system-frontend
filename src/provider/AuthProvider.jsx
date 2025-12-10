import React, { createContext, useState } from 'react';
import useAxiosPublic from '../hooks/useAxiosPublic';


export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // set user
    const [loading, setLoading] = useState(true); // for loading spinner
    const axiosPublic = useAxiosPublic(); // axios instance with base url


    // logout user 
    const logout = () => {
        return '';
    }

    // save user to local storage

    const authInfo = {
        logout,
        setLoading,
        loading,
        user,
        setUser
    }

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;