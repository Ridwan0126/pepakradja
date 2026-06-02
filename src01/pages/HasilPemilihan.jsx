"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  Download,
  RefreshCw,
  Trophy,
  Users,
  FileText,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { storage } from "../utils/storage";
import jsPDF from "jspdf";
import Swal from "sweetalert2";

export default function HasilPemilihan() {
  const [hasil, setHasil] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pengaturan, setPengaturan] = useState({});

  useEffect(() => {
    loadHasil();
    const interval = setInterval(() => {
      loadHasil();
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const loadHasil = () => {
    setLoading(true);

    const votesOnline = storage.get("votes", []);
    const votesOffline = storage.get("votesOffline", []);
    const calon = storage.get("calon", []);
    const savedPengaturan = storage.get("pengaturan", {});
    setPengaturan(savedPengaturan);

    console.log(
      "[v0] Loading votes - Online:",
      votesOnline.length,
      "Offline:",
      votesOffline.length
    );

    const voteCount = {};

    votesOnline.forEach((vote) => {
      if (vote.calonId) {
        voteCount[vote.calonId] = (voteCount[vote.calonId] || 0) + 1;
      }
    });

    votesOffline.forEach((vote) => {
      if (vote.statusSuara === "SAH" && vote.calonId) {
        voteCount[vote.calonId] = (voteCount[vote.calonId] || 0) + 1;
      }
    });

    const totalValidVotes =
      votesOnline.length +
      votesOffline.filter((v) => v.statusSuara === "SAH").length;

    const hasilData = calon.map((c) => {
      const jumlahSuara = voteCount[c.id] || 0;
      const persentase =
        totalValidVotes > 0
          ? ((jumlahSuara / totalValidVotes) * 100).toFixed(2)
          : 0;

      return {
        id: c.id,
        nomorUrut: c.nomorUrut,
        nama: `${c.namaKetua} & ${c.namaWakil}`,
        namaKetua: c.namaKetua,
        namaWakil: c.namaWakil,
        jumlahSuara,
        persentase: Number.parseFloat(persentase),
      };
    });

    hasilData.sort((a, b) => b.jumlahSuara - a.jumlahSuara);

    setHasil(hasilData);
    setTotalVotes(totalValidVotes);

    setTimeout(() => setLoading(false), 300);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(
      pengaturan.judulPemilihan || "HASIL PEMILIHAN",
      pageWidth / 2,
      20,
      { align: "center" }
    );

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(
      pengaturan.deskripsi || "Sistem Pemungutan Suara Elektronik",
      pageWidth / 2,
      28,
      { align: "center" }
    );

    doc.setFontSize(10);
    doc.text(
      `Dicetak pada: ${new Date().toLocaleString("id-ID")}`,
      pageWidth / 2,
      35,
      { align: "center" }
    );

    let yPos = 50;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("STATISTIK PEMILIHAN", 15, yPos);

    yPos += 10;
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Total Suara Masuk: ${totalVotes}`, 15, yPos);
    yPos += 7;
    doc.text(`Total Calon: ${hasil.length}`, 15, yPos);
    yPos += 7;
    doc.text(
      `Pemenang Sementara: ${
        hasil.length > 0 && hasil[0].jumlahSuara > 0
          ? `No. ${hasil[0].nomorUrut} - ${hasil[0].namaKetua}`
          : "-"
      }`,
      15,
      yPos
    );

    yPos += 8;
    doc.setLineWidth(0.5);
    doc.line(15, yPos, pageWidth - 15, yPos);

    yPos += 10;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("PEROLEHAN SUARA", 15, yPos);

    yPos += 10;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("No", 15, yPos);
    doc.text("Calon", 30, yPos);
    doc.text("Suara", pageWidth - 60, yPos);
    doc.text("Persentase", pageWidth - 35, yPos);

    yPos += 2;
    doc.setLineWidth(0.3);
    doc.line(15, yPos, pageWidth - 15, yPos);

    doc.setFont("helvetica", "normal");
    hasil.forEach((item, index) => {
      yPos += 8;

      if (yPos > pageHeight - 40) {
        doc.addPage();
        yPos = 20;
      }

      doc.text(`${item.nomorUrut}`, 15, yPos);
      doc.text(`${item.namaKetua} & ${item.namaWakil}`, 30, yPos);
      doc.text(`${item.jumlahSuara}`, pageWidth - 60, yPos);
      doc.text(`${item.persentase}%`, pageWidth - 35, yPos);

      yPos += 2;
      doc.setLineWidth(0.1);
      doc.line(15, yPos, pageWidth - 15, yPos);
    });

    const footerY = pageHeight - 20;
    doc.setLineWidth(0.5);
    doc.line(15, footerY - 5, pageWidth - 15, footerY - 5);

    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.text("Dokumen ini dicetak melalui:", pageWidth / 2, footerY, {
      align: "center",
    });

    doc.setFont("helvetica", "bold");
    doc.text("Sistem E-Voting v1.0", pageWidth / 2, footerY + 5, {
      align: "center",
    });

    doc.setFont("helvetica", "normal");
    const currentUser = "Admin Panel";
    doc.text(
      `Dicetak oleh: ${currentUser} | ${new Date().toLocaleDateString(
        "id-ID"
      )}`,
      pageWidth / 2,
      footerY + 10,
      {
        align: "center",
      }
    );

    const fileName = `Hasil-${pengaturan.judulPemilihan || "Pemilihan"}-${
      new Date().toISOString().split("T")[0]
    }.pdf`;
    doc.save(fileName.replace(/\s+/g, "-"));

    Swal.fire({
      icon: "success",
      title: "Export Berhasil",
      text: "Hasil pemilihan telah diexport ke PDF",
      confirmButtonColor: "#10b981",
      timer: 2000,
    });
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(hasil, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `hasil-pemilihan-${new Date().toISOString()}.json`;
    link.click();

    Swal.fire({
      icon: "success",
      title: "Export Berhasil",
      text: "Data hasil telah diexport ke JSON",
      confirmButtonColor: "#10b981",
      timer: 2000,
    });
  };

  const COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"];

  const chartData = hasil.map((h) => ({
    name: `No. ${h.nomorUrut}`,
    suara: h.jumlahSuara,
  }));

  const pieData = hasil.map((h) => ({
    name: `No. ${h.nomorUrut} - ${h.namaKetua}`,
    value: h.jumlahSuara,
  }));

  return (
    <div className="space-y-4 sm:space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10 flex-shrink-0">
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] truncate">
                  Hasil {pengaturan.judulPemilihan || "Pemilihan"}
                </h1>
                <p className="text-sm sm:text-base text-[var(--color-text-secondary)] truncate">
                  {pengaturan.deskripsi ||
                    "Lihat hasil pemilihan secara real-time"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={loadHasil}
                disabled={loading}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-lg font-medium hover:bg-[var(--color-surface-hover)] transition-all disabled:opacity-50 text-sm"
              >
                <RefreshCw
                  className={`w-4 h-4 sm:w-5 sm:h-5 ${
                    loading ? "animate-spin" : ""
                  }`}
                />
                <span className="hidden sm:inline">Refresh</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExportPDF}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all text-sm"
              >
                <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">PDF</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExport}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:opacity-90 transition-all text-sm"
              >
                <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">JSON</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border)]"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Total Suara Masuk
              </p>
              <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                {totalVotes}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border)]"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <BarChart3 className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Total Calon
              </p>
              <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                {hasil.length}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl p-6 border border-yellow-500/20"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-yellow-500/20">
              <Trophy className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-yellow-600 dark:text-yellow-500">
                Pemenang Sementara
              </p>
              <p className="text-lg font-bold text-[var(--color-text-primary)]">
                {hasil.length > 0 && hasil[0].jumlahSuara > 0
                  ? `No. ${hasil[0].nomorUrut}`
                  : "-"}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
          Perolehan Suara
        </h2>
        <div className="space-y-3">
          {hasil.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border)] hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-6">
                <div
                  className={`flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center font-bold text-2xl ${
                    index === 0
                      ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white"
                      : index === 1
                      ? "bg-gradient-to-br from-gray-300 to-gray-500 text-white"
                      : index === 2
                      ? "bg-gradient-to-br from-orange-400 to-orange-600 text-white"
                      : "bg-[var(--color-surface-hover)] text-[var(--color-text-primary)]"
                  }`}
                >
                  {item.nomorUrut}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-bold text-lg text-[var(--color-text-primary)]">
                        {item.namaKetua}
                      </p>
                      <p className="text-sm text-[var(--color-text-secondary)]">
                        {item.namaWakil}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                        {item.jumlahSuara}
                      </p>
                      <p className="text-sm text-[var(--color-text-secondary)]">
                        suara
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[var(--color-text-secondary)]">
                        Persentase
                      </span>
                      <span className="font-semibold text-[var(--color-primary)]">
                        {item.persentase}%
                      </span>
                    </div>
                    <div className="h-3 bg-[var(--color-background)] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.persentase}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {hasil.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-[var(--color-surface)] rounded-xl p-12 border border-[var(--color-border)] text-center"
            >
              <BarChart3 className="w-16 h-16 text-[var(--color-text-muted)] mx-auto mb-4" />
              <p className="text-[var(--color-text-secondary)]">
                Belum ada data hasil pemilihan
              </p>
            </motion.div>
          )}
        </div>
      </div>
      {hasil.length > 0 && totalVotes > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border)]"
          >
            <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-4">
              Diagram Batang
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                />
                <XAxis dataKey="name" stroke="var(--color-text-secondary)" />
                <YAxis stroke="var(--color-text-secondary)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="suara" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border)]"
          >
            <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-4">
              Diagram Lingkaran
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name.split(" - ")[0]} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      )}
    </div>
  );
}
