import { useEffect } from 'react';
import useAuth from '../../hooks/useAuth.jsx';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../ui/LoadingSpinner.jsx';

const RoleBasedRedirects = () => {
   const { user, loading, isServerWaking } = useAuth();
   const navigate = useNavigate();

   useEffect(() => {
      // only redirect if the server is NOT waking and we are NOT loading auth
      if (!loading && !isServerWaking) {
         if (user) {
            const routes = { admin: '/admin', super_admin: '/admin', teacher: '/teacher', student: '/student' };
            navigate(routes[user.role] || '/unauthorized', { replace: true });
            // switch (user.role) {
            //    case 'admin': navigate('/admin', { replace: true }); break;
            //    case 'super_admin': navigate('/admin', { replace: true }); break;
            //    case 'teacher': navigate('/teacher', { replace: true }); break;
            //    case 'student': navigate('/student', { replace: true }); break;
            //    default: navigate('/unauthorized', { replace: true });
            // }
         } else {
            navigate('/signin', { replace: true });
         }
      }
   }, [user, loading, navigate, isServerWaking]);

   // Show full screen "Waking up" message
   if (isServerWaking) {
      return (
         <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 p-4">
            <div className="max-w-md w-full p-8 bg-base-100 rounded-2xl shadow-xl text-center">
               <span className="loading loading-ring loading-lg text-primary mb-4"></span>
               <h2 className="text-xl font-bold">Connecting to Services</h2>
               <p className="text-base-content/70 mt-2">The server is waking up from a deep sleep. This usually takes about 60 seconds. Please wait.</p>
            </div>
         </div>
      )
   }

   if (loading) {
      return <LoadingSpinner />;
   }

   return null;
};

export default RoleBasedRedirects;