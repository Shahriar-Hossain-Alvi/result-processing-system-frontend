import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import MainLayout from "../layout/MainLayout.jsx";
import ErrorPage from "../../pages/public/ErrorPage.jsx";
import Signin from "../../pages/auth/Signin.jsx";
import Notice from "../../pages/public/Notice.jsx";
import Contact from "../../pages/public/Contact.jsx";
import Faculties from "../../pages/public/Faculties.jsx";
import AdminRoutes from "./AdminRoutes.jsx";
import TeacherRoutes from "./TeacherRoutes.jsx";
import StudentRoutes from "./StudentRoutes.jsx";
import Unauthorize from "../../pages/public/Unauthorize.jsx";
import RoleBasedRedirects from "../../components/RouteHandlers/RoleBasedRedirects.jsx";


const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<MainLayout />} errorElement={<ErrorPage />}>
            <Route index element={<RoleBasedRedirects />} />

            {/* public routes */}
            <Route path="/signin" element={<Signin />} />
            <Route path="/notice" element={<Notice />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faculties" element={<Faculties />} />
            <Route path="/unauthorized" element={<Unauthorize />} />

            {/* Admin routes */}
            {AdminRoutes}

            {/* Teacher routes */}
            {TeacherRoutes}

            {/* Student routes */}
            {StudentRoutes}
        </Route>
    )
)
export default router;
