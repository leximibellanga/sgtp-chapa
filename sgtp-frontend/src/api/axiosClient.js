import axios from "axios";

const axiosClient = axios.create({
    baseURL: "http://localhost:8080/api",
})

// Interceptor de REQUEST: anexa token JWT em toda camada 
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config
})

// Interceptor de REQUEST: se token expirar/for invalido, desloga automaticamente
axiosClient.interceptors.response.use(
    (res) => res,
    (erro) => {
        if (erro.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("usuario");
            window.location.href = "/login";
        }
        return Promise.reject(erro)
    }
)

export default axiosClient
