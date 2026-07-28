import axiosClient from "./axiosClient"

export default function login(email, senha) {
    return axiosClient.post("/auth/login", {
        email,
        senha
    });
}
