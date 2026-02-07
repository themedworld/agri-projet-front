"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

/* ================= TYPES ================= */
type WeatherPoint = {
  time: string;
  temp: number;
  humidity: number;
  precipitation: number;
};

type Risks = Record<string, number>;

type TerrainData = {
  terrainId: number;
  description: string;
  culture: string;
  indicators?: {
    weather_forecast: WeatherPoint[];
    risks: Risks;
    lastUpdate: string;
  };
};

/* ================= HELPERS ================= */
const diseaseLabels: Record<string, string> = {
  rouille_brune: "🟤 Rouille brune",
  rouille_noire: "⚫ Rouille noire",
  rouille_jaune: "🟡 Rouille jaune",
  septoriose: "🍂 Septoriose",
};

function riskLevel(value: number) {
  if (value < 30) return { label: "Faible", color: "bg-green-500" };
  if (value < 60) return { label: "Modéré", color: "bg-yellow-500" };
  if (value < 80) return { label: "Élevé", color: "bg-orange-500" };
  return { label: "Critique", color: "bg-red-600" };
}

function formatTime(time: string) {
  const d = new Date(time);
  return `${d.getDate()}/${d.getMonth() + 1} ${d.getHours()}h`;
}

/* ================= COMPONENT ================= */
export default function TerrainPage() {
  const params = useParams();
  const terrainId = params?.id;

  const [terrain, setTerrain] = useState<TerrainData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_FAST_API_URL}/terrainmongos/${terrainId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Erreur de récupération du terrain");

        const data = await res.json();
        setTerrain(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (terrainId && token) fetchData();
    else {
      setError("Veuillez vous connecter");
      setLoading(false);
    }
  }, [terrainId]);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!terrain) return null;

  const forecast = terrain.indicators?.weather_forecast || [];
  const risks = terrain.indicators?.risks || {};

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">
          🌾 Terrain {terrain.terrainId}
        </h1>
        <p className="text-gray-600">{terrain.description}</p>
        <p className="text-sm text-gray-500">
          Culture : {terrain.culture}
        </p>
      </div>

      {/* METEO CHART */}
      <div className="bg-white shadow rounded p-4">
        <h2 className="font-semibold mb-3">🌤️ Prévisions météo (6 jours)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={forecast}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              tickFormatter={formatTime}
              tick={{ fontSize: 11 }}
            />
            <YAxis />
            <Tooltip
              labelFormatter={formatTime}
              formatter={(value: any, name: string) => {
                if (name === "temp") return [`${value} °C`, "Température"];
                if (name === "humidity") return [`${value} %`, "Humidité"];
                if (name === "precipitation") return [`${value} mm`, "Pluie"];
                return value;
              }}
            />
            <Legend />
            <Line dataKey="temp" stroke="#ef4444" name="Température" />
            <Line dataKey="humidity" stroke="#3b82f6" name="Humidité" />
            <Line dataKey="precipitation" stroke="#10b981" name="Pluie" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* RISKS */}
      <div className="bg-white shadow rounded p-4">
        <h2 className="font-semibold mb-4">⚠️ Risques phytosanitaires</h2>

        <div className="space-y-4">
          {Object.entries(risks).map(([key, value]) => {
            const level = riskLevel(value);
            return (
              <div key={key}>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">
                    {diseaseLabels[key] || key}
                  </span>
                  <span className="text-sm">
                    {value}% – {level.label}
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded h-3">
                  <div
                    className={`${level.color} h-3 rounded`}
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-gray-500 mt-4">
          Dernière mise à jour : {terrain.indicators?.lastUpdate}
        </p>
      </div>
    </div>
  );
}
