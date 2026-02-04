"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import * as turf from "@turf/turf";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export default function MapPage() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const drawRef = useRef<MapboxDraw | null>(null);

  const [info, setInfo] = useState<{
    area: number;
    perimeter: number;
    address: string;
  } | null>(null);

  useEffect(() => {
    if (mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [10.18, 36.8], // Tunisie
      zoom: 14,
      pitch: 60,
      bearing: -20,
      antialias: true,
    });

    mapRef.current = map;

    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
      modes: {
        ...MapboxDraw.modes,
      },
    });

    drawRef.current = draw;
    map.addControl(draw);
    map.addControl(new mapboxgl.NavigationControl());

    map.on("draw.create", handleDraw);
    map.on("draw.update", handleDraw);

    async function handleDraw(e: any) {
      const feature = e.features[0];
      if (!feature) return;

      const area = turf.area(feature); // m²
      const perimeter = turf.length(feature, { units: "meters" });

      const center = turf.center(feature).geometry.coordinates;
      const [lng, lat] = center;

      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`
      );
      const data = await res.json();
      const address = data.features?.[0]?.place_name || "Adresse inconnue";

      setInfo({
        area: Math.round(area),
        perimeter: Math.round(perimeter),
        address,
      });
    }
  }, []);

  return (
    <div className="h-screen w-full flex flex-col bg-gray-100">
      {/* Header */}
      <div className="px-6 py-4 bg-white shadow">
        <h1 className="text-xl font-semibold text-gray-800">
          Tracé du terrain (stylo – carte 3D)
        </h1>
        <p className="text-sm text-gray-500">
          Utilisez l’outil polygone pour tracer le terrain
        </p>
      </div>

      {/* Map */}
      <div ref={mapContainerRef} className="flex-1" />

      {/* Info Panel */}
      <div className="bg-white p-6 shadow-lg">
        <h3 className="text-lg font-medium text-gray-800 mb-3">
          Informations du terrain
        </h3>

        {info ? (
          <div className="grid grid-cols-1 gap-3 text-sm">
            <div>
              <span className="text-gray-500">Surface</span>
              <div className="font-semibold">{info.area} m²</div>
            </div>
            <div>
              <span className="text-gray-500">Périmètre</span>
              <div className="font-semibold">{info.perimeter} m</div>
            </div>
            <div>
              <span className="text-gray-500">Adresse exacte</span>
              <div className="font-semibold">{info.address}</div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">
            Tracez un terrain pour afficher les informations
          </p>
        )}
      </div>
    </div>
  );
}
