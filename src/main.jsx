import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

import "./styles/app.css";
import "./styles/auth.css";

import { CartProvider } from "./context/CartContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider>
        <FavoritesProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </FavoritesProvider>
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
);