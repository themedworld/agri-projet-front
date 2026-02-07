"use client";

import { MapContainer, TileLayer, FeatureGroup, useMapEvents } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { useState } from 'react';
import * as turf from '@turf/turf';

export default function MapPageComponent() {
  const [info, setInfo] = useState<{ area: number; perimeter: number; center: [number, number]; temperature?: number | string; humidity?: number | string } | null>(null);

  function MapEvents() {
    useMapEvents({});
    return null;
  }

  const onCreated = async (e: any) => {
    const layer = e.layer;
    const geojson = layer.toGeoJSON();
    const area = turf.area(geojson);
    const perimeter = turf.length(geojson, { units: 'meters' });
    const center = turf.center(geojson).geometry.coordinates as [number, number];

    let temperature: number | string = 'N/A';
    let humidity: number | string = 'N/A';

    try {
      const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
      if (!apiKey) throw new Error('OpenWeatherMap API key missing');

      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${center[1]}&lon=${center[0]}&units=metric&appid=${apiKey}`);
      const data = await res.json();

      if (data && data.main) {
        temperature = data.main.temp;
        humidity = data.main.humidity;
      } else {
        console.warn('Aucune donnée météo trouvée pour ces coordonnées');
      }
    } catch (err) {
      console.error('Error fetching weather:', err);
    }

    setInfo({ area: Math.round(area), perimeter: Math.round(perimeter), center, temperature, humidity });
  };

  return (
    <div className="h-screen w-full flex flex-col bg-gray-100">
      <div className="px-6 py-4 bg-white shadow">
        <h1 className="text-xl font-semibold text-gray-800">Tracé du terrain (Leaflet – 2D)</h1>
        <p className="text-sm text-gray-500">Utilisez l’outil polygone pour tracer le terrain</p>
      </div>

      <MapContainer center={[36.8, 10.18]} zoom={13} className="flex-1">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
        <FeatureGroup>
          <EditControl
            position="topright"
            onCreated={onCreated}
            draw={{ rectangle: false, circle: false, circlemarker: false, polyline: false, marker: false }}
          />
        </FeatureGroup>
        <MapEvents />
      </MapContainer>

      <div className="bg-white p-6 shadow-lg">
        <h3 className="text-lg font-medium text-gray-800 mb-3">Informations du terrain</h3>
        {info ? (
          <div className="grid grid-cols-1 gap-3 text-sm">
            <div><span className="text-gray-500">Surface</span><div className="font-semibold">{info.area} m²</div></div>
            <div><span className="text-gray-500">Périmètre</span><div className="font-semibold">{info.perimeter} m</div></div>
            <div><span className="text-gray-500">Centre (Lng, Lat)</span><div className="font-semibold">{info.center[0].toFixed(6)}, {info.center[1].toFixed(6)}</div></div>
            <div><span className="text-gray-500">Température</span><div className="font-semibold">{info.temperature} {info.temperature !== 'N/A' ? '°C' : ''}</div></div>
            <div><span className="text-gray-500">Humidité</span><div className="font-semibold">{info.humidity} {info.humidity !== 'N/A' ? '%' : ''}</div></div>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">Tracez un terrain pour afficher les informations</p>
        )}
      </div>
    </div>
  );
}
