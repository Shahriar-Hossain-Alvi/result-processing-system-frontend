import { Route } from 'react-router-dom';
import TeacherLayout from '../layout/TeacherLayout.jsx';
import PrivateRoutes from '../../components/RouteHandlers/PrivateRoutes.jsx';
import TeacherProfile from '../../pages/teacher/TeacherProfile.jsx';
import MyAssignedCourses from '../../pages/teacher/MyAssignedCourses.jsx';

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
        {/* <Route path="my-courses" element={<OfferedCourses />} /> */}
        {/* <Route path="my-courses" element={<OfferedCourses />} /> */}
    </Route >
)

export default TeacherRoutes;