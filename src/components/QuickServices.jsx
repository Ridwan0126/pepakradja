import {
  FileText,
  Download,
  Receipt,
  Flag,
  Users,
  AlertCircle,
  ArrowUpRight,
} from "lucide-react";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";

export default function QuickServices() {
  const navigate = useNavigate();

  const session = JSON.parse(localStorage.getItem("wr_session") || "{}");

  const isLoggedIn =
    session?.isLoggedIn === true && session?.expiredAt > Date.now();

  const handleServiceClick = (service, e) => {
    if (service.requireLogin && !isLoggedIn) {
      e.preventDefault();

      Swal.fire({
        icon: "warning",
        title: "Login Diperlukan",
        text: "Silakan login terlebih dahulu untuk mengakses layanan ini.",
        confirmButtonText: "Login",
        showCancelButton: true,
        cancelButtonText: "Batal",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
    }
  };

  const services = [
    {
      id: 2,
      icon: Download,
      title: "Bukti Bayar",
      count: "5000+",
      color: "from-violet-500 to-purple-500",
      status: "active",
      link: "/transactions",
    },
    {
      id: 3,
      icon: Receipt,
      title: "SPTRD",
      count: "Tersedia",
      color: "from-pink-500 to-rose-500",
      status: "active",
      link: "/sptrd",
      requireLogin: true,
    },
    {
      id: 4,
      icon: Flag,
      title: "SKPD/SKRD",
      count: "Tersedia",
      color: "from-emerald-500 to-green-500",
      status: "active",
      link: "/skrd",
      requireLogin: true,
    },
    {
      id: 5,
      icon: Users,
      title: "PAP",
      count: "Soon",
      color: "from-orange-500 to-amber-500",
      status: "coming",
      link: "#",
    },
    {
      id: 6,
      icon: AlertCircle,
      title: "NPWPD",
      count: "Soon",
      color: "from-red-500 to-pink-500",
      status: "coming",
      link: "#",
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        {services.map((service) => {
          const Icon = service.icon;
          const isActive = service.status === "active";

          return (
            <Link
              key={service.id}
              to={service.link}
              onClick={(e) => handleServiceClick(service, e)}
              className={`
    relative
    overflow-hidden
    rounded-2xl
    border border-slate-200/80
    bg-white/80
    backdrop-blur-xl
    p-3
    transition-all duration-300
    hover:shadow-lg
    hover:-translate-y-0.5
  `}
            >
              <div
                className={`
      absolute inset-0 opacity-[0.03]
      bg-gradient-to-br ${service.color}
    `}
              />

              <div className="relative flex items-center gap-3">
                {/* Icon */}
                <div
                  className={`
        flex-shrink-0
        w-9 h-9
        rounded-xl
        bg-gradient-to-br ${service.color}
        flex items-center justify-center
      `}
                >
                  <Icon className="w-4 h-4 text-white" />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-slate-800 truncate">
                    {service.title}
                  </h4>

                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className={`text-[11px] ${
                        isActive ? "text-slate-500" : "text-orange-500"
                      }`}
                    >
                      {service.count}
                    </span>

                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        isActive ? "bg-emerald-500" : "bg-orange-400"
                      }`}
                    />
                  </div>
                </div>

                {isActive && (
                  <ArrowUpRight className="w-4 h-4 text-slate-400" />
                )}
                {service.requireLogin && !isLoggedIn && (
                  <div className="absolute top-2 right-2 px-2">
                    <Lock className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
