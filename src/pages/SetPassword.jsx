import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const SetPassword = () => {
  const { token } = useParams();
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(true);

  // State untuk form
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const apiHeaders = {
    "x-api-key": "xV3nKd8QpL5rTyHuWc2MfZaJbE7sRt1",
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  };

  useEffect(() => {
    const verifyToken = async () => {
      try {
        console.log("[v0] Verifying token...");
        const response = await axios.get(
          `/api/set-password?set_password_token=${encodeURIComponent(token)}`,
        );
        console.log(
          "[v0] Token verification response:",
          response.status,
          response.data,
        );

        if (response.data.success === true) {
          setIsValid(true);
        } else {
          throw new Error("Token tidak valid");
        }
        console.log("VERIFY RESPONSE:", JSON.stringify(response.data, null, 2));
      } catch (error) {
        console.error(
          "[v0] Token verification error:",
          error.response?.data || error.message,
        );
        const errorMsg =
          error.response?.data?.error ||
          "Token tidak valid atau akses ditolak.";
        Swal.fire("Error", errorMsg, "error");
      } finally {
        setLoading(false);
      }
    };
    if (token) verifyToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi password
    if (password.length < 8) {
      Swal.fire("Validasi", "Password minimal 8 karakter", "warning");
      return;
    }

    if (password !== passwordConfirmation) {
      Swal.fire("Validasi", "Password tidak cocok", "warning");
      return;
    }

    const payload = {
      set_password_token: token,
      password: password,
      password_confirmation: passwordConfirmation,
    };

    console.log("[v0] Submitting payload:", JSON.stringify(payload, null, 2));

    try {
      console.log("[v0] Submitting password change...");

      // Ganti bagian axios.post di handleSubmit menjadi:
      const response = await axios.post("/api/set-password", payload, {
        headers: apiHeaders, // Pastikan apiHeaders sudah didefinisikan sebelumnya
      });
      console.log(
        "[v0] Password change response:",
        response.status,
        response.data,
      );
      console.log("FULL RESPONSE:", JSON.stringify(response.data, null, 2));

      if (response.data.success === true) {
        Swal.fire("Berhasil", "Password berhasil diatur!", "success").then(
          () => {
            window.location.href = "/login";
          },
        );
      } else {
        const errMsg = response.data.error || "Gagal mengatur password";
        console.error("[v0] Submission failed:", errMsg);
        Swal.fire("Gagal", errMsg, "error");
      }
    } catch (error) {
      console.error("[v0] Error:", error.response?.data || error.message);
      const errorMsg =
        error.response?.data?.error ||
        error.response?.data?.details ||
        error.message ||
        "Gagal mengatur password";
      Swal.fire("Gagal", errorMsg, "error");
    }
  };

  if (loading) return <div>Memeriksa Token...</div>;

  return (
    <div className="container">
      {isValid ? (
        <form onSubmit={handleSubmit}>
          <h2>Set Password Baru</h2>

          <label>Password Baru:</label>
          <input
            type="password"
            placeholder="Masukkan password baru"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label>Konfirmasi Password:</label>
          <input
            type="password"
            placeholder="Ulangi password baru"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
          />

          <button type="submit">Simpan Password</button>
        </form>
      ) : (
        <p>Maaf, token tidak valid atau telah kadaluwarsa.</p>
      )}
    </div>
  );
};

export default SetPassword;
