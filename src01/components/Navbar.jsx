lalu perbaiki header saya dengan memberikan kode lengkapnya untuk di implementasi apa yang sudah saya atur tadi

import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Menu,
  X,
  LogOut,
  Home,
  Settings,
  Search,
  ChevronDown,
} from "lucide-react";

import { useAuth } from "../contexts/AuthContext";
import { useCartStore } from "../stores/cartStore";
import { useState } from "react";

import { motion, AnimatePresence } from "framer-motion";
import SearchDropdown from "./SearchDropdown";

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const { getTotalItems } = useCartStore();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCategory, setShowCategory] = useState(false);
  const [activeMenu, setActiveMenu] = useState("home");
  const [activeCategory, setActiveCategory] = useState("Tanah");
  const [searchOpen, setSearchOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileMenuOpen(false);
  };

  const menuData = {
    home: {
      categories: {
        Tanah: [
          {
            title: "Sewa Tanah",
            path: "/tanah/sewa-tanah",
          },
          {
            title: "Bangunan Semi Permanen",
            path: "/tanah/bangunan-semi-permanen",
          },
          {
            title: "Jalan Masuk",
            path: "/tanah/jalan-masuk",
          },
        ],

        Bangunan: [
          {
            title: "Lantai Jemur",
            path: "/bangunan/lantai-jemur",
          },
          {
            title: "Rumah Dinas",
            path: "/bangunan/rumah-dinas",
          },
          {
            title: "Sewa Gedung",
            path: "/bangunan/sewa-gedung",
          },
        ],

        "Tanah Bangunan": [
          {
            title: "Sewa Lahan",
            path: "/tanah-bangunan/sewa-lahan",
          },
          {
            title: "Tegalan",
            path: "/tanah-bangunan/tegalan",
          },
          {
            title: "Jembatan",
            path: "/tanah-bangunan/jembatan",
          },
          {
            title: "Warung",
            path: "/tanah-bangunan/warung",
          },
        ],

        "Gedung Pertemuan": [
          {
            title: "Aula Sekolah",
            path: "/gedung-pertemuan/aula-sekolah",
          },
          {
            title: "Aula",
            path: "/gedung-pertemuan/aula",
          },
          {
            title: "Ruang Pertemuan",
            path: "/gedung-pertemuan/ruang-pertemuan",
          },
          {
            title: "Sewa Gedung",
            path: "/gedung-pertemuan/sewa-gedung",
          },
        ],

        "Lahan Iklan": [
          {
            title: "Reklame",
            path: "/lahan-iklan/reklame",
          },
          {
            title: "Lahan Tiang Reklame",
            path: "/lahan-iklan/lahan-tiang-reklame",
          },
          {
            title: "Pemasangan Media Promosi",
            path: "/lahan-iklan/pemasangan-media-promosi",
          },
        ],

        "Kios / Los": [
          {
            title: "Kios Terminal",
            path: "/kios-los/kios-terminal",
          },
          {
            title: "Los BPSPP",
            path: "/kios-los/los-bpspp",
          },
        ],

        "Lain-lain": [
          {
            title: "Produksi Perkebunan",
            path: "/lain-lain/produksi-perkebunan",
          },
          {
            title: "Sayur-sayuran",
            path: "/lain-lain/sayur-sayuran",
          },
          {
            title: "Kalibrasi Alat",
            path: "/lain-lain/kalibrasi-alat",
          },
          {
            title: "Pemakaian Ruang",
            path: "/lain-lain/pemakaian-ruang",
          },
          {
            title: "Pengujian",
            path: "/lain-lain/pengujian",
          },
        ],
      },
    },

    penetapan: {
      items: [
        {
          title: "SKRD",
          path: "/skrd",
        },
        {
          title: "Pembayaran",
          path: "/pembayaran",
        },
      ],
    },

    tiketonline: {
      items: [
        {
          title: "Pariwisata",
          path: "/pariwisata",
        },
      ],
    },

    lainnya: {
      items: [
        {
          title: "PAP",
          path: "/pap",
        },
        {
          title: "PAB",
          path: "/pab",
        },
        {
          title: "DLL",
          path: "/dll",
        },
      ],
    },
  };

  return (
    <div className="fixed top-4 left-0 right-0 z-50 px-3 md:px-6">
      <header className="max-w-7xl mx-auto rounded-[30px] border border-gray-200/70 bg-white/90 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] overflow-visible">
        {/* MAIN NAVBAR */}
        <div className="px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* LEFT */}
            <div className="flex items-center gap-4">
              {/* MOBILE BUTTON */}
              <button
                className="md:hidden p-2 rounded-2xl hover:bg-gray-100 transition-all"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-700" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700" />
                )}
              </button>

              {/* LOGO */}
              <Link to="/" className="flex items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-xl"
                >
                  <span className="text-white font-bold text-lg">PR</span>
                </motion.div>

                <div className="hidden sm:flex flex-col">
                  <span className="text-lg font-bold text-gray-800 leading-none">
                    PEPAK RAJA
                  </span>

                  <span className="text-xs text-gray-500">
                    Marketplace Retribusi
                  </span>
                </div>
              </Link>

              {/* MENU */}
              <div
                className="relative hidden md:block"
                onMouseEnter={() => setShowCategory(true)}
                onMouseLeave={() => setShowCategory(false)}
              >
                <button className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-all font-medium text-gray-700">
                  Menu
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
                      showCategory ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* DROPDOWN */}
                <AnimatePresence>
                  {showCategory && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 15,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        y: 15,
                      }}
                      transition={{
                        duration: 0.2,
                      }}
                      className="absolute top-full mt-4 left-0 z-[999] w-[950px] rounded-[30px] border border-gray-200 bg-white shadow-2xl overflow-hidden"
                    >
                      {/* TOP MENU */}
                      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100 bg-white">
                        {[
                          {
                            key: "home",
                            label: "Home",
                          },
                          {
                            key: "penetapan",
                            label: "Penetapan",
                          },
                          {
                            key: "tiketonline",
                            label: "Tiket Online",
                          },
                          {
                            key: "lainnya",
                            label: "Lain-lain",
                          },
                        ].map((menu) => (
                          <button
                            key={menu.key}
                            onClick={() => setActiveMenu(menu.key)}
                            className={`relative px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                              activeMenu === menu.key
                                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                            }`}
                          >
                            {menu.label}
                          </button>
                        ))}
                      </div>

                      {/* CONTENT */}
                      <div
                        className={`grid ${
                          activeMenu === "home"
                            ? "grid-cols-[260px_1fr]"
                            : "grid-cols-1"
                        }`}
                      >
                        {/* SIDEBAR */}
                        {activeMenu === "home" && (
                          <div className="bg-gray-50 border-r border-gray-100 p-5 h-[450px] overflow-y-auto">
                            <div className="space-y-2">
                              {Object.keys(menuData.home.categories).map(
                                (item, index) => (
                                  <motion.button
                                    whileHover={{
                                      x: 5,
                                    }}
                                    key={index}
                                    onClick={() => setActiveCategory(item)}
                                    className={`w-full text-left px-4 py-3 rounded-2xl transition-all text-sm ${
                                      activeCategory === item
                                        ? "bg-white shadow-md text-blue-600 font-semibold"
                                        : "hover:bg-white hover:shadow-sm text-gray-700"
                                    }`}
                                  >
                                    {item}
                                  </motion.button>
                                ),
                              )}
                            </div>
                          </div>
                        )}

                        {/* RIGHT CONTENT */}
                        <div className="p-7">
                          {/* LIST BUTTON */}
                          <div
                            className={`grid gap-4 ${
                              activeMenu === "home"
                                ? "grid-cols-2"
                                : "grid-cols-2"
                            }`}
                          >
                            {(activeMenu === "home"
                              ? menuData.home.categories[activeCategory]
                              : menuData[activeMenu].items
                            ).map((item, index) => (
                              <Link key={index} to={item.path}>
                                <motion.div
                                  whileHover={{
                                    y: -3,
                                    scale: 1.02,
                                  }}
                                  whileTap={{
                                    scale: 0.98,
                                  }}
                                  transition={{
                                    duration: 0.2,
                                  }}
                                  className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 py-4 hover:border-blue-300 hover:shadow-xl transition-all"
                                >
                                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-50/40 to-indigo-50/60 opacity-0 group-hover:opacity-100 transition-all duration-300" />

                                  <div className="relative flex items-center justify-between">
                                    <span className="font-semibold text-gray-800 text-[15px]">
                                      {item.title}
                                    </span>

                                    <div className="w-8 h-8 rounded-xl bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-all">
                                      <ChevronDown className="-rotate-90 w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                                    </div>
                                  </div>
                                </motion.div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* SEARCH */}
            <div className="hidden lg:flex flex-1 max-w-2xl">
              <div className="relative w-full">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                <input
                  type="text"
                  placeholder="Cari layanan atau retribusi..."
                  onClick={() => setSearchOpen(true)}
                  className="w-full pl-14 pr-5 py-4 rounded-2xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                />
              </div>
            </div>

            {/* SEARCH DROPDOWN */}
            <SearchDropdown
              isOpen={searchOpen}
              onClose={() => setSearchOpen(false)}
            />

            {/* RIGHT */}
            <div className="flex items-center gap-3">
              {/* CART */}
              <Link
                to="/cart"
                className="relative w-12 h-12 rounded-2xl hover:bg-gray-100 flex items-center justify-center transition-all"
              >
                <ShoppingCart className="w-5 h-5 text-gray-700" />

                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-pink-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-lg">
                    {getTotalItems()}
                  </span>
                )}
              </Link>

              {/* USER */}
              {isAuthenticated ? (
                <div className="relative group hidden md:block">
                  <button className="flex items-center gap-3 px-3 py-2 rounded-2xl hover:bg-gray-100 transition-all">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold shadow">
                      {user?.name?.charAt(0) || "U"}
                    </div>

                    <div className="hidden lg:block text-left">
                      <p className="font-semibold text-sm text-gray-800">
                        {user?.name || "User"}
                      </p>

                      <p className="text-xs text-gray-500 capitalize">
                        {user?.role || "user"}
                      </p>
                    </div>
                  </button>

                  {/* USER DROPDOWN */}
                  <div className="absolute right-0 mt-3 w-64 rounded-3xl border border-gray-200 bg-white shadow-2xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <div className="p-5 border-b border-gray-100">
                      <p className="font-bold text-gray-800">
                        {user?.name || "User"}
                      </p>

                      <p className="text-sm text-gray-500 capitalize">
                        {user?.role || "user"}
                      </p>
                    </div>

                    <div className="p-3 space-y-1">
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-blue-50 transition-all"
                      >
                        <Home className="w-4 h-4" />
                        Dashboard
                      </Link>

                      {(user?.role === "admin" ||
                        user?.role === "superadmin") && (
                        <Link
                          to={user?.role === "admin" ? "/admin" : "/superadmin"}
                          className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-blue-50 transition-all"
                        >
                          <Settings className="w-4 h-4" />

                          {user?.role === "superadmin"
                            ? "SuperAdmin Panel"
                            : "Admin Panel"}
                        </Link>
                      )}
                    </div>

                    <div className="p-3 border-t border-gray-100">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-red-50 hover:text-red-600 transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="hidden md:flex gap-2">
                  <Link
                    to="/login"
                    className="px-5 py-3 rounded-2xl border border-gray-300 hover:bg-gray-100 transition-all font-semibold text-gray-700"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:scale-105 transition-all font-semibold"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{
                opacity: 0,
                height: 0,
              }}
              animate={{
                opacity: 1,
                height: "auto",
              }}
              exit={{
                opacity: 0,
                height: 0,
              }}
              className="md:hidden border-t border-gray-100 bg-white"
            >
              <div className="p-5 space-y-3">
                {/* HOME */}
                <div className="space-y-2">
                  <div className="font-bold text-gray-800 px-2">Home</div>

                  {Object.keys(menuData.home.categories).map((cat, i) => (
                    <div key={i}>
                      <div className="text-sm font-semibold text-blue-600 px-2 py-2">
                        {cat}
                      </div>

                      <div className="space-y-2 ml-2">
                        {menuData.home.categories[cat].map((item, idx) => (
                          <Link
                            key={idx}
                            to={item.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-4 py-3 rounded-2xl bg-gray-50 hover:bg-blue-50 transition-all text-sm"
                          >
                            {item.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* PENETAPAN */}
                <div className="pt-3 border-t border-gray-100">
                  <div className="font-bold text-gray-800 px-2 mb-2">
                    Penetapan
                  </div>

                  {menuData.penetapan.items.map((item, idx) => (
                    <Link
                      key={idx}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 rounded-2xl hover:bg-blue-50 transition-all"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>

                {/* TIKET ONLINE */}
                <div className="pt-3 border-t border-gray-100">
                  <div className="font-bold text-gray-800 px-2 mb-2">
                    Tiket Online
                  </div>

                  {menuData.tiketonline.items.map((item, idx) => (
                    <Link
                      key={idx}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 rounded-2xl hover:bg-blue-50 transition-all"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>

                {/* LAINNYA */}
                <div className="pt-3 border-t border-gray-100">
                  <div className="font-bold text-gray-800 px-2 mb-2">
                    Lain-lain
                  </div>

                  {menuData.lainnya.items.map((item, idx) => (
                    <Link
                      key={idx}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 rounded-2xl hover:bg-blue-50 transition-all"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </div>
  );
}
