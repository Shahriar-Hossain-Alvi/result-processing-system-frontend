import axios from "axios";

const axiosSecure = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    // Must include credentials for cookies to be sent cross-domain
    withCredentials: true
})

export default axiosSecure;