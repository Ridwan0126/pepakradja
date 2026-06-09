import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { PrivateRoute } from "./components/PrivateRoute";
import SplashScreen from "./components/SplashScreen";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Transactions from "./pages/Transactions";
import SKRD from "./pages/SKRD";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import NotFound from "./pages/NotFound";
import SPTRD from "./pages/SPTRD";
import Profile from "./pages/Profile";
import SetPassword from "./pages/SetPassword";
import TentangKami from "./pages/TentangKami";
import ScanTicket from "./pages/ScanTicket";
import Ticket from "./pages/Ticket";

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const splashShown = sessionStorage.getItem("splashShown");
    if (splashShown) {
      setShowSplash(false);
    }
  }, []);

  const handleSplashFinish = () => {
    sessionStorage.setItem("splashShown", "true");
  };

  return (
    <>
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/transactions" element={<Transactions />} />

            <Route path="/skrd" element={<SKRD />} />
            <Route path="/tentangkami" element={<TentangKami />} />

            <Route path="/sptrd" element={<SPTRD />} />

            <Route path="/profile" element={<Profile />} />

            <Route path="/setpassword" element={<SetPassword />} />
            <Route path="/scanticket" element={<ScanTicket />} />
            <Route path="/ticket" element={<Ticket />} />

            <Route
              path="/checkout"
              element={
                <PrivateRoute>
                  <Checkout />
                </PrivateRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <PrivateRoute allowedRoles={["user"]}>
                  <UserDashboard />
                </PrivateRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <PrivateRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />

            <Route
              path="/superadmin"
              element={
                <PrivateRoute allowedRoles={["superadmin"]}>
                  <SuperAdminDashboard />
                </PrivateRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
