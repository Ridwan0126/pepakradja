"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Vote, CheckCircle, ChevronRight, Clock, Eye } from "lucide-react"
import { useState, useEffect } from "react"
import { storage } from "../utils/storage"
import Swal from "sweetalert2"

const SUPERADMIN = {
  nomorHP: "08999999999",
  token: "SUPERADMIN2024",
}

export default function VotingStandalone() {
  const [step, setStep] = useState(1)
  const [nomorHP, setNomorHP] = useState("")
  const [token, setToken] = useState("")
  const [pemilih, setPemilih] = useState(null)
  const [calon, setCalon] = useState([])
  const [selectedCalon, setSelectedCalon] = useState(null)
  const [pengaturan, setPengaturan] = useState({})
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const [countdown, setCountdown] = useState("")
  const [votingStatus, setVotingStatus] = useState("") // "belum", "berlangsung", "selesai"
  const [canVote, setCanVote] = useState(false)
  const [wilayahList, setWilayahList] = useState([])

  const [votingPeriodStatus, setVotingPeriodStatus] = useState("") // "before", "during", "after"
  const [pencoblosanStatus, setPencoblosanStatus] = useState("") // "before", "during", "after"

  useEffect(() => {
    const savedCalon = storage.get("calon", [])
    const savedPengaturan = storage.get("pengaturan", {})
    const savedWilayahList = storage.get("wilayahList", [])

    console.log("[v0] Loaded pengaturan:", savedPengaturan)

    setCalon(savedCalon)
    setPengaturan(savedPengaturan)
    setWilayahList(savedWilayahList)

    // Update countdown every second
    const interval = setInterval(() => {
      updateTimers(savedPengaturan)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const updateTimers = (settings) => {
    if (!settings.tanggalMulai || !settings.tanggalSelesai || !settings.tanggalPencoblosan) {
      setCountdown("")
      setVotingStatus("belum")
      setVotingPeriodStatus("before")
      setPencoblosanStatus("before")
      return
    }

    const now = new Date()
    const votingStart = new Date(settings.tanggalMulai)
    const votingEnd = new Date(settings.tanggalSelesai)
    const pencoblosanDate = new Date(settings.tanggalPencoblosan)

    const jamMulai = settings.jamPencoblosanMulai || "08:00"
    const jamSelesai = settings.jamPencoblosanSelesai || "17:00"
    const [jamM, menitM] = jamMulai.split(":").map(Number)
    const [jamS, menitS] = jamSelesai.split(":").map(Number)

    // Get start of pencoblosan day with jam mulai
    const pencoblosanDayStart = new Date(pencoblosanDate)
    pencoblosanDayStart.setHours(jamM, menitM, 0, 0)
    // Get end of pencoblosan day with jam selesai
    const pencoblosanDayEnd = new Date(pencoblosanDate)
    pencoblosanDayEnd.setHours(jamS, menitS, 59, 999)

    // Check voting period (login/register period)
    if (now < votingStart) {
      setVotingPeriodStatus("before")
    } else if (now >= votingStart && now <= votingEnd) {
      setVotingPeriodStatus("during")
    } else {
      setVotingPeriodStatus("after")
    }

    // Check pencoblosan period (voting period) - dengan jam
    if (now < pencoblosanDayStart) {
      setPencoblosanStatus("before")
    } else if (now >= pencoblosanDayStart && now <= pencoblosanDayEnd) {
      setPencoblosanStatus("during")
    } else {
      setPencoblosanStatus("after")
    }

    // Overall voting status
    if (now < votingStart) {
      setVotingStatus("belum")
      const diff = votingStart - now
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      setCountdown(`Pemilihan dimulai dalam ${days}h ${hours}j ${minutes}m ${seconds}s`)
    } else if (now >= votingStart && now <= votingEnd) {
      setVotingStatus("berlangsung")
      const diff = votingEnd - now
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      setCountdown(`Pemilihan berakhir dalam ${hours}h ${minutes}m ${seconds}s`)
    } else {
      setVotingStatus("selesai")
      setCountdown("Pemilihan telah berakhir")
    }
  }

  const handleLogin = (e) => {
    e.preventDefault()

    // Check superadmin
    if (nomorHP === SUPERADMIN.nomorHP && token === SUPERADMIN.token) {
      setIsSuperAdmin(true)
      setPemilih({ nama: "SuperAdmin", nomorHP: SUPERADMIN.nomorHP })
      setStep(2)
      Swal.fire({
        icon: "info",
        title: "Mode SuperAdmin",
        text: "Anda login sebagai SuperAdmin. Anda hanya dapat melihat tampilan, tidak dapat melakukan voting.",
        confirmButtonText: "OK",
        confirmButtonColor: "#3b82f6",
      })
      return
    }

    const allPemilih = storage.get("pemilih", [])
    const found = allPemilih.find((p) => p.nomorHP === nomorHP && p.token === token)

    if (!found) {
      Swal.fire({
        icon: "error",
        title: "Nomor Handphone Anda tidak terdaftar",
        text: "Hubungi Panitia Pemilihan di wilayah Anda.",
        confirmButtonColor: "#ef4444",
      })
      return
    }

    if (!found.verifikasiSesuai) {
      Swal.fire({
        icon: "error",
        title: "Data pemilih tidak terverifikasi",
        text: "Hubungi Panitia Pemilihan di wilayah Anda.",
        confirmButtonColor: "#ef4444",
      })
      return
    }

    if (found.sudahMemilih) {
      Swal.fire({
        icon: "warning",
        title: "Anda sudah memilih",
        text: "Setiap pemilih hanya dapat voting 1 kali.",
        confirmButtonColor: "#f59e0b",
      })
      // Still allow to see results
      setPemilih(found)
      setStep(4) // Go to results page
      return
    }

    if (pengaturan.tanggalSelesai) {
      const now = new Date()
      const end = new Date(pengaturan.tanggalSelesai)

      if (now > end) {
        Swal.fire({
          icon: "info",
          title: "Waktu pemungutan suara sudah selesai",
          text: "Anda tidak bisa memberikan suara lagi.",
          confirmButtonColor: "#3b82f6",
        })
        setPemilih(found)
        setStep(4) // Go to results page
        return
      }
    }

    if (pengaturan.tanggalMulai) {
      const now = new Date()
      const start = new Date(pengaturan.tanggalMulai)

      if (now < start) {
        Swal.fire({
          icon: "info",
          title: "Mohon maaf, belum saatnya pemungutan suara",
          text: `Pemilihan akan dimulai pada ${start.toLocaleString("id-ID")}`,
          confirmButtonColor: "#3b82f6",
        })
        return
      }
    }

    setPemilih(found)
    setIsSuperAdmin(false)
    setStep(2)
  }

  const handleVote = () => {
    if (pencoblosanStatus !== "during") {
      let message = ""
      if (pencoblosanStatus === "before") {
        message = "Waktu pencoblosan (voting) belum dimulai. Silakan tunggu hingga tanggal yang ditentukan."
      } else if (pencoblosanStatus === "after") {
        message = "Waktu pencoblosan (voting) sudah berakhir. Terima kasih atas partisipasi Anda."
      }

      Swal.fire({
        icon: "warning",
        title: "Tidak Dapat Voting",
        text: message,
        confirmButtonColor: "#f59e0b",
      })
      return
    }

    if (isSuperAdmin) {
      Swal.fire({
        icon: "warning",
        title: "Tidak Dapat Voting",
        text: "SuperAdmin tidak dapat melakukan voting. Anda hanya dapat melihat tampilan.",
        confirmButtonColor: "#f59e0b",
      })
      return
    }

    if (!selectedCalon) {
      Swal.fire({
        icon: "warning",
        title: "Pilih Calon",
        text: "Silakan pilih salah satu calon terlebih dahulu.",
        confirmButtonColor: "#f59e0b",
      })
      return
    }

    Swal.fire({
      title: "Konfirmasi Pilihan",
      html: `Anda akan memilih:<br><br><strong>No. ${selectedCalon.nomorUrut}</strong><br>${selectedCalon.namaKetua} & ${selectedCalon.namaWakil}<br><br>Pilihan tidak dapat diubah setelah dikonfirmasi!`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3b82f6",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Konfirmasi",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        // Save vote
        const votes = storage.get("votes", [])
        votes.push({
          pemilihId: pemilih.id,
          calonId: selectedCalon.id,
          timestamp: new Date().toISOString(),
          caraMemilih: "online",
        })
        storage.set("votes", votes)

        // Update pemilih status
        const allPemilih = storage.get("pemilih", [])
        const updated = allPemilih.map((p) => (p.id === pemilih.id ? { ...p, sudahMemilih: true } : p))
        storage.set("pemilih", updated)

        setStep(3)

        Swal.fire({
          icon: "success",
          title: "Suara berhasil disimpan!",
          html: '<p style="font-style: italic; margin-top: 16px;">"Terima kasih telah turut berperan serta dalam pemilihan dan menentukan masa depan"</p>',
          confirmButtonColor: "#10b981",
        }).then(() => {
          // After 2 seconds, show results
          setTimeout(() => {
            setStep(4)
          }, 1000)
        })
      }
    })
  }

  // Calculate results for display
  const getResults = () => {
    const votes = storage.get("votes", [])
    const votesOffline = storage.get("votesOffline", [])
    const allPemilih = storage.get("pemilih", [])
    const wilayahList = storage.get("wilayahPemilihan", [])

    const totalPemilih = allPemilih.length
    const totalSuaraMasuk = votes.length + votesOffline.filter((v) => v.statusSuara === "SAH").length
    const suaraSah = votes.length + votesOffline.filter((v) => v.statusSuara === "SAH").length
    const suaraTidakSah = votesOffline.filter((v) => v.statusSuara === "TIDAK SAH").length
    const tidakMemilih = totalPemilih - totalSuaraMasuk - suaraTidakSah

    const calonResults = calon.map((c) => {
      const onlineVotes = votes.filter((v) => v.calonId === c.id).length
      const offlineVotes = votesOffline.filter((v) => v.calonId === c.id && v.statusSuara === "SAH").length
      const total = onlineVotes + offlineVotes
      const percentage = totalSuaraMasuk > 0 ? ((total / totalSuaraMasuk) * 100).toFixed(2) : 0

      return {
        ...c,
        votes: total,
        percentage,
      }
    })

    // Wilayah participation
    const wilayahStats = wilayahList.map((w) => {
      const pemilihInWilayah = allPemilih.filter((p) => p.wilayahPemilih === w.nama)
      const votedInWilayah = pemilihInWilayah.filter((p) => p.sudahMemilih).length
      const percentage = pemilihInWilayah.length > 0 ? ((votedInWilayah / pemilihInWilayah.length) * 100).toFixed(1) : 0

      return {
        nama: w.nama,
        total: pemilihInWilayah.length,
        voted: votedInWilayah,
        percentage,
      }
    })

    return {
      totalPemilih,
      totalSuaraMasuk,
      suaraSah,
      suaraTidakSah,
      tidakMemilih,
      calonResults,
      wilayahStats,
    }
  }

  const results = getResults()

  const handleReset = () => {
    setStep(1)
    setNomorHP("")
    setToken("")
    setPemilih(null)
    setSelectedCalon(null)
    setIsSuperAdmin(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="text-center space-y-1">
            {pengaturan.judul1 && (
              <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                {pengaturan.judul1}
              </h1>
            )}
            {pengaturan.judul2 && (
              <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-700 dark:text-gray-300">
                {pengaturan.judul2}
              </h2>
            )}
            {pengaturan.judul3 && (
              <h3 className="text-xs sm:text-sm md:text-base font-medium text-gray-600 dark:text-gray-400">
                {pengaturan.judul3}
              </h3>
            )}
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500 italic mt-2">
              Suara Anda Menentukan Kemajuan Wilayah, Pastikan Suaramu Tercatat.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        <AnimatePresence mode="wait">
          {/* Step 1: Login */}
          {step === 1 && (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-md mx-auto"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
                <div className="text-center mb-6 sm:mb-8">
                  <div className="inline-flex p-3 sm:p-4 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 mb-4">
                    <Vote className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">Login Pemilih</h2>
                  <div className="space-y-1 mb-4">
                    {pengaturan.judul1 && (
                      <p className="text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400">
                        {pengaturan.judul1}
                      </p>
                    )}
                    {pengaturan.judul2 && (
                      <p className="text-sm sm:text-base font-semibold text-blue-500 dark:text-blue-400">
                        {pengaturan.judul2}
                      </p>
                    )}
                    {pengaturan.judul3 && (
                      <p className="text-xs sm:text-sm font-medium text-blue-400 dark:text-blue-500">
                        {pengaturan.judul3}
                      </p>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Masukkan Nomor HP dan Token yang telah dikirim via WhatsApp
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nomor HP</label>
                    <input
                      type="text"
                      value={nomorHP}
                      onChange={(e) => setNomorHP(e.target.value)}
                      placeholder="Contoh: 081234567890"
                      className="w-full px-4 py-2.5 sm:py-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Token</label>
                    <input
                      type="text"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      placeholder="Masukkan token dari WhatsApp"
                      className="w-full px-4 py-2.5 sm:py-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                      required
                    />
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 shadow-lg transition-all text-sm sm:text-base"
                  >
                    Lanjutkan
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.button>
                </form>
              </div>
            </motion.div>
          )}

          {/* Step 2: Pilih Calon */}
          {step === 2 && (
            <motion.div
              key="vote"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4 sm:space-y-6"
            >
              {votingStatus === "berlangsung" && countdown && (
                <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl p-4 sm:p-6 text-center shadow-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
                    <p className="text-sm sm:text-base font-medium">Waktu Pemilihan Berakhir Pada:</p>
                  </div>
                  <p className="text-2xl sm:text-3xl md:text-4xl font-bold">{countdown}</p>
                </div>
              )}

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
                {isSuperAdmin && (
                  <div className="mb-4 p-3 sm:p-4 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 flex items-start gap-2 sm:gap-3">
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-yellow-800 dark:text-yellow-300 text-sm sm:text-base">
                        Mode SuperAdmin
                      </p>
                      <p className="text-xs sm:text-sm text-yellow-700 dark:text-yellow-400">
                        Anda hanya dapat melihat tampilan. Voting tidak tersedia untuk SuperAdmin.
                      </p>
                    </div>
                  </div>
                )}
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                  DAFTAR CALON
                </h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 text-center mb-4">
                  Silahkan pilih dengan klik foto
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {calon.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400 text-lg">Belum ada data calon yang tersedia.</p>
                  </div>
                ) : (
                  calon.map((item, index) => (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => !isSuperAdmin && setSelectedCalon(item)}
                      disabled={isSuperAdmin}
                      className={`bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border-2 transition-all shadow-lg ${
                        selectedCalon?.id === item.id
                          ? "border-blue-500 ring-4 ring-blue-200 dark:ring-blue-900/50"
                          : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700"
                      } ${isSuperAdmin ? "opacity-75 cursor-not-allowed" : ""}`}
                    >
                      <div className="relative h-48 sm:h-56 bg-gradient-to-br from-blue-500 to-purple-500">
                        {item.foto ? (
                          <img
                            src={item.foto || "/placeholder.svg"}
                            alt={item.namaKetua}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <div className="text-white text-6xl sm:text-7xl font-bold">{item.nomorUrut}</div>
                          </div>
                        )}
                        <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-white text-blue-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-bold shadow-lg text-sm sm:text-base">
                          No. {item.nomorUrut}
                        </div>
                        {selectedCalon?.id === item.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-blue-600 p-1.5 sm:p-2 rounded-full shadow-lg"
                          >
                            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          </motion.div>
                        )}
                      </div>

                      <div className="p-4 sm:p-5 text-left space-y-3">
                        <div>
                          <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1">KETUA</p>
                          <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                            {item.namaKetua}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.alamatKetua}</p>
                        </div>
                        <div>
                          <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold mb-1">WAKIL</p>
                          <p className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300">
                            {item.namaWakil}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.alamatWakil}</p>
                        </div>
                        {item.jargon && (
                          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 italic text-center">
                              "{item.jargon}"
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.button>
                  ))
                )}
              </div>

              {!isSuperAdmin && pemilih && !pemilih.sudahMemilih && (
                <button
                  onClick={handleVote}
                  disabled={pencoblosanStatus !== "during"}
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    pencoblosanStatus === "during"
                      ? "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {pencoblosanStatus === "before"
                    ? `Tunggu hingga waktu pencoblosan (${new Date(pengaturan?.tanggalPencoblosan).toLocaleDateString("id-ID")})`
                    : pencoblosanStatus === "after"
                      ? "Waktu pencoblosan sudah berakhir"
                      : "Konfirmasi Pilihan"}
                </button>
              )}

              {isSuperAdmin && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleReset}
                  className="w-full max-w-2xl mx-auto flex items-center justify-center gap-2 px-6 py-3 sm:py-4 bg-gray-600 text-white rounded-xl font-medium hover:bg-gray-700 shadow-lg transition-all text-sm sm:text-base"
                >
                  Kembali ke Login
                </motion.button>
              )}
            </motion.div>
          )}

          {/* Step 3: Success Message */}
          {step === 3 && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 sm:p-12 border border-gray-200 dark:border-gray-700 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.6 }}
                  className="inline-flex p-4 sm:p-6 rounded-full bg-green-100 dark:bg-green-900/30 mb-4 sm:mb-6"
                >
                  <CheckCircle className="w-16 h-16 sm:w-20 sm:h-20 text-green-600 dark:text-green-400" />
                </motion.div>

                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Suara Berhasil Disimpan!
                </h2>
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-4 italic">
                  "Terima kasih telah turut berperan serta dalam pemilihan dan menentukan masa depan"
                </p>

                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 sm:p-6 max-w-md mx-auto mb-6 sm:mb-8">
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="text-gray-600 dark:text-gray-400">Pemilih:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{pemilih?.nama}</span>
                    </div>
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="text-gray-600 dark:text-gray-400">Pilihan:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        No. {selectedCalon?.nomorUrut} - {selectedCalon?.namaKetua}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="text-gray-600 dark:text-gray-400">Waktu:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {new Date().toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Menuju halaman hasil...</p>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Status Hasil */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700 text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {votingStatus === "belum" && "BELUM ADA HASIL PEMUNGUTAN SUARA"}
                  {votingStatus === "berlangsung" && "HASIL SEMENTARA"}
                  {votingStatus === "selesai" && "HASIL FINAL"}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {votingStatus === "belum" && "Pemungutan suara belum dimulai"}
                  {votingStatus === "berlangsung" && "Pemilihan selesai dan status penghitungan belum final"}
                  {votingStatus === "selesai" && "Pemilihan selesai dan status penghitungan sudah final"}
                </p>
              </div>

              {/* Hasil per Calon */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {results.calonResults
                  .sort((a, b) => b.votes - a.votes)
                  .map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 text-center"
                    >
                      <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">{item.nomorUrut}</div>
                      {item.foto && (
                        <img
                          src={item.foto || "/placeholder.svg"}
                          alt={item.namaKetua}
                          className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                        />
                      )}
                      <h3 className="font-bold text-gray-900 dark:text-white mb-1">{item.namaKetua}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{item.namaWakil}</p>
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">{item.votes}</div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">suara ({item.percentage}%)</p>
                    </motion.div>
                  ))}
              </div>

              {/* Suara Masuk per Wilayah */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Suara Masuk per Wilayah</h3>
                <div className="space-y-3">
                  {results.wilayahStats.map((wilayah, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">{wilayah.nama}</span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {wilayah.voted} / {wilayah.total} pemilih ({wilayah.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${wilayah.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Statistics */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Ringkasan</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{results.totalPemilih}</div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Total Pemilih</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {results.totalSuaraMasuk}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Suara Masuk</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{results.suaraSah}</div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Suara Sah</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">{results.suaraTidakSah}</div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Suara Tidak Sah</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">{results.tidakMemilih}</div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Tidak Memberi Suara</p>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReset}
                className="w-full max-w-md mx-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 shadow-lg transition-all"
              >
                Selesai
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-1">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Perangkat Lunak Ini Disediakan Oleh{" "}
            <a href="https://manasukatour.com" className="text-blue-600 hover:underline font-medium">
              manasukatour.com
            </a>{" "}
            Semarang © 2025
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 italic">Untuk Kemajuan Negeri</p>
        </div>
      </div>
    </div>
  )
}
