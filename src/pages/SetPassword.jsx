import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const SetPassword = () => {
  const { token } = useParams();
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");

  useEffect(() => {
    // Menggunakan path yang sudah di-proxy di vercel.json
    axios
      .get(`/api/set-password/?set_password_token=${token}`)
      .then(() => setIsValid(true))
      .catch(() => {
        Swal.fire("Error", "Token tidak valid", "error");
      })
      .finally(() => setLoading(false));
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Gunakan path yang sama untuk POST
      await axios.post("/api/set-password/", {
        set_password_token: token,
        password: password,
      });
      Swal.fire("Berhasil", "Password berhasil diatur!", "success");
    } catch (error) {
      Swal.fire("Gagal", "Terjadi kesalahan sistem", "error");
    }
  };

  if (loading) return <div>Memeriksa Token...</div>;

  return (
    <div className="container">
      {isValid ? (
        <form onSubmit={handleSubmit}>
          <h2>Set Password</h2>
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
