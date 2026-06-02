"use client"

import { motion } from "framer-motion"
import { Lock, User, Eye, EyeOff, Vote, Zap } from "lucide-react"
import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { seedInitialUsers } from "../utils/firestore"
import Swal from "sweetalert2"

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [seedLoading, setSeedLoading] = useState(false)
  const { login, error: authError } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await login(username, password)
      Swal.fire({
        icon: "success",
        title: "Login Berhasil!",
        text: "Selamat datang di sistem E-Voting",
        confirmButtonColor: "#3b82f6",
        timer: 1500,
      })
      navigate("/dashboard")
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Login Gagal!",
        text: authError || "Username atau password salah",
        confirmButtonColor: "#ef4444",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSeedUsers = async () => {
    setSeedLoading(true)
    try {
      console.log("[v0] Starting seed users process...")
      await new Promise((resolve) => setTimeout(resolve, 1500))

      console.log("[v0] Calling seedInitialUsers...")
      const result = await seedInitialUsers()

      console.log("[v0] Seed result:", result)

      Swal.fire({
        icon: "success",
        title: "Populate Users Berhasil!",
        html: `
          <div class="text-left">
            <p class="mb-2">${result.message}</p>
            ${result.errors ? `<p class="text-red-500 text-sm mt-3"><strong>Catatan:</strong></p><p class="text-red-500 text-xs">${result.errors.join("<br>")}</p>` : ""}
          </div>
        `,
        confirmButtonColor: "#10b981",
        timer: 3000,
      })
    } catch (err) {
      console.error("[v0] Seed users error:", err)

      let errorTitle = "Populate Users Gagal!"
      let errorText = err.message || "Terjadi kesalahan saat membuat data user"
      let showGuide = false

      if (err.message && err.message.includes("firestore is not available")) {
        errorTitle = "Firestore Belum Diaktifkan"
        errorText = `Firestore Database belum dibuat di Firebase Console.\n\nLangkah untuk mengaktifkan:\n1. Buka Firebase Console\n2. Klik Cloud Firestore\n3. Klik Create Database\n4. Pilih region: asia-southeast1\n5. Pilih mode: Production\n6. Klik Create dan tunggu 2-3 menit\n7. Refresh halaman dan coba lagi`
        showGuide = true
      } else if (err.message && err.message.includes("Initialization timeout")) {
        errorTitle = "Koneksi Timeout"
        errorText = `Firebase tidak merespons dalam waktu yang ditentukan.\n\nCoba:\n1. Cek koneksi internet\n2. Pastikan Firestore sudah dibuat di Firebase Console\n3. Refresh halaman (Ctrl+Shift+R)\n4. Coba lagi`
      }

      Swal.fire({
        icon: "error",
        title: errorTitle,
        text: errorText,
        confirmButtonColor: "#ef4444",
        width: "600px",
        didOpen: (modal) => {
          if (showGuide) {
            modal.querySelector(".swal2-html-container").style.textAlign = "left"
            modal.querySelector(".swal2-html-container").style.whiteSpace = "pre-wrap"
            modal.querySelector(".swal2-html-container").style.fontSize = "13px"
          }
        },
      })
    } finally {
      setSeedLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Vote className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">E-Voting System</h1>
            <p className="text-blue-100">Sistem Pemungutan Suara Elektronik</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Memproses..." : "Login"}
            </motion.button>
          </form>

          <div className="px-8 pb-4 space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 font-semibold mb-2">Test Accounts (Firestore Collection):</p>
              <div className="space-y-1 text-xs text-gray-500">
                <p>
                  Admin: <span className="font-mono bg-white px-2 py-1 rounded">admin / admin123</span>
                </p>
                <p>
                  Ketua: <span className="font-mono bg-white px-2 py-1 rounded">ketua / ketua123</span>
                </p>
                <p>
                  Verifikator:{" "}
                  <span className="font-mono bg-white px-2 py-1 rounded">verifikator / verifikator123</span>
                </p>
                <p>
                  Coordinator:{" "}
                  <span className="font-mono bg-white px-2 py-1 rounded">coordinator / coordinator123</span>
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleSeedUsers}
              disabled={seedLoading}
              className="w-full py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" />
              {seedLoading ? "Membuat User..." : "Populate Initial Users"}
            </motion.button>

            <p className="text-xs text-gray-400 text-center">
              Klik tombol di atas untuk membuat data user default ke Firestore
            </p>
          </div>

          {/* Footer */}
          <div className="px-8 pb-8 text-center">
            <p className="text-sm text-gray-500">Sistem E-Voting v2.0 &copy; 2025</p>
            <p className="text-xs text-gray-400 mt-1">Powered by Firebase Firestore Collection</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
