import React from 'react'
import { BrowserRouter, Navigate, replace, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './routes/ProtectedRoute.route'
import RoleRoute from './routes/RoleRoute.route'
import LoginPage from "./pages/auth/LoginPage"
import AdminLayout from './components/layout/AdminLayout'
import MotoristaLayout from './components/layout/MotoristaLayout'
import ListaCarrosPage from './pages/admin/carros/ListaCarrosPage'
import { Toaster } from 'sonner'
import ListaUsuariosPage from './pages/admin/usuarios/ListaUsuariosPage'
import ListaRegistosPage from './pages/admin/registos/ListaRegistosPage'
import ListaRegistosMotoristaPage from './pages/motorista/ListaRegistosMotoristaPage'
import FormRegistoPage from './pages/motorista/FormRegistoPage'
import ListaGastosPage from './pages/admin/gastos/ListaGastosPage'
import DashboardPage from './pages/admin/DashboardPage'
import RelatoriosPage from './pages/admin/relatorios/RelatorioPage'

const App = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />

                    <Route element={<ProtectedRoute />}>
                        <Route element={<RoleRoute roleExigida={"ADMIN"} />}>
                            <Route element={<AdminLayout />}>
                                <Route path="/admin/dashboard" element={<DashboardPage />} />
                                <Route path="/admin/carros" element={<ListaCarrosPage />} />
                                <Route path="/admin/usuarios" element={<ListaUsuariosPage />} />
                                <Route path="/admin/registos" element={<ListaRegistosPage />} />
                                <Route path="/admin/gastos" element={<ListaGastosPage />} />
                                <Route path="/admin/relatorios" element={<RelatoriosPage />} />
                            </Route>
                        </Route>

                        <Route element={<RoleRoute roleExigida={"MOTORISTA"} />}>
                            <Route element={<MotoristaLayout />}>
                                <Route path="/motorista/dashboard" element={<div>Dashboad (em construcao)</div>} />
                                <Route path="/motorista/registos" element={<ListaRegistosMotoristaPage />} />
                                <Route path="/motorista/registos/novo" element={<FormRegistoPage />} />
                            </Route>
                        </Route>
                    </Route>

                    <Route path="/" element={<Navigate to={"/login"} replace />} />
                </Routes>
            </AuthProvider>

            {/* Notificacoes */}
            <Toaster position='top-center' duration={3000} closeButton richColors/>
        </BrowserRouter>
    )
}

export default App
