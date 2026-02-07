"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Terrain = {
  id: number;
  latitude: number;
  longitude: number;
  surface: number;
  description?: string;
  culture?: string;
};

export default function TerrainsPage() {
  const [terrains, setTerrains] = useState<Terrain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  /* ======================
     FETCH TERRAIN
  ====================== */
  const fetchTerrains = async () => {
    try {
      // ✅ localStorage accessible uniquement côté client
      const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

      const res = await fetch(`${process.env.NEXT_PUBLIC_NEST_API_URL}/terrain`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
      });

      if (!res.ok) throw new Error("Erreur API");
      const data = await res.json();
      setTerrains(data);
    } catch {
      setError("Impossible de charger les terrains");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTerrains();
  }, []);

  /* ======================
     SUPPRESSION
  ====================== */
  const deleteTerrain = async (id: number) => {
    const confirm = window.confirm("Voulez-vous vraiment supprimer ce terrain ?");
    if (!confirm) return;

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

      const res = await fetch(`${process.env.NEXT_PUBLIC_NEST_API_URL}/terrain/${id}`, {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
      });

      if (!res.ok) throw new Error("Erreur API");

      setTerrains((prev) => prev.filter((t) => t.id !== id));
    } catch {
      alert("Erreur lors de la suppression");
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Chargement...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Mes terrains</h1>

      {terrains.length === 0 ? (
        <p className="text-gray-500">Aucun terrain enregistré</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {terrains.map((terrain) => (
            <div
              key={terrain.id}
              className="bg-white rounded-lg shadow p-5 space-y-3"
            >
              <h2 className="font-semibold text-lg">Terrain #{terrain.id}</h2>

              <p className="text-sm">
                📐 <b>Surface :</b> {terrain.surface} m²
              </p>

              {terrain.culture && (
                <p className="text-sm">
                  🌱 <b>Culture :</b> {terrain.culture}
                </p>
              )}

              {/* ACTIONS */}
              <div className="flex gap-2 pt-3">
                <button
                  onClick={() => router.push(`/dashboard/terrain/${terrain.id}`)}
                  className="flex-1 bg-blue-600 text-white text-sm py-2 rounded hover:bg-blue-700"
                >
                  Détails
                </button>
                <button
                  onClick={() => deleteTerrain(terrain.id)}
                  className="flex-1 bg-red-600 text-white text-sm py-2 rounded hover:bg-red-700"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
