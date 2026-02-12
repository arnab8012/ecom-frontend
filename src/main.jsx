import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

import "./styles/app.css";
import "./styles/auth.css";

import { CartProvider } from "./context/CartContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { AuthProvider } from "./context/AuthContext";
import { HelmetProvider } from "react-helmet-async";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
     <HelmetProvider>
      <CartProvider>
        <FavoritesProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </FavoritesProvider>
      </CartProvider>
     </HelmetProvider>
    </BrowserRouter>
  </React.StrictMode>
);