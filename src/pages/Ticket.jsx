"use client";

import { useMemo, useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Star,
  SlidersHorizontal,
  X,
  Minus,
  Plus,
  User,
  CalendarDays,
  Ticket as TicketIcon,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Clock,
  Wallet,
  Loader2,
  Download,
  Sparkles,
  History,
  LogIn,
  Lock,
  Banknote,
  Store,
  ChevronLeft,
} from "lucide-react";

import Header from "../components/Header";
import Footer from "../components/Footer";

/* =========================================================================
   PEMASARAN PARIWISATA JAWA TENGAH — TICKETING (iOS GLASS THEME)
   Single file. TailwindCSS + Framer Motion + Lucide React.
   Pembayaran nontunai (Bank Jateng) — data dummy.
   ========================================================================= */

const STORAGE_KEY = "jateng_tickets";
const SESSION_KEY = "wr_session";

const RUPIAH = (n) =>
  "Rp" + Number(n).toLocaleString("id-ID", { maximumFractionDigits: 0 });

// Baca sesi login dari localStorage (wr_session)
const readSession = () => {
  try {
    const s = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    if (!s || !s.isLoggedIn) return null;
    if (s.expiredAt && Date.now() > s.expiredAt) return null; // sesi kedaluwarsa
    return s;
  } catch (e) {
    console.log("[v0] baca sesi gagal:", e);
    return null;
  }
};

const readTickets = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
};

// QR via free image API (no extra npm package needed)
const qrSrc = (data, size = 260) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=12&data=${encodeURIComponent(
    data,
  )}`;

const genKode = () =>
  "JTG-" +
  Math.random().toString(36).slice(2, 6).toUpperCase() +
  "-" +
  Math.random().toString(36).slice(2, 6).toUpperCase();

/* ----------------------------- DUMMY DATA ------------------------------ */
const KATEGORI = ["Semua", "Candi", "Alam", "Sejarah", "Pantai", "Rekreasi"];

const DESTINASI = [
  {
    id: "OBJ-001",
    nama: "Candi Borobudur",
    lokasi: "Magelang",
    kategori: "Candi",
    rating: 4.9,
    harga: 50000,
    img: "/images/borobudur.png",
    desc: "Candi Buddha terbesar di dunia, warisan dunia UNESCO dengan panorama matahari terbit yang ikonik.",
    jam: "06.00 - 17.00",
    satuan: "orang",
  },
  {
    id: "OBJ-002",
    nama: "Candi Prambanan",
    lokasi: "Klaten",
    kategori: "Candi",
    rating: 4.8,
    harga: 50000,
    img: "/images/prambanan.png",
    desc: "Kompleks candi Hindu termegah di Indonesia dengan arsitektur menjulang yang memukau.",
    jam: "06.30 - 17.00",
    satuan: "orang",
  },
  {
    id: "OBJ-003",
    nama: "Dataran Tinggi Dieng",
    lokasi: "Wonosobo",
    kategori: "Alam",
    rating: 4.7,
    harga: 25000,
    img: "/images/dieng.png",
    desc: "Negeri di atas awan dengan telaga warna, kawah, dan udara sejuk pegunungan.",
    jam: "24 Jam",
    satuan: "orang",
  },
  {
    id: "OBJ-004",
    nama: "Lawang Sewu",
    lokasi: "Semarang",
    kategori: "Sejarah",
    rating: 4.6,
    harga: 20000,
    img: "/images/lawangsewu.png",
    desc: "Bangunan kolonial bersejarah dengan seribu pintu, ikon Kota Semarang.",
    jam: "08.00 - 21.00",
    satuan: "orang",
  },
  {
    id: "OBJ-005",
    nama: "Karimunjawa",
    lokasi: "Jepara",
    kategori: "Pantai",
    rating: 4.9,
    harga: 75000,
    img: "/images/karimunjawa.png",
    desc: "Gugusan pulau tropis dengan air laut sebening kristal, surga snorkeling.",
    jam: "07.00 - 18.00",
    satuan: "orang",
  },
  {
    id: "OBJ-006",
    nama: "Umbul Ponggok",
    lokasi: "Klaten",
    kategori: "Rekreasi",
    rating: 4.5,
    harga: 30000,
    img: "/images/ponggok.png",
    desc: "Mata air jernih untuk snorkeling dan foto bawah air yang fenomenal.",
    jam: "07.00 - 17.00",
    satuan: "orang",
  },
  {
    id: "OBJ-007",
    nama: "Kota Lama Semarang",
    lokasi: "Semarang",
    kategori: "Sejarah",
    rating: 4.6,
    harga: 15000,
    img: "/images/kotalama.png",
    desc: "Little Netherlands dengan deretan bangunan tua estetik dan Gereja Blenduk.",
    jam: "24 Jam",
    satuan: "orang",
  },
  {
    id: "OBJ-008",
    nama: "Saloka Theme Park",
    lokasi: "Semarang",
    kategori: "Rekreasi",
    rating: 4.7,
    harga: 100000,
    img: "/images/saloka.png",
    desc: "Taman rekreasi keluarga terbesar di Jawa Tengah dengan puluhan wahana seru.",
    jam: "09.00 - 17.00",
    satuan: "orang",
  },
];

/* --------------------------- SMALL UI PARTS ---------------------------- */
function Glass({ className = "", children, ...rest }) {
  return (
    <div
      className={`border border-white/50 bg-white/60 backdrop-blur-xl shadow-[0_8px_30px_rgba(15,23,42,0.08)] ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

