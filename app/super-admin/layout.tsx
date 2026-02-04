"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SuperAdminHeader from "./components/Header"; // Ajustez le chemin selon votre structure
import SuperAdminSidebar from "./components/Sidebar"; // Ajustez le chemin selon votre structure

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const userStr = localStorage.getItem("user");

    if (!token || !userStr) {
      router.push("/login");
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (user.role !== "super_admin") { // Attention: vérifiez si c'est "super_admin" ou "ADMIN" selon votre DB
        router.push("/unauthorized");
      } else {
        setIsAuthorized(true);
      }
    } catch (e) {
      localStorage.clear();
      router.push("/login");
    }
  }, [router]);

  if (!isAuthorized) return null; // Évite le flash de contenu avant redirection

  return (
    // H-SCREEN + OVERFLOW-HIDDEN empêche toute la page de scroller
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans">
      
      {/* Sidebar Fixe (ne scrolle pas) */}
      <SuperAdminSidebar />

      {/* Colonne de droite : Header + Contenu Scrollable */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        
        <SuperAdminHeader />

        {/* C'est ICI que le scroll se passe : overflow-y-auto */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
          <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}