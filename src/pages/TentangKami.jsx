"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ChevronDown,
  Star,
  Users,
  Zap,
  Heart,
  Eye,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Bell,
  Search,
  Settings,
  Globe,
  Code,
  Palette,
  BarChart3,
  Lock,
  Smartphone,
  TrendingUp,
  DollarSign,
  FileText,
  Building2,
  Briefcase,
  Award,
  MapPin,
  Phone,
  Mail,
  Clock,
  Download,
  FileCheck,
  AlertCircle,
  Target,
  Percent,
  Home,
  Car,
  Landmark,
  Utensils,
  Ticket,
  Building,
  Plus,
  ChevronRight,
  BookOpen,
  PieChart,
  Headphones,
  Shield,
} from "lucide-react";

export default function BapendaJateng() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [notification, setNotification] = useState("");
  const [expandedFaq, setExpandedFaq] = useState(0);
  const [activeTab, setActiveTab] = useState("pajak");

  useEffect(() => {
    const timer = setTimeout(() => setPopupVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 3000);
  };

  // Main Navigation
  const navItems = [
    "Beranda",
    "Profil",
    "Layanan",
    "Informasi",
    "Tim",
    "Kontak",
  ];

  // Kategori Pajak & Retribusi
  const pajakRetribusi = [
    {
      id: 1,
      title: "Pajak Kendaraan Bermotor",
      desc: "Pajak atas kepemilikan kendaraan bermotor",
      icon: Car,
      detail:
        "Meliputi mobil pribadi, motor, kendaraan komersial dengan tarif progressif",
      revenue: "Rp 2.5 Triliun",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: 2,
      title: "Pajak Air Permukaan",
      desc: "Pajak penggunaan air dari sumber air permukaan",
      icon: Zap,
      detail: "Untuk keperluan pertanian, industri, dan komersial",
      revenue: "Rp 850 Miliar",
      color: "from-green-500 to-emerald-500",
    },
    {
      id: 3,
      title: "Retribusi Jasa Umum",
      desc: "Retribusi untuk pelayanan kesehatan, parkir, pasar",
      icon: Home,
      detail: "Mencakup layanan publik yang diberikan pemerintah daerah",
      revenue: "Rp 450 Miliar",
      color: "from-purple-500 to-pink-500",
    },
    {
      id: 4,
      title: "Retribusi Perizinan",
      desc: "Retribusi untuk perizinan usaha dan bangunan",
      icon: FileCheck,
      detail: "IMB, izin trayek, izin usaha komersial",
      revenue: "Rp 320 Miliar",
      color: "from-orange-500 to-yellow-500",
    },
    {
      id: 5,
      title: "Bea Perolehan Hak atas Tanah",
      desc: "Pajak atas transaksi tanah dan bangunan",
      icon: Building2,
      detail: "Dikenakan pada setiap pembelian properti",
      revenue: "Rp 1.8 Triliun",
      color: "from-red-500 to-rose-500",
    },
    {
      id: 6,
      title: "Pajak Hiburan",
      desc: "Pajak atas penyelenggaraan hiburan umum",
      icon: Sparkles,
      detail: "Konser, teater, pertandingan olahraga",
      revenue: "Rp 180 Miliar",
      color: "from-indigo-500 to-violet-500",
    },
  ];

  // Divisi & Layanan Bapenda
  const divisions = [
    {
      id: 1,
      title: "Direktorat Pajak Daerah",
      desc: "Mengelola semua jenis pajak lokal",
      icon: DollarSign,
      services: [
        "Pajak Kendaraan Bermotor",
        "Pajak Air Permukaan",
        "Pajak Properti",
        "Pajak Hiburan",
      ],
    },
    {
      id: 2,
      title: "Direktorat Retribusi Daerah",
      desc: "Mengelola retribusi jasa dan perizinan",
      icon: FileText,
      services: [
        "Retribusi Jasa Umum",
        "Retribusi Usaha",
        "Retribusi Perizinan",
        "Retribusi Parkir",
      ],
    },
    {
      id: 3,
      title: "Direktorat Manajemen Aset",
      desc: "Pengelolaan aset daerah yang optimal",
      icon: Building2,
      services: [
        "Inventarisasi Aset",
        "Penilaian Aset",
        "Pemeliharaan Aset",
        "Pelaporan Aset",
      ],
    },
    {
      id: 4,
      title: "Direktorat Teknologi Informasi",
      desc: "Digitalisasi dan transformasi sistem",
      icon: Code,
      services: [
        "e-SAMSAT",
        "Portal Online Pajak",
        "Sistem Informasi Aset",
        "Data Analytics",
      ],
    },
    {
      id: 5,
      title: "Direktorat Kepatuhan",
      desc: "Pengawasan dan compliance pajak",
      icon: Shield,
      services: [
        "Pemeriksaan Pajak",
        "Penindakan Pelanggaran",
        "Konsultasi Pajak",
        "Penyuluhan",
      ],
    },
    {
      id: 6,
      title: "Direktorat Pelayanan Publik",
      desc: "Layanan pelanggan terpadu",
      icon: Headphones,
      services: [
        "Customer Service",
        "Pengaduan Pelayanan",
        "Informasi Publik",
        "Mediasi Sengketa",
      ],
    },
  ];

  // Jenis Aset yang Dikelola
  const assetTypes = [
    {
      icon: Home,
      title: "Tanah & Bangunan",
      value: "Rp 8.5 Triliun",
      description: "Aset tetap berupa properti pemerintah",
    },
    {
      icon: Car,
      title: "Kendaraan",
      value: "12,450 unit",
      description: "Kendaraan operasional berbagai instansi",
    },
    {
      icon: Landmark,
      title: "Infrastruktur",
      value: "Rp 5.2 Triliun",
      description: "Jalan, jembatan, dan fasilitas publik",
    },
    {
      icon: Building,
      title: "Peralatan",
      value: "45,800 unit",
      description: "Mesin, peralatan kantor, dan furniture",
    },
  ];

  // Tim Management
  const teamMembers = [
    {
      id: 1,
      name: "Drs. H. Hadi Sutrisno, M.Si",
      role: "Kepala Bapenda",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      bio: "Berpengalaman lebih dari 25 tahun di bidang administrasi pemerintahan",
      phone: "+62-274-1234567",
    },
    {
      id: 2,
      name: "Ir. Siti Nurhaliza, M.Eng",
      role: "Kepala Seksi Pajak Daerah",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      bio: "Spesialis dalam sistem perpajakan daerah modern",
      phone: "+62-274-1234568",
    },
    {
      id: 3,
      name: "Bambang Suryanto, S.H., M.H",
      role: "Kepala Seksi Retribusi",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      bio: "Ahli dalam regulasi retribusi daerah",
      phone: "+62-274-1234569",
    },
    {
      id: 4,
      name: "Dr. Rini Widiastuti, S.E., M.E",
      role: "Kepala Seksi Manajemen Aset",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      bio: "Doktor ekonomi dengan fokus pada pengelolaan aset publik",
      phone: "+62-274-1234570",
    },
    {
      id: 5,
      name: "Agus Prabowo, S.T., M.T",
      role: "Kepala Seksi IT",
      image:
        "https://images.unsplash.com/photo-1507239711619-18f1d1f60f78?w=400&h=400&fit=crop",
      bio: "Insinyur teknologi dengan keahlian transformasi digital",
      phone: "+62-274-1234571",
    },
    {
      id: 6,
      name: "Dewi Lestari, S.A.B",
      role: "Kepala Seksi Pelayanan Publik",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      bio: "Berpengalaman dalam manajemen layanan pelanggan",
      phone: "+62-274-1234572",
    },
  ];

  // FAQ Section
  const faqs = [
    {
      question: "Apa itu Bapenda Provinsi Jawa Tengah?",
      answer:
        "Bapenda (Badan Pendapatan Daerah) Provinsi Jawa Tengah adalah lembaga pemerintah daerah yang bertanggung jawab mengelola pendapatan asli daerah melalui perpajakan, retribusi, dan pengelolaan aset daerah untuk mendukung pembangunan ekonomi berkelanjutan di Jawa Tengah.",
    },
    {
      question: "Apa perbedaan pajak, retribusi, dan aset?",
      answer:
        "Pajak adalah pungutan wajib tanpa imbalan langsung, retribusi adalah pungutan atas jasa atau perizinan tertentu yang diberikan pemerintah, sedangkan aset adalah barang milik daerah yang dikelola untuk kemaksimalan pemanfaatannya dalam melayani masyarakat.",
    },
    {
      question: "Bagaimana cara membayar pajak kendaraan?",
      answer:
        "Anda dapat membayar melalui e-SAMSAT di website https://esamsat.jatengprov.go.id/, kantor SAMSAT, atau agen resmi. Untuk kendaraan baru, dapat langsung ke kantor Bapenda dengan membawa dokumen kendaraan.",
    },
    {
      question: "Apa saja jenis retribusi yang ada?",
      answer:
        "Retribusi dibagi menjadi 3 jenis: (1) Retribusi Jasa Umum untuk pelayanan kesehatan, parkir, pasar; (2) Retribusi Jasa Usaha untuk terminal, tempat rekreasi; (3) Retribusi Perizinan untuk IMB, izin trayek, dan izin usaha.",
    },
    {
      question: "Bagaimana manajemen aset daerah?",
      answer:
        "Manajemen aset mencakup perencanaan, pengadaan, penggunaan, pemeliharaan, penilaian, pemindahtanganan, dan pelaporan aset daerah sesuai Peraturan Pemerintah Nomor 27 Tahun 2014 yang diubah dengan PP Nomor 28 Tahun 2020.",
    },
    {
      question: "Bagaimana cara konsultasi atau mengadukan masalah?",
      answer:
        "Anda dapat menghubungi Call Center Bapenda di nomor telepon yang tersedia, email, atau datang langsung ke kantor pusat Bapenda di Semarang. Tim pelayanan kami siap membantu 24 jam untuk non-darurat pada hari kerja.",
    },
  ];

  // Statistics
  const stats = [
    { label: "Total PAD Terkelola", value: "Rp 6.1 Triliun", icon: TrendingUp },
    { label: "Jenis Pajak", value: "6+", icon: BarChart3 },
    { label: "Aset Terkelola", value: "Rp 18.5T+", icon: Building2 },
    { label: "Kepuasan Publik", value: "92%", icon: Star },
  ];

  return (
    <div className="bg-white text-gray-900 min-h-screen overflow-hidden">
      {/* NAVBAR */}
      <motion.nav
        className="fixed top-0 left-0 right-0 bg-white bg-opacity-95 backdrop-blur-lg border-b border-gray-100 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-2 rounded-lg">
              <Building2 size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">BAPENDA</h1>
              <p className="text-xs text-gray-600">Jawa Tengah</p>
            </div>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item, i) => (
              <motion.a
                key={i}
                href="#"
                className="text-gray-700 hover:text-blue-600 font-medium text-sm transition-colors"
                whileHover={{ y: -2 }}
              >
                {item}
              </motion.a>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Search size={20} className="text-gray-700" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 hover:bg-gray-100 rounded-lg relative"
            >
              <Bell size={20} className="text-gray-700" />
              <span className="absolute top-1 right-1 bg-red-500 w-2 h-2 rounded-full"></span>
            </motion.button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* HERO SECTION */}
      <motion.section
        className="pt-40 pb-20 px-4 bg-gradient-to-br from-blue-50 via-white to-gray-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6">
                <Sparkles size={16} />
                <span className="text-sm font-semibold">
                  Platform Pendapatan Digital Jawa Tengah
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Mengelola Pendapatan
                </span>
                <br />
                Daerah dengan Transparan
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Bapenda Provinsi Jawa Tengah berkomitmen mengoptimalkan
                pendapatan asli daerah melalui digitalisasi, transparansi, dan
                pelayanan terbaik untuk masyarakat.
              </p>

              <div className="flex flex-wrap gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveModal("info")}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:shadow-lg"
                >
                  Pelajari Lebih Lanjut
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveModal("layanan")}
                  className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50"
                >
                  Lihat Layanan
                </motion.button>
              </div>
            </motion.div>

            {/* Right Floating Cards */}
            <motion.div
              className="relative h-96"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              {/* Floating Card 1 */}
              <motion.div
                className="absolute top-0 right-0 w-56 bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <DollarSign className="text-blue-600 mb-3" size={28} />
                <p className="text-sm text-gray-600">Total PAD Terkelola</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">Rp 6.1T</p>
              </motion.div>

              {/* Floating Card 2 */}
              <motion.div
                className="absolute top-32 left-0 w-56 bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              >
                <Building2 className="text-green-600 mb-3" size={28} />
                <p className="text-sm text-gray-600">Aset Daerah</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  Rp 18.5T+
                </p>
              </motion.div>

              {/* Floating Card 3 */}
              <motion.div
                className="absolute bottom-0 right-8 w-56 bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 2 }}
              >
                <Star className="text-yellow-500 mb-3" size={28} />
                <p className="text-sm text-gray-600">Kepuasan Pelanggan</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">92%</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* QUICK STATS */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={i}
                  className="text-center"
                  whileHover={{ y: -5 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="bg-gradient-to-br from-blue-50 to-gray-50 rounded-lg p-6 mb-3">
                    <Icon className="text-blue-600 mx-auto" size={32} />
                  </div>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PAJAK & RETRIBUSI SECTION */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Pajak & Retribusi Daerah
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Enam kategori utama pendapatan yang menopang pembangunan Jawa
              Tengah
            </p>
          </motion.div>

          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {["pajak", "retribusi", "semua"].map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  activeTab === tab
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab === "pajak" && "Pajak"}
                {tab === "retribusi" && "Retribusi"}
                {tab === "semua" && "Semua"}
              </motion.button>
            ))}
          </div>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pajakRetribusi.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-2xl border border-gray-100 overflow-hidden cursor-pointer"
                  whileHover={{ y: -8 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedService(item)}
                >
                  {/* Gradient Header */}
                  <div
                    className={`h-32 bg-gradient-to-br ${item.color} relative overflow-hidden`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon size={64} className="text-white opacity-20" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <Icon className="text-blue-600 mb-3" size={32} />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">{item.desc}</p>
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-600">
                        Estimasi Pendapatan Tahunan
                      </p>
                      <p className="text-2xl font-bold text-blue-600 mt-1">
                        {item.revenue}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* DIVISIONS SECTION */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Divisi & Layanan
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tim profesional yang siap melayani kebutuhan pajak, retribusi, dan
              aset daerah
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {divisions.map((div, i) => {
              const Icon = div.icon;
              return (
                <motion.div
                  key={div.id}
                  className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-100 p-8 hover:shadow-2xl"
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="bg-blue-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="text-blue-600" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {div.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-6">{div.desc}</p>

                  <div className="space-y-2">
                    {div.services.map((service, j) => (
                      <div key={j} className="flex items-center gap-2">
                        <CheckCircle
                          size={16}
                          className="text-green-600 flex-shrink-0"
                        />
                        <span className="text-sm text-gray-700">{service}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ASSET MANAGEMENT */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Manajemen Aset Daerah
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Pengelolaan aset publik yang transparan dan efisien
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
            {/* Left */}
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="space-y-6">
                {assetTypes.map((asset, i) => {
                  const Icon = asset.icon;
                  return (
                    <motion.div
                      key={i}
                      className="flex gap-4 items-start p-4 rounded-lg hover:bg-white transition-colors"
                      whileHover={{ x: 8 }}
                    >
                      <div className="bg-blue-100 p-3 rounded-lg flex-shrink-0">
                        <Icon className="text-blue-600" size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">
                          {asset.title}
                        </h4>
                        <p className="text-blue-600 font-semibold mb-1">
                          {asset.value}
                        </p>
                        <p className="text-sm text-gray-600">
                          {asset.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Right */}
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-2xl shadow-2xl p-8"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Siklus Manajemen Aset
              </h3>
              <div className="space-y-4">
                {[
                  "Perencanaan Kebutuhan",
                  "Pengadaan Aset",
                  "Penggunaan & Pemanfaatan",
                  "Pemeliharaan & Pengamanan",
                  "Penilaian Aset",
                  "Pemindahtanganan/Pemusnahan",
                  "Penatausahaan",
                  "Pengawasan & Pengendalian",
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center text-sm font-bold">
                      {i + 1}
                    </div>
                    <span className="text-gray-700 font-medium">{step}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Tim Manajemen
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Para profesional berpengalaman yang memimpin transformasi
              pendapatan daerah
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, i) => (
              <motion.div
                key={member.id}
                className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl cursor-pointer"
                whileHover={{ y: -8 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setActiveModal("team")}
              >
                {/* Image */}
                <div className="h-64 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 font-semibold text-sm mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
                  <div className="flex items-center gap-2 text-blue-600 text-sm font-medium">
                    <Phone size={16} />
                    {member.phone}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Pertanyaan Umum
            </h2>
            <p className="text-xl text-gray-600">
              Temukan jawaban atas pertanyaan yang sering diajukan
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <motion.button
                  onClick={() => setExpandedFaq(expandedFaq === i ? -1 : i)}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                >
                  <span className="text-lg font-semibold text-gray-900 text-left">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: expandedFaq === i ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="text-blue-600" size={24} />
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {expandedFaq === i && (
                    <motion.div
                      className="px-6 pb-6 text-gray-600 border-t border-gray-100"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <motion.footer
        className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16 px-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Column 1 */}
            <div>
              <h3 className="text-xl font-bold mb-4">BAPENDA</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Badan Pendapatan Daerah Provinsi Jawa Tengah berkomitmen
                mengoptimalkan pendapatan asli daerah.
              </p>
            </div>

            {/* Column 2 */}
            <div>
              <h4 className="font-semibold mb-4">Layanan Utama</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Pajak Daerah
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Retribusi Daerah
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Manajemen Aset
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    e-SAMSAT
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <h4 className="font-semibold mb-4">Informasi</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Tentang Kami
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Tim
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Kontak
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4 */}
            <div>
              <h4 className="font-semibold mb-4">Hubungi Kami</h4>
              <div className="space-y-3 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span>Jl. Pandanaran, Semarang, Jateng</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} />
                  <span>(024) 3545-5678</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={16} />
                  <span>info@bapenda.jatengprov.go.id</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>Senin - Jumat, 08:00 - 16:00</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
            <p>
              &copy; 2024 BAPENDA Provinsi Jawa Tengah. All rights reserved.
            </p>
          </div>
        </div>
      </motion.footer>

      {/* WELCOME POPUP */}
      <AnimatePresence>
        {popupVisible && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPopupVisible(false)}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <Sparkles className="text-blue-600 mx-auto mb-4" size={48} />
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Selamat Datang di Bapenda
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Kami adalah lembaga yang mengelola pendapatan asli daerah Jawa
                  Tengah dengan profesional dan transparan.
                </p>
                <motion.button
                  onClick={() => setPopupVisible(false)}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Mulai Jelajahi
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODALS */}
      <AnimatePresence>
        {activeModal === "info" && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 my-8"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-3xl font-bold text-gray-900">
                  Tentang Bapenda Jateng
                </h2>
                <button
                  onClick={() => setActiveModal(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6 text-gray-600">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Visi</h3>
                  <p>
                    Menjadi lembaga pendapatan daerah yang modern, transparan,
                    dan berpihak pada masyarakat dalam mendukung pembangunan
                    berkelanjutan Jawa Tengah.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Misi</h3>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>
                      Mengoptimalkan Pendapatan Asli Daerah melalui digitalisasi
                      dan inovasi
                    </li>
                    <li>
                      Memberikan layanan pajak dan retribusi yang mudah, cepat,
                      dan transparan
                    </li>
                    <li>Mengelola aset daerah secara efisien dan akuntabel</li>
                    <li>
                      Meningkatkan kesadaran masyarakat tentang pentingnya pajak
                      dan retribusi
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Fungsi Utama
                  </h3>
                  <p>
                    Bapenda bertugas memungut, mengelola, dan melaporkan semua
                    jenis pajak daerah, retribusi daerah, dan aset daerah sesuai
                    dengan peraturan perundang-undangan yang berlaku.
                  </p>
                </div>

                <motion.button
                  onClick={() => {
                    setActiveModal(null);
                    showNotification(
                      "Terima kasih telah membaca informasi tentang kami!",
                    );
                  }}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Tutup
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {activeModal === "layanan" && selectedService && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-3xl font-bold text-gray-900">
                  {selectedService.title}
                </h2>
                <button
                  onClick={() => setActiveModal(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div
                  className={`h-32 bg-gradient-to-br ${selectedService.color} rounded-lg flex items-center justify-center`}
                >
                  <selectedService.icon
                    size={64}
                    className="text-white opacity-20"
                  />
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Deskripsi</h3>
                  <p className="text-gray-600">{selectedService.detail}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Estimasi Pendapatan</p>
                    <p className="text-2xl font-bold text-blue-600 mt-1">
                      {selectedService.revenue}
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">
                      Aktif
                    </p>
                  </div>
                </div>

                <motion.button
                  onClick={() => {
                    setActiveModal(null);
                    showNotification(
                      `Anda telah memilih: ${selectedService.title}`,
                    );
                  }}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Pelajari Lebih Lanjut
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NOTIFICATION TOAST */}
      <AnimatePresence>
        {notification && (
          <motion.div
            className="fixed top-24 right-4 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg z-50 flex items-center gap-3"
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CheckCircle size={20} />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
