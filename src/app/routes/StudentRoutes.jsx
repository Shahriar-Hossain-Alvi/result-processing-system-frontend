import React from 'react';
import { Route } from 'react-router-dom';
import StudentLayout from '../layout/StudentLayout.jsx';
import StudentDashboard from '../../pages/student/StudentDashboard.jsx';
import PrivateRoutes from '../../components/RouteHandlers/PrivateRoutes.jsx';

const StudentRoutes = (
    <Route
        path='/student'
        element={
            <PrivateRoutes role="student">
                <StudentLayout />
            </PrivateRoutes>
        }
    >
        <Route index element={<StudentDashboard />} />
    </Route>
)

export default StudentRoutes;