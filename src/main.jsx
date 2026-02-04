import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./App.css";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { FavoritesProvider } from "./context/FavoritesContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <FavoritesProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </FavoritesProvider>
    </AuthProvider>
  </BrowserRouter>
);
