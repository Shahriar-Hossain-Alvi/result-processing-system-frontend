import useAuth from "./useAuth.jsx";

const useAxiosPublic = () => {
    const { axiosPublic } = useAuth();
    return axiosPublic;
};

export default useAxiosPublic;