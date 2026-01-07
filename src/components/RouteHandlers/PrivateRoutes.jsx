import LoadingSpinner from '../ui/LoadingSpinner.jsx';
import useAuth from '../../hooks/useAuth.jsx';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoutes = ({ children, role }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    // 1. Wait for user to load
    if (loading) return <LoadingSpinner />;

    // 2. Authentication check. If no user, redirect to login
    if (!user) return <Navigate to="/signin" state={{ from: location }} replace />

    // Check if 'role' is an array. If it is, check if it includes user.role.
    // If it's a string, check for equality.
    const allowedRoles = Array.isArray(role) ? role : [role];

    // 3. Authorization check. 
    if (role && !allowedRoles.includes(user?.role)) {
        console.warn(`User role '${user.role}' denied access to required role '${role}'`);
        return <Navigate to="/unauthorized" replace /> // TODO: add a unauthorized page
    }

    return children;
};


export default PrivateRoutes;