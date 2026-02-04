"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Server } from "lucide-react";

type AdminUser = {
  id: number;
  email: string;
  role: string;
};

export default function SuperAdminDashboard() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem("access_token");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_NEST_API_URL}/auth/admin-data`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Accès refusé");
        }

        const data = await res.json();
        setUser(data.user);
      } catch (err: any) {
        setError(err.message || "Erreur serveur");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) return <p className="text-slate-500">Chargement...</p>;
  if (error) return <p className="text-red-500">{error}</p>;


  return (
    <div className="space-y-8">
      {/* Titre */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Super Admin Dashboard
        </h1>
        <p className="text-slate-500 text-sm">Contrôle global de la plateforme</p>
      </div>

      {/* Infos Super Admin */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-lg">
        <p className="text-sm opacity-80">Connecté en tant que</p>
        <p className="text-lg font-semibold">{user?.email}</p>
        <span className="inline-block mt-2 px-3 py-1 text-xs rounded-full bg-emerald-500/20 text-emerald-400">
          {user?.role}
        </span>
      </div>

      {/* Stats Super Admin */}
      
    </div>
  );
}
