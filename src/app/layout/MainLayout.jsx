import { Outlet } from "react-router-dom";
import Navbar from "../../components/ui/Navbar.jsx";
import AuthProvider from "../../provider/AuthProvider.jsx";
import useAxiosInterceptor from "../../hooks/useAxiosInterceptor.jsx";
import { Toaster } from "react-hot-toast";


const MainLayoutWithAxiosInterceptor = () => {
    useAxiosInterceptor();

    return (
        <div className="font-noto-sans bg-base-200">
            <Navbar />
            <Toaster />
            <Outlet />
            {/* TODO: Footer here */}
        </div>
    )
};



const MainLayout = () => {
    return (
        <AuthProvider>
            <MainLayoutWithAxiosInterceptor />
        </AuthProvider>
    );
};

export default MainLayout;