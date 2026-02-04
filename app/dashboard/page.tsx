"use client";

import { useEffect, useState } from "react";

type ClientUser = {
  id: number;
  email: string;
  role: string;
};

export default function ClientDashboard() {
  const [user, setUser] = useState<ClientUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const token = localStorage.getItem("access_token");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_NEST_API_URL}/auth/member-data`,
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

    fetchMemberData();
  }, []);

  if (loading) return <p className="text-slate-500">Chargement...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-8">
      {/* Titre */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Dashboard Client
        </h1>
        <p className="text-slate-500 text-sm">
          Bienvenue sur votre espace personnel
        </p>
      </div>

      {/* Infos client */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-lg">
        <p className="text-sm text-slate-500">Connecté en tant que</p>
        <p className="text-lg font-semibold">{user?.email}</p>
        <span className="inline-block mt-2 px-3 py-1 text-xs rounded-full bg-blue-500/20 text-blue-600">
          {user?.role}
        </span>
      </div>

      {/* Message ou info simple */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-blue-900 shadow-sm">
        <h3 className="font-semibold mb-2">État du compte</h3>
        <p className="text-sm opacity-90">
          Votre compte est actif. Vous pouvez accéder à vos données et
          fonctionnalités disponibles.
        </p>
      </div>
    </div>
  );
}
