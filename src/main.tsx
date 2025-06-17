import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import Dashboard from "./layout/Dashboard";
import Home from "./pages/Home";
import Settings from "./pages/Settings";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="cities/:cityName" element={<Home />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
