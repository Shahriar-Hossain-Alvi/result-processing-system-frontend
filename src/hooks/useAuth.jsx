import { useContext } from 'react';
import { AuthContext } from '../provider/AuthProvider.jsx';

const useAuth = () => {
    return useContext(AuthContext);
};

export default useAuth;