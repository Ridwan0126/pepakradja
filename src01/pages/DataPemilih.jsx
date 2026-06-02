"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Plus, Edit2, Trash2, Save, X, Users, Search, Send } from "lucide-react"
import { useState, useEffect } from "react"
import { storage } from "../utils/storage"
import Swal from "sweetalert2"
import { useAuth } from "../contexts/AuthContext"
import {
  getPemilihByElection,
  addPemilih,
  updatePemilih,
  deletePemilih,
  getWilayahByElection,
  getPemilihanConfig,
} from "../utils/firestore"

export default function DataPemilih() {
  const { user } = useAuth()
  const [electionId, setElectionId] = useState(null)
  const [pemilih, setPemilih] = useState([])
  const [wilayahList, setWilayahList] = useState([])
  const [selectedWilayah, setSelectedWilayah] = useState("*")
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [pengaturan, setPengaturan] = useState({})
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    wilayahPemilih: "",
    nama: "",
    alamatJalan: "",
    nomorRumah: "",
    jenisKelamin: "Laki-Laki",
    caraMemilih: "online",
    nomorHP: "",
    sudahMemilih: false, // Kept from original, but might be unused in Firestore
    pantarlih: "", // Kept from original, but might be unused in Firestore
    tanggalRekam: null, // Kept from original, but might be unused in Firestore
    verifikasiSesuai: false, // Kept from original, but might be unused in Firestore
    token: "", // Will be generated in addPemilih or updated
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const elecId = localStorage.getItem("currentElectionId")
        if (elecId) {
          setElectionId(elecId)

          const [pemilihData, wilayahData, pengaturanData] = await Promise.all([
            getPemilihByElection(elecId),
            getWilayahByElection(elecId),
            getPemilihanConfig(elecId),
          ])

          setPemilih(pemilihData || [])
          setWilayahList(wilayahData || [])
          setPengaturan(pengaturanData || {})
        } else {
          // Fallback to local storage if no election ID is found, for backward compatibility
          const savedPemilih = storage.get("pemilih", []).map((p) => ({
            ...p,
            token: p.token || Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
          }))
          const savedWilayah = storage.get("wilayahList", [])
          const savedPengaturan = storage.get("pengaturan", {})

          setPemilih(savedPemilih)
          setWilayahList(savedWilayah)
          setPengaturan(savedPengaturan)
          storage.set("pemilih", savedPemilih)
        }
      } catch (err) {
        console.error("Error loading data:", err)
        Swal.fire({ icon: "error", title: "Error", text: err.message })
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const hasVotingStarted = () => {
    // Use configuration from Firestore if available, otherwise fallback to local storage
    const config = Object.keys(pengaturan).length > 0 ? pengaturan : storage.get("pengaturan", {})
    const tanggalPencoblosanStr = config.tanggalPemungutanSuara || config.tanggalPencoblosan

    if (!tanggalPencoblosanStr) return "before"

    const tanggalPencoblosan = new Date(tanggalPencoblosanStr)
    const jamMulai = config.jamPemungutanSuaraMulai || config.jamPencoblosanMulai || "08:00"
    const jamSelesai = config.jamPemungutanSuaraSelesai || config.jamPencoblosanSelesai || "17:00"

    const [jamM, menitM] = jamMulai.split(":").map(Number)
    const [jamS, menitS] = jamSelesai.split(":").map(Number)

    const pencoblosanDayStart = new Date(tanggalPencoblosan)
    pencoblosanDayStart.setHours(jamM, menitM, 0, 0)

    const pencoblosanDayEnd = new Date(tanggalPencoblosan)
    pencoblosanDayEnd.setHours(jamS, menitS, 59, 999)

    const today = new Date()

    if (today < pencoblosanDayStart) return "before"
    if (today >= pencoblosanDayStart && today <= pencoblosanDayEnd) return "during"
    return "after"
  }

  const sendTokenWhatsApp = (pemilihData) => {
    const votingLink = `${window.location.origin}/vote`
    // Use configuration from Firestore if available, otherwise fallback to local storage
    const config = Object.keys(pengaturan).length > 0 ? pengaturan : storage.get("pengaturan", {})
    const message = encodeURIComponent(
      `Halo ${pemilihData.nama},\n\n` +
        `Anda terdaftar sebagai pemilih untuk ${config.judul1 || "Pemilihan"}.\n\n` +
        `Token Anda: ${pemilihData.token}\n` +
        `Nomor HP: ${pemilihData.nomorHP}\n\n` +
        `Link Voting: ${votingLink}\n\n` +
        `Gunakan token dan nomor HP Anda untuk login dan memberikan suara.\n\n` +
        `Terima kasih.`,
    )
    window.open(`https://wa.me/${pemilihData.nomorHP.replace(/\D/g, "")}?text=${message}`, "_blank")
  }

  const sendBulkTokenWhatsApp = () => {
    const filtered = getFilteredPemilih()
    const onlinePemilih = filtered.filter((p) => p.caraMemilih === "online" && p.nomorHP)

    if (onlinePemilih.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Tidak Ada Data",
        text: "Tidak ada pemilih online dengan nomor HP yang terdaftar di wilayah ini.",
      })
      return
    }

    Swal.fire({
      title: "Kirim Token ke Semua Pemilih?",
      text: `Akan mengirim token ke ${onlinePemilih.length} pemilih online via WhatsApp`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Kirim Semua",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        onlinePemilih.forEach((p, index) => {
          setTimeout(() => {
            sendTokenWhatsApp(p)
          }, index * 500)
        })
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: `Token dikirim ke ${onlinePemilih.length} pemilih`,
        })
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const votingStatus = hasVotingStarted()
    if (votingStatus !== "before") {
      Swal.fire({
        icon: "error",
        title: "Tidak Dapat Menambah",
        text: "Pemilih tidak dapat ditambahkan karena pemilihan sudah dimulai",
        confirmButtonColor: "#ef4444",
      })
      return
    }

    // Basic validation from original code
    if (formData.nama.length > 50) {
      Swal.fire({
        icon: "error",
        title: "Nama Terlalu Panjang",
        text: "Nama maksimal 50 karakter",
        confirmButtonColor: "#ef4444",
      })
      return
    }

    if (formData.alamatJalan.length > 50) {
      Swal.fire({
        icon: "error",
        title: "Alamat Terlalu Panjang",
        text: "Alamat jalan maksimal 50 karakter",
        confirmButtonColor: "#ef4444",
      })
      return
    }

    // Check for duplicate phone numbers if online
    if (formData.caraMemilih === "online" && formData.nomorHP) {
      const duplicatePhone = pemilih.find(
        (p) => p.nomorHP === formData.nomorHP && p.id !== editingId && p.caraMemilih === "online",
      )
      if (duplicatePhone) {
        Swal.fire({
          icon: "error",
          title: "Nomor HP Sudah Terdaftar",
          text: "Nomor HP ini sudah digunakan oleh pemilih lain",
          confirmButtonColor: "#ef4444",
        })
        return
      }
    }

    // Check if wilayah has reached its capacity (from original code, might need Firestore integration if available)
    const wilayahData = wilayahList.find((w) => w.wilayahPemilih === formData.wilayahPemilih)
    const currentPemilihInWilayah = pemilih.filter(
      (p) => p.wilayahPemilih === formData.wilayahPemilih && p.id !== editingId,
    ).length

    if (wilayahData && currentPemilihInWilayah >= wilayahData.jumlahPemilih) {
      Swal.fire({
        icon: "error",
        title: "Kuota Penuh",
        text: `Wilayah ${formData.wilayahPemilih} sudah mencapai batas pemilih (${wilayahData.jumlahPemilih})`,
        confirmButtonColor: "#ef4444",
      })
      return
    }

    try {
      setLoading(true)

      if (editingId) {
        await updatePemilih(electionId, editingId, formData)
        setPemilih(pemilih.map((p) => (p.id === editingId ? { ...p, ...formData } : p)))
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Data pemilih berhasil diupdate",
          confirmButtonColor: "#10b981",
          timer: 2000,
        })
      } else {
        const token = Math.random().toString(36).substring(2, 15)
        const newPemilih = { ...formData, token }
        const newId = await addPemilih(electionId, newPemilih)
        setPemilih([...pemilih, { id: newId, ...newPemilih }])
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Pemilih baru berhasil ditambahkan",
          confirmButtonColor: "#10b981",
          timer: 2000,
        })
      }

      resetForm()
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.message })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (item) => {
    // The original had a check for verifikasiSesuai, keeping it here for potential compatibility
    // if (item.verifikasiSesuai) {
    //   Swal.fire({
    //     icon: "error",
    //     title: "Tidak Dapat Mengubah",
    //     text: "Pemilih yang sudah diverifikasi tidak dapat diubah",
    //   })
    //   return
    // }

    setFormData({
      ...item,
      // Ensure token is generated if missing during edit, though addPemilih should handle it
      token: item.token || Math.random().toString(36).substring(2, 15),
    })

    setEditingId(item.id)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    // The original had a check for verifikasiSesuai, keeping it here for potential compatibility
    // const item = pemilih.find((p) => p.id === id)
    // if (item.verifikasiSesuai) {
    //   Swal.fire({
    //     icon: "error",
    //     title: "Tidak Dapat Menghapus",
    //     text: "Pemilih yang sudah diverifikasi tidak dapat dihapus",
    //     confirmButtonColor: "#ef4444",
    //   })
    //   return
    // }

    const confirmed = await Swal.fire({
      title: "Hapus Pemilih?",
      text: "Data akan dihapus permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    })

    if (confirmed.isConfirmed) {
      try {
        setLoading(true)
        await deletePemilih(electionId, id)
        setPemilih(pemilih.filter((p) => p.id !== id))
        Swal.fire({
          icon: "success",
          title: "Terhapus",
          text: "Data pemilih berhasil dihapus",
          confirmButtonColor: "#10b981",
          timer: 2000,
        })
      } catch (err) {
        Swal.fire({ icon: "error", title: "Error", text: err.message })
      } finally {
        setLoading(false)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      wilayahPemilih: "",
      nama: "",
      alamatJalan: "",
      nomorRumah: "",
      jenisKelamin: "Laki-Laki",
      caraMemilih: "online",
      nomorHP: "",
      sudahMemilih: false,
      pantarlih: "",
      tanggalRekam: null,
      verifikasiSesuai: false,
      token: "", // Token will be generated on submit
    })
    setEditingId(null)
    setShowModal(false)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const getFilteredPemilih = () => {
    return pemilih
      .filter((item) => {
        const matchSearch = item.nama.toLowerCase().includes(searchTerm.toLowerCase())
        const matchWilayah = selectedWilayah === "*" || item.wilayahPemilih === selectedWilayah
        return matchSearch && matchWilayah
      })
      .sort((a, b) => {
        if (a.wilayahPemilih !== b.wilayahPemilih) {
          return a.wilayahPemilih.localeCompare(b.wilayahPemilih)
        }
        // Original sort logic for nomorRumah
        return (Number.parseInt(a.nomorRumah) || 0) - (Number.parseInt(b.nomorRumah) || 0)
      })
  }

  const votingStatus = hasVotingStarted()
  const filtered = getFilteredPemilih()
  const canAddMore =
    selectedWilayah === "*" ||
    filtered.length <
      (wilayahList.find((w) => w.wilayahPemilih === selectedWilayah)?.jumlahPemilih || Number.POSITIVE_INFINITY)

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading election data...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg">
              <Users className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Data Pemilih
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Kelola data pemilih</p>
            </div>
          </div>
          {/* Removed the original button related to bulk sending, as it's not in the update */}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 mb-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Wilayah Pemilih</label>
              <select
                value={selectedWilayah}
                onChange={(e) => setSelectedWilayah(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-900 dark:text-white"
              >
                <option value="*">Semua Wilayah</option>
                {wilayahList.map((w) => (
                  <option key={w.id} value={w.wilayahPemilih}>
                    {w.wilayahPemilih}
                  </option>
                ))}
              </select>
            </div>

            {/* Bulk Send Button - Added from Updates */}
            <div className="flex items-end gap-2">
              <button
                onClick={sendBulkTokenWhatsApp}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 shadow-lg transition-all font-medium flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Kirim Token ke Semua
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Pemilih Online</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {pemilih.filter((p) => p.caraMemilih === "online").length}
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 p-4 rounded-xl border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-600 dark:text-green-400 mb-1">Pemilih Offline</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {pemilih.filter((p) => p.caraMemilih === "offline").length}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row gap-3"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-[var(--color-text-muted)]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari berdasarkan nama..."
              className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2 md:py-3 text-sm md:text-base rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
            />
          </div>

          {votingStatus === "before" && canAddMore && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 md:py-3 text-sm md:text-base bg-[var(--color-primary)] text-white rounded-lg font-medium hover:opacity-90 transition-all whitespace-nowrap"
            >
              <Plus className="w-4 h-4 md:w-5 md:h-5" />
              Tambah
            </motion.button>
          )}
          {votingStatus === "during" && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-3 md:px-4 py-2 md:py-3">
              <p className="text-xs md:text-sm text-red-500 font-medium">
                🔒 Pemilihan sedang berlangsung - Data terkunci
              </p>
            </div>
          )}
          {votingStatus === "after" && (
            <div className="bg-gray-500/10 border border-gray-500/20 rounded-lg px-3 md:px-4 py-2 md:py-3">
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium">
                ✓ Pemilihan telah selesai
              </p>
            </div>
          )}
          {!canAddMore && votingStatus === "before" && (
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg px-3 md:px-4 py-2 md:py-3">
              <p className="text-xs md:text-sm text-orange-500 font-medium"> Kuota wilayah penuh</p>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden ${
            votingStatus !== "before" ? "opacity-60 pointer-events-none" : ""
          }`}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">No</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Nama</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Alamat</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">No Telepon</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Status</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-900 dark:text-white" colSpan={2}>
                    Rekam Data
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">Aksi</th>
                </tr>
                {/* Removed the extra header row about Pantarlih and Tanggal/Jam as it's not in the update */}
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-600 dark:text-gray-400">
                      {searchTerm ? "Tidak ada pemilih yang ditemukan" : "Belum ada data pemilih"}
                    </td>
                  </tr>
                ) : (
                  filtered.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-4 py-3 text-gray-900 dark:text-white">{index + 1}</td>
                      <td className="px-4 py-3 text-gray-900 dark:text-white">{item.nama}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                        {item.alamatJalan} Nomor {item.nomorRumah}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{item.nomorHP || "-"}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            item.caraMemilih === "online"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                              : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          }`}
                        >
                          {item.caraMemilih === "online" ? "Online" : "Offline"}
                        </span>
                      </td>
                      {/* Removed Pantarlih and Tanggal Rekam columns as they are not in the update */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {item.caraMemilih === "online" && item.nomorHP && (
                            <button
                              onClick={() => sendTokenWhatsApp(item)}
                              className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                              title="Kirim Token via WhatsApp"
                            >
                              <Send className="w-5 h-5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleEdit(item)}
                            // disabled={item.verifikasiSesuai} // Disabled based on original code's logic
                            disabled={votingStatus !== "before"}
                            className={`p-2 rounded-lg transition-colors ${
                              votingStatus !== "before" // Simplified disabled logic based on voting status
                                ? "opacity-50 cursor-not-allowed text-gray-400"
                                : "hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600"
                            }`}
                            title="Edit"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            // disabled={item.verifikasiSesuai} // Disabled based on original code's logic
                            disabled={votingStatus !== "before"}
                            className={`p-2 rounded-lg transition-colors ${
                              votingStatus !== "before" // Simplified disabled logic based on voting status
                                ? "opacity-50 cursor-not-allowed text-gray-400"
                                : "hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600"
                            }`}
                            title="Hapus"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
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
              onClick={resetForm}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                    {editingId ? "Edit Pemilih" : "Tambah Pemilih"}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Wilayah Pemilih
                    </label>
                    <select
                      name="wilayahPemilih"
                      value={formData.wilayahPemilih}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-900 dark:text-white"
                      required
                      disabled={votingStatus !== "before"} // Only editable before voting starts
                    >
                      <option value="">Pilih Wilayah</option>
                      {wilayahList.map((wilayah) => (
                        <option key={wilayah.id} value={wilayah.wilayahPemilih}>
                          {wilayah.wilayahPemilih}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Nama Pemilih (Maks. 50 karakter)
                    </label>
                    <input
                      type="text"
                      name="nama"
                      value={formData.nama}
                      onChange={handleChange}
                      placeholder="Nama lengkap"
                      maxLength={50}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-900 dark:text-white"
                      required
                      disabled={votingStatus !== "before"}
                    />
                    <p className="text-xs text-gray-600 dark:text-gray-400 text-right">{formData.nama.length}/50</p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Alamat Jalan (Maks. 50 karakter)
                    </label>
                    <input
                      type="text"
                      name="alamatJalan"
                      value={formData.alamatJalan}
                      onChange={handleChange}
                      placeholder="Nama jalan"
                      maxLength={50}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-900 dark:text-white"
                      required
                      disabled={votingStatus !== "before"}
                    />
                    <p className="text-xs text-gray-600 dark:text-gray-400 text-right">
                      {formData.alamatJalan.length}/50
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nomor Rumah</label>
                    <input
                      type="number"
                      name="nomorRumah"
                      value={formData.nomorRumah}
                      onChange={handleChange}
                      placeholder="9999"
                      max={9999}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-900 dark:text-white"
                      required
                      disabled={votingStatus !== "before"}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Jenis Kelamin</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="jenisKelamin"
                          value="Laki-Laki"
                          checked={formData.jenisKelamin === "Laki-Laki"}
                          onChange={handleChange}
                          className="w-4 h-4 text-blue-600"
                          disabled={votingStatus !== "before"}
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Laki-Laki</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="jenisKelamin"
                          value="Perempuan"
                          checked={formData.jenisKelamin === "Perempuan"}
                          onChange={handleChange}
                          className="w-4 h-4 text-blue-600"
                          disabled={votingStatus !== "before"}
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Perempuan</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cara Memilih</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="caraMemilih"
                          value="online"
                          checked={formData.caraMemilih === "online"}
                          onChange={handleChange}
                          className="w-4 h-4 text-blue-600"
                          disabled={votingStatus !== "before"}
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Online</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="caraMemilih"
                          value="offline"
                          checked={formData.caraMemilih === "offline"}
                          onChange={handleChange}
                          className="w-4 h-4 text-blue-600"
                          disabled={votingStatus !== "before"}
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Offline</span>
                      </label>
                    </div>
                  </div>

                  {formData.caraMemilih === "online" && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Nomor Handphone
                      </label>
                      <input
                        type="tel"
                        name="nomorHP"
                        value={formData.nomorHP}
                        onChange={handleChange}
                        placeholder="+62 999999999999"
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-900 dark:text-white"
                        required={formData.caraMemilih === "online"}
                        disabled={votingStatus !== "before"}
                      />
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Nomor ini harus unik dan tidak boleh duplikat
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={resetForm}
                      className="flex-1 px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all"
                    >
                      Batal
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm bg-blue-600 text-white rounded-lg hover:opacity-90 transition-all"
                      disabled={votingStatus !== "before"}
                    >
                      <Save className="w-5 h-5" />
                      {editingId ? "Update" : "Simpan"}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
