import { Outlet } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import Sidebar from "./Sidebar"
import Navbar from "./Navbar"


export default function AdminLayout() {
    const { usuario } = useAuth()

    return (
        <div className="flex min-h-screen bg-[#d8f3dc]">
            <Sidebar />

            <div className="flex-1 flex flex-col m-2 rounded-xl bg-[#fafaff] border border-emerald-950/20">
                <Navbar />

                <main className="flex-1 px-8 py-6">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
