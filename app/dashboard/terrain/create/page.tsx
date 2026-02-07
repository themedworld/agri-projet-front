"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import * as turf from "@turf/turf";

// Charger Leaflet uniquement côté client
let L: typeof import("leaflet");
if (typeof window !== "undefined") {
  L = require("leaflet");
}

// Charger react-leaflet uniquement côté client
const MapContainer = dynamic(
  async () => (await import("react-leaflet")).MapContainer,
  { ssr: false }
);
const TileLayer = dynamic(
  async () => (await import("react-leaflet")).TileLayer,
  { ssr: false }
);
const FeatureGroup = dynamic(
  async () => (await import("react-leaflet")).FeatureGroup,
  { ssr: false }
);
const EditControl = dynamic(
  async () => (await import("react-leaflet-draw")).EditControl,
  { ssr: false }
);

import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

type TerrainInfo = {
  area: number;
  perimeter: number;
  center: [number, number];
};

export default function MapPageComponent() {
  const featureGroupRef = useRef<L.FeatureGroup | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  const [terrain, setTerrain] = useState<TerrainInfo | null>(null);
  const [description, setDescription] = useState("");
  const [culture, setCulture] = useState("");
  const [coordinatesInput, setCoordinatesInput] = useState("");
  const [clientId] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  /* =======================
     CALCUL TERRAIN
  ======================= */
  const computeTerrain = (geojson: any, layer?: L.Layer) => {
    const area = turf.area(geojson); // en m²
    const perimeter = turf.length(geojson, { units: "kilometers" }) * 1000; // en m
    const center = turf.center(geojson).geometry.coordinates as [
      number,
      number
    ];

    setTerrain({
      area: Math.round(area),
      perimeter: Math.round(perimeter),
      center,
    });

    // ✅ Ajouter popup avec infos
    if (layer) {
      (layer as any).bindPopup(
        `Surface: ${Math.round(area)} m²<br>Périmètre: ${Math.round(perimeter)} m`
      ).openPopup();
    }
  };

  /* =======================
     MODE 1 : DESSIN CARTE
  ======================= */
  const onCreated = (e: any) => {
    const layer = e.layer;
    const geojson = layer.toGeoJSON();

    featureGroupRef.current?.clearLayers();
    featureGroupRef.current?.addLayer(layer);

    computeTerrain(geojson, layer);

    // ✅ zoom automatique
    mapRef.current?.fitBounds(layer.getBounds());
  };

  /* =======================
     MODE 2 : COORDONNÉES
  ======================= */
  const drawFromCoordinates = () => {
    try {
      const points = coordinatesInput
        .trim()
        .split("\n")
        .map((line) => {
          const [lat, lng] = line.split(",").map(Number);
          if (isNaN(lat) || isNaN(lng)) throw new Error("Coordonnées invalides");
          return [lng, lat];
        });

      if (points.length < 3) {
        setMessage("❌ Minimum 3 points requis");
        return;
      }

      const polygon = L.polygon(points);
      const geojson = polygon.toGeoJSON();

      featureGroupRef.current?.clearLayers();
      featureGroupRef.current?.addLayer(polygon);

      computeTerrain(geojson, polygon);
      setMessage("✅ Terrain dessiné depuis coordonnées");

      // ✅ zoom automatique
      mapRef.current?.fitBounds(polygon.getBounds());
    } catch {
      setMessage("❌ Coordonnées invalides");
    }
  };

  /* =======================
     SAVE API
  ======================= */
  const saveTerrain = async () => {
    if (!terrain) {
      setMessage("Veuillez tracer ou saisir un terrain");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const geojson = featureGroupRef.current?.toGeoJSON();
      const token = localStorage.getItem("access_token"); // ✅ récupérer le token

      const res = await fetch(`${process.env.NEXT_PUBLIC_NEST_API_URL}/terrain`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // ✅ ajout du token
        },
        body: JSON.stringify({
          latitude: terrain.center[1],
          longitude: terrain.center[0],
          surface: terrain.area,
          perimeter: terrain.perimeter,
          description,
          culture,
          clientId,
          geometry: geojson,
        }),
      });

      if (!res.ok) throw new Error();
      setMessage("✅ Terrain enregistré avec succès");
    } catch {
      setMessage("❌ Erreur lors de l’enregistrement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* HEADER */}
      <div className="bg-white shadow px-6 py-4">
        <h1 className="text-2xl font-bold">Délimitation du terrain agricole</h1>
        <p className="text-sm text-gray-500">
          Tracez sur la carte OU entrez les coordonnées
        </p>
      </div>

      {/* MAP */}
      <div className="flex-1">
        <MapContainer
          center={[36.8, 10.18]}
          zoom={13}
          className="h-full w-full"
          whenCreated={(map) => (mapRef.current = map)} // ✅ stocker la carte
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap"
          />

          <FeatureGroup ref={featureGroupRef}>
            <EditControl
              position="topright"
              onCreated={onCreated}
              draw={{
                rectangle: false,
                circle: false,
                circlemarker: false,
                polyline: false,
                marker: false,
              }}
            />
          </FeatureGroup>
        </MapContainer>
      </div>

      {/* FORM */}
      <div className="bg-white p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* INFOS */}
        <div>
          <h2 className="font-semibold mb-3">Informations terrain</h2>

          {terrain ? (
            <ul className="text-sm space-y-2">
              <li><b>Surface :</b> {terrain.area} m²</li>
              <li><b>Périmètre :</b> {terrain.perimeter} m</li>
              <li>
                <b>Centre :</b>{" "}
                {terrain.center[1].toFixed(6)}, {terrain.center[0].toFixed(6)}
              </li>
            </ul>
          ) : (
            <p className="text-sm text-gray-500">Aucun terrain défini</p>
          )}
        </div>

        {/* INPUTS */}
        <div className="space-y-3">
          <textarea
            rows={4}
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder={`Coordonnées (1 point par ligne)\n36.801,10.175`}
            value={coordinatesInput}
            onChange={(e) => setCoordinatesInput(e.target.value)}
          />

          <button
            onClick={drawFromCoordinates}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Dessiner depuis coordonnées
          </button>

          <input
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="Description / Adresse"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="Culture (ex: Blé dur)"
            value={culture}
            onChange={(e) => setCulture(e.target.value)}
          />

          <button
            onClick={saveTerrain}
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            {loading ? "Enregistrement..." : "Enregistrer le terrain"}
          </button>

          {message && <p className="text-center text-sm">{message}</p>}
        </div>
      </div>
    </div>
  );
}
