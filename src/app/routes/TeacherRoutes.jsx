import { Route } from 'react-router-dom';
import TeacherLayout from '../layout/TeacherLayout.jsx';
import PrivateRoutes from '../../components/RouteHandlers/PrivateRoutes.jsx';
import TeacherProfile from '../../pages/teacher/TeacherProfile.jsx';
import MyAssignedCourses from '../../pages/teacher/MyAssignedCourses.jsx';
import Marks from '../../pages/admin/Marks.jsx';

const TeacherRoutes = (
    <Route
        path="/teacher"
        element={
            <PrivateRoutes role="teacher">
                <TeacherLayout />
            </PrivateRoutes>
        }>

        <Route index element={<TeacherProfile />} />
        <Route path="my-courses" element={<MyAssignedCourses />} />
        <Route path="marks" element={<Marks />} />
    </Route >
)

export default TeacherRoutes;