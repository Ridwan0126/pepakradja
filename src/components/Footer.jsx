import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  Phone,
  MapPin,
  Send,
} from "lucide-react";

export default function Footer() {
  const socials = [Facebook, Twitter, Linkedin, Instagram];

  return (
    <>
      <footer className="relative overflow-hidden bg-[#020817] text-white">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />

          <div
            className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />

          <div
            className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-3xl"
            style={{
              animation: "float 8s ease-in-out infinite",
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          {/* Footer Main */}
          <div className="grid pt-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16">
            {/* Brand */}
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center gap-4 mb-6 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-cyan-500/30 blur-xl rounded-full group-hover:scale-125 transition-all duration-500" />

                  <img
                    src="/images/logopepakraja.png"
                    alt="PEPAK RAJA"
                    className="relative w-16 h-16 object-contain group-hover:scale-110 transition-all duration-500"
                  />
                </div>

                <div>
                  <h2 className="font-black text-2xl bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    PEPAK RADJA
                  </h2>

                  <p className="text-slate-400 text-sm">
                    Marketplace Retribusi Daerah
                  </p>
                </div>
              </Link>

              <p className="text-slate-400 leading-relaxed mb-6 max-w-md">
                Platform digital layanan retribusi daerah yang memberikan
                kemudahan, transparansi, dan keamanan dalam proses pembayaran
                serta pengelolaan retribusi secara modern.
              </p>

              {/* Social */}
              <div className="flex gap-3">
                {socials.map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="
                      w-12 h-12
                      rounded-2xl
                      bg-white/5
                      border border-white/10
                      backdrop-blur-xl
                      hover:bg-cyan-500/20
                      hover:border-cyan-400
                      hover:-translate-y-2
                      transition-all
                      duration-500
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Menu */}
            <div>
              <h3 className="font-bold text-lg mb-5">Menu Utama</h3>

              <ul className="space-y-4">
                {[
                  { label: "Beranda", href: "/" },
                  { label: "Katalog", href: "/products" },
                  { label: "Keranjang", href: "/cart" },
                  { label: "Tentang Kami", href: "#" },
                ].map((item, i) => (
                  <li key={i}>
                    <Link
                      to={item.href}
                      className="group text-slate-400 hover:text-cyan-400 transition-all duration-300"
                    >
                      <span className="relative">
                        {item.label}
                        <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-cyan-400 group-hover:w-full transition-all duration-500" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Layanan */}
            <div>
              <h3 className="font-bold text-lg mb-5">Layanan</h3>

              <ul className="space-y-4">
                {[
                  "Retribusi Jasa Umum",
                  "Retribusi Jasa Usaha",
                  "Perizinan Tertentu",
                  "Konsultasi Layanan",
                ].map((item, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="group text-slate-400 hover:text-cyan-400 transition-all duration-300"
                    >
                      <span className="relative">
                        {item}
                        <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-cyan-400 group-hover:w-full transition-all duration-500" />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-bold text-lg mb-5">Kontak</h3>

              <div className="space-y-5">
                <div className="flex gap-3">
                  <Phone className="w-5 h-5 text-cyan-400 mt-1" />
                  <div>
                    <p className="text-slate-500 text-sm">Telepon</p>
                    <p>+62 xxx xxxx xxxx</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Mail className="w-5 h-5 text-cyan-400 mt-1" />
                  <div>
                    <p className="text-slate-500 text-sm">Email</p>
                    <p>support@pepakraja.com</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <MapPin className="w-5 h-5 text-cyan-400 mt-1" />
                  <div>
                    <p className="text-slate-500 text-sm">Alamat</p>
                    <p>Semarang, Jawa Tengah</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
          </div>

          {/* Bottom */}
          <div className="py-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm text-center md:text-left">
              © {new Date().getFullYear()} PEPAK RADJA. Seluruh Hak Cipta
              Dilindungi.
            </p>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
              <a href="#" className="hover:text-cyan-400 transition-colors">
                Kebijakan Privasi
              </a>

              <a href="#" className="hover:text-cyan-400 transition-colors">
                Syarat & Ketentuan
              </a>

              <a href="#" className="hover:text-cyan-400 transition-colors">
                Peta Situs
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating */}
      <div className="fixed bottom-6 right-6 z-50">
        <a
          href="https://wa.me/6285642312609"
          target="_blank"
          rel="noopener noreferrer"
          className="block hover:scale-110 transition-transform duration-300"
        >
          <img
            src="/images/logopepakraja.png"
            alt="PEPAK RAJA"
            className="w-16 h-16 object-contain floating-logo"
          />
        </a>
      </div>

      <style>{`
        @keyframes float {
          0%,100% {
            transform: translate(-50%, -50%) translateY(0px);
          }
          50% {
            transform: translate(-50%, -50%) translateY(-30px);
          }
        }
          @keyframes floating {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
}

.floating-logo {
  animation: floating 3s ease-in-out infinite;
}
      `}</style>
    </>
  );
}
