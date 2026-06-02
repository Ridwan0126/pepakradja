import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  LogOut,
  ChevronDown,
  Search,
  MapPin,
  Building2,
  Wallet,
  XCircle,
  ArrowRight,
  User,
} from "lucide-react";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const navigate = useNavigate();

  // =========================
  // REF
  // =========================
  const searchRef = useRef(null);
  const profileRef = useRef(null);

  // =========================
  // STATE
  // =========================
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [showCategory, setShowCategory] = useState(false);

  const [activeMenu, setActiveMenu] = useState("home");

  const [activeCategory, setActiveCategory] = useState("Tanah");

  // SEARCH
  const [searchOpen, setSearchOpen] = useState(false);

  const [search, setSearch] = useState("");

  const [lastSearch, setLastSearch] = useState("");

  const [searchResults, setSearchResults] = useState([]);

  const [loadingSearch, setLoadingSearch] = useState(false);

  // PROFILE
  const [profileOpen, setProfileOpen] = useState(false);

  // DETAIL
  const [selectedDetail, setSelectedDetail] = useState(null);

  // GALLERY
  const [activeImage, setActiveImage] = useState("");

  // AUTH
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [user, setUser] = useState(null);

  // =========================
  // CHECK SESSION
  // =========================
  useEffect(() => {
    checkSession();
  }, []);
  useEffect(() => {
    if (selectedDetail) {
      setSearchOpen(false);
    }
  }, [selectedDetail]);
  const checkSession = () => {
    const session = localStorage.getItem("wr_session");

    if (!session) {
      setIsAuthenticated(false);
      setUser(null);
      return;
    }

    try {
      const parsed = JSON.parse(session);

      if (Date.now() > parsed.expiredAt) {
        localStorage.removeItem("wr_session");

        localStorage.removeItem("wr_user_header");

        setIsAuthenticated(false);

        setUser(null);

        return;
      }

      setIsAuthenticated(true);

      setUser(parsed.user);
    } catch (err) {
      console.error(err);

      localStorage.removeItem("wr_session");

      localStorage.removeItem("wr_user_header");

      setIsAuthenticated(false);

      setUser(null);
    }
  };

  // =========================
  // CLICK OUTSIDE
  // =========================
  useEffect(() => {
    const handleClickOutside = (event) => {
      // SEARCH
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }

      // PROFILE
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("wr_session");

    localStorage.removeItem("wr_user_header");

    setIsAuthenticated(false);

    setUser(null);

    setProfileOpen(false);

    navigate("/login");

    setMobileMenuOpen(false);
  };

  // =========================
  // AUTO SEARCH
  // =========================
  useEffect(() => {
    const debounce = setTimeout(() => {
      if (search.trim()) {
        handleSearch(search);
      } else {
        setSearchResults([]);

        setSearchOpen(false);
      }
    }, 500);

    return () => clearTimeout(debounce);
  }, [search]);

  // =========================
  // GET ALL PHOTOS
  // =========================
  const getAllPhotos = (item) => {
    const photos = [];

    if (item?.foto) photos.push(item.foto);

    if (item?.foto2) photos.push(item.foto2);

    if (item?.foto3) photos.push(item.foto3);

    if (item?.foto4) photos.push(item.foto4);

    return [...new Set(photos)];
  };

  // =========================
  // SEARCH API
  // =========================
  const handleSearch = async (keywordSearch = search) => {
    try {
      const keyword = keywordSearch.toLowerCase().trim();

      if (!keyword) {
        setSearchResults([]);

        setSearchOpen(false);

        return;
      }

      setLastSearch(keywordSearch);

      setLoadingSearch(true);

      setSearchOpen(true);

      let allData = [];

      let currentPage = 1;

      let hasMore = true;

      while (hasMore) {
        const response = await fetch(
          `https://rpp.bapenda.jatengprov.go.id/penatausahaan/api/penakbusiti/obyek-retribusi?page=${currentPage}&limit=100&search=${encodeURIComponent(
            keyword,
          )}`,
        );

        const result = await response.json();

        const apiData = result?.data || [];

        if (apiData.length > 0) {
          allData = [...allData, ...apiData];

          currentPage++;
        } else {
          hasMore = false;
        }

        if (currentPage > 20) {
          hasMore = false;
        }
      }

      const filtered = allData.filter((item) => {
        const obyek = item?.obyek_retribusi?.toLowerCase() || "";

        const opd = item?.opd?.nama?.toLowerCase() || "";

        const uppd = item?.uppd?.nama?.toLowerCase() || "";

        const kota = item?.kota?.kab_kota?.toLowerCase() || "";

        const kecamatan = item?.kecamatan?.kecamatan?.toLowerCase() || "";

        const jenis = item?.jenis?.jenis_retribusi?.toLowerCase() || "";

        return (
          obyek.includes(keyword) ||
          opd.includes(keyword) ||
          uppd.includes(keyword) ||
          kota.includes(keyword) ||
          kecamatan.includes(keyword) ||
          jenis.includes(keyword)
        );
      });

      setSearchResults(filtered);

      setSearchOpen(true);
    } catch (err) {
      console.error("SEARCH ERROR:", err);

      setSearchResults([]);
    } finally {
      setLoadingSearch(false);
    }
  };

  // =========================
  // MENU DATA
  // =========================
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
          title: "SPTRD",
          path: "/sptrd",
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

  const topMenus = [
    {
      key: "home",
      label: "Home",
    },

    ...(isAuthenticated
      ? [
          {
            key: "penetapan",
            label: "Penetapan",
          },
        ]
      : []),

    {
      key: "tiketonline",
      label: "Tiket Online",
    },

    {
      key: "lainnya",
      label: "Lain-lain",
    },
  ];

  return (
    <>
      {/* BLUR */}
      <AnimatePresence>
        {(searchOpen || selectedDetail) && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="fixed inset-0 bg-black/20 backdrop-blur-md z-40"
          />
        )}
      </AnimatePresence>

      <div className="fixed top-4 left-0 right-0 z-50 px-3 md:px-6">
        <div className="max-w-7xl mx-auto">
          {/* HEADER */}
          <header className="rounded-[30px] border border-gray-200/70 bg-white/95 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] overflow-visible">
            <div className="px-4 lg:px-6 py-4">
              <div className="flex items-center justify-between gap-4">
                {/* LEFT */}
                <div className="flex items-center gap-4">
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
                      whileHover={{
                        scale: 1.03,
                      }}
                      className="flex items-center justify-center"
                    >
                      <img
                        src="/images/logopepakraja.png"
                        alt="Logo"
                        className="h-12 w-auto object-contain"
                      />
                    </motion.div>

                    <div className="hidden sm:flex flex-col leading-tight">
                      <span className="text-lg font-bold text-gray-800">
                        PEPAK RADJA
                      </span>

                      <span className="text-xs text-gray-500">
                        Marketplace Retribusi
                      </span>
                    </div>
                  </Link>

                  {/* MENU */}
                  <div
                    className="relative hidden md:block z-[10001]"
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
                          className="absolute mt-8 mb-12 left-0  w-[950px] rounded-[30px] border border-gray-200 bg-white shadow-2xl overflow-hidden"
                        >
                          {/* TOP MENU */}
                          <div className="flex items-center gap-3 px-6 py-3 border-b border-gray-100 bg-white">
                            {topMenus.map((menu) => (
                              <button
                                key={menu.key}
                                onClick={() => setActiveMenu(menu.key)}
                                className={`px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
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
                            {/* CATEGORY */}
                            {activeMenu === "home" && (
                              <div className="bg-gray-50 border-r border-gray-100 p-5 h-[450px] overflow-y-auto">
                                <div className="space-y-2">
                                  {Object.keys(menuData.home.categories).map(
                                    (item, index) => (
                                      <button
                                        key={index}
                                        onClick={() => setActiveCategory(item)}
                                        className={`w-full text-left px-4 py-3 rounded-2xl transition-all text-sm ${
                                          activeCategory === item
                                            ? "bg-white shadow-md text-blue-600 font-semibold"
                                            : "hover:bg-white hover:shadow-sm text-gray-700"
                                        }`}
                                      >
                                        {item}
                                      </button>
                                    ),
                                  )}
                                </div>
                              </div>
                            )}

                            {/* SUB MENU */}
                            <div className="p-2">
                              <div className="grid gap-4 grid-cols-2">
                                {(activeMenu === "home"
                                  ? menuData.home.categories[activeCategory]
                                  : menuData[activeMenu]?.items || []
                                ).map((item, index) => (
                                  <Link key={index} to={item.path}>
                                    <motion.div
                                      whileHover={{
                                        y: -3,
                                        scale: 1.02,
                                      }}
                                      className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 py-4 hover:border-blue-300 hover:shadow-xl transition-all"
                                    >
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
                <div ref={searchRef} className="hidden lg:flex flex-1 relative">
                  <div className="relative w-full">
                    {/* ICON */}
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />

                    {/* INPUT */}
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onFocus={() => {
                        if (search.trim()) {
                          setSearchOpen(true);
                        }
                      }}
                      placeholder="Cari layanan atau retribusi..."
                      className="
        w-full
        pl-14
        pr-28
        py-4
        rounded-[24px]
        border
        border-gray-200
        bg-white
        focus:outline-none
        focus:ring-2
        focus:ring-blue-500
        transition-all
      "
                    />

                    {/* BUTTON SEARCH */}
                    <button
                      onClick={() => handleSearch(search)}
                      className="
        absolute
        right-12
        top-1/2
        -translate-y-1/2
        text-blue-600
        text-sm
        font-semibold
        hover:text-blue-700
        z-10
      "
                    >
                      Cari
                    </button>

                    {/* CLEAR */}
                    {search && (
                      <button
                        onClick={() => {
                          setSearch("");
                          setLastSearch("");
                          setSearchResults([]);
                          setSearchOpen(false);
                          setSelectedDetail(null);
                        }}
                        className="
          absolute
          right-4
          top-1/2
          -translate-y-1/2
          z-10
        "
                      >
                        <XCircle className="w-5 h-5 text-gray-400 hover:text-red-500 transition-all" />
                      </button>
                    )}
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-3">
                  {isAuthenticated ? (
                    <div ref={profileRef} className="relative hidden md:block">
                      <button
                        onClick={() => setProfileOpen(!profileOpen)}
                        className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-all"
                      >
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold">
                          {user?.nama?.charAt(0) || "U"}
                        </div>

                        <div className="text-left">
                          <p className="font-semibold text-sm text-gray-800">
                            {user?.nama || "User"}
                          </p>

                          <p className="text-xs text-gray-500">Profile</p>
                        </div>

                        <ChevronDown
                          className={`w-4 h-4 transition-all ${
                            profileOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {profileOpen && (
                          <motion.div
                            initial={{
                              opacity: 0,
                              y: 10,
                            }}
                            animate={{
                              opacity: 1,
                              y: 0,
                            }}
                            exit={{
                              opacity: 0,
                              y: 10,
                            }}
                            className="absolute right-0 mt-3 w-64 rounded-3xl border border-gray-200 bg-white shadow-2xl overflow-hidden z-[99999]"
                          >
                            <div className="p-5 border-b border-gray-100">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold">
                                  {user?.nama?.charAt(0) || "U"}
                                </div>

                                <div>
                                  <h3 className="font-bold text-gray-800">
                                    {user?.nama || "User"}
                                  </h3>

                                  <p className="text-sm text-gray-500">
                                    {user?.email || "-"}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="p-3">
                              <button
                                onClick={() => {
                                  navigate("/profile");

                                  setProfileOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-gray-100 transition-all text-gray-700"
                              >
                                <User className="w-4 h-4" />
                                Profile
                              </button>

                              <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-red-50 text-red-600 transition-all"
                              >
                                <LogOut className="w-4 h-4" />
                                Logout
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
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
          </header>

          {/* SEARCH RESULT */}
          <AnimatePresence>
            {searchOpen && !selectedDetail && search.trim() && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="
        fixed
        inset-0
        mt-4
        z-[99999]
        pt-[100px]   /* JARAK NAVBAR */
        pb-6         /* JARAK BAWAH */
      "
              >
                {/* CONTAINER */}
                <div className="max-w-7xl mx-auto px-3 md:px-6 h-full">
                  <div
                    className="
            h-full
            rounded-[28px]
            border
            border-gray-200
            bg-white
            shadow-[0_20px_60px_rgba(0,0,0,0.15)]
            flex
            flex-col
            overflow-hidden
          "
                  >
                    {/* HEADER */}
                    <div className="px-5 py-4 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-lg font-bold text-gray-800">
                            Hasil Pencarian
                          </h2>
                          <p className="text-xs text-gray-500">
                            {searchResults.length} data ditemukan
                          </p>
                        </div>

                        {loadingSearch && (
                          <div className="text-xs font-semibold text-blue-600">
                            Loading...
                          </div>
                        )}
                      </div>
                    </div>

                    {/* CONTENT SCROLL */}
                    <div className="flex-1 overflow-y-auto p-4">
                      {!loadingSearch && searchResults.length === 0 ? (
                        <div className="py-14 text-center">
                          <p className="text-gray-500 text-sm">
                            Tidak ada data ditemukan
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {searchResults.map((item, index) => {
                            const BASE_URL =
                              "https://rpp.bapenda.jatengprov.go.id";

                            // ✅ FIX FOTO (pakai underscore + fallback)
                            const photo =
                              item?.foto ||
                              item?.foto_2 ||
                              item?.foto_3 ||
                              item?.foto_4 ||
                              null;

                            return (
                              <motion.div
                                key={`${item.id}-${index}`}
                                whileHover={{ scale: 1.02 }}
                                onClick={() => {
                                  setSelectedDetail(item);
                                  setActiveImage(photo);
                                  setSearchOpen(false);
                                }}
                                className="
                        flex
                        items-center
                        gap-3
                        p-3
                        rounded-xl
                        border
                        border-gray-200
                        bg-white
                        hover:shadow-md
                        hover:border-blue-300
                        transition-all
                        cursor-pointer
                      "
                              >
                                {/* IMAGE */}
                                <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                  {photo ? (
                                    <img
                                      src={activeImage}
                                      alt="foto"
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600">
                                      <Building2 className="w-5 h-5 text-white" />
                                    </div>
                                  )}
                                </div>

                                {/* TEXT */}
                                <div className="min-w-0">
                                  <h3 className="font-semibold text-gray-800 text-sm truncate">
                                    {item?.obyek_retribusi}
                                  </h3>

                                  <p className="text-xs text-blue-600 font-medium truncate">
                                    {item?.opd?.nama || "-"}
                                  </p>

                                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                    <div className="flex items-center gap-1">
                                      <MapPin className="w-3 h-3 text-blue-500" />
                                      {item?.kota?.kab_kota || "-"}
                                    </div>

                                    <div className="flex items-center gap-1 text-green-600 font-semibold">
                                      <Wallet className="w-3 h-3" />
                                      Rp{" "}
                                      {Number(
                                        item?.tariftbl?.tarif || 0,
                                      ).toLocaleString("id-ID")}
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* DETAIL */}
          <AnimatePresence>
            {selectedDetail && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="
        fixed
        inset-0 mt-4
        z-[99999]
        pt-[100px]   /* SAMA DENGAN SEARCH */
        pb-6
      "
              >
                {/* CONTAINER SAMA */}
                <div className="max-w-7xl mx-auto px-3 md:px-6 h-full">
                  <div
                    className="
            h-full
            rounded-[28px]
            border
            border-gray-200
            bg-white
            shadow-[0_20px_60px_rgba(0,0,0,0.15)]
            flex
            flex-col
            overflow-hidden
          "
                  >
                    {/* HEADER */}
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-bold text-gray-800">
                          Detail
                        </h2>
                        <p className="text-xs text-gray-500">
                          {selectedDetail?.obyek_retribusi}
                        </p>
                      </div>

                      {/* CLOSE */}
                      <button
                        onClick={() => {
                          setSelectedDetail(null);
                          setSearchOpen(true);
                        }}
                        className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                      >
                        <X className="w-5 h-5 text-gray-700" />
                      </button>
                    </div>

                    {/* CONTENT SCROLL */}
                    <div className="flex-1 overflow-y-auto">
                      <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
                        {/* ================= LEFT - FOTO ================= */}
                        <div className="flex flex-col border-r border-gray-100">
                          {/* MAIN IMAGE */}
                          <div className="h-[420px] bg-gray-100">
                            {activeImage ? (
                              <img
                                src={activeImage}
                                alt="detail"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600">
                                <Building2 className="w-20 h-20 text-white" />
                              </div>
                            )}
                          </div>

                          {/* THUMBNAIL */}
                          <div className="p-4 flex gap-3 overflow-x-auto">
                            {getAllPhotos(selectedDetail).map((photo, i) => (
                              <button
                                key={i}
                                onClick={() => setActiveImage(photo)}
                                className={`min-w-[110px] h-[90px] rounded-xl overflow-hidden border-2 transition-all ${
                                  activeImage === photo
                                    ? "border-blue-500"
                                    : "border-transparent"
                                }`}
                              >
                                <img
                                  src={photo}
                                  className="w-full h-full object-cover"
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* ================= RIGHT - INFO ================= */}
                        <div className="flex flex-col">
                          <div className="p-6 space-y-5">
                            {/* TITLE */}
                            <div>
                              <h1 className="text-2xl font-bold text-gray-800">
                                {selectedDetail?.obyek_retribusi}
                              </h1>

                              <p className="text-sm text-gray-500 mt-1">
                                {selectedDetail?.kota?.kab_kota || "-"}
                              </p>
                            </div>

                            {/* PRICE */}
                            <div className="text-2xl font-bold text-blue-600">
                              Rp{" "}
                              {Number(
                                selectedDetail?.tariftbl?.tarif || 0,
                              ).toLocaleString("id-ID")}
                            </div>

                            {/* GRID INFO */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="border rounded-2xl p-4">
                                <p className="text-xs text-gray-500 mb-1">
                                  OPD
                                </p>
                                <p className="font-semibold text-gray-800">
                                  {selectedDetail?.opd?.nama || "-"}
                                </p>
                              </div>

                              <div className="border rounded-2xl p-4">
                                <p className="text-xs text-gray-500 mb-1">
                                  UPPD
                                </p>
                                <p className="font-semibold text-gray-800">
                                  {selectedDetail?.uppd?.nama || "-"}
                                </p>
                              </div>

                              <div className="border rounded-2xl p-4">
                                <p className="text-xs text-gray-500 mb-1">
                                  Jenis
                                </p>
                                <p className="font-semibold text-gray-800">
                                  {selectedDetail?.jenis?.jenis_retribusi ||
                                    "-"}
                                </p>
                              </div>

                              <div className="border rounded-2xl p-4">
                                <p className="text-xs text-gray-500 mb-1">
                                  Alamat
                                </p>
                                <p className="font-semibold text-gray-800">
                                  {selectedDetail?.alamat || "-"}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* BUTTON STICKY BAWAH */}
                          <div className="mt-auto p-6 border-t">
                            <button
                              onClick={() => {
                                setSearchOpen(false);
                                setSelectedDetail(null);
                                setSearch(""); // optional biar bersih
                                navigate(`/products/${selectedDetail?.id}`, {
                                  state: selectedDetail,
                                });
                              }}
                              className="w-full py-4 rounded-2xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                            >
                              Selengkapnya
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
