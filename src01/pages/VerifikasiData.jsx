"use client"

import { motion } from "framer-motion"
import { CheckCircle, Filter } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { getPemilihByElection, updatePemilih, getWilayahByElection, getPemilihanConfig } from "../utils/firestore"
import Swal from "sweetalert2"

export default function VerifikasiData() {
  const { user } = useAuth()
  const [electionId, setElectionId] = useState(null)
  const [pemilih, setPemilih] = useState([])
  const [wilayahList, setWilayahList] = useState([])
  const [selectedWilayah, setSelectedWilayah] = useState("*")
  const [pengaturan, setPengaturan] = useState({})
  const [loading, setLoading] = useState(true)

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
        }
      } catch (err) {
        Swal.fire({ icon: "error", title: "Error", text: err.message })
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const canVerify = () => {
    if (!pengaturan.tanggalPemungutanSuara) return true
    const votingStart = new Date(pengaturan.tanggalPemungutanSuara)
    return new Date() < votingStart
  }

  const handleVerify = async (id) => {
    if (!canVerify()) {
      Swal.fire({
        icon: "error",
        title: "Tidak Dapat Verifikasi",
        text: "Verifikasi tidak dapat dilakukan karena waktu pemungutan suara sudah dimulai",
      })
      return
    }

    try {
      const item = pemilih.find((p) => p.id === id)
      const newStatus = !item.verifikasiSesuai
      await updatePemilih(electionId, id, {
        verifikasiSesuai: newStatus,
        verifikasiTanggal: newStatus ? new Date().toISOString() : null,
      })

      setPemilih(pemilih.map((p) => (p.id === id ? { ...p, verifikasiSesuai: newStatus } : p)))
      Swal.fire({ icon: "success", title: "Berhasil", text: "Status verifikasi berhasil diupdate" })
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.message })
    }
  }

  const filteredPemilih = pemilih
    .filter((p) => selectedWilayah === "*" || p.wilayahPemilih === selectedWilayah)
    .sort((a, b) => a.wilayahPemilih.localeCompare(b.wilayahPemilih))

  const stats = {
    online: filteredPemilih.filter((p) => p.caraMemilih === "online").length,
    offline: filteredPemilih.filter((p) => p.caraMemilih === "offline").length,
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-500/10">
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Verifikasi Data Pemilih</h1>
            <p className="text-[var(--color-text-secondary)]">Verifikasi data pemilih sebelum pemilihan dimulai</p>
          </div>
        </div>
      </motion.div>

      {/* Filter & Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border)]"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-[var(--color-text-secondary)]" />
            <h3 className="font-semibold">Filter</h3>
          </div>

          <select
            value={selectedWilayah}
            onChange={(e) => setSelectedWilayah(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)]"
          >
            <option value="*">Keseluruhan</option>
            {wilayahList.map((w) => (
              <option key={w.id} value={w.wilayahPemilih}>
                {w.wilayahPemilih}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-blue-500/10 rounded-lg p-4">
              <p className="text-sm text-blue-500">Pemilih Online</p>
              <p className="text-3xl font-bold text-blue-500">{stats.online}</p>
            </div>
            <div className="bg-green-500/10 rounded-lg p-4">
              <p className="text-sm text-green-500">Pemilih Offline</p>
              <p className="text-3xl font-bold text-green-500">{stats.offline}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {!canVerify() && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-500/10 border border-red-500/20 rounded-lg p-4"
        >
          <p className="text-red-500 text-sm font-medium">
            Pemilihan sedang berlangsung - Verifikasi tidak dapat dilakukan
          </p>
        </motion.div>
      )}

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--color-surface-hover)]">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">No</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Nama</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Alamat</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Wilayah</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Verifikasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {filteredPemilih.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-[var(--color-text-secondary)]">
                    Tidak ada data
                  </td>
                </tr>
              ) : (
                filteredPemilih.map((item, idx) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 text-sm">{idx + 1}</td>
                    <td className="px-4 py-3 text-sm font-medium">{item.nama}</td>
                    <td className="px-4 py-3 text-sm">
                      {item.alamatJalan} No {item.nomorRumah}
                    </td>
                    <td className="px-4 py-3 text-sm">{item.wilayahPemilih}</td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={item.verifikasiSesuai || false}
                        onChange={() => handleVerify(item.id)}
                        disabled={!canVerify()}
                        className="w-5 h-5 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
