import React, { useState, useEffect } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  Loader2,
  ChevronRight,
} from "lucide-react";

const SetPassword = () => {
  const [searchParams] = useSearchParams();
  // const token = searchParams.get("token");
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isTokenValid, setIsTokenValid] = useState(null);
  const [loadingToken, setLoadingToken] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const HEADER_TOKEN = "xV3nKd8QpL5rTyHuWc2MfZaJbE7sRt1/wr/set-password?";

  useEffect(() => {
    const checkTokenValidity = async () => {
      if (!token) {
        setIsTokenValid(false);
        setMessage({
          type: "error",
          text: "Akses Ditolak: Token pengaman tidak ditemukan di tautan Anda.",
        });
        setLoadingToken(false);
        return;
      }

      try {
        setLoadingToken(true);
        const params = new URLSearchParams({ set_password_token: token });
        const response = await fetch(
          `/bapenda-api/pepakraja/wr/set-password?${params.toString()}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${HEADER_TOKEN}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (response.ok) {
          setIsTokenValid(true);
        } else {
          setIsTokenValid(false);
          setMessage({
            type: "error",
            text: "Tautan kedaluwarsa atau token tidak valid.",
          });
        }
      } catch (error) {
        setIsTokenValid(false);
        setMessage({
          type: "error",
          text: "Gagal memverifikasi. Periksa koneksi internet Anda.",
        });
      } finally {
        setLoadingToken(false);
      }
    };

    checkTokenValidity();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Konfirmasi password tidak cocok." });
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        set_password_token: token,
        password: password,
        password_confirmation: confirmPassword,
      };

      const response = await fetch("/bapenda-api/pepakraja/wr/set-password", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HEADER_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.code === "00") {
        // Sesuaikan dengan response API Anda
        setMessage({ type: "success", text: "Password berhasil diperbarui." });
      } else {
        setMessage({
          type: "error",
          text: result.message || "Gagal memperbarui password.",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Terjadi gangguan sistem." });
    } finally {
      setSubmitting(false);
    }
  };

  // iOS Loading style dengan efek blur
  if (loadingToken) {
    return (
      <div className="min-h-screen bg-[#F2F2F7] dark:bg-[#1C1C1E] flex flex-col items-center justify-center font-sans">
        <div className="p-6 bg-white/80 dark:bg-[#2C2C2E]/80 backdrop-blur-xl rounded-2xl shadow-sm border border-black/5 dark:border-white/5 flex flex-col items-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          >
            <Loader2 className="w-8 h-8 text-[#007AFF]" />
          </motion.div>
          <p className="mt-3 text-sm font-medium text-[#3A3A3C] dark:text-[#E5E5EA]">
            Memverifikasi...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-[#000000] relative flex items-center justify-center p-4 font-sans antialiased text-black dark:text-white">
      {/* Efek Lampu Aurora halus di belakang device/card */}
      <div className="absolute top-[10%] left-[25%] w-[400px] h-[400px] rounded-full bg-[#007AFF]/10 dark:bg-[#0A84FF]/5 blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }} // iOS Spring ease curve
        className="relative w-full max-w-sm"
      >
        {/* Brand Header Group */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 rounded-2xl shadow-sm mb-3">
            <Lock className="w-6 h-6 text-[#007AFF] dark:text-[#0A84FF]" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-[#1C1C1E] dark:text-white">
            Kata Sandi Baru
          </h2>
          <p className="text-[#8E8E93] text-xs mt-0.5 font-normal">
            BAPENDA Provinsi Jawa Tengah
          </p>
        </div>

        {/* Kondisi Jika Token Invalid */}
        {!isTokenValid ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/5 p-5 rounded-2xl shadow-sm text-center"
          >
            <XCircle className="w-10 h-10 text-[#FF3B30] mx-auto mb-2" />
            <p className="text-[#1C1C1E] dark:text-white text-sm font-medium">
              {message.text}
            </p>
            <p className="text-xs text-[#8E8E93] mt-1">
              Silakan tutup halaman ini dan gunakan tautan baru.
            </p>
          </motion.div>
        ) : (
          /* Tampilan Form Utama Bertema iOS Form Group */
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* iOS Style Action Toast/Banner */}
            <AnimatePresence mode="wait">
              {message.text && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className={`p-3.5 rounded-2xl flex items-center gap-3 border ${
                    message.type === "success"
                      ? "bg-[#34C759]/10 border-[#34C759]/20 text-[#34C759]"
                      : "bg-[#FF3B30]/10 border-[#FF3B30]/20 text-[#FF3B30]"
                  }`}
                >
                  {message.type === "success" ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 shrink-0" />
                  )}
                  <span className="text-xs font-semibold">{message.text}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* iOS List Section Group */}
            <div className="bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm divide-y divide-black/5 dark:divide-white/5">
              {/* Row Input 1: Password */}
              <div className="px-4 py-3.5 flex flex-col gap-1">
                <span className="text-[11px] font-medium uppercase tracking-wider text-[#8E8E93]">
                  Sandi Baru
                </span>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    required
                    className="w-full bg-transparent text-sm text-[#1C1C1E] dark:text-white placeholder-[#AEAEB2] focus:outline-none pr-8"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 text-[#AEAEB2] hover:text-[#8E8E93] transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Row Input 2: Konfirmasi Password */}
              <div className="px-4 py-3.5 flex flex-col gap-1">
                <span className="text-[11px] font-medium uppercase tracking-wider text-[#8E8E93]">
                  Konfirmasi Sandi
                </span>
                <div className="relative flex items-center">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi sandi baru"
                    required
                    className="w-full bg-transparent text-sm text-[#1C1C1E] dark:text-white placeholder-[#AEAEB2] focus:outline-none pr-8"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-0 text-[#AEAEB2] hover:text-[#8E8E93] transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* iOS System Button Accent */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={submitting}
              className="w-full bg-[#007AFF] dark:bg-[#0A84FF] text-white font-semibold py-3.5 px-4 rounded-2xl shadow-sm transition-all flex items-center justify-center gap-1.5 text-sm disabled:opacity-40"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Memperbarui...
                </>
              ) : (
                <>
                  Perbarui Kata Sandi
                  <ChevronRight className="w-4 h-4 opacity-70" />
                </>
              )}
            </motion.button>
          </form>
        )}

        {/* Apple Centered Clean Footer */}
        <div className="text-center mt-6">
          <p className="text-[11px] text-[#8E8E93] font-normal">
            © 2026 BAPENDA Provinsi Jawa Tengah.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SetPassword;
