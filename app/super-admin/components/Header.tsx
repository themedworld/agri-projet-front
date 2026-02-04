"use client";

import { useEffect, useState } from "react";
import { Bell, Search, Menu } from "lucide-react";

export default function SuperAdminHeader() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Petit délai ou vérification pour éviter les erreurs d'hydratation
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Erreur parsing user");
      }
    }
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-8 backdrop-blur-md transition-all">
      
      {/* Partie Gauche : Fil d'ariane ou Info Société */}
      <div className="flex items-center gap-4">
        {/* Mobile trigger pourrait aller ici */}
        <div className="hidden md:flex flex-col">
          <h2 className="text-lg font-bold text-slate-800 leading-tight">
            Espace Administration
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500">
             <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Système opérationnel</span>
          </div>
        </div>
      </div>

      {/* Partie Droite : Actions & Profil */}
      <div className="flex items-center gap-6">
        
        {/* Notifications */}
        <button className="relative rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-blue-600 transition">
          <Bell size={20} />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        <div className="h-8 w-px bg-slate-200" />

        {/* Profil Utilisateur */}
        <div className="flex items-center gap-3 pl-2">
          <div className="hidden text-right md:block">
            <p className="text-sm font-bold text-slate-800">
              {user?.fullname || "Administrateur"}
            </p>
            <p className="text-xs font-medium text-slate-500">
              {user?.role === 'super_admin' ? 'Super Admin' : 'Admin Société'}
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-sm font-bold text-white shadow-md ring-2 ring-white">
            {user?.fullname ? user.fullname[0].toUpperCase() : "A"}
          </div>
        </div>
      </div>
    </header>
  );
}