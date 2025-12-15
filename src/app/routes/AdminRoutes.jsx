import { Route } from "react-router-dom";
import AdminDashboard from "../../pages/admin/AdminDashboard.jsx";
import AdminLayout from "../layout/AdminLayout.jsx";
import PrivateRoutes from "../../components/RouteHandlers/PrivateRoutes.jsx";


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
        {/* <Route path="departments" element={<AdminDashboard />} /> */}
        {/* <Route path="subjects" element={<AdminDashboard />} /> */}
        {/* <Route path="assignSubject" element={<AdminDashboard />} /> */}
        {/* <Route path="addUser" element={<AdminDashboard />} /> */}
        {/* <Route path="allUser" element={<AdminDashboard />} /> */}
        {/* <Route path="insertMarks" element={<AdminDashboard />} /> */}
        {/* <Route path="results" element={<AdminDashboard />} /> */}
    </Route>
)

export default AdminRoutes;