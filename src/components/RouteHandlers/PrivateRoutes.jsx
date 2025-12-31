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

    // 3. Authorization check. 
    if (role && user?.role !== role) {
        console.warn(`User role '${user.role}' denied access to required role '${role}'`);
        return <Navigate to="/unauthorized" replace /> // TODO: add a unauthorized page
    }

    return children;
};

// PrivateRoute.propTypes = {
//     children: PropTypes.node.isRequired,
//     role: PropTypes.string // Optional role to check against
// }

export default PrivateRoutes;