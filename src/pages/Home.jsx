import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Carousel from "../components/Carousel";
import QuickServices from "../components/QuickServices";
import ProductFilter from "../components/ProductFilter";
import ProductGrid from "../components/ProductGrid";

export default function Home() {
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const slides = [
    {
      badge: "Layanan Digital",
      title: "PEPAKRAJA",
      description:
        "Platform digital untuk pengelolaan retribusi daerah yang modern dan terintegrasi.",
      cta: "Pelajari",
      backgroundImage: "/images/banner-01.png",
      image: "/images/hero1.png",
    },
    {
      badge: "Retribusi Online",
      title: "Mudah & Cepat",
      description: "Lakukan pembayaran dan monitoring retribusi kapan saja.",
      cta: "Mulai Sekarang",
      backgroundImage: "/images/banner-02.png",
      image: "/images/hero2.png",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <Header />

      {/* Carousel Slider - Added extra padding to account for floating navbar */}
      <section className="pt-36 md:pt-40 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <Carousel slides={slides} />
        </div>
      </section>

      {/* Products Section with 2-Column Layout */}
      <section className="py-8 md:py-10 px-4 bg-slate-50/50">
        <div className="max-w-7xl mx-auto">
          {/* Section Title */}
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 animate-slide-in-down">
              Jelajahi Produk & Layanan
            </h2>
            <p
              className="text-sm md:text-base text-slate-500"
              style={{ animationDelay: "100ms" }}
            >
              Temukan semua kebutuhan pajak dan retribusi Anda di satu tempat
            </p>
          </div>

          {/* 2-Column Layout: Quick Services + Filter */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <QuickServices />

            <ProductFilter
              onFilterChange={setFilters}
              onSearch={setSearchTerm}
            />
          </div>

          {/* Product Grid - Full Width */}
          <ProductGrid filters={filters} searchTerm={searchTerm} />
        </div>
      </section>

      <Footer />
    </div>
  );
}
