"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, ChevronLeft, ChevronRight, Building2, MapPin, LandPlot, X } from "lucide-react";

// Ajout d'une prop isOpenMobile pour le contrôle depuis le Header
export default function ClientSidebar({ isMobileOpen, setMobileOpen }: any) {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const logout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const navItem = (href: string, label: string, Icon: any) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        onClick={() => setMobileOpen(false)} // Ferme le menu sur mobile après clic
        className={`group relative flex items-center gap-4 px-4 py-3 rounded-xl transition-all
          ${isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" : "text-slate-300 hover:bg-white/5 hover:text-white"}`}
      >
        <Icon size={22} />
        <span className={`text-[14px] font-semibold ${!open && "lg:hidden"}`}>{label}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Overlay pour Mobile : Floute l'arrière-plan quand le menu est ouvert */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside 
        className={`fixed inset-y-0 left-0 z-[70] bg-[#0f172a] transition-all duration-300 lg:static lg:translate-x-0
          ${isMobileOpen ? "translate-x-0 w-72" : "-translate-x-full lg:translate-x-0"}
          ${open ? "lg:w-72" : "lg:w-20"}`}
      >
        {/* Header Sidebar (Logo + Fermer Mobile) */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="min-w-[36px] h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <Building2 size={20} />
            </div>
            {open && <span className="font-bold text-white text-lg tracking-tight">AgriControl</span>}
          </div>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden text-slate-400"><X size={24} /></button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItem("/dashboard", "Tableau de Bord", LayoutDashboard)}
          {navItem("/dashboard/terrain", "Mes Terrains", LandPlot)}
          {navItem("/dashboard/terrain/create", "Nouveau Terrain", MapPin)}
        </nav>

        {/* Toggle Desktop */}
        <button
          onClick={() => setOpen(!open)}
          className="hidden lg:flex absolute -right-3 top-10 bg-blue-600 text-white rounded-lg p-1 shadow-lg"
        >
          {open ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
        <div className="absolute bottom-0 w-full p-4 space-y-4 bg-gradient-to-t from-[#0f172a] via-[#0f172a] to-transparent">
        <button
          onClick={logout}
          className="group w-full flex items-center gap-4 px-4 py-3 rounded-xl
            text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          {open && <span className="text-sm font-bold tracking-wide">Déconnexion</span>}
        </button>
      </div>
      </aside>
    </>
  );
}