import { Route } from "react-router-dom";
import AdminDashboard from "../../pages/admin/AdminDashboard.jsx";
import AdminLayout from "../layout/AdminLayout.jsx";
import PrivateRoutes from "../../components/RouteHandlers/PrivateRoutes.jsx";
import AddUser from "../../pages/admin/AddUser.jsx";
import DepartmentsAndSemesters from "../../pages/admin/DepartmentsAndSemesters.jsx";
import AllUser from "../../pages/admin/AllUser.jsx";


const AdminRoutes = (
    <Route
        path="/admin"
        element={
            <PrivateRoutes role="admin">
                <AdminLayout />
            </PrivateRoutes>
        }
    >

        <Route index element={<AdminDashboard />} />
        {/* <Route index element={<AdminDashboard />} /> */}
        <Route path="departmentsAndSemesters" element={<DepartmentsAndSemesters />} />
        {/* <Route path="subjects" element={<AdminDashboard />} /> */}
        {/* <Route path="assignSubject" element={<AdminDashboard />} /> */}
        <Route path="addUser" element={<AddUser />} />
        <Route path="allUser" element={<AllUser />} />
        {/* <Route path="insertMarks" element={<AdminDashboard />} /> */}
        {/* <Route path="results" element={<AdminDashboard />} /> */}
    </Route>
)

export default AdminRoutes;