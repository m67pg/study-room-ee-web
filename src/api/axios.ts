import axios, { type AxiosInstance } from "axios";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const api: AxiosInstance = axios.create({
    baseURL: apiBaseUrl, 
    withCredentials: true, // セッションCookieのやり取りに必須
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest', // CI4にAJAXリクエストだと認識させる
    },
});

export default api;