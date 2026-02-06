import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// ✅ Layout
import Navbar from "./components/Navbar";
import BottomNav from "./components/BottomNav";
import Footer from "./components/Footer";

// ✅ Public pages
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import SettingsEdit from "./pages/SettingsEdit";
import Favorites from "./pages/Favorites";

// ✅ Route guards
import AdminRoute from "./components/AdminRoute";
import PrivateRoute from "./components/PrivateRoute";

// ✅ Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminBanners from "./pages/admin/AdminBanners";

import "./styles/app.css";

export default function App() {
  const { pathname } = useLocation();

  // ✅ admin page গুলোতে navbar/footer/bottomnav দেখাবে না
  const isAdminPage = pathname.startsWith("/admin");

  return (
    <>
      {!isAdminPage && <Navbar />}

      {/* ✅ BottomNav থাকার জন্য padding */}
      <div style={{ paddingBottom: isAdminPage ? 0 : 80 }}>
        <Routes>
          {/* ================== Public ================== */}
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ================== Private ================== */}
          <Route
            path="/checkout"
            element={
              <PrivateRoute>
                <Checkout />
              </PrivateRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          {/* ✅ Priyo route */}
          <Route
            path="/priyo"
            element={
              <PrivateRoute>
                <Favorites />
              </PrivateRoute>
            }
          />

          {/* ✅ kept: /favorites */}
          <Route
            path="/favorites"
            element={
              <PrivateRoute>
                <Favorites />
              </PrivateRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            }
          />

          <Route
            path="/settings/edit"
            element={
              <PrivateRoute>
                <SettingsEdit />
              </PrivateRoute>
            }
          />

          {/* ================== Admin ================== */}
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/products"
            element={
              <AdminRoute>
                <AdminProducts />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/orders"
            element={
              <AdminRoute>
                <AdminOrders />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/categories"
            element={
              <AdminRoute>
                <AdminCategories />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/banners"
            element={
              <AdminRoute>
                <AdminBanners />
              </AdminRoute>
            }
          />

          {/* ================== Fallback ================== */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {!isAdminPage && (
        <>
          <Footer />
          <BottomNav />
        </>
      )}
    </>
  );
}