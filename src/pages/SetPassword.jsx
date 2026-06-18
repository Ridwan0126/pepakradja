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

    // Validasi sederhana di sisi client
    if (password !== passwordConfirmation) {
      Swal.fire(
        "Gagal",
        "Password dan Konfirmasi Password tidak cocok!",
        "warning",
      );
      return;
    }

    try {
      await axios.post(
        "/api/set-password",
        {
          set_password_token: token,
          password: password,
          password_confirmation: passwordConfirmation,
        },
        {
          headers: apiHeaders,
        },
      );
      Swal.fire("Berhasil", "Password berhasil diatur!", "success");
    } catch (error) {
      console.log(error.response?.data); // TAMBAHKAN INI
      Swal.fire("Gagal", JSON.stringify(error.response?.data), "error");
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
