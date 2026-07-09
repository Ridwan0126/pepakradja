import React from "react";
import { motion } from "framer-motion";
import { MapPinOff } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom"; // Tambahkan useLocation

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Ambil ID dari state, berikan nilai default '-' jika kosong
  const idAset = location.state?.idAset || "Tidak diketahui";
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 font-sans relative overflow-hidden">
      {/* Elemen Latar Belakang Aksen Glassmorphism */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100 rounded-full opacity-50 blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-green-100 rounded-full opacity-50 blur-3xl"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} // Easing kustom yang halus
        className="bg-white/80 backdrop-blur-xl border border-white/20 p-12 rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] w-full max-w-2xl flex flex-col items-center text-center z-10"
      >
        {/* Ikon Visual Modern */}
        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            delay: 0.2,
            duration: 0.5,
            type: "spring",
            bounce: 0.4,
          }}
          className="mb-10 p-5 bg-blue-50 rounded-full relative"
        >
          {/* Bayangan latar ikon */}
          <div className="absolute inset-0 bg-blue-100 rounded-full blur-md opacity-70"></div>

          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.7666.967-.939 1.165-.173.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.915-2.206-.243-.591-.487-.511-.669-.513-.172-.004-.371-.005-.57-.005-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.395 0 .001 5.394.001 12.05c0 2.091.545 4.134 1.584 5.945L0 24l6.247-1.642a11.812 11.812 0 0 0 5.803 1.53c6.655 0 12.049-5.394 12.049-12.049 0-3.226-1.256-6.262-3.536-8.541" />
          </svg>
        </motion.div>

        {/* Teks Section */}
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Data Belum Tersedia
          </h1>
          <p className="text-lg text-gray-600 mb-10 leading-relaxed font-light">
            Mohon maaf, saat ini nomor WhatsApp untuk pengelola aset belum
            tersedia di sistem. Silakan hubungi{" "}
            <span className="font-semibold text-blue-700">PIC Pusat</span>{" "}
            secara langsung untuk mendapatkan informasi detail dan bantuan lebih
            lanjut mengenai aset yang Anda cari.
          </p>
        </div>

        {/* Button Section */}
        <div className="flex flex-col sm:flex-row gap-5 w-full justify-center sm:w-auto">
          <motion.a
            href="/"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-4 bg-white border border-gray-200 text-gray-700 font-semibold rounded-2xl transition-all duration-200 hover:border-gray-300 hover:shadow-sm"
          >
            Lain Kali
          </motion.a>
          <motion.a
            // Menggunakan template literal untuk menyisipkan pesan otomatis beserta ID objek
            href={`https://wa.me/62895330823300?text=${encodeURIComponent(
              `Halo PIC Pusat, saya ingin menanyakan perihal aset dengan ID: ${idAset}, namun nomor WhatsApp pengelolanya tidak tersedia di sistem. Mohon bantuannya.`,
            )}`}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-2xl shadow-lg shadow-green-200/80 transition-all duration-200 hover:from-emerald-600 hover:to-green-700 flex items-center justify-center gap-2"
          >
            {/* SVG tetap sama */}
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="..." />
            </svg>
            Hubungi PIC Pusat
          </motion.a>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
