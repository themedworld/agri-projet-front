"use client";
import { useState } from "react";
import ClientHeader from "./components/Header";
import ClientSidebar from "./components/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans">
      
      {/* Sidebar - Reçoit les props de contrôle mobile */}
      <ClientSidebar isMobileOpen={isMobileOpen} setMobileOpen={setIsMobileOpen} />

      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        
        {/* Header - Reçoit le déclencheur mobile */}
        <ClientHeader setMobileOpen={setIsMobileOpen} />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="mx-auto max-w-7xl">
            {/* Titre de page dynamique optionnel */}
            <div className="mb-6 lg:mb-8">
              <h1 className="text-2xl font-bold text-slate-900 lg:text-3xl">Bienvenue sur votre espace</h1>
              <p className="text-slate-500 text-sm">Gérez vos exploitations en temps réel.</p>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}