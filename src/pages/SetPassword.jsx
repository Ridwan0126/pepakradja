import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import Swal from "sweetalert2";

// Gunakan API proxy lokal (backend) bukan langsung ke API eksternal
const API_BASE_URL = "/api";

export default function SetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [error, setError] = useState("");

  // Cek validasi token saat component mount
  useEffect(() => {
    const validateToken = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_BASE_URL}/set-password?set_password_token=${token}`,
        );

        if (response.status === 200 && response.data) {
          setTokenValid(true);
          setError("");
        }
      } catch (err) {
        console.error("Token validation error:", err);
        setTokenValid(false);
        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            "Token tidak valid atau sudah kadaluarsa",
        );

        // Tampilkan alert error dan redirect setelah 3 detik
        setTimeout(() => {
          Swal.fire({
            icon: "error",
            title: "Token Tidak Valid",
            text:
              error ||
              "Token tidak valid atau sudah kadaluarsa. Silakan lakukan registrasi ulang.",
            confirmButtonColor: "#EF4444",
          }).then(() => {
            navigate("/");
          });
        }, 500);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      validateToken();
    } else {
      setError("Token tidak ditemukan");
      setLoading(false);
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi
    if (!password || !passwordConfirm) {
      setError("Password dan konfirmasi password tidak boleh kosong");
      return;
    }

    if (password.length < 8) {
      setError("Password minimal 8 karakter");
      return;
    }

    if (password !== passwordConfirm) {
      setError("Password dan konfirmasi password tidak cocok");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const response = await axios.post(`${API_BASE_URL}/set-password`, {
        set_password_token: token,
        password: password,
        password_confirmation: passwordConfirm,
      });

      if (response.status === 200) {
        // Tampilkan success alert
        await Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Password berhasil diatur. Silakan login dengan akun Anda.",
          confirmButtonColor: "#10B981",
        });

        // Redirect ke login
        navigate("/login");
      }
    } catch (err) {
      console.error("Set password error:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Terjadi kesalahan saat mengatur password";

      setError(errorMessage);

      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: errorMessage,
        confirmButtonColor: "#EF4444",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <div className="inline-block">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"
            />
          </div>
          <p className="mt-4 text-gray-600 font-medium">
            Memverifikasi token...
          </p>
        </motion.div>
      </div>
    );
  }

  // Invalid token state
  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center"
        >
          <div className="text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Token Tidak Valid
          </h1>
          <p className="text-gray-600 mb-6">
            Token yang Anda gunakan tidak valid atau sudah kadaluarsa. Silakan
            lakukan registrasi ulang.
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Kembali ke Beranda
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="text-4xl mb-4">🔐</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Atur Password
          </h1>
          <p className="text-gray-600">
            Buat password yang kuat untuk akun Anda
          </p>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Password Input */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password minimal 8 karakter"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </motion.div>

          {/* Confirm Password Input */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Konfirmasi Password
            </label>
            <div className="relative">
              <input
                type={showPasswordConfirm ? "text" : "password"}
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="Ulangi password Anda"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              <button
                type="button"
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              >
                {showPasswordConfirm ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </motion.div>

          {/* Password Requirements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="bg-blue-50 rounded-lg p-3 text-sm text-gray-700"
          >
            <p className="font-medium mb-2">Persyaratan password:</p>
            <ul className="space-y-1 text-xs">
              <li
                className={`flex items-center ${password.length >= 8 ? "text-green-600" : "text-gray-500"}`}
              >
                <span className="mr-2">{password.length >= 8 ? "✓" : "○"}</span>
                Minimal 8 karakter
              </li>
              <li
                className={`flex items-center ${password && passwordConfirm && password === passwordConfirm ? "text-green-600" : "text-gray-500"}`}
              >
                <span className="mr-2">
                  {password && passwordConfirm && password === passwordConfirm
                    ? "✓"
                    : "○"}
                </span>
                Password cocok
              </li>
            </ul>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={submitting}
            className={`w-full py-3 rounded-lg font-medium text-white transition ${
              submitting
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
            }`}
          >
            {submitting ? (
              <span className="flex items-center justify-center">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="inline-block mr-2"
                >
                  ⏳
                </motion.span>
                Memproses...
              </span>
            ) : (
              "Atur Password"
            )}
          </motion.button>
        </form>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="mt-6 text-center text-sm text-gray-600"
        >
          Sudah punya akun?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Login di sini
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
