"use client";

import { motion } from "framer-motion";
import {
  Users,
  UserCheck,
  UserX,
  UsersRound,
  Vote,
  BarChart3,
  Settings,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { storage } from "../utils/storage";

export default function Dashboard({ setCurrentPage }) {
  const [stats, setStats] = useState({
    totalPemilih: 0,
    sudahMemilih: 0,
    belumMemilih: 0,
    totalCalon: 0,
  });

  useEffect(() => {
    // Load data from localStorage
    const pemilih = storage.get("pemilih", []);
    const calon = storage.get("calon", []);
    const votes = storage.get("votes", []);

    setStats({
      totalPemilih: pemilih.length,
      sudahMemilih: votes.length,
      belumMemilih: pemilih.length - votes.length,
      totalCalon: calon.length,
    });
  }, []);

  const statsCards = [
    {
      title: "Total Pemilih",
      value: stats.totalPemilih,
      icon: Users,
      gradient: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50",
      iconBg: "from-blue-500 to-cyan-500",
    },
    {
      title: "Sudah Memilih",
      value: stats.sudahMemilih,
      icon: UserCheck,
      gradient: "from-green-500 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50",
      iconBg: "from-green-500 to-emerald-500",
    },
    {
      title: "Belum Memilih",
      value: stats.belumMemilih,
      icon: UserX,
      gradient: "from-orange-500 to-amber-500",
      bgColor: "from-orange-50 to-amber-50",
      iconBg: "from-orange-500 to-amber-500",
    },
    {
      title: "Total Calon",
      value: stats.totalCalon,
      icon: UsersRound,
      gradient: "from-purple-500 to-pink-500",
      bgColor: "from-purple-50 to-pink-50",
      iconBg: "from-purple-500 to-pink-500",
    },
  ];

  const quickActions = [
    {
      title: "Kelola Calon",
      description: "Tambah atau edit data calon",
      icon: UsersRound,
      gradient: "from-blue-500 to-cyan-500",
      action: () => setCurrentPage("pengaturan-calon"),
    },
    {
      title: "Kelola Pemilih",
      description: "Tambah atau edit data pemilih",
      icon: Users,
      gradient: "from-green-500 to-emerald-500",
      action: () => setCurrentPage("data-pemilih"),
    },
    {
      title: "Lihat Hasil",
      description: "Lihat hasil pemilihan real-time",
      icon: BarChart3,
      gradient: "from-purple-500 to-pink-500",
      action: () => setCurrentPage("hasil"),
    },
    {
      title: "Pengaturan",
      description: "Atur judul dan periode pemilihan",
      icon: Settings,
      gradient: "from-orange-500 to-amber-500",
      action: () => setCurrentPage("pengaturan-judul"),
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1 sm:space-y-2"
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-[var(--color-text-secondary)]">
          Selamat datang di Sistem E-Voting
        </p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className={`bg-gradient-to-br ${stat.bgColor} rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white shadow-lg hover:shadow-xl transition-all`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-2 sm:space-y-3 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-[var(--color-text-secondary)] truncate">
                  {stat.title}
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--color-text-primary)]">
                  {stat.value}
                </p>
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs font-medium">Live</span>
                </div>
              </div>
              <div
                className={`p-2.5 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br ${stat.iconBg} shadow-lg flex-shrink-0`}
              >
                <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)]">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {quickActions.map((action, index) => (
            <motion.button
              key={action.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={action.action}
              className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[var(--color-border)] hover:shadow-xl transition-all text-left group overflow-hidden relative touch-manipulation"
            >
              <div className="flex items-start gap-3 sm:gap-4 relative z-10">
                <div
                  className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br ${action.gradient} shadow-lg group-hover:scale-110 transition-transform flex-shrink-0`}
                >
                  <action.icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                </div>
                <div className="space-y-1 sm:space-y-2 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-[var(--color-text-primary)]">
                    {action.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
                    {action.description}
                  </p>
                </div>
              </div>
              <div
                className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-5 transition-opacity`}
              ></div>
            </motion.button>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 bg-white/10 rounded-full blur-3xl"></div>

        <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 relative z-10">
          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg flex-shrink-0">
            <Vote className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
          </div>
          <div className="space-y-1 sm:space-y-2">
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Sistem E-Voting Aktif
            </h3>
            <p className="text-xs sm:text-sm text-blue-50 leading-relaxed">
              Sistem pemungutan suara elektronik siap digunakan. Pastikan semua
              data calon dan pemilih telah diatur dengan benar sebelum memulai
              pemilihan.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
