import useAuth from "./useAuth.jsx";

const useAxiosSecure = () => {
    const { axiosSecure } = useAuth();

    return axiosSecure;
};

export default useAxiosSecure;