const spring = { type: "spring", stiffness: 320, damping: 30 };

/* ------------------------------ CARD ----------------------------------- */
function DestinationCard({ item, onSelect, index }) {
  return (
    <motion.button
      layout
      onClick={() => onSelect(item)}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ ...spring, delay: index * 0.03 }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      className="group text-left"
    >
      <Glass className="overflow-hidden rounded-3xl">
        <div className="relative h-40 w-full overflow-hidden">
          <img
            src={item.img || "/placeholder.svg"}
            alt={item.nama}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-slate-700 backdrop-blur">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            {item.rating}
          </div>
          <div className="absolute right-3 top-3 rounded-full bg-sky-500/90 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
            {item.kategori}
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <MapPin className="h-3.5 w-3.5" />
            {item.lokasi}
          </div>
          <h3 className="mt-1 text-base font-semibold text-slate-900">
            {item.nama}
          </h3>
          <div className="mt-3 flex items-end justify-between">
            <div>
              <p className="text-[11px] text-slate-400">Mulai dari</p>
              <p className="text-lg font-bold text-sky-600">
                {RUPIAH(item.harga)}
              </p>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-slate-900 px-3 py-2 text-xs font-medium text-white transition group-hover:bg-sky-600">
              Minat <ChevronRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </Glass>
    </motion.button>
  );
}

