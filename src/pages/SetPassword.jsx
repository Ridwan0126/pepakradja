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

    const payload = {
      set_password_token: token,
      password: password,
      password_confirmation: passwordConfirmation,
    };

    // LOG DATA KE CONSOLE BROWSER (F12)
    console.log(
      "Data yang akan dikirim ke API:",
      JSON.stringify(payload, null, 2),
    );

    try {
      const response = await axios.post("/api/set-password", payload, {
        headers: apiHeaders,
      });
      console.log("Respon sukses dari server:", response.data);
      Swal.fire("Berhasil", "Password berhasil diatur!", "success");
    } catch (error) {
      // LOG RESPON ERROR LENGKAP
      console.error("Data error dari server:", error.response?.data);
      console.error("Status error:", error.response?.status);
      Swal.fire("Gagal", "Cek Console untuk detail error", "error");
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
