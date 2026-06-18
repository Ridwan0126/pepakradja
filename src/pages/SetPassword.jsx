import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const SetPassword = () => {
  const { token } = useParams();
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");

  // Definisikan header yang diperlukan
  const apiHeaders = {
    "x-api-key": "xV3nKd8QpL5rTyHuWc2MfZaJbE7sRt1",
    Accept: "application/json",
    "Content-Type": "application/json",
    Referer: "https://rpp.bapenda.jatengprov.go.id/", // Memberitahu server asal request
    Origin: "https://rpp.bapenda.jatengprov.go.id/",
  };

  useEffect(() => {
    const verifyToken = async () => {
      try {
        // Request dengan menyertakan headers
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
    try {
      await axios.post(
        "/api/set-password/",
        {
          set_password_token: token,
          password: password,
        },
        {
          headers: apiHeaders, // Jangan lupa sertakan header juga saat POST
        },
      );
      Swal.fire("Berhasil", "Password berhasil diatur!", "success");
    } catch (error) {
      Swal.fire("Gagal", "Terjadi kesalahan saat menyimpan password.", "error");
    }
  };

  if (loading) return <div>Memeriksa Token...</div>;

  return (
    <div className="container">
      {isValid ? (
        <form onSubmit={handleSubmit}>
          <h2>Set Password Baru</h2>
          <input
            type="password"
            placeholder="Masukkan password baru"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Simpan</button>
        </form>
      ) : (
        <p>Maaf, token tidak valid.</p>
      )}
    </div>
  );
};

export default SetPassword;
