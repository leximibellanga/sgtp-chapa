import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function RoleRoute({ roleExigida }) {
  const { usuario } = useAuth();

  if (usuario.role !== roleExigida) {
    const destino =
      usuario.role === "ADMIN" ? "/admin/dashboard" : "/motorista/dashboard";
    return <Navigate to={destino} replace />;
  }

  return <Outlet />;
}
