// src/utils/axios/axiosPublic.js
import axios from "axios";

const axiosPublic = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    // No withCredentials here. Public routes don't send cookies.
});

export default axiosPublic;