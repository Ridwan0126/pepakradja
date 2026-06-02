"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Users, Download, Filter, X } from "lucide-react"
import { useState, useEffect } from "react"
import { storage } from "../utils/storage"
import Swal from "sweetalert2"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { useAuth } from "../contexts/AuthContext"

export default function SuaraOffline() {
  const [pemilih, setPemilih] = useState([])
  const [calon, setCalon] = useState([])
  const [wilayahList, setWilayahList] = useState([])
  const [pengaturan, setPengaturan] = useState({})
  const [panitiaList, setPanitiaList] = useState([])
  const [selectedWilayah, setSelectedWilayah] = useState("*")
  const [saksi1, setSaksi1] = useState("")
  const [saksi2, setSaksi2] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingPemilih, setEditingPemilih] = useState(null)
  const [formData, setFormData] = useState({
    statusSuara: "SAH",
    pilihanCalon: "",
    wilayahPemilih: "",
  })
  const [votesOffline, setVotesOffline] = useState([])
  const [tanggalPengesahan, setTanggalPengesahan] = useState("")

  const { user } = useAuth()
  const isKetuaPanitia = user?.level === "Ketua Panitia"

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const savedPemilih = storage.get("pemilih", [])
    const savedWilayah = storage.get("wilayahList", [])
    const savedCalon = storage.get("calon", [])
    const savedVotesOffline = storage.get("votesOffline", [])
    const savedPengaturan = storage.get("pengaturan", {})
    const savedPanitia = storage.get("panitiaList", [])
    const savedPengesahan = storage.get("pengesahanOffline", { tanggal: "" })

    setPemilih(savedPemilih)
    setWilayahList(savedWilayah)
    setCalon(savedCalon)
    setVotesOffline(savedVotesOffline)
    setPengaturan(savedPengaturan)
    setPanitiaList(savedPanitia)
    setTanggalPengesahan(savedPengesahan.tanggal || "")
  }

  const saveSaksi = () => {
    storage.set("saksiOffline", { saksi1, saksi2 })
    Swal.fire({
      icon: "success",
      title: "Berhasil",
      text: "Data saksi berhasil disimpan",
      confirmButtonColor: "#10b981",
      timer: 2000,
    })
  }

  const filteredPemilih = pemilih
    .filter((p) => p.caraMemilih === "offline")
    .filter((p) => selectedWilayah === "*" || p.wilayahPemilih === selectedWilayah)
    .sort((a, b) => {
      if (a.wilayahPemilih !== b.wilayahPemilih) {
        return a.wilayahPemilih.localeCompare(b.wilayahPemilih)
      }
      return (Number.parseInt(a.nomorRumah) || 0) - (Number.parseInt(b.nomorRumah) || 0)
    })

  const stats = {
    offline: filteredPemilih.length,
  }

  const handleVote = (pemilihData) => {
    if (tanggalPengesahan) {
      Swal.fire({
        icon: "warning",
        title: "Voting Ditutup",
        text: "Data suara offline sudah disahkan. Tidak dapat menambah data lagi.",
        confirmButtonColor: "#f59e0b",
      })
      return
    }

    const votes = storage.get("votesOffline", [])
    const hasVoted = votes.find((v) => v.pemilihId === pemilihData.id)

    if (hasVoted) {
      Swal.fire({
        icon: "info",
        title: "Sudah Memilih",
        text: "Pemilih ini sudah melakukan voting offline",
        confirmButtonColor: "#3b82f6",
      })
      return
    }

    setEditingPemilih(pemilihData)
    setFormData({
      statusSuara: "SAH",
      pilihanCalon: "",
      wilayahPemilih: pemilihData.wilayahPemilih,
    })
    setShowModal(true)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (tanggalPengesahan) {
      Swal.fire({
        icon: "warning",
        title: "Voting Ditutup",
        text: "Data suara offline sudah disahkan. Tidak dapat menambah data lagi.",
        confirmButtonColor: "#f59e0b",
      })
      setShowModal(false)
      return
    }

    if (formData.statusSuara === "SAH" && !formData.pilihanCalon) {
      Swal.fire({
        icon: "error",
        title: "Pilih Calon",
        text: "Silakan pilih calon terlebih dahulu",
        confirmButtonColor: "#ef4444",
      })
      return
    }

    const votes = storage.get("votesOffline", [])
    const newVote = {
      id: Date.now(),
      pemilihId: editingPemilih.id,
      pemilihNama: editingPemilih.nama,
      wilayahPemilih: formData.wilayahPemilih,
      alamat: `${editingPemilih.alamatJalan} Nomor ${editingPemilih.nomorRumah}`,
      jenisKelamin: editingPemilih.jenisKelamin,
      statusSuara: formData.statusSuara,
      calonId: formData.statusSuara === "SAH" ? Number.parseInt(formData.pilihanCalon) : null,
      calonNama:
        formData.statusSuara === "SAH"
          ? calon.find((c) => c.id === Number.parseInt(formData.pilihanCalon))?.namaKetua
          : null,
      pantarlih: "Admin System",
      tanggal: new Date().toISOString(),
    }

    votes.push(newVote)
    storage.set("votesOffline", votes)

    Swal.fire({
      icon: "success",
      title: "Berhasil",
      text: "Suara offline berhasil direkam",
      confirmButtonColor: "#10b981",
      timer: 2000,
    })

    setShowModal(false)
    setEditingPemilih(null)
    loadData()
  }

  const getVoteStatus = (pemilihId) => {
    const votes = storage.get("votesOffline", [])
    return votes.find((v) => v.pemilihId === pemilihId)
  }

  const exportPDF = () => {
    console.log("[v0] Exporting PDF for Suara Offline...")

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
        doc.text(`Ketua Panitia: ${ketuaPanitia}`, pageWidth / 2, yPos, { align: "center" })
        yPos += 8
      }

      doc.setFontSize(16)
      doc.setFont(undefined, "bold")
      doc.text("REKAM DATA SUARA OFFLINE", pageWidth / 2, yPos, {
        align: "center",
      })
      yPos += 10

      doc.setFontSize(10)
      doc.setFont(undefined, "normal")
      doc.text(`Wilayah Pemilih: ${selectedWilayah === "*" ? "Semua Wilayah" : selectedWilayah}`, 14, yPos)
      yPos += 5
      doc.text(`Jumlah Pemilih Offline: ${filteredPemilih.length}`, 14, yPos)
      yPos += 6
      doc.text(`Saksi 1: ${saksi1 || "-"}`, 14, yPos)
      yPos += 5
      doc.text(`Saksi 2: ${saksi2 || "-"}`, 14, yPos)
      yPos += 10

      /* ================= BODY DATA ================= */
      const bodyRows = filteredPemilih.map((p, i) => {
        const voteData = votesOffline.find((v) => v.pemilihId === p.id)

        return [
          i + 1,
          p.nama,
          `${p.alamatJalan} Nomor ${p.nomorRumah}`,
          p.nomorHP || "-",
          voteData?.statusSuara || "-",
          voteData?.statusSuara === "SAH" ? voteData.calonNama : "-",
          voteData?.pantarlih || "-",
          voteData ? new Date(voteData.tanggal).toLocaleString("id-ID") : "-",
        ]
      })

      /* ================= TABEL ================= */
      autoTable(doc, {
        startY: yPos,

        /* ===== MULTI HEADER ===== */
        head: [
          [
            { content: "No", rowSpan: 2 },
            { content: "Nama", rowSpan: 2 },
            { content: "Alamat", rowSpan: 2 },
            { content: "No Telepon", rowSpan: 2 },
            { content: "Status Suara", rowSpan: 2 },
            { content: "Pilihan", rowSpan: 2 },
            { content: "Rekam Data", colSpan: 2 },
          ],
          ["Pantarlih", "Tanggal / Jam"],
        ],

        body: bodyRows.length > 0 ? bodyRows : [["", "Tidak ada pemilih offline", "", "", "", "", "", ""]],

        /* ===== STYLE UMUM ===== */
        styles: {
          fontSize: 9,
          cellPadding: 3,
          valign: "middle",
          lineColor: [200, 200, 200],
          lineWidth: 0.2,
        },

        headStyles: {
          fillColor: [59, 130, 246],
          textColor: 255,
          halign: "center",
          fontStyle: "bold",
        },

        alternateRowStyles: {
          fillColor: [245, 247, 250],
        },

        columnStyles: {
          0: { halign: "center", cellWidth: 10 },
          1: { cellWidth: 35 },
          2: { cellWidth: 50 },
          3: { cellWidth: 30 },
          4: { halign: "center", cellWidth: 25 },
          5: { cellWidth: 35 },
          6: { cellWidth: 30 },
          7: { cellWidth: 40 },
        },

        margin: { left: 14, right: 14 },

        /* ===== FOOTER OTOMATIS ===== */
        didDrawPage: () => {
          const pageHeight = doc.internal.pageSize.height
          doc.setFontSize(8)
          doc.setFont(undefined, "normal")
          doc.text("Perangkat Lunak Ini Disediakan Oleh manasukatour.com Semarang © 2025", 14, pageHeight - 15)
          doc.text("Untuk Kemajuan Negeri", 14, pageHeight - 10)
        },
      })

      /* ================= SAVE ================= */
      const fileName = `Suara-Offline-${
        selectedWilayah === "*" ? "Semua-Wilayah" : selectedWilayah
      }-${new Date().toISOString().split("T")[0]}.pdf`

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

  const handleSavePengesahan = () => {
    if (!tanggalPengesahan) {
      Swal.fire({
        icon: "error",
        title: "Pilih Tanggal",
        text: "Silakan pilih tanggal pengesahan terlebih dahulu",
        confirmButtonColor: "#ef4444",
      })
      return
    }

    storage.set("pengesahanOffline", { tanggal: tanggalPengesahan })

    Swal.fire({
      icon: "success",
      title: "Berhasil",
      text: "Data suara offline berhasil disahkan. Voting tidak dapat ditambah lagi.",
      confirmButtonColor: "#10b981",
      timer: 2000,
    })

    loadData()
  }

  const handleClearPengesahan = () => {
    Swal.fire({
      title: "Hapus Pengesahan?",
      text: "Hapus pengesahan untuk membuka voting kembali?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        storage.remove("pengesahanOffline")
        setTanggalPengesahan("")

        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Pengesahan dihapus. Voting dapat ditambah kembali.",
          confirmButtonColor: "#10b981",
          timer: 2000,
        })

        loadData()
      }
    })
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <Users className="w-5 h-5 md:w-6 md:h-6 text-green-500" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)]">
                Rekam Data Suara Offline
              </h1>
              <p className="text-sm md:text-base text-[var(--color-text-secondary)]">Rekam suara pemilih offline</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={exportPDF}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm"
            >
              <Download className="w-4 h-4 md:w-5 md:h-5" />
              PDF
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--color-surface)] rounded-xl p-4 md:p-6 border border-[var(--color-border)]"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-[var(--color-text-secondary)]" />
            <h3 className="font-semibold text-[var(--color-text-primary)]">Filter & Saksi</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs md:text-sm font-medium text-[var(--color-text-primary)] mb-2">
                Wilayah Pemilih
              </label>
              <select
                value={selectedWilayah}
                onChange={(e) => setSelectedWilayah(e.target.value)}
                className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
              >
                <option value="*">Keseluruhan</option>
                {wilayahList.map((wilayah) => (
                  <option key={wilayah.id} value={wilayah.wilayahPemilih}>
                    {wilayah.wilayahPemilih}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs md:text-sm font-medium text-[var(--color-text-primary)] mb-2">
                Saksi 1
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={saksi1}
                  onChange={(e) => setSaksi1(e.target.value)}
                  maxLength={50}
                  placeholder="Nama Saksi 1"
                  className="flex-1 px-3 md:px-4 py-2 md:py-3 text-sm md:text-base rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                />
                <button
                  onClick={saveSaksi}
                  className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-xs md:text-sm"
                  title="Simpan"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs md:text-sm font-medium text-[var(--color-text-primary)] mb-2">
                Saksi 2
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={saksi2}
                  onChange={(e) => setSaksi2(e.target.value)}
                  maxLength={50}
                  placeholder="Nama Saksi 2"
                  className="flex-1 px-3 md:px-4 py-2 md:py-3 text-sm md:text-base rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                />
                <button
                  onClick={saveSaksi}
                  className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-xs md:text-sm"
                  title="Simpan"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {isKetuaPanitia && (
              <div>
                <label className="block text-xs md:text-sm font-medium text-[var(--color-text-primary)] mb-2">
                  Tanggal Pengesahan
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={tanggalPengesahan}
                    onChange={(e) => setTanggalPengesahan(e.target.value)}
                    disabled={!!tanggalPengesahan}
                    className={`flex-1 px-3 md:px-4 py-2 md:py-3 text-sm md:text-base rounded-lg border border-[var(--color-border)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] transition-all ${
                      tanggalPengesahan
                        ? "bg-green-100/50 dark:bg-green-900/30 cursor-not-allowed"
                        : "bg-[var(--color-background)]"
                    }`}
                  />
                  {tanggalPengesahan ? (
                    <button
                      onClick={handleClearPengesahan}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-xs md:text-sm"
                      title="Hapus Pengesahan"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSavePengesahan}
                      className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all text-xs md:text-sm"
                      title="Sahkan"
                    >
                      Sahkan
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {tanggalPengesahan && (
            <div className="bg-green-100/50 dark:bg-green-900/30 rounded-lg p-3 md:p-4 border border-green-500/30">
              <p className="text-xs md:text-sm text-green-600 dark:text-green-400 font-semibold">
                Data Suara Offline Sudah Disahkan pada {new Date(tanggalPengesahan).toLocaleDateString("id-ID")}
              </p>
              <p className="text-xs md:text-sm text-green-600 dark:text-green-400">
                Voting tidak dapat ditambah atau diedit lagi.
              </p>
            </div>
          )}

          <div className="bg-green-500/10 rounded-lg p-3 md:p-4 border border-green-500/20">
            <p className="text-xs md:text-sm text-green-500">Jumlah Pemilih Offline</p>
            <p className="text-2xl md:text-3xl font-bold text-green-500">{stats.offline}</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden"
      >
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
                  No Telepon
                </th>
                <th className="px-2 md:px-4 py-2 md:py-3 text-left font-semibold text-[var(--color-text-primary)]">
                  Status Suara
                </th>
                <th className="px-2 md:px-4 py-2 md:py-3 text-left font-semibold text-[var(--color-text-primary)]">
                  Pilihan
                </th>
                <th
                  className="px-2 md:px-4 py-2 md:py-3 text-center font-semibold text-[var(--color-text-primary)]"
                  colSpan={2}
                >
                  Rekam Data
                </th>
                <th className="px-2 md:px-4 py-2 md:py-3 text-right font-semibold text-[var(--color-text-primary)]">
                  Aksi
                </th>
              </tr>
              <tr className="bg-[var(--color-surface-hover)]">
                <th colSpan={6}></th>
                <th className="px-2 md:px-4 py-1 md:py-2 text-center text-[10px] md:text-xs font-medium text-[var(--color-text-secondary)]">
                  Pantarlih
                </th>
                <th className="px-2 md:px-4 py-1 md:py-2 text-center text-[10px] md:text-xs font-medium text-[var(--color-text-secondary)]">
                  Tanggal / Jam
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {filteredPemilih.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-2 md:px-4 py-8 md:py-12 text-center text-[var(--color-text-secondary)]">
                    Tidak ada pemilih offline
                  </td>
                </tr>
              ) : (
                filteredPemilih.map((item, index) => {
                  const voteData = getVoteStatus(item.id)
                  return (
                    <tr key={item.id} className="hover:bg-[var(--color-surface-hover)] transition-colors">
                      <td className="px-2 md:px-4 py-2 md:py-3 text-[var(--color-text-primary)]">{index + 1}</td>
                      <td className="px-2 md:px-4 py-2 md:py-3 text-[var(--color-text-primary)] font-medium">
                        {item.nama}
                      </td>
                      <td className="px-2 md:px-4 py-2 md:py-3 text-[var(--color-text-secondary)]">
                        {item.alamatJalan} Nomor {item.nomorRumah}
                      </td>
                      <td className="px-2 md:px-4 py-2 md:py-3 text-[var(--color-text-secondary)]">
                        {item.nomorHP || "-"}
                      </td>
                      <td className="px-2 md:px-4 py-2 md:py-3 text-[var(--color-text-secondary)]">
                        {voteData?.statusSuara || "-"}
                      </td>
                      <td className="px-2 md:px-4 py-2 md:py-3 text-[var(--color-text-secondary)]">
                        {voteData?.statusSuara === "SAH" ? voteData.calonNama : "-"}
                      </td>
                      <td className="px-2 md:px-4 py-2 md:py-3 text-center text-[var(--color-text-secondary)]">
                        {voteData?.pantarlih || "-"}
                      </td>
                      <td className="px-2 md:px-4 py-2 md:py-3 text-center text-[var(--color-text-secondary)]">
                        {voteData ? new Date(voteData.tanggal).toLocaleString("id-ID") : "-"}
                      </td>
                      <td className="px-2 md:px-4 py-2 md:py-3 text-right">
                        <button
                          onClick={() => handleVote(item)}
                          disabled={!!voteData}
                          className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all ${
                            voteData
                              ? "bg-gray-500/10 text-gray-400 cursor-not-allowed"
                              : "bg-blue-500 text-white hover:bg-blue-600"
                          }`}
                        >
                          {voteData ? "Selesai" : "Vote"}
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[var(--color-surface)] rounded-xl p-4 md:p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-[var(--color-text-primary)]">
                  Rekam Data Suara Offline
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-lg hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)]"
                >
                  <X className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {editingPemilih && (
                  <div className="bg-blue-500/10 rounded-lg p-3 md:p-4 border border-blue-500/20">
                    <p className="text-xs md:text-sm text-[var(--color-text-secondary)]">Pemilih</p>
                    <p className="font-semibold text-[var(--color-text-primary)] text-sm md:text-base">
                      {editingPemilih.nama}
                    </p>
                    <p className="text-xs md:text-sm text-[var(--color-text-secondary)]">
                      {editingPemilih.wilayahPemilih}
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-xs md:text-sm font-medium text-[var(--color-text-primary)]">
                    Status Suara
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="statusSuara"
                        value="SAH"
                        checked={formData.statusSuara === "SAH"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            statusSuara: e.target.value,
                            pilihanCalon: "",
                          })
                        }
                        className="w-4 h-4 text-[var(--color-primary)]"
                      />
                      <span className="text-xs md:text-sm text-[var(--color-text-primary)]">SAH</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="statusSuara"
                        value="TIDAK SAH"
                        checked={formData.statusSuara === "TIDAK SAH"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            statusSuara: e.target.value,
                            pilihanCalon: "",
                          })
                        }
                        className="w-4 h-4 text-[var(--color-primary)]"
                      />
                      <span className="text-xs md:text-sm text-[var(--color-text-primary)]">TIDAK SAH</span>
                    </label>
                  </div>
                </div>

                {formData.statusSuara === "SAH" && (
                  <div className="space-y-2">
                    <label className="block text-xs md:text-sm font-medium text-[var(--color-text-primary)]">
                      Pilihan Suara
                    </label>
                    <div className="space-y-2">
                      {calon.map((c) => (
                        <label
                          key={c.id}
                          className="flex items-center gap-3 p-3 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] cursor-pointer transition-all"
                        >
                          <input
                            type="radio"
                            name="pilihanCalon"
                            value={c.id}
                            checked={formData.pilihanCalon === c.id.toString()}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                pilihanCalon: e.target.value,
                              })
                            }
                            className="w-4 h-4 text-[var(--color-primary)]"
                          />
                          <div>
                            <p className="font-semibold text-[var(--color-text-primary)] text-sm md:text-base">
                              No. {c.nomorUrut} - {c.namaKetua}
                            </p>
                            <p className="text-xs text-[var(--color-text-secondary)]">{c.namaWakil}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-xs md:text-sm font-medium text-[var(--color-text-primary)]">
                    Wilayah Pemilih
                  </label>
                  <select
                    name="wilayahPemilih"
                    value={formData.wilayahPemilih}
                    onChange={handleChange}
                    className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                    required
                  >
                    <option value="">Pilih Wilayah</option>
                    {wilayahList.map((wilayah) => (
                      <option key={wilayah.id} value={wilayah.wilayahPemilih}>
                        {wilayah.wilayahPemilih}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 md:py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all font-medium text-sm md:text-base"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 md:py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all font-medium text-sm md:text-base"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
