"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Users, Plus, Edit, Trash2, Save, X, Eye, EyeOff } from "lucide-react"
import { useState, useEffect } from "react"
import { getAllUsers, setUser, deleteUser } from "../utils/firestore"
import { useAuth } from "../contexts/AuthContext"
import Swal from "sweetalert2"

export default function PengaturanPengguna() {
  const { user: currentUser } = useAuth()
  const [usersList, setUsersList] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    namaLengkap: "",
    role: "verifikator",
    username: "",
    password: "",
    ulangPassword: "",
    nomorHP: "",
  })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const users = await getAllUsers()
      setUsersList(users)
    } catch (err) {
      console.error("Error loading users:", err)
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Gagal memuat data pengguna dari Firestore",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (!formData.namaLengkap.trim()) {
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Nama lengkap tidak boleh kosong",
        confirmButtonColor: "#ef4444",
      })
      return
    }

    if (!formData.username.trim()) {
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Username tidak boleh kosong",
        confirmButtonColor: "#ef4444",
      })
      return
    }

    if (formData.password.length < 6) {
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Password minimal 6 karakter",
        confirmButtonColor: "#ef4444",
      })
      return
    }

    if (formData.password !== formData.ulangPassword) {
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Password dan ulang password tidak sama",
        confirmButtonColor: "#ef4444",
      })
      return
    }

    try {
      setLoading(true)

      if (editingId) {
        await setUser(editingId, {
          namaLengkap: formData.namaLengkap,
          role: formData.role,
          username: formData.username,
          password: formData.password,
          nomorHP: formData.nomorHP,
          updatedAt: new Date().toISOString(),
        })

        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Data pengguna berhasil diupdate di Firestore",
          confirmButtonColor: "#3b82f6",
        })
      } else {
        const newUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        await setUser(newUserId, {
          namaLengkap: formData.namaLengkap,
          role: formData.role,
          username: formData.username,
          password: formData.password,
          nomorHP: formData.nomorHP,
          createdAt: new Date().toISOString(),
        })

        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Pengguna baru berhasil ditambahkan ke Firestore",
          confirmButtonColor: "#3b82f6",
        })
      }

      resetForm()
      await loadUsers()
    } catch (err) {
      console.error("Error saving user:", err)
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: err.message || "Gagal menyimpan pengguna",
        confirmButtonColor: "#ef4444",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (userData) => {
    setEditingId(userData.id)
    setFormData({
      namaLengkap: userData.namaLengkap,
      role: userData.role,
      username: userData.username,
      password: userData.password,
      ulangPassword: userData.password,
      nomorHP: userData.nomorHP || "",
    })
    setShowModal(true)
  }

  const handleDelete = async (userData) => {
    const result = await Swal.fire({
      title: "Hapus Pengguna?",
      text: `Apakah Anda yakin ingin menghapus pengguna ${userData.username}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    })

    if (result.isConfirmed) {
      try {
        setLoading(true)
        await deleteUser(userData.id)

        Swal.fire({
          icon: "success",
          title: "Terhapus!",
          text: "Pengguna berhasil dihapus dari Firestore",
          confirmButtonColor: "#3b82f6",
        })

        await loadUsers()
      } catch (err) {
        console.error("Error deleting user:", err)
        Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: "Gagal menghapus pengguna",
          confirmButtonColor: "#ef4444",
        })
      } finally {
        setLoading(false)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      namaLengkap: "",
      role: "verifikator",
      username: "",
      password: "",
      ulangPassword: "",
      nomorHP: "",
    })
    setEditingId(null)
    setShowModal(false)
    setShowPassword(false)
    setShowPasswordConfirm(false)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 rounded-lg bg-orange-500/10 flex-shrink-0">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[var(--color-text-primary)]">
                Pengaturan Pengguna
              </h1>
              <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
                Kelola pengguna dari Firestore Collection
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg font-medium text-sm shadow-lg hover:shadow-xl transition-all touch-manipulation"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Tambah Pengguna</span>
            <span className="sm:hidden">Tambah</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-slate-50 to-orange-50">
              <tr>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-[var(--color-text-primary)]">
                  Nama Lengkap
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-[var(--color-text-primary)]">
                  Username
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-[var(--color-text-primary)]">
                  Role
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-[var(--color-text-primary)]">
                  Nomor HP
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm font-semibold text-[var(--color-text-primary)]">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {usersList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Users className="w-12 h-12 text-gray-300" />
                      <p className="text-sm text-[var(--color-text-muted)]">Belum ada data pengguna</p>
                    </div>
                  </td>
                </tr>
              ) : (
                usersList.map((userData, index) => (
                  <motion.tr
                    key={userData.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-orange-50/50 transition-colors"
                  >
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-[var(--color-text-primary)]">
                      {userData.namaLengkap}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-[var(--color-text-secondary)]">
                      {userData.username}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-[var(--color-text-secondary)]">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          userData.role === "admin"
                            ? "bg-red-100 text-red-700"
                            : userData.role === "ketua"
                              ? "bg-purple-100 text-purple-700"
                              : userData.role === "coordinator"
                                ? "bg-green-100 text-green-700"
                                : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {userData.role}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-[var(--color-text-secondary)]">
                      {userData.nomorHP || "-"}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(userData)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(userData)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
            onClick={resetForm}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-2xl my-8"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-[var(--color-text-primary)]">
                  {editingId ? "EDIT" : "TAMBAH"} PENGGUNA
                </h3>
                <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[var(--color-text-primary)]">Nama Lengkap</label>
                  <input
                    type="text"
                    value={formData.namaLengkap}
                    onChange={(e) => setFormData({ ...formData, namaLengkap: e.target.value })}
                    placeholder="Nama lengkap pengguna"
                    className="w-full px-4 py-2.5 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[var(--color-text-primary)]">Username</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="username"
                    className="w-full px-4 py-2.5 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[var(--color-text-primary)]">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="admin">Admin</option>
                    <option value="ketua">Ketua Panitia</option>
                    <option value="verifikator">Verifikator</option>
                    <option value="coordinator">Coordinator</option>
                    <option value="pemilih">Pemilih</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[var(--color-text-primary)]">
                    Nomor HP (opsional)
                  </label>
                  <input
                    type="text"
                    value={formData.nomorHP}
                    onChange={(e) => setFormData({ ...formData, nomorHP: e.target.value })}
                    placeholder="+62-8123456789"
                    className="w-full px-4 py-2.5 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[var(--color-text-primary)]">
                    Password (minimum 6 karakter)
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="password"
                      className="w-full px-4 py-2.5 pr-12 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[var(--color-text-primary)]">Ulang Password</label>
                  <div className="relative">
                    <input
                      type={showPasswordConfirm ? "text" : "password"}
                      value={formData.ulangPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          ulangPassword: e.target.value,
                        })
                      }
                      placeholder="ulang password"
                      className="w-full px-4 py-2.5 pr-12 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPasswordConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--color-primary)] text-white rounded-lg font-medium text-sm hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  {loading ? "Menyimpan..." : "Simpan Pengguna"}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-blue-500/10 rounded-xl p-4 sm:p-6 border border-blue-500/20"
      >
        <h3 className="font-semibold text-sm sm:text-base text-[var(--color-text-primary)] mb-2">Informasi Roles</h3>
        <div className="space-y-2 text-xs sm:text-sm text-[var(--color-text-secondary)]">
          <p>
            <strong>Admin:</strong> Akses penuh ke semua fitur sistem
          </p>
          <p>
            <strong>Ketua Panitia:</strong> Mengesahkan suara offline dan akses penuh
          </p>
          <p>
            <strong>Verifikator:</strong> Input data pemilih dan verifikasi
          </p>
          <p>
            <strong>Coordinator:</strong> Input suara offline dan laporan
          </p>
          <p>
            <strong>Pemilih:</strong> Hanya bisa voting dan melihat hasil
          </p>
        </div>
      </motion.div>
    </div>
  )
}
