"use client";

import dynamic from 'next/dynamic';

// Import the Leaflet map dynamically to prevent SSR errors
const MapPageNoSSR = dynamic(() => import('./MapPageComponent'), { ssr: false });

export default function MapPageWrapper() {
  return <MapPageNoSSR />;
}
