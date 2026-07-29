import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"
import { LoaderFullPage } from "../components/ui/Loader";

export default function ProtectedRoute() {
    const { usuario, carregando } = useAuth()

    if (carregando) return <LoaderFullPage />

    if (!usuario) return <Navigate to={"/login"} replace />;

    return <Outlet />
}
