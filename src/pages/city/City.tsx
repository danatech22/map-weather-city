import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import mapboxgl, { Map as MapboxMap } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./City.css";

import Dashboard from "@/layout/Dashboard";
import { cities, type CityProps } from "@/data/cities";

const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;

const City = () => {
  const { cityName } = useParams<{ cityName?: string }>();

  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<MapboxMap | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapboxToken) {
      setError("Mapbox token is missing. Please add it to your .env file.");
      setIsLoading(false);
      return;
    }

    if (map.current || !mapContainer.current) return;

    const selectedCity = cityName
      ? cities.find(
          (c) => c.title.toLowerCase().replace(/\s+/g, "-") === cityName
        )
      : undefined;

    const initialOptions = {
      center: selectedCity
        ? ([selectedCity.lon, selectedCity.lat] as [number, number])
        : ([10, 35] as [number, number]),
      zoom: selectedCity ? 10 : 1.5,
    };

    mapboxgl.accessToken = mapboxToken;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      ...initialOptions,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.current.on("load", () => {
      console.log("Map loaded successfully.");

      cities.forEach((city: CityProps) => {
        const markerEl = document.createElement("div");

        markerEl.className = `custom-marker ${
          city.title === selectedCity?.title ? "selected" : ""
        }`;

        const popup = new mapboxgl.Popup({
          offset: 25,
          closeButton: false,
        }).setHTML(
          `<h3>${city.title}</h3><p>Lat: ${city.lat.toFixed(
            4
          )}, Lon: ${city.lon.toFixed(4)}</p>`
        );

        new mapboxgl.Marker(markerEl)
          .setLngLat([city.lon, city.lat])
          .setPopup(popup)
          .addTo(map.current!);
      });

      setIsLoading(false);
    });

    map.current.on("error", (e) => {
      console.error("Map error:", e);
      setError(`Map failed to load: ${e.error?.message || "Unknown error"}`);
      setIsLoading(false);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [cityName]);

  if (error) {
    return (
      <Dashboard>
        <div className="w-full h-full bg-red-50 flex items-center justify-center text-center p-4">
          <div>
            <h2 className="text-xl font-bold text-red-600 mb-2">Map Error</h2>
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </Dashboard>
    );
  }

  return (
    <Dashboard>
      <div className="w-full h-full relative">
        {isLoading && (
          <div className="absolute inset-0 bg-gray-100 bg-opacity-75 flex items-center justify-center z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading Map...</p>
            </div>
          </div>
        )}
        <div ref={mapContainer} className="h-full w-full" />
      </div>
    </Dashboard>
  );
};

export default City;
