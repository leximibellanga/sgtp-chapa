import {
  ArrowBigLeft,
  BarChart3,
  BusFront,
  Car,
  CarFront,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  PanelLeftClose,
  Users,
  Wallet,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

const links = [
  {
    to: "/admin/dashboard",
    label: "Dashboard",
    title: "Dashboard",
    icon: LayoutDashboard,
  },
  { to: "/admin/carros", label: "Carros", title: "Carros", icon: Car },
  { to: "/admin/usuarios", label: "Usuarios", title: "Usuarios", icon: Users },
  {
    to: "/admin/registos",
    label: "Registos",
    title: "Registos",
    icon: ClipboardList,
  },
  { to: "/admin/gastos", label: "Gastos", title: "Gastos", icon: Wallet },
  {
    to: "/admin/relatorios",
    label: "Relatorios",
    title: "Relatorios",
    icon: BarChart3,
  },
];

// CORES:
/*
    #001f18 - verde black
    #003328 - verde dark
    #d8f3dc - verde background
*/

export default function Sidebar() {
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(true);

  const sidebarWidth = () => {
    if (document.body.offsetWidth >= 768) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    sidebarWidth();
  }, []);

  addEventListener("resize", sidebarWidth);

  return (
    <aside
      className={`sticky ml-2 mt-2 mb-2 rounded-xl bg-[#001f18] text-white flex flex-col transition-all duration-450 overflow-hidden ${isOpen ? "w-60" : "w-16"}`}
    >
      <div
        className={`h-18 flex items-center ${isOpen ? "justify-between" : "justify-center"} px-3 border-b border-emerald-950`}
      >
        {isOpen && (
          <div className="flex items-center ml-1">
            <span className="bg-[#d8f3dc] text-emerald-950 rounded-lg grid place-items-center p-1.25 shadow ">
              <CarFront size={18} color="#001f18" fill="#001f18" />
            </span>
            <h1 className="flex flex-col pl-3 font-bold gap-0">
              <span className="text-sm">SGTP</span>
              <span className="text-xs font-light">Sistema de Chapa</span>
            </h1>
          </div>
        )}
        <button
          className={`cursor-pointer  p-2 rounded-lg transition-all duration-300 hover:animate-pulse hover:bg-emerald-950 ${isOpen ? "-mt-5 -mr-1" : ""}`}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <PanelLeftClose size={17} /> : <Menu size={18} />}
        </button>
      </div>

      <nav className="flex-1 px-3 space-y-1 mt-3">
        {links.map(({ to, label, title, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            title={title}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                             ${
                               isActive
                                 ? "bg-emerald-950 text-emerald-100"
                                 : "text-emerald-100 hover:bg-emerald-950"
                             }`
            }
          >
            <Icon size={16} />
            {isOpen && label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-6 flex items-center">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-emerald-100 cursor-pointer transition-all duration-300 hover:bg-emerald-950"
        >
          <LogOut size={16} />
          {isOpen && <p>Sair</p>}
        </button>
      </div>
    </aside>
  );
}
