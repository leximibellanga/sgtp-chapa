import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Bell, ChevronDown, LogOut, Search, User } from "lucide-react";
import Input from "../ui/Input";

export default function Navbar() {
  const { usuario, logout } = useAuth();
  const [menuAberto, setMenuAberto] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickFora(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuAberto(false);
      }
    }
    document.addEventListener("mousedown", handleClickFora);
    return () => document.removeEventListener("mousedown", handleClickFora);
  }, []);

  const iniciais = usuario?.nome
    ?.split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <header className="border-b border-emerald-950/5 rounded-tl-lg rounded-tr-lg flex items-center justify-end gap-5 px-5 py-2.5 sm:justify-between">
      <div className="relative hidden w-60 items-center ml-3 sm:flex">
        <Search size={14} className="text-emerald-950/80 ml-4 z-10" />
        <input
          className="absolute w-full bg-emerald-950/5 border border-emerald-950/20 pl-9 pr-4 py-1.5 rounded-lg text-sm outline-none transition focus:ring-2 focus:ring-emerald-950/30 text-emerald-950/80"
          placeholder="Pesquisar..."
        />
      </div>
      <div className="relative flex items-center gap-2" ref={menuRef}>
        <button
          className="relative bg-white p-1.5 rounded-full border border-emerald-950/10 cursor-pointer hover:animate-pulse hover:shadow"
          onClick={() => alert("Notificaoes ainda em desenvolvimento")}
        >
          <span className="absolute top-0.5 right-1.5 bg-[crimson] rounded-full h-2.5 w-2.5"></span>
          <Bell size={18} />
        </button>
        <button
          onClick={() => setMenuAberto((v) => !v)}
          className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-emerald-950/5 cursor-pointer transition"
        >
          <div className="w-8 h-8 rounded-full bg-green-950 text-neutral-200 flex items-center justify-center text-xs font-bold">
            {iniciais}
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-sm font-medium text-green-950 leading-tight">
              {usuario?.nome}
            </p>
            <p className="text-xs text-neutral-500 leading-tight">
              Administrador
            </p>
          </div>
          <ChevronDown size={16} className="text-neutral-500" />
        </button>

        {menuAberto && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-neutral-300 rounded-xl shadow-lg py-1.5 z-20">
            <div className="px-3 py-2 border-b border-neutral-300 sm:hidden">
              <p className="text-sm font-medium text-green-950">
                {usuario?.nome}
              </p>
              <p className="text-xs text-neutral-500">{usuario?.email}</p>
            </div>
            <button
              disabled
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-neutral-500/50 cursor-not-allowed"
            >
              <User size={16} />
              Meu perfil
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-neutral-700 hover:bg-red-800 hover:text-neutral-200 transition"
            >
              <LogOut size={16} />
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
