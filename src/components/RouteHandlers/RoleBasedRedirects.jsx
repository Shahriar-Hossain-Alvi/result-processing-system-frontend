import React, { useEffect } from 'react';
import useAuth from '../../hooks/useAuth.jsx';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../ui/LoadingSpinner.jsx';

const RoleBasedRedirects = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
         if (loading) {
            <LoadingSpinner />
            return
         } 

         if(user) {
            switch(user.role) {
                case 'admin': navigate('/admin', { replace: true }); break;
                case 'teacher': navigate('/teacher', { replace: true }); break;
                case 'student': navigate('/student', { replace: true }); break;
                default: navigate('/unauthorized', { replace: true });
            }
         } else{
            navigate('/signin', { replace: true });
         }
    })

    return null;
};

export default RoleBasedRedirects;