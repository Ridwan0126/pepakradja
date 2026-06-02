"use client";

import { Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Sidebar from "./components/Sidebar";
import BottomNav from "./components/BottomNav";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import PengaturanJudul from "./pages/PengaturanJudul";
import PengaturanCalon from "./pages/PengaturanCalon";
import DataPemilih from "./pages/DataPemilih";
import VotingPage from "./pages/VotingPage";
import HasilPemilihan from "./pages/HasilPemilihan";
import VotingStandalone from "./pages/VotingStandalone";
import SetWilayah from "./pages/SetWilayah";
import BuatWilayah from "./pages/BuatWilayah";
import PengaturanPengguna from "./pages/PengaturanPengguna";
import VerifikasiData from "./pages/VerifikasiData";
import SuaraOffline from "./pages/SuaraOffline";
import LaporanRekap from "./pages/LaporanRekap";
import LaporanJurnal from "./pages/LaporanJurnal";
import ResetData from "./pages/ResetData";

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const navigate = useNavigate();
  const { user, hasAccess } = useAuth();

  useEffect(() => {
    if (currentPage === "dashboard") {
      navigate("/");
    } else {
      navigate(`/${currentPage}`);
    }
  }, [currentPage, navigate]);

  const renderPage = () => {
    if (!hasAccess(currentPage)) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-2">
              Akses Ditolak
            </h2>
            <p className="text-gray-600">
              Anda tidak memiliki izin untuk mengakses halaman ini.
            </p>
          </div>
        </div>
      );
    }

    switch (currentPage) {
      case "dashboard":
        return <Dashboard setCurrentPage={setCurrentPage} />;
      case "pengaturan-judul":
        return <PengaturanJudul />;
      case "pengaturan-calon":
        return <PengaturanCalon />;
      case "set-wilayah":
        return <SetWilayah />;
      case "buat-wilayah":
        return <BuatWilayah />;
      case "pengaturan-pengguna":
        return <PengaturanPengguna />;
      case "reset-data":
        return <ResetData />;
      case "data-pemilih":
        return <DataPemilih />;
      case "verifikasi-data":
        return <VerifikasiData />;
      case "voting":
        return <VotingPage />;
      case "hasil":
        return <HasilPemilihan />;
      case "suara-offline":
        return <SuaraOffline />;
      case "laporan-rekap":
        return <LaporanRekap />;
      case "laporan-jurnal":
        return <LaporanJurnal />;
      default:
        return <Dashboard setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden lg:block">
        <Sidebar
          isOpen={sidebarOpen}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />

        <main className="flex-1 overflow-y-auto bg-[var(--color-background)] p-4 md:p-6 lg:p-8 pb-20 lg:pb-8">
          {renderPage()}
        </main>

        <BottomNav currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/vote" element={<VotingStandalone />} />
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
