"use client"

import { motion } from "framer-motion"
import { Save, FileText, Calendar } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { getPemilihanConfig, setPemilihanConfig } from "../utils/firestore"
import Swal from "sweetalert2"

export default function PengaturanJudul() {
  const { user, loading: authLoading } = useAuth()
  const [electionId, setElectionId] = useState(null)
  const [formData, setFormData] = useState({
    judul1: "",
    judul2: "",
    judul3: "",
    deskripsi: "",
    tanggalMulai: "",
    tanggalSelesai: "",
    tanggalPemungutanSuara: "",
    jamPemungutanSuaraSelesai: "17:00",
    namaKetuaPanitia: "",
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initElection = async () => {
      try {
        if (!user) return

        let elecId = localStorage.getItem("currentElectionId")
        if (!elecId) {
          elecId = `election-${user.uid}-${Date.now()}`
          localStorage.setItem("currentElectionId", elecId)
        }
        setElectionId(elecId)

        // Load existing data from Firestore
        const savedData = await getPemilihanConfig(elecId)
        if (savedData) {
          setFormData({
            judul1: savedData.judul1 || "",
            judul2: savedData.judul2 || "",
            judul3: savedData.judul3 || "",
            deskripsi: savedData.deskripsi || "",
            tanggalMulai: savedData.tanggalMulai || "",
            tanggalSelesai: savedData.tanggalSelesai || "",
            tanggalPemungutanSuara: savedData.tanggalPemungutanSuara || "",
            jamPemungutanSuaraSelesai: savedData.jamPemungutanSuaraSelesai || "17:00",
            namaKetuaPanitia: savedData.namaKetuaPanitia || "",
          })
        }
      } catch (err) {
        console.error("Error initializing election:", err)
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Gagal memuat pengaturan dari Firestore",
        })
      } finally {
        setLoading(false)
      }
    }

    initElection()
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      await setPemilihanConfig(electionId, {
        ...formData,
        uid: user.uid,
        updatedAt: new Date().toISOString(),
      })

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Pengaturan berhasil disimpan ke Firestore!",
        confirmButtonColor: "#3b82f6",
      })
    } catch (err) {
      console.error("Error saving:", err)
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: err.message,
        confirmButtonColor: "#ef4444",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (authLoading || loading) return <div>Loading...</div>
  if (!user) return <div>Not authenticated</div>

  return (
    <div className="space-y-4 sm:space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 flex-shrink-0">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[var(--color-text-primary)]">
              Pengaturan Judul Pemilihan
            </h1>
            <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">Atur informasi dasar pemilihan</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--color-surface)] rounded-xl p-4 sm:p-6 border border-[var(--color-border)]"
      >
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Judul Pemilihan */}
          <div className="space-y-2">
            <label htmlFor="judul1" className="block text-sm font-medium text-[var(--color-text-primary)]">
              Judul Pemilihan 1
            </label>
            <input
              type="text"
              id="judul1"
              name="judul1"
              value={formData.judul1}
              onChange={handleChange}
              placeholder="Contoh: Pemilihan Kepala Desa 2025"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="judul2" className="block text-sm font-medium text-[var(--color-text-primary)]">
              Judul Pemilihan 2 <span className="text-xs text-gray-500">(opsional)</span>
            </label>
            <input
              type="text"
              id="judul2"
              name="judul2"
              value={formData.judul2}
              onChange={handleChange}
              placeholder="Contoh: Periode 2025-2030"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="judul3" className="block text-sm font-medium text-[var(--color-text-primary)]">
              Judul Pemilihan 3 <span className="text-xs text-gray-500">(opsional)</span>
            </label>
            <input
              type="text"
              id="judul3"
              name="judul3"
              value={formData.judul3}
              onChange={handleChange}
              placeholder="Contoh: Desa Sukamaju"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
            />
          </div>

          {/* Deskripsi */}
          <div className="space-y-2">
            <label htmlFor="deskripsi" className="block text-sm font-medium text-[var(--color-text-primary)]">
              Deskripsi
            </label>
            <textarea
              id="deskripsi"
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleChange}
              placeholder="Masukkan deskripsi pemilihan..."
              rows={4}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all resize-none"
              required
            />
          </div>

          {/* Nama Ketua Panitia */}
          <div className="space-y-2">
            <label htmlFor="namaKetuaPanitia" className="block text-sm font-medium text-[var(--color-text-primary)]">
              Nama Ketua Panitia <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="namaKetuaPanitia"
              name="namaKetuaPanitia"
              value={formData.namaKetuaPanitia}
              onChange={handleChange}
              placeholder="Masukkan nama ketua panitia pemilihan"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Akan dicantumkan di laporan dan dokumen pemilu</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="tanggalMulai" className="block text-sm font-medium text-[var(--color-text-primary)]">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Tanggal Mulai Pemilihan (Registrasi)
                </div>
              </label>
              <input
                type="datetime-local"
                id="tanggalMulai"
                name="tanggalMulai"
                value={formData.tanggalMulai}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Pemilih bisa login dan melihat calon, tapi belum bisa memilih
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="tanggalSelesai" className="block text-sm font-medium text-[var(--color-text-primary)]">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Tanggal Selesai Pemilihan (Registrasi)
                </div>
              </label>
              <input
                type="datetime-local"
                id="tanggalSelesai"
                name="tanggalSelesai"
                value={formData.tanggalSelesai}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Pemilih tidak bisa login setelah tanggal ini</p>
            </div>

            {/* Tanggal & Waktu Mulai Pemungutan Suara */}
            <div className="space-y-2">
              <label
                htmlFor="tanggalPemungutanSuara"
                className="block text-sm font-medium text-[var(--color-text-primary)]"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Tanggal & Waktu Mulai Pemungutan Suara (Voting)
                </div>
              </label>
              <input
                type="datetime-local"
                id="tanggalPemungutanSuara"
                name="tanggalPemungutanSuara"
                value={formData.tanggalPemungutanSuara}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Hanya hari ini pemilih bisa memilih dari jam ini</p>
            </div>

            {/* Jam Selesai Pemungutan Suara */}
            <div className="space-y-2">
              <label
                htmlFor="jamPemungutanSuaraSelesai"
                className="block text-sm font-medium text-[var(--color-text-primary)]"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Jam Selesai Pemungutan Suara
                </div>
              </label>
              <input
                type="time"
                id="jamPemungutanSuaraSelesai"
                name="jamPemungutanSuaraSelesai"
                value={formData.jamPemungutanSuaraSelesai}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-[var(--color-primary)] text-white rounded-lg font-medium text-sm sm:text-base hover:opacity-90 transition-all touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4 sm:w-5 sm:h-5" />
            {loading ? "Menyimpan..." : "Simpan Pengaturan"}
          </motion.button>
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-blue-500/10 rounded-xl p-4 sm:p-6 border border-blue-500/20"
      >
        <h3 className="font-semibold text-sm sm:text-base text-[var(--color-text-primary)] mb-2">Informasi</h3>
        <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed mb-3">
          Pengaturan ini akan menentukan informasi dasar pemilihan yang akan ditampilkan kepada pemilih dan disimpan di
          Firestore.
        </p>
        <div className="space-y-2 text-xs sm:text-sm text-[var(--color-text-secondary)]">
          <p>
            <strong>Tanggal Mulai - Selesai:</strong> Periode waktu pemilih bisa login dan registrasi (bisa lihat calon
            tapi belum bisa vote)
          </p>
          <p>
            <strong>Tanggal & Waktu Pemungutan Suara:</strong> Waktu spesifik ketika voting dimulai. Pemilih hanya bisa
            memilih dari jam ini hingga jam selesai yang ditentukan!
          </p>
          <p>
            <strong>Jam Selesai:</strong> Jam ketika voting berakhir pada tanggal pemungutan suara.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
