import { Route } from 'react-router-dom';
import StudentLayout from '../layout/StudentLayout.jsx';
import PrivateRoutes from '../../components/RouteHandlers/PrivateRoutes.jsx';
import StudentProfile from '../../pages/student/StudentProfile.jsx';
import SingleStudentMarks from '../../pages/student/SingleStudentMarks.jsx';
import Results from '../../pages/private/Results.jsx';
import OfferedCourses from '../../pages/student/OfferedCourses.jsx';

const StudentRoutes = (
    <Route
        path='/student'
        element={
            <PrivateRoutes role="student">
                <StudentLayout />
            </PrivateRoutes>
        }
    >
        <Route index element={<StudentProfile />} />
        <Route path="my-courses" element={<OfferedCourses />} />
        <Route path="marks" element={<SingleStudentMarks />} />
        <Route path="results" element={<Results />} />
    </Route>
)

export default StudentRoutes;