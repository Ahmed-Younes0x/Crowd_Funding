import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import App from "./App.jsx";
import Register from "./Components/reg.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./Components/login.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
        <App />
        <div className="container mt-4">
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
    </BrowserRouter>
  </StrictMode>
);
