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
        {/* <Route path="dashboard" element={<AdminDashboard />} /> */}
    </Route>
)

export default AdminRoutes;