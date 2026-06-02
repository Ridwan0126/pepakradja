"use client"

import { motion } from "framer-motion"
import { FileText, Download, Filter } from "lucide-react"
import { useState, useEffect } from "react"
import { storage } from "../utils/storage"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import Swal from "sweetalert2"

export default function LaporanJurnal() {
  const [pengaturan, setPengaturan] = useState({})
  const [wilayahList, setWilayahList] = useState([])
  const [selectedWilayah, setSelectedWilayah] = useState("")
  const [jurnal, setJurnal] = useState([])

  useEffect(() => {
    loadData()
  }, [selectedWilayah])

  const loadData = () => {
    const savedPengaturan = storage.get("pengaturan", {})
    const savedWilayah = storage.get("wilayahList", [])
    const savedPemilih = storage.get("pemilih", [])
    const savedVotesOnline = storage.get("votes", [])
    const savedVotesOffline = storage.get("votesOffline", [])

    setPengaturan(savedPengaturan)
    setWilayahList(savedWilayah)

    if (selectedWilayah) {
      generateJurnal(savedPemilih, savedVotesOnline, savedVotesOffline)
    } else {
      setJurnal([])
    }
  }

  const generateJurnal = (pemilihData, vOnline, vOffline) => {
    const jurnalData = []

    vOnline.forEach((vote) => {
      const pemilih = pemilihData.find((p) => p.id === vote.pemilihId)
      if (pemilih && pemilih.wilayahPemilih === selectedWilayah) {
        const timestamp = vote.tanggal ? new Date(vote.tanggal) : new Date()
        const isValidDate = !isNaN(timestamp.getTime())

        jurnalData.push({
          nama: pemilih.nama,
          alamat: `${pemilih.alamatJalan} Nomor ${pemilih.nomorRumah}`,
          caraMemilih: "Online",
          statusSuara: vote.calonId ? "SAH" : "TIDAK SAH",
          suara: vote.calonId ? `No. ${vote.nomorUrut || ""} - ${vote.namaKetua || vote.calonNama || ""}` : "-",
          tanggal: isValidDate ? timestamp.toLocaleString("id-ID") : "-",
          user: "Online System",
        })
      }
    })

    vOffline.forEach((vote) => {
      if (vote.wilayahPemilih === selectedWilayah) {
        const timestamp = vote.tanggal ? new Date(vote.tanggal) : new Date()
        const isValidDate = !isNaN(timestamp.getTime())

        jurnalData.push({
          nama: vote.pemilihNama,
          alamat: vote.alamat,
          caraMemilih: "Offline",
          statusSuara: vote.statusSuara,
          suara: vote.statusSuara === "SAH" ? vote.calonNama : "-",
          tanggal: isValidDate ? timestamp.toLocaleString("id-ID") : "-",
          user: vote.pantarlih || "Admin System",
        })
      }
    })

    setJurnal(jurnalData)
  }

  const exportPDF = () => {
    console.log("[v0] Exporting PDF for Laporan Jurnal...")

    if (!selectedWilayah) {
      Swal.fire({
        icon: "warning",
        title: "Pilih Wilayah",
        text: "Silakan pilih wilayah terlebih dahulu",
        confirmButtonColor: "#f59e0b",
      })
      return
    }

    try {
      const doc = new jsPDF("landscape")
      const pageWidth = doc.internal.pageSize.width

      const header1 = pengaturan.judul1 || ""
      const header2 = pengaturan.judul2 || ""
      const header3 = pengaturan.judul3 || ""
      const ketuaPanitia = pengaturan.namaKetuaPanitia || ""

      let yPos = 20

      /* ================= HEADER ================= */
      if (header1) {
        doc.setFontSize(14)
        doc.setFont(undefined, "bold")
        doc.text(header1, pageWidth / 2, yPos, { align: "center" })
        yPos += 7
      }

      if (header2) {
        doc.setFontSize(12)
        doc.text(header2, pageWidth / 2, yPos, { align: "center" })
        yPos += 7
      }

      if (header3) {
        doc.setFontSize(12)
        doc.text(header3, pageWidth / 2, yPos, { align: "center" })
        yPos += 10
      }

      if (ketuaPanitia) {
        doc.setFontSize(10)
        doc.setFont(undefined, "normal")
        doc.text(`Ketua Panitia: ${ketuaPanitia}`, pageWidth / 2, yPos, {
          align: "center",
        })
        yPos += 8
      }

      doc.setFontSize(16)
      doc.setFont(undefined, "bold")
      doc.text("LAPORAN JURNAL SUARA (RAHASIA)", pageWidth / 2, yPos, {
        align: "center",
      })
      yPos += 8

      doc.setFontSize(10)
      doc.setFont(undefined, "normal")
      doc.text(`Wilayah Suara: ${selectedWilayah}`, pageWidth / 2, yPos, {
        align: "center",
      })
      yPos += 10

      /* ================= TABEL ================= */
      autoTable(doc, {
        startY: yPos,
        head: [["No", "Nama", "Alamat", "Cara Memilih", "Status Suara", "Suara", "Tanggal / Jam", "User"]],
        body:
          jurnal.length === 0
            ? [["", "Tidak ada data jurnal untuk wilayah ini", "", "", "", "", "", ""]]
            : jurnal.map((j, i) => [i + 1, j.nama, j.alamat, j.caraMemilih, j.statusSuara, j.suara, j.tanggal, j.user]),

        /* ===== STYLE UTAMA ===== */
        styles: {
          fontSize: 8,
          cellPadding: 3,
          valign: "middle",
          lineColor: [200, 200, 200], // BONUS: garis tabel
          lineWidth: 0.2,
        },

        /* ===== HEADER STYLE ===== */
        headStyles: {
          fillColor: [59, 130, 246],
          textColor: 255,
          halign: "center",
          fontStyle: "bold",
        },

        /* ===== ZEBRA ROW (BONUS) ===== */
        alternateRowStyles: {
          fillColor: [245, 247, 250],
        },

        /* ===== KOLOM ===== */
        columnStyles: {
          0: { halign: "center", cellWidth: 10 },
          1: { cellWidth: 30 },
          2: { cellWidth: 42 },
          3: { halign: "center", cellWidth: 22 },
          4: { halign: "center", cellWidth: 22 },
          5: { cellWidth: 36 },
          6: { cellWidth: 32 },
          7: { cellWidth: 28 },
        },

        margin: { left: 14, right: 14 },

        /* ===== FOOTER OTOMATIS TIAP HALAMAN ===== */
        didDrawPage: () => {
          const pageHeight = doc.internal.pageSize.height
          doc.setFontSize(8)
          doc.setFont(undefined, "normal")
          doc.text("Perangkat Lunak Ini Disediakan Oleh manasukatour.com Semarang © 2025", 14, pageHeight - 15)
          doc.text("Untuk Kemajuan Negeri", 14, pageHeight - 10)
        },
      })

      /* ================= SAVE ================= */
      const fileName = `Laporan-Jurnal-${selectedWilayah}-${new Date().toISOString().split("T")[0]}.pdf`

      doc.save(fileName)

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "PDF berhasil diexport",
        confirmButtonColor: "#10b981",
        timer: 2000,
      })
    } catch (error) {
      console.error("[v0] Error exporting PDF:", error)
      Swal.fire({
        icon: "error",
        title: "Gagal Export PDF",
        text: error.message || "Terjadi kesalahan saat membuat PDF.",
        confirmButtonColor: "#ef4444",
      })
    }
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <FileText className="w-5 h-5 md:w-6 md:h-6 text-purple-500" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)]">Laporan Jurnal Suara</h1>
              <p className="text-sm md:text-base text-[var(--color-text-secondary)]">
                Detail suara per pemilih (RAHASIA)
              </p>
            </div>
          </div>

          <button
            onClick={exportPDF}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm"
          >
            <Download className="w-4 h-4 md:w-5 md:h-5" />
            PDF
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--color-surface)] rounded-xl p-4 md:p-6 border border-[var(--color-border)]"
      >
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-[var(--color-text-secondary)]" />
          <h3 className="font-semibold text-[var(--color-text-primary)]">Filter</h3>
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-[var(--color-text-primary)] mb-2">
            Pilih Wilayah Suara <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedWilayah}
            onChange={(e) => setSelectedWilayah(e.target.value)}
            className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
          >
            <option value="">-- Pilih Wilayah --</option>
            {wilayahList.map((wilayah) => (
              <option key={wilayah.id} value={wilayah.wilayahPemilih}>
                {wilayah.wilayahPemilih}
              </option>
            ))}
          </select>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">
            Wajib pilih wilayah untuk menampilkan jurnal
          </p>
        </div>
      </motion.div>

      {selectedWilayah && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden"
        >
          <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-[var(--color-border)]">
            {pengaturan.judul1 && (
              <h2 className="text-lg md:text-xl font-bold text-[var(--color-text-primary)]">{pengaturan.judul1}</h2>
            )}
            {pengaturan.judul2 && (
              <p className="text-sm md:text-base text-[var(--color-text-secondary)]">{pengaturan.judul2}</p>
            )}
            {pengaturan.judul3 && (
              <p className="text-sm md:text-base text-[var(--color-text-secondary)]">{pengaturan.judul3}</p>
            )}
            {pengaturan.namaKetuaPanitia && (
              <p className="text-sm md:text-base text-[var(--color-text-secondary)] mt-2">
                Ketua Panitia:{" "}
                <span className="font-semibold text-[var(--color-text-primary)]">{pengaturan.namaKetuaPanitia}</span>
              </p>
            )}
            <p className="text-xs md:text-sm text-[var(--color-text-secondary)] mt-2">
              Wilayah Suara: <span className="font-semibold text-[var(--color-text-primary)]">{selectedWilayah}</span>
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs md:text-sm">
              <thead className="bg-[var(--color-surface-hover)]">
                <tr>
                  <th className="px-2 md:px-4 py-2 md:py-3 text-left font-semibold text-[var(--color-text-primary)]">
                    No
                  </th>
                  <th className="px-2 md:px-4 py-2 md:py-3 text-left font-semibold text-[var(--color-text-primary)]">
                    Nama
                  </th>
                  <th className="px-2 md:px-4 py-2 md:py-3 text-left font-semibold text-[var(--color-text-primary)]">
                    Alamat
                  </th>
                  <th className="px-2 md:px-4 py-2 md:py-3 text-left font-semibold text-[var(--color-text-primary)]">
                    Cara Memilih
                  </th>
                  <th className="px-2 md:px-4 py-2 md:py-3 text-left font-semibold text-[var(--color-text-primary)]">
                    Status Suara
                  </th>
                  <th className="px-2 md:px-4 py-2 md:py-3 text-left font-semibold text-[var(--color-text-primary)]">
                    Suara
                  </th>
                  <th className="px-2 md:px-4 py-2 md:py-3 text-left font-semibold text-[var(--color-text-primary)]">
                    Rekam Suara
                    <br />
                    Tanggal / Jam
                  </th>
                  <th className="px-2 md:px-4 py-2 md:py-3 text-left font-semibold text-[var(--color-text-primary)]">
                    User
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {jurnal.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-2 md:px-4 py-8 md:py-12 text-center text-[var(--color-text-secondary)]"
                    >
                      Tidak ada data jurnal untuk wilayah ini
                    </td>
                  </tr>
                ) : (
                  jurnal.map((j, index) => (
                    <tr key={index} className="hover:bg-[var(--color-surface-hover)] transition-colors">
                      <td className="px-2 md:px-4 py-2 md:py-3 text-[var(--color-text-primary)]">{index + 1}</td>
                      <td className="px-2 md:px-4 py-2 md:py-3 text-[var(--color-text-primary)] font-medium">
                        {j.nama}
                      </td>
                      <td className="px-2 md:px-4 py-2 md:py-3 text-[var(--color-text-secondary)]">{j.alamat}</td>
                      <td className="px-2 md:px-4 py-2 md:py-3 text-[var(--color-text-secondary)]">{j.caraMemilih}</td>
                      <td className="px-2 md:px-4 py-2 md:py-3 text-[var(--color-text-secondary)]">{j.statusSuara}</td>
                      <td className="px-2 md:px-4 py-2 md:py-3 text-[var(--color-text-secondary)]">{j.suara}</td>
                      <td className="px-2 md:px-4 py-2 md:py-3 text-[var(--color-text-secondary)]">{j.tanggal}</td>
                      <td className="px-2 md:px-4 py-2 md:py-3 text-[var(--color-text-secondary)]">{j.user}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  )
}
