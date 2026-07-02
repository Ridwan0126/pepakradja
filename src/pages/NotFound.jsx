import Header from "../components/Header";
import Footer from "../components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex flex-col justify-between">
      {/* Header / Navbar tetap di atas */}
      <Header />

      {/* Kontainer Video dengan jarak (pt-20) agar tidak tertutup navbar */}
      {/* Sesuaikan pt-20 (80px) dengan tinggi asli navbar Anda jika masih kurang */}
      <div className="flex-1 flex items-center justify-center p-4 pt-20 md:pt-24">
        <div className="w-full max-w-4xl aspect-video rounded-xl overflow-hidden shadow-2xl">
          <video
            className="w-full h-full object-cover"
            src="/images/404.mp4"
            autoPlay
            loop
            muted
            playsInline
            controls // Tambahkan ini jika ingin user bisa play/pause
          >
            Browser Anda tidak mendukung tag video.
          </video>
        </div>
      </div>

      {/* Footer tetap di bawah */}
      <Footer />
    </div>
  );
}
