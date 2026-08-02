import { ClipboardList, Home, LogOut } from "lucide-react"
import { useAuth } from "../../hooks/useAuth"
import { NavLink, Outlet } from "react-router-dom"


export default function MotoristaLayout() {
    const { usuario, logout } = useAuth()

    return (
        <div className="min-h-screen bg-[#fcfcfc] flex flex-col">
            <header className="bg-green-600 text-white px-5 py-4 flex items-center justify-between">
                <div>
                    <p className="text-xs text-gray-200">Ola,</p>
                    <p className="text-lg font-bold">{usuario?.nome}</p>
                </div>
                <button
                    onClick={logout}
                    className="p-2 rounded-full hover:bg-green-700 cursor-pointer"
                >
                    <LogOut size={18} />
                </button>
            </header>

            <main className="flex-1 px-4 py-5 pb-24">
                <Outlet />
            </main>

            <nav className="fixed bottom-0 left-0 right-0 bg-green-600 text-white flex justify-around py-3 border-t border-black/10">
                <NavLink
                    to={"/motorista/dashboard"}
                    className={({ isActive }) =>
                        `flex flex-col items-center gap-1 text-xs ${isActive ? "text-gray-100" : "text-gray-white"}`
                    }
                >
                    <Home size={20} />
                    Inicio
                </NavLink>
                <NavLink
                    to={"/motorista/registos"}
                    className={({ isActive }) =>
                        `flex flex-col items-center gap-1 text-xs ${isActive ? "text-gray-300" : "text-gray-white"}`
                    }
                >
                    <ClipboardList size={20} />
                    Registos
                </NavLink>
            </nav>
        </div>
    )
}