/* --------------------------- BOOKING SHEET ----------------------------- */
function BookingSheet({ item, session, onClose, onIssued, onTriggerLogin }) {
  // step: detail -> form -> pay -> done

  const [step, setStep] = useState("detail");
  const [nama, setNama] = useState(session?.user?.nama || "");
  const [jumlah, setJumlah] = useState(2);
  const today = new Date().toISOString().slice(0, 10);
  const [tanggal, setTanggal] = useState(today);
  const [paying, setPaying] = useState(false);
  const [ticket, setTicket] = useState(null);

  const total = item.harga * jumlah;

  // Di dalam BookingSheet
  const handleBeliClick = () => {
    if (!session) {
      onTriggerLogin(item); // Panggil prop yang di-pass dari parent
    } else {
      setStep("form");
    }
  };

  const handlePay = () => {
    setPaying(true);
    // Simulasi pencatatan pemesanan (pembayaran offline / di lokasi)
    setTimeout(() => {
      const kode = genKode();
      const expiry = new Date(tanggal + "T23:59:59").toISOString();
      const t = {
        kode,
        objekId: item.id,
        objekNama: item.nama,
        lokasi: item.lokasi,
        kategori: item.kategori,
        img: item.img,
        namaPemesan: nama.trim() || session?.user?.nama || "Tamu",
        pemesanId: session?.user?.id || null,
        npwrd: session?.user?.npwrd || null,
        jumlahOrang: jumlah,
        hargaSatuan: item.harga,
        total,
        tanggalKunjungan: tanggal,
        createdAt: new Date().toISOString(),
        expiryDate: expiry,
        metode: "Tunai / Bayar di Lokasi",
        statusBayar: "Belum Dibayar",
        status: "active",
        used: false,
      };
      // simpan ke localStorage agar bisa di-scan & jadi riwayat
      try {
        const list = readTickets();
        list.push(t);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      } catch (e) {
        console.log("[v0] gagal simpan tiket:", e);
      }
      setTicket(t);
      setPaying(false);
      setStep("done");
      onIssued && onIssued();
    }, 1600);
  };

  const ticketQrData = ticket ? JSON.stringify(ticket) : "";

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ y: "100%", opacity: 0.6 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0.6 }}
        transition={spring}
        className="relative z-10 max-h-[92vh] w-full overflow-y-auto rounded-t-[2rem] border border-white/60 bg-white/80 p-1 backdrop-blur-2xl sm:max-w-md sm:rounded-[2rem]"
      >
        {/* grabber */}
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-[2rem] bg-white/60 px-4 pb-2 pt-3 backdrop-blur-xl">
          <div className="mx-auto h-1.5 w-12 rounded-full bg-slate-300 sm:hidden" />
          <button
            onClick={onClose}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-slate-200/80 text-slate-600 transition active:scale-90"
            aria-label="Tutup"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5 pb-8">
          <AnimatePresence mode="wait">
            {/* ----------------------- STEP: DETAIL ---------------------- */}
            {step === "detail" && (
              <motion.div
                key="detail"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={spring}
              >
                <div className="overflow-hidden rounded-3xl">
                  <img
                    src={item.img || "/placeholder.svg"}
                    alt={item.nama}
                    className="h-48 w-full object-cover"
                  />
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                  <MapPin className="h-4 w-4" /> {item.lokasi}
                  <span className="text-slate-300">&bull;</span>
                  <Clock className="h-4 w-4" /> {item.jam}
                </div>
                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  {item.nama}
                </h2>
                <div className="mt-1 flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-slate-700">
                    {item.rating}
                  </span>
                  <span className="text-slate-400">
                    &middot; {item.kategori}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {item.desc}
                </p>

                <Glass className="mt-4 flex items-center justify-between rounded-2xl p-4">
                  <div>
                    <p className="text-[11px] text-slate-400">
                      Harga tiket / orang
                    </p>
                    <p className="text-xl font-bold text-sky-600">
                      {RUPIAH(item.harga)}
                    </p>
                  </div>
                  <ShieldCheck className="h-7 w-7 text-emerald-500" />
                </Glass>

                <button
                  onClick={handleBeliClick}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-500 py-4 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition active:scale-[0.98]"
                >
                  Beli Tiket <ChevronRight className="h-4 w-4" />
                </button>
              </motion.div>
            )}

            {/* ------------------------ STEP: FORM ----------------------- */}
            {step === "form" && (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={spring}
              >
                <h2 className="mt-2 text-xl font-bold text-slate-900">
                  Detail Pemesanan
                </h2>
                <p className="text-sm text-slate-500">{item.nama}</p>

                <label className="mt-5 block text-xs font-medium text-slate-500">
                  Nama Pemesan
                </label>
                <div className="mt-1 flex items-center gap-2 rounded-2xl border border-white/60 bg-white/70 px-4 py-3 backdrop-blur">
                  <User className="h-4 w-4 text-slate-400" />
                  <input
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="cth. Budi Santoso"
                    className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                  />
                </div>

                <label className="mt-4 block text-xs font-medium text-slate-500">
                  Tanggal Kunjungan
                </label>
                <div className="mt-1 flex items-center gap-2 rounded-2xl border border-white/60 bg-white/70 px-4 py-3 backdrop-blur">
                  <CalendarDays className="h-4 w-4 text-slate-400" />
                  <input
                    type="date"
                    min={today}
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                    className="w-full bg-transparent text-sm text-slate-800 outline-none"
                  />
                </div>

                <label className="mt-4 block text-xs font-medium text-slate-500">
                  Jumlah Orang
                </label>
                <Glass className="mt-1 flex items-center justify-between rounded-2xl px-4 py-3">
                  <span className="text-sm text-slate-700">{jumlah} orang</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setJumlah((j) => Math.max(1, j - 1))}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-slate-700 transition active:scale-90"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-6 text-center text-base font-semibold text-slate-900">
                      {jumlah}
                    </span>
                    <button
                      onClick={() => setJumlah((j) => Math.min(20, j + 1))}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-500 text-white transition active:scale-90"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </Glass>

                <Glass className="mt-5 rounded-2xl p-4">
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>
                      {RUPIAH(item.harga)} &times; {jumlah}
                    </span>
                    <span>{RUPIAH(total)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between border-t border-slate-200/70 pt-2">
                    <span className="text-sm font-medium text-slate-700">
                      Total Bayar
                    </span>
                    <span className="text-xl font-bold text-slate-900">
                      {RUPIAH(total)}
                    </span>
                  </div>
                </Glass>

                <button
                  onClick={() => setStep("pay")}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-4 text-sm font-semibold text-white transition active:scale-[0.98]"
                >
                  <Wallet className="h-4 w-4" /> Lanjut ke Pembayaran
                </button>
                <button
                  onClick={() => setStep("detail")}
                  className="mt-2 w-full rounded-2xl py-2 text-sm font-medium text-slate-500"
                >
                  Kembali
                </button>
              </motion.div>
            )}

            {/* ------------------------ STEP: PAY ------------------------ */}
            {step === "pay" && (
              <motion.div
                key="pay"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={spring}
                className="text-center"
              >
                <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-600">
                  <Banknote className="h-3.5 w-3.5" /> Pembayaran di Lokasi
                </div>
                <h2 className="mt-3 text-xl font-bold text-slate-900">
                  Konfirmasi Pemesanan
                </h2>
                <p className="text-sm text-slate-500">
                  Pembayaran dilakukan secara tunai di loket obyek wisata
                </p>

                <Glass className="mx-auto mt-5 flex w-fit items-center justify-center rounded-3xl p-6">
                  <div className="relative flex h-[160px] w-[220px] flex-col items-center justify-center gap-2">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100">
                      <Store className="h-8 w-8 text-amber-500" />
                    </div>
                    <p className="text-sm font-semibold text-slate-700">
                      Bayar di Loket
                    </p>
                    <p className="text-center text-[11px] text-slate-400">
                      Tunjukkan e-tiket Anda kepada petugas saat tiba
                    </p>
                    {paying && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-white/80 backdrop-blur">
                        <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
                        <p className="mt-2 text-xs font-medium text-slate-600">
                          Menyimpan pesanan...
                        </p>
                      </div>
                    )}
                  </div>
                </Glass>

                <div className="mx-auto mt-5 max-w-xs rounded-2xl bg-slate-50 p-4 text-left">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Total Tagihan</span>
                    <span className="font-bold text-slate-900">
                      {RUPIAH(total)}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-sm">
                    <span className="text-slate-500">Tujuan</span>
                    <span className="font-medium text-slate-700">
                      {item.nama}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-sm">
                    <span className="text-slate-500">Metode</span>
                    <span className="font-medium text-slate-700">
                      Tunai di Lokasi
                    </span>
                  </div>
                </div>

                <button
                  onClick={handlePay}
                  disabled={paying}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-4 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition active:scale-[0.98] disabled:opacity-60"
                >
                  {paying ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Memproses...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" /> Konfirmasi Pesan
                      Tiket
                    </>
                  )}
                </button>
                <button
                  onClick={() => setStep("form")}
                  className="mt-2 w-full rounded-2xl py-2 text-sm font-medium text-slate-500"
                  disabled={paying}
                >
                  Kembali
                </button>
              </motion.div>
            )}

            {/* ------------------------ STEP: DONE ----------------------- */}
            {step === "done" && ticket && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={spring}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ ...spring, delay: 0.1 }}
                  className="mx-auto mt-2 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100"
                >
                  <CheckCircle2 className="h-9 w-9 text-emerald-500" />
                </motion.div>
                <h2 className="mt-3 text-center text-xl font-bold text-slate-900">
                  Pesanan Berhasil
                </h2>
                <p className="text-center text-sm text-slate-500">
                  E-Tiket Anda sudah terbit &middot; bayar di lokasi
                </p>

                {/* TICKET */}
                <div className="relative mt-5 overflow-hidden rounded-3xl border border-white/60 bg-white/80 shadow-xl backdrop-blur-xl">
                  <div className="flex items-center justify-between bg-sky-500 px-5 py-3 text-white">
                    <div className="flex items-center gap-2">
                      <TicketIcon className="h-5 w-5" />
                      <span className="text-sm font-semibold">
                        E-Tiket Wisata Jateng
                      </span>
                    </div>
                    <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-medium">
                      AKTIF
                    </span>
                  </div>

                  <div className="p-5">
                    <div className="flex gap-4">
                      <img
                        src={ticket.img || "/placeholder.svg"}
                        alt={ticket.objekNama}
                        className="h-20 w-20 rounded-2xl object-cover"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-base font-bold text-slate-900">
                          {ticket.objekNama}
                        </p>
                        <p className="text-xs text-slate-500">
                          {ticket.lokasi}
                        </p>
                        <p className="mt-1 text-[11px] text-slate-400">
                          ID: {ticket.objekId}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <Info label="Pemesan" value={ticket.namaPemesan} />
                      <Info
                        label="Jumlah"
                        value={`${ticket.jumlahOrang} orang`}
                      />
                      <Info label="Tanggal" value={ticket.tanggalKunjungan} />
                      <Info label="Total" value={RUPIAH(ticket.total)} />
                    </div>
                  </div>

                  {/* perforation */}
                  <div className="relative flex items-center">
                    <div className="h-5 w-5 -translate-x-2.5 rounded-full bg-slate-900/10" />
                    <div className="flex-1 border-t-2 border-dashed border-slate-200" />
                    <div className="h-5 w-5 translate-x-2.5 rounded-full bg-slate-900/10" />
                  </div>

                  <div className="flex flex-col items-center px-5 pb-6 pt-3">
                    <p className="text-[11px] text-slate-400">
                      Pindai QR ini di pintu masuk
                    </p>
                    <div className="mt-3 rounded-2xl bg-white p-3 shadow-inner">
                      <img
                        src={qrSrc(ticketQrData, 220) || "/placeholder.svg"}
                        alt="QR Tiket"
                        className="h-44 w-44"
                      />
                    </div>
                    <p className="mt-3 font-mono text-sm font-semibold tracking-wider text-slate-700">
                      {ticket.kode}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      Berlaku sampai {ticket.tanggalKunjungan} 23:59
                    </p>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-4 text-sm font-semibold text-white transition active:scale-[0.98]"
                >
                  <Download className="h-4 w-4" /> Selesai &amp; Simpan Tiket
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-2">
      <p className="text-[11px] text-slate-400">{label}</p>
      <p className="truncate font-semibold text-slate-800">{value}</p>
    </div>
  );
}

