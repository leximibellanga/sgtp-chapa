import {
  Bell,
  Bus,
  BusFront,
  Car,
  CarFront,
  ClipboardList,
  Home,
  LogOut,
  Menu,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";

export default function MotoristaLayout() {
  const { usuario, logout } = useAuth();
  const [notificacoes, setNotificacoes] = useState(2); // depois mudar para vir dinamicamente

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex flex-col">
      <header className="bg-[#001f18] text-emerald-100 px-4 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Menu size={18} />
          <div className="flex items-center gap-1.5">
            <span className="bg-emerald-100 rounded-lg p-1">
              <CarFront size={18} color="#001f18" fill="#001f18" />
            </span>
            <h1 className="flex flex-col font-bold gap-0">
              <span className="text-xs">SGTP</span>
              <span className="text-[10px] font-light">Sistema de Chapa</span>
            </h1>
          </div>
        </div>
        <div>
          <button
            className="relative p-2 bg-emerald-950 rounded-lg grid place-items-center"
            onClick={() => alert("Notificaoes em desenvolvimento")}
          >
            {notificacoes >= 1 && (
              <span className="absolute top-1 right-1.5 bg-red-600 h-2.5 w-2.5 rounded-full"></span>
            )}
            <Bell size={18} />
          </button>
        </div>
      </header>

      <main className="flex-1 px-4 py-5 pb-24">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-[#001f18] text-emerald-100 flex items-center justify-around py-3 border-t border-black/10">
        <NavLink
          to={"/motorista/dashboard"}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-xs ${isActive ? "text-emerald-500" : "text-emerald-100"}`
          }
        >
          <Home size={20} />
          Inicio
        </NavLink>
        <NavLink
          to={"/motorista/registos"}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-xs ${isActive ? "text-emerald-300" : "text-emerald-100"}`
          }
        >
          <ClipboardList size={20} />
          Registos
        </NavLink>
      </nav>
    </div>
  );
}

{
  /* <div>
          <p className="text-xs text-gray-200">Ola,</p>
          <p className="text-lg font-bold">{usuario?.nome}</p>
        </div>
        <button
          onClick={logout}
          className="p-2 rounded-full hover:bg-green-700 cursor-pointer"
        >
          <LogOut size={18} />
        </button> */
}
