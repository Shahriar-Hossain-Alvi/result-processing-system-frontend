import { Route } from 'react-router-dom';
import TeacherLayout from '../layout/TeacherLayout.jsx';
import TeacherDashboard from '../../pages/teacher/TeacherDashboard.jsx';
import PrivateRoutes from '../../components/RouteHandlers/PrivateRoutes.jsx';

const TeacherRoutes = (
    <Route
        path="/teacher"
        element={
            <PrivateRoutes role="teacher">
                <TeacherLayout />
            </PrivateRoutes>
        }>

        <Route index element={<TeacherDashboard />} />
    </Route >
)

export default TeacherRoutes;