"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Briefcase,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  PlusCircle,
  Building2
} from "lucide-react";

export default function SuperAdminSidebar() {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const logout = () => {
    localStorage.clear();
    router.push("/login");
  };

  // Helper pour les liens
  const NavItem = ({ href, label, Icon }: { href: string; label: string; Icon: any }) => {
    const isActive = pathname === href;

    return (
      <Link
        href={href}
        className={`group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 relative overflow-hidden
          ${
            isActive
              ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
              : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
          }`}
      >
        <Icon size={20} className={`shrink-0 ${isActive ? "text-white" : "text-slate-400 group-hover:text-white"}`} />
        
        <span
          className={`whitespace-nowrap transition-all duration-300 ${
            open ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 w-0 overflow-hidden"
          }`}
        >
          {label}
        </span>

        {/* Petit indicateur visuel actif */}
        {isActive && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white/20 rounded-l-full" />
        )}
      </Link>
    );
  };

  return (
    <aside
      className={`relative h-screen flex flex-col bg-[#0f172a] border-r border-slate-800 shadow-2xl transition-all duration-300 ease-in-out z-40
        ${open ? "w-72" : "w-20"}`}
    >
      {/* Toggle Button (Positionné plus proprement) */}
      <button
        onClick={() => setOpen(!open)}
        className="absolute -right-3 top-9 z-50 flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white shadow-md ring-4 ring-slate-50 transition hover:bg-blue-700"
      >
        {open ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>

      {/* Logo Area */}
      <div className="flex h-20 items-center gap-4 px-6 border-b border-slate-800/50">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
          <ShieldCheck size={22} />
        </div>
        
        <div className={`flex flex-col overflow-hidden transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 hidden"}`}>
          <span className="text-sm font-bold tracking-wide text-white">ADMIN PANEL</span>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">Super Admin</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4 overflow-y-auto scrollbar-hide">
        <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
           {open ? "Menu Principal" : "..."}
        </div>
        <NavItem href="/super-admin" label="Dashboard" Icon={LayoutDashboard} />
        <NavItem href="/super-admin/users" label="Utilisateurs" Icon={Users} />
        <NavItem href="/super-admin/users/create" label="Ajouter utilisateur" Icon={UserPlus} />
     
      </nav>

      {/* Logout Footer */}
      <div className="border-t border-slate-800 p-4 bg-[#0f172a]">
        <button
          onClick={logout}
          className={`flex w-full items-center gap-3 rounded-xl border border-slate-700/50 bg-slate-800/50 px-3 py-3 text-red-400 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-300
            ${!open && "justify-center"}`}
        >
          <LogOut size={20} className="shrink-0" />
          {open && <span className="text-sm font-medium">Déconnexion</span>}
        </button>
      </div>
    </aside>
  );
}