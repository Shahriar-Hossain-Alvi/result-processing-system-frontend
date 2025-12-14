import { Outlet } from "react-router-dom";
import Navbar from "../../components/ui/Navbar.jsx";
import AuthProvider from "../../provider/AuthProvider.jsx";


const MainLayout = () => {
    return (
        <AuthProvider>
            <div className="font-noto-sans">
                <Navbar />
                <Outlet />
                {/* TODO: Footer here */}
            </div>
        </AuthProvider>
    );
};

export default MainLayout;