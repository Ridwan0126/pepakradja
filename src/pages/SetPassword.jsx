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
  };

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await axios.get(`/api/set-password/?set_password_token=${token}`, {
          headers: apiHeaders,
        });
        setIsValid(true);
      } catch (error) {
        Swal.fire("Error", "Token tidak valid atau akses ditolak.", "error");
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
      const response = await axios.post("/api/set-password", payload, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-api-key": "xV3nKd8QpL5rTyHuWc2MfZaJbE7sRt1",
        },
      });

      console.log("[v0] Response success:", response.data);

      if (
        response.data.success ||
        response.data.status === 200 ||
        response.data.status === 201
      ) {
        Swal.fire("Berhasil", "Password berhasil diatur!", "success").then(
          () => {
            // Redirect ke login atau halaman lain
            window.location.href = "/login";
          },
        );
      } else {
        console.error("[v0] Unexpected response:", response.data);
        Swal.fire("Gagal", `API Response: ${response.data.status}`, "error");
      }
    } catch (error) {
      console.error("[v0] Error response:", error.response?.data);
      console.error("[v0] Error status:", error.response?.status);
      console.error("[v0] Error message:", error.message);

      const errorMsg =
        error.response?.data?.error ||
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
