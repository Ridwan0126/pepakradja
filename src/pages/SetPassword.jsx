import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const SetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [userData, setUserData] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const BASE_URL = "/api-proxy/set-password";
  const API_KEY = "xV3nKd8QpL5rTyHuWc2MfZaJbE7sRt1";
  // 1. Cek Token saat komponen dimuat
  useEffect(() => {
    fetch(`${BASE_URL}?set_password_token=${token}`, {
      method: "GET",
      headers: { token: API_KEY },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.code === "00") {
          setIsValid(true);
          setUserData(res.data);
        } else {
          setMessage("Token tidak valid atau sudah kadaluwarsa.");
        }
      })
      .catch(() => setMessage("Terjadi kesalahan koneksi server."))
      .finally(() => setLoading(false));
  }, [token]);

  // 2. Handler submit password
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Password tidak cocok!");
      return;
    }

    try {
      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: API_KEY,
        },
        body: JSON.stringify({
          set_password_token: token,
          password: password,
          password_confirmation: confirmPassword,
        }),
      });

      const result = await response.json();

      if (result.code === "00") {
        alert("Password berhasil diset!");
        navigate("/login");
      } else {
        alert(result.message || "Gagal mengubah password.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan koneksi ke server.");
    }
  };

  if (loading) return <div>Memeriksa token...</div>;
  if (!isValid) return <div>{message}</div>;

  return (
    <div className="p-8">
      <h2>Set Password untuk {userData?.nama}</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="password"
          placeholder="Password Baru"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border p-2"
        />
        <input
          type="password"
          placeholder="Konfirmasi Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="border p-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2">
          Simpan Password
        </button>
      </form>
    </div>
  );
};

export default SetPassword;
