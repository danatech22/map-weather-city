import React, { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Dashboard from "@/layout/Dashboard";
import { useParams } from "react-router";
import { cities } from "@/data/cities";

const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;

// Custom hook for managing map markers
const useMapMarkers = (cities, map) => {
  const markers = useRef([]);

  const createMarkerElement = useCallback((city) => {
    const markerEl = document.createElement("div");
    markerEl.className = "custom-marker";
    markerEl.dataset.cityId = city.title.toLowerCase().replace(/\s+/g, "-");

    // Apply styles programmatically for better control
    Object.assign(markerEl.style, {
      width: "20px",
      height: "20px",
      backgroundColor: "#3b82f6",
      border: "2px solid white",
      borderRadius: "50%",
      cursor: "pointer",
      position: "relative",
      transition: "all 0.2s ease",
      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    });

    // Add hover effect
    markerEl.addEventListener("mouseenter", () => {
      markerEl.style.transform = "scale(1.1)";
      markerEl.style.backgroundColor = "#2563eb";
    });

    markerEl.addEventListener("mouseleave", () => {
      markerEl.style.transform = "scale(1)";
      markerEl.style.backgroundColor = "#3b82f6";
    });

    return markerEl;
  }, []);

  const createInfoButton = useCallback((city) => {
    const infoButton = document.createElement("button");
    infoButton.className = "info-button";
    infoButton.innerHTML = "i";
    infoButton.title = `Get info about ${city.title}`;
    infoButton.setAttribute("aria-label", `Information about ${city.title}`);

    Object.assign(infoButton.style, {
      position: "absolute",
      top: "-8px",
      right: "-8px",
      width: "16px",
      height: "16px",
      backgroundColor: "#ef4444",
      color: "white",
      border: "none",
      borderRadius: "50%",
      fontSize: "10px",
      fontWeight: "bold",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.2s ease",
      boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
    });

    // Add hover effect for info button
    infoButton.addEventListener("mouseenter", () => {
      infoButton.style.backgroundColor = "#dc2626";
      infoButton.style.transform = "scale(1.1)";
    });

    infoButton.addEventListener("mouseleave", () => {
      infoButton.style.backgroundColor = "#ef4444";
      infoButton.style.transform = "scale(1)";
    });

    return infoButton;
  }, []);

  const createMarker = useCallback(
    (city) => {
      if (!map) return null;

      const markerEl = createMarkerElement(city);
      const infoButton = createInfoButton(city);

      // Event handlers
      const handleInfoClick = (e) => {
        e.stopPropagation();
        window.dispatchEvent(
          new CustomEvent("markerInfoClick", {
            detail: { city, coordinates: [city.lon, city.lat] },
          })
        );
      };

      const handleMarkerClick = () => {
        window.dispatchEvent(
          new CustomEvent("markerClick", {
            detail: { city, coordinates: [city.lon, city.lat] },
          })
        );
      };

      // Attach event listeners
      infoButton.addEventListener("click", handleInfoClick);
      markerEl.addEventListener("click", handleMarkerClick);

      // Append info button to marker
      markerEl.appendChild(infoButton);

      // Create and return mapbox marker
      const marker = new mapboxgl.Marker(markerEl)
        .setLngLat([city.lon, city.lat])
        .addTo(map);

      // Store references for cleanup
      marker._eventCleanup = () => {
        infoButton.removeEventListener("click", handleInfoClick);
        markerEl.removeEventListener("click", handleMarkerClick);
      };

      return marker;
    },
    [map, createMarkerElement, createInfoButton]
  );

  const addMarkers = useCallback(() => {
    if (!map || !cities?.length) return;

    // Clear existing markers first
    removeMarkers();

    // Add new markers
    const newMarkers = cities.map((city) => createMarker(city)).filter(Boolean); // Remove any null markers

    markers.current = newMarkers;
  }, [cities, map, createMarker]);

  const removeMarkers = useCallback(() => {
    markers.current.forEach((marker) => {
      if (marker._eventCleanup) {
        marker._eventCleanup();
      }
      marker.remove();
    });
    markers.current = [];
  }, []);

  const focusOnCity = useCallback(
    (cityTitle) => {
      if (!map) return;

      const city = cities.find((c) => c.title === cityTitle);
      if (city) {
        map.flyTo({
          center: [city.lon, city.lat],
          zoom: 12,
          duration: 1500,
        });
      }
    },
    [cities, map]
  );

  return {
    addMarkers,
    removeMarkers,
    focusOnCity,
    markersCount: markers.current.length,
  };
};

// Custom hook for map initialization
const useMapbox = (containerRef, options = {}) => {
  const map = useRef(null);
  const [mapState, setMapState] = useState({
    isLoaded: false,
    error: null,
    isInitializing: false,
  });

  const defaultOptions = {
    style: "mapbox://styles/mapbox/streets-v11",
    center: [0, 20],
    zoom: 2,
    ...options,
  };

  useEffect(() => {
    if (!mapboxToken) {
      setMapState((prev) => ({
        ...prev,
        error:
          "Mapbox token is missing. Please check your VITE_MAPBOX_TOKEN environment variable.",
      }));
      return;
    }

    if (map.current || !containerRef.current) return;

    setMapState((prev) => ({ ...prev, isInitializing: true }));
    mapboxgl.accessToken = mapboxToken;

    try {
      map.current = new mapboxgl.Map({
        container: containerRef.current,
        ...defaultOptions,
      });

      map.current.on("load", () => {
        console.log("Map loaded successfully");
        setMapState({
          isLoaded: true,
          error: null,
          isInitializing: false,
        });
      });

      map.current.on("error", (e) => {
        console.error("Map error:", e);
        setMapState({
          isLoaded: false,
          error: `Map failed to load: ${e.error?.message || "Unknown error"}`,
          isInitializing: false,
        });
      });
    } catch (error) {
      console.error("Error initializing map:", error);
      setMapState({
        isLoaded: false,
        error: `Failed to initialize map: ${error.message}`,
        isInitializing: false,
      });
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [containerRef, mapboxToken]);

  return { map: map.current, ...mapState };
};

// Custom hook for handling marker events
const useMarkerEvents = (onMarkerClick, onInfoClick) => {
  useEffect(() => {
    const handleMarkerClick = (e) => {
      const { city, coordinates } = e.detail;
      console.log(`Marker clicked: ${city.title}`);
      onMarkerClick?.(city, coordinates);
    };

    const handleMarkerInfo = (e) => {
      const { city, coordinates } = e.detail;
      console.log(`Info clicked: ${city.title}`);
      onInfoClick?.(city, coordinates);
    };

    window.addEventListener("markerClick", handleMarkerClick);
    window.addEventListener("markerInfoClick", handleMarkerInfo);

    return () => {
      window.removeEventListener("markerClick", handleMarkerClick);
      window.removeEventListener("markerInfoClick", handleMarkerInfo);
    };
  }, [onMarkerClick, onInfoClick]);
};

// Main City Component
const City = () => {
  const params = useParams();
  const mapContainer = useRef(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  // Initialize map
  const { map, isLoaded, error, isInitializing } = useMapbox(mapContainer, {
    center: [0, 20],
    zoom: 2.5,
  });

  // Initialize markers
  const { addMarkers, removeMarkers, focusOnCity, markersCount } =
    useMapMarkers(cities, map);

  // Handle marker events
  const handleMarkerClick = useCallback(
    (city, coordinates) => {
      setSelectedCity(city);
      map?.flyTo({
        center: coordinates,
        zoom: 10,
        duration: 1500,
      });
    },
    [map]
  );

  const handleInfoClick = useCallback((city, coordinates) => {
    setSelectedCity(city);
    setShowInfo(true);
    // You can add weather fetching logic here
    console.log(`Fetching info for ${city.title}...`);
  }, []);

  // Set up event listeners
  useMarkerEvents(handleMarkerClick, handleInfoClick);

  // Add markers when map is loaded
  useEffect(() => {
    if (isLoaded && map) {
      addMarkers();
    }
    return () => removeMarkers();
  }, [isLoaded, map, addMarkers, removeMarkers]);

  // Focus on specific city from URL params
  useEffect(() => {
    if (params.cityName && isLoaded) {
      const cityTitle = params.cityName
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      focusOnCity(cityTitle);
    }
  }, [params.cityName, isLoaded, focusOnCity]);

  // Loading state
  if (isInitializing) {
    return (
      <Dashboard>
        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      </Dashboard>
    );
  }

  // Error state
  if (error) {
    return (
      <Dashboard>
        <div className="w-full h-full bg-red-50 flex items-center justify-center">
          <div className="text-red-600 text-center p-6 max-w-md">
            <h2 className="text-xl font-bold mb-2">Map Error</h2>
            <p className="mb-4">{error}</p>
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
        {/* Map Container */}
        <div ref={mapContainer} className="h-full w-full" />

        {/* Info Panel */}
        {showInfo && selectedCity && (
          <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm z-10">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-800">
                {selectedCity.title}
              </h3>
              <button
                onClick={() => setShowInfo(false)}
                className="text-gray-500 hover:text-gray-700 text-xl leading-none"
              >
                ×
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Coordinates: {selectedCity.lat.toFixed(4)},{" "}
              {selectedCity.lon.toFixed(4)}
            </p>
            <div className="space-y-2">
              <button
                onClick={() => focusOnCity(selectedCity.title)}
                className="w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
              >
                Focus on City
              </button>
            </div>
          </div>
        )}

        {/* Debug Info */}
        {process.env.NODE_ENV === "development" && (
          <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white p-2 rounded text-xs">
            Map loaded: {isLoaded ? "Yes" : "No"} | Markers: {markersCount}
            {selectedCity && ` | Selected: ${selectedCity.title}`}
          </div>
        )}
      </div>
    </Dashboard>
  );
};

export default City;