/* --------------------- SWEETALERT: LOGIN REQUIRED ---------------------- */
function LoginAlert({ onLogin, onCancel }) {
  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onCancel}
      />
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 10 }}
        transition={{ type: "spring", stiffness: 360, damping: 26 }}
        className="relative z-10 w-full max-w-sm rounded-[2rem] border border-white/60 bg-white/90 p-7 text-center shadow-2xl backdrop-blur-2xl"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 320,
            damping: 18,
            delay: 0.08,
          }}
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-100"
        >
          <Lock className="h-9 w-9 text-amber-500" />
        </motion.div>
        <h3 className="mt-5 text-xl font-bold text-slate-900">
          Login Diperlukan
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          Anda harus masuk terlebih dahulu untuk melakukan pemesanan tiket
          wisata.
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <button
            onClick={onLogin}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition active:scale-[0.98]"
          >
            <LogIn className="h-4 w-4" /> Login Sekarang
          </button>
          <button
            onClick={onCancel}
            className="w-full rounded-2xl bg-slate-100 py-3.5 text-sm font-medium text-slate-600 transition active:scale-[0.98]"
          >
            Batal
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ----------------------- RIWAYAT PEMESANAN ----------------------------- */
function HistorySheet({ session, onClose }) {
  const list = useMemo(() => {
    const all = readTickets();
    const mine = session?.user?.id
      ? all.filter((t) => t.pemesanId === session.user.id)
      : all;
    return [...mine].reverse();
  }, [session]);

  const statusBadge = (t) => {
    if (t.used) return { txt: "Terpakai", cls: "bg-slate-200 text-slate-600" };
    if (new Date(t.expiryDate) < new Date())
      return { txt: "Hangus", cls: "bg-rose-100 text-rose-600" };
    return { txt: "Aktif", cls: "bg-emerald-100 text-emerald-600" };
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ y: "100%", opacity: 0.6 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0.6 }}
        transition={spring}
        className="relative z-10 max-h-[88vh] w-full overflow-y-auto rounded-t-[2rem] border border-white/60 bg-white/85 backdrop-blur-2xl sm:max-w-md sm:rounded-[2rem]"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between bg-white/70 px-5 pb-3 pt-4 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-sky-500" />
            <h2 className="text-lg font-bold text-slate-900">
              Riwayat Pemesanan
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200/80 text-slate-600 transition active:scale-90"
            aria-label="Tutup"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5 pb-8">
          {list.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <TicketIcon className="mx-auto h-10 w-10" />
              <p className="mt-3 text-sm">Belum ada pemesanan tiket.</p>
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              {list.map((t, i) => {
                const b = statusBadge(t);
                return (
                  <motion.div
                    key={t.kode}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...spring, delay: i * 0.04 }}
                  >
                    <Glass className="flex gap-3 rounded-2xl p-3">
                      <img
                        src={t.img || "/placeholder.svg"}
                        alt={t.objekNama}
                        className="h-16 w-16 shrink-0 rounded-xl object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {t.objekNama}
                          </p>
                          <span
                            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${b.cls}`}
                          >
                            {b.txt}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">{t.lokasi}</p>
                        <div className="mt-1.5 flex items-center justify-between text-xs">
                          <span className="text-slate-500">
                            {t.tanggalKunjungan} &middot; {t.jumlahOrang} org
                          </span>
                          <span className="font-bold text-sky-600">
                            {RUPIAH(t.total)}
                          </span>
                        </div>
                        <p className="mt-1 font-mono text-[10px] tracking-wider text-slate-400">
                          {t.kode}
                        </p>
                      </div>
                    </Glass>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------ MAIN ----------------------------------- */
export default function Ticket() {
  const [query, setQuery] = useState("");
  const [lokasi, setLokasi] = useState("Semua Lokasi");
  const [kategori, setKategori] = useState("Semua");
  const [showFilter, setShowFilter] = useState(false);
  const [selected, setSelected] = useState(null);
  const [issuedCount, setIssuedCount] = useState(0);
  const [session, setSession] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [pendingItem, setPendingItem] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setSession(readSession());
    setIssuedCount(readTickets().length);
  }, []);

  // Klik "Pesan": wajib login dulu
  const handleSelect = (item) => {
    setSelected(item);
  };

  // Tombol login pada SweetAlert — arahkan ke halaman login.
  // Untuk demo: jika belum ada sesi, buat sesi dummy lalu lanjutkan pesanan.
  const handleLogin = () => {
    window.location.href = "/login";
  };

  const lokasiList = useMemo(
    () => [
      "Semua Lokasi",
      ...Array.from(new Set(DESTINASI.map((d) => d.lokasi))),
    ],
    [],
  );

  const filtered = useMemo(() => {
    return DESTINASI.filter((d) => {
      const okQuery =
        d.nama.toLowerCase().includes(query.toLowerCase()) ||
        d.lokasi.toLowerCase().includes(query.toLowerCase());
      const okLokasi = lokasi === "Semua Lokasi" || d.lokasi === lokasi;
      const okKategori = kategori === "Semua" || d.kategori === kategori;
      return okQuery && okLokasi && okKategori;
    });
  }, [query, lokasi, kategori]);

  const triggerLogin = (item) => {
    setPendingItem(item);
    setShowLogin(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-white text-slate-900">
      <Header />

      <main className="mx-auto max-w-5xl px-4 pb-16 pt-6 mt-20">
        <button
          onClick={() => navigate("/")}
          className=" top-4 left-4 mb-2 flex items-center gap-1.5 py-2 px-4 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-md transition-all active:scale-95 shadow-xl border border-white/10"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-medium text-sm">Kembali</span>
        </button>
        {/* HERO */}
        <Glass className="overflow-hidden rounded-[2rem] p-6 sm:p-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-600">
            <Sparkles className="h-3.5 w-3.5" /> Jelajah Jawa Tengah
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Pesan Tiket Wisata Jawa Tengah
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600">
            Temukan destinasi terbaik Jawa Tengah dan pesan e-tiket dalam
            hitungan detik. Pembayaran{" "}
            <span className="font-semibold text-slate-800">
              tunai di lokasi
            </span>{" "}
            untuk saat ini.
          </p>

          {/* SEARCH */}
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <div className="flex flex-1 items-center gap-2 rounded-2xl border border-white/60 bg-white/80 px-4 py-3 backdrop-blur">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari obyek wisata atau kota..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>
            <button
              onClick={() => setShowFilter((s) => !s)}
              className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition active:scale-95 ${
                showFilter
                  ? "bg-sky-500 text-white"
                  : "bg-white/80 text-slate-700 border border-white/60"
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" /> Filter
            </button>
            <button
              onClick={() => setShowHistory(true)}
              className="flex items-center justify-center gap-2 rounded-2xl border border-white/60 bg-white/80 px-4 py-3 text-sm font-medium text-slate-700 transition active:scale-95"
            >
              <History className="h-4 w-4" /> Riwayat
            </button>
          </div>

          {/* FILTER PANEL */}
          <AnimatePresence>
            {showFilter && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={spring}
                className="overflow-hidden"
              >
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="mb-2 text-xs font-medium text-slate-500">
                      Lokasi
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {lokasiList.map((l) => (
                        <Chip
                          key={l}
                          active={lokasi === l}
                          onClick={() => setLokasi(l)}
                          icon={<MapPin className="h-3 w-3" />}
                        >
                          {l}
                        </Chip>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-medium text-slate-500">
                      Kategori
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {KATEGORI.map((k) => (
                        <Chip
                          key={k}
                          active={kategori === k}
                          onClick={() => setKategori(k)}
                        >
                          {k}
                        </Chip>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Glass>

        {/* QUICK LOCATION ROW */}
        <div className="mt-5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          {lokasiList.map((l) => (
            <Chip
              key={l}
              active={lokasi === l}
              onClick={() => setLokasi(l)}
              icon={<MapPin className="h-3 w-3" />}
            >
              {l}
            </Chip>
          ))}
        </div>

        {/* RESULTS */}
        <div className="mt-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            {filtered.length} Destinasi
          </h2>
          {issuedCount > 0 && (
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
              {issuedCount} tiket terbit
            </span>
          )}
        </div>

        <motion.div
          layout
          className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => (
              <DestinationCard
                key={item.id}
                item={item}
                index={i}
                onSelect={handleSelect}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div className="mt-12 text-center text-slate-400">
            <MapPin className="mx-auto h-10 w-10" />
            <p className="mt-2 text-sm">Tidak ada destinasi yang cocok.</p>
          </div>
        )}
      </main>

      <Footer />

      <AnimatePresence>
        {selected && (
          <BookingSheet
            item={selected}
            session={session}
            onClose={() => setSelected(null)}
            onIssued={() => setIssuedCount((c) => c + 1)}
            onTriggerLogin={triggerLogin} // <--- Tambahkan ini
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLogin && (
          <LoginAlert
            onLogin={handleLogin}
            onCancel={() => {
              setShowLogin(false);
              setPendingItem(null);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showHistory && (
          <HistorySheet
            session={session}
            onClose={() => setShowHistory(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function Chip({ active, onClick, children, icon }) {
  return (
    <button
      onClick={onClick}
      className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2 text-xs font-medium transition active:scale-95 ${
        active
          ? "bg-sky-500 text-white shadow-md shadow-sky-500/30"
          : "border border-white/60 bg-white/70 text-slate-600 backdrop-blur hover:bg-white"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}
