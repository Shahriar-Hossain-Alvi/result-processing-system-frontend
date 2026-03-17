import React from 'react';
import { Route } from 'react-router-dom';
import StudentLayout from '../layout/StudentLayout.jsx';
import StudentDashboard from '../../pages/student/StudentDashboard.jsx';
import PrivateRoutes from '../../components/RouteHandlers/PrivateRoutes.jsx';
import StudentProfile from '../../pages/student/StudentProfile.jsx';
import SingleStudentMarks from '../../pages/student/SingleStudentMarks.jsx';
import Marks from '../../pages/admin/Marks.jsx';

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
        <Route path="profile" element={<StudentProfile />} />
        <Route path="marks" element={<SingleStudentMarks />} />
        <Route path="marks" element={<Marks />} />
        {/* <Route path="allUser" element={<AllUser />} /> */}
        {/* <Route path="user/:id" element={<SingleUserDetails />} /> */}
    </Route>
)

export default StudentRoutes;