import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import mapboxgl, { Map as MapboxMap, Popup } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./City.css";

import Dashboard from "@/layout/Dashboard";
import { cities, type CityProps } from "@/data/cities";
import { fetchWeather, type Forecast } from "@/services/weatherService";

const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;

const City = () => {
  const { cityName } = useParams<{ cityName?: string }>();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<MapboxMap | null>(null);
  const activePopup = useRef<Popup | null>(null); // Keep track of the active popup

  const [isLoading, setIsLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapboxToken) {
      // setError("Mapbox token is missing...");
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
      setIsLoading(false);
      console.log("Map loaded successfully.");

      cities.forEach((city: CityProps) => {
        const markerEl = document.createElement("div");
        markerEl.className = `custom-marker ${
          city.title === selectedCity?.title ? "selected" : ""
        }`;

        new mapboxgl.Marker(markerEl)
          .setLngLat([city.lon, city.lat])
          .addTo(map.current!);

        markerEl.addEventListener("click", async (e) => {
          e.stopPropagation();

          if (activePopup.current) {
            activePopup.current.remove();
          }

          const popup = new Popup({ offset: 25, closeOnClick: true })
            .setLngLat([city.lon, city.lat])
            .setHTML(
              '<div class="popup-loading"><h3>Loading weather...</h3></div>'
            )
            .addTo(map.current!);

          activePopup.current = popup;

          try {
            const forecast = await fetchWeather(city.lat, city.lon);
            if (activePopup.current === popup) {
              popup.setHTML(createWeatherHtml(city.title, forecast));
            }
          } catch (err) {
            console.error(err);
            if (activePopup.current === popup) {
              popup.setHTML(
                '<div class="popup-error"><h3>Could not load weather.</h3></div>'
              );
            }
          }
        });
      });
    });

    map.current.on("click", () => {
      if (activePopup.current) {
        activePopup.current.remove();
        activePopup.current = null;
      }
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [cityName]);

  const createWeatherHtml = (cityName: string, forecast: Forecast): string => `
    <div class="weather-popup">
      <h3 class="city-title">${cityName}</h3>
      <div class="forecast-item current">
        <span>Now</span>
        <span class="icon">${forecast.current.icon}</span>
        <span class="desc">${forecast.current.description}</span>
        <span class="temp">${forecast.current.temp}°C</span>
      </div>
      <div class="forecast-item">
        <span>Today</span>
        <span class="icon">${forecast.today.icon}</span>
        <span class="desc">${forecast.today.description}</span>
        <span class="temp"><strong>${forecast.today.max}°</strong> / ${forecast.today.min}°</span>
      </div>
      <div class="forecast-item">
        <span>Tomorrow</span>
        <span class="icon">${forecast.tomorrow.icon}</span>
        <span class="desc">${forecast.tomorrow.description}</span>
        <span class="temp"><strong>${forecast.tomorrow.max}°</strong> / ${forecast.tomorrow.min}°</span>
      </div>
    </div>
  `;

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
