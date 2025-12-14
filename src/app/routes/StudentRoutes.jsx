import React from 'react';
import { Route } from 'react-router-dom';
import StudentLayout from '../layout/StudentLayout.jsx';
import StudentDashboard from '../../pages/student/StudentDashboard.jsx';

const StudentRoutes = (
    <Route path='/student' element={<StudentLayout />}>
        <Route index element={<StudentDashboard />} />
    </Route>
)

export default StudentRoutes;