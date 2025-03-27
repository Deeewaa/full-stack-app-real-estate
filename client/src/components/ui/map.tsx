import { useEffect, useRef } from "react";

interface MapProps {
  location: {
    lat: number;
    lng: number;
  };
  zoom?: number;
}

export function MapComponent({ location, zoom = 14 }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null); // To store the Leaflet map instance

  useEffect(() => {
    // Load Leaflet CSS
    const linkElement = document.createElement("link");
    linkElement.rel = "stylesheet";
    linkElement.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    linkElement.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
    linkElement.crossOrigin = "";
    document.head.appendChild(linkElement);

    // Load Leaflet JS
    const scriptElement = document.createElement("script");
    scriptElement.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    scriptElement.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
    scriptElement.crossOrigin = "";
    document.body.appendChild(scriptElement);

    scriptElement.onload = () => {
      if (!mapRef.current) return;

      // If map already initialized, update it
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setView([location.lat, location.lng], zoom);
        return;
      }

      // Initialize map
      const L = (window as any).L;
      const map = L.map(mapRef.current).setView([location.lat, location.lng], zoom);
      mapInstanceRef.current = map;

      // Add tile layer (using OpenStreetMap)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Add marker
      const marker = L.marker([location.lat, location.lng]).addTo(map);
      
      // Ensure map is invalidated (fixes issue with map tiles not loading correctly)
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    };

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [location, zoom]);

  return <div ref={mapRef} className="h-full w-full"></div>;
}
