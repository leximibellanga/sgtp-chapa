import { createContext, useEffect, useState } from "react";
import { login as loginRequest } from "../api/authApi"

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null);
    const [carregando, setCarregando] = useState(true)

    useEffect(() => {
        const usuarioSalvo = localStorage.getItem("usuario");
        const token = localStorage.getItem("token")

        if (usuarioSalvo && token) {
            setUsuario(JSON.parse(usuarioSalvo));
        }
        setCarregando(false);
    }, [])

    async function login(email, senha) {
        const resposta = await loginRequest(email, senha)
        const { token, nome, email: emailResp, role } = resposta.data;

        const dadosUsuario = { nome, email: emailResp, role };

        localStorage.setItem("token", token);
        localStorage.setItem("usuario", JSON.stringify(dadosUsuario));
        setUsuario(dadosUsuario);

        return dadosUsuario
    }

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
    }

    return (
        <AuthContext.Provider value={{usuario, login, logout, carregando}}>
            {children}
        </AuthContext.Provider>
    )
}
