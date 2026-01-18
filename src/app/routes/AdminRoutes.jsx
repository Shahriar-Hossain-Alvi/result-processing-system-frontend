import { Route } from "react-router-dom";
import AdminDashboard from "../../pages/admin/AdminDashboard.jsx";
import AdminLayout from "../layout/AdminLayout.jsx";
import PrivateRoutes from "../../components/RouteHandlers/PrivateRoutes.jsx";
import AddUser from "../../pages/admin/AddUser.jsx";
import DepartmentsAndSemesters from "../../pages/admin/DepartmentsAndSemesters.jsx";
import AllUser from "../../pages/admin/AllUser.jsx";
import SingleUserDetails from "../../pages/private/SingleUserDetails.jsx";
import Subjects from "../../pages/admin/Subjects.jsx";
import AssignedCourses from "../../pages/admin/AssignedCourses.jsx";


const AdminRoutes = (
    <Route
        path="/admin"
        element={
            <PrivateRoutes role={["admin", "super_admin"]}>
                <AdminLayout />
            </PrivateRoutes>
        }
    >

        <Route index element={<AdminDashboard />} />
        <Route path="addUser" element={<AddUser />} />
        <Route path="allUser" element={<AllUser />} />
        <Route path="user/:id" element={<SingleUserDetails />} />
        {/* <Route index element={<AdminDashboard />} /> */}
        {/* <Route path="insertMarks" element={<AdminDashboard />} /> */}
        {/* <Route path="results" element={<AdminDashboard />} /> */}
        <Route path="subjects" element={<Subjects />} />
        <Route path="assignedCourses" element={<AssignedCourses />} />
        <Route path="departmentsAndSemesters" element={<DepartmentsAndSemesters />} />
    </Route>
)

export default AdminRoutes;