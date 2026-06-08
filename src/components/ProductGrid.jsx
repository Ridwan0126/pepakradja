import { useState, useEffect } from "react";
import { Star, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { retributiAPI_Endpoints } from "../services/api";
import SkeletonLoader from "./SkeletonLoader";
import logoApp from "/images/logopepakraja.png";

export default function ProductGrid({ filters = {}, searchTerm = "" }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [totalItems, setTotalItems] = useState(500);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setProducts([]);
    setCurrentPage(1);
    setHasMore(true);
    fetchProducts(1, false);
  }, [JSON.stringify(filters), searchTerm, itemsPerPage]);

  // const fetchProducts = async (page, append = false) => {
  //   try {
  //     append ? setLoadingMore(true) : setLoading(true);

  //     const filterParams = {
  //       search: searchTerm || filters.search || "",
  //       limit: itemsPerPage, // Menambahkan limit berdasarkan state
  //     };
  //     // Pastikan filterParams bersih
  //     if (filters.city) filterParams.city = String(filters.city);
  //     if (filters.manager) filterParams.manager = String(filters.manager);

  //     // KIRIM ID LENGKAP:
  //     // Jika Anda memilih "02.21", ini akan mengirim "02.21" bukan "02"
  //     if (filters.serviceType) {
  //       filterParams.id_jenis_retribusi = filters.serviceType;
  //     }

  //     const response = await retributiAPI_Endpoints.getProducts(
  //       page,
  //       itemsPerPage,
  //       filterParams,
  //     );
  //     const payload = response.data || response;
  //     let rawProducts = payload.data || payload.products || [];
  //     console.log("Contoh 1 produk pertama dari API:", rawProducts[0]);
  //     if (filters.serviceType) {
  //       rawProducts = rawProducts.filter((product) => {
  //         // Log ini membantu Anda melihat ID apa yang dibandingkan
  //         // console.log("Cek:", product.jenis?.id, "vs", filters.serviceType);
  //         return String(product.jenis?.id) === String(filters.serviceType);
  //       });
  //     }

  //     // Filter status
  //     if (filters.is_laku !== undefined && filters.is_laku !== "") {
  //       const targetStatus = filters.is_laku === true;
  //       rawProducts = rawProducts.filter(
  //         (product) => Boolean(product.is_laku) === targetStatus,
  //       );
  //     }

  //     const updated = append ? [...products, ...rawProducts] : rawProducts;
  //     setProducts(updated);

  //     setTotalItems(payload.total_row || payload.total || rawProducts.length);
  //     setHasMore(updated.length < (payload.total_row || 0));
  //   } catch (err) {
  //     console.error(err);
  //     setProducts(append ? products : []);
  //   } finally {
  //     setLoading(false);
  //     setLoadingMore(false);
  //   }
  // };

  const fetchProducts = async (page, append = false) => {
    try {
      append ? setLoadingMore(true) : setLoading(true);

      const filterParams = {
        search: searchTerm || filters.search || "",
        limit: 500, // Ambil batch besar agar filter client-side punya banyak bahan
      };

      if (filters.city) filterParams.city = String(filters.city);
      if (filters.manager) filterParams.manager = String(filters.manager);
      if (filters.serviceType)
        filterParams.id_jenis_retribusi = filters.serviceType;

      const response = await retributiAPI_Endpoints.getProducts(
        page,
        20,
        filterParams,
      );
      const payload = response.data || response;
      let rawProducts = payload.data || payload.products || [];

      // Filter Manual
      if (filters.serviceType) {
        rawProducts = rawProducts.filter(
          (product) =>
            String(product.jenis?.id).trim() ===
            String(filters.serviceType).trim(),
        );
      }

      if (filters.is_laku !== undefined && filters.is_laku !== "") {
        const targetStatus = filters.is_laku === true;
        rawProducts = rawProducts.filter(
          (product) => Boolean(product.is_laku) === targetStatus,
        );
      }

      // LOGIKA REKURSI OTOMATIS:
      // Jika data hasil filter < 20 dan masih ada halaman berikutnya, ambil lagi!
      if (rawProducts.length < 20 && payload.current_page < payload.last_page) {
        // Panggil kembali fungsi ini untuk halaman berikutnya
        return fetchProducts(page + 1, append, rawProducts);
      }

      const updated = append ? [...products, ...rawProducts] : rawProducts;
      setProducts(updated);

      setTotalItems(payload.total_row || 0);
      setHasMore(updated.length < (payload.total_row || 0));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    const next = currentPage + 1;
    setCurrentPage(next);
    fetchProducts(next, true);
  };

  const displayedCount = products.length;

  // Perbaikan utama: Mendeklarasikan kembali variabel showLoadMore sebelum return JSX
  const showLoadMore = hasMore;

  return (
    <div className="w-full">
      {/* INFO PANEL */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-slate-500 font-medium">
          Menampilkan{" "}
          <span className="font-semibold text-slate-900">{displayedCount}</span>{" "}
          dari{" "}
          <span className="font-semibold text-slate-900">{totalItems}</span>{" "}
          produk
        </p>

        {/* SELECT BOX */}
        <select
          value={itemsPerPage}
          onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
          className="px-4 py-2 text-xs font-semibold border border-slate-200 rounded-full bg-white text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all cursor-pointer"
        >
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>

      {/* LOADING STATE */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {[...Array(10)].map((_, i) => (
            <SkeletonLoader key={i} className="rounded-[20px]" />
          ))}
        </div>
      ) : products.length > 0 ? (
        <>
          {/* PRODUCT GRID CONTAINER */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 items-stretch">
            {products.map((product, idx) => {
              const isFallback = !product.foto;

              return (
                <motion.div
                  key={product.id || idx}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -6 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 22,
                    delay: idx * 0.01,
                  }}
                  className="h-full"
                >
                  <Link
                    to={`/products/${product.id}`}
                    className={`group flex flex-col h-full rounded-[20px] overflow-hidden border bg-white shadow-[0_4px_16px_rgba(0,0,0,0.02)] transition-all duration-300 ${
                      product.is_laku
                        ? "border-slate-100 hover:border-red-500 hover:shadow-xl hover:shadow-red-500/10"
                        : "border-slate-100 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/10"
                    }`}
                  >
                    {/* AREA MEDIA FOTO */}
                    <div className="relative h-44 bg-slate-100/80 flex items-center justify-center overflow-hidden border-b border-slate-100">
                      <div className="absolute top-3 left-3 z-10">
                        {product.is_laku ? (
                          <span className="px-2.5 py-1 rounded-full bg-red-500 text-white text-[9px] font-bold uppercase tracking-wider shadow-sm">
                            Tersewa
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[9px] font-bold uppercase tracking-wider shadow-sm">
                            Tersedia
                          </span>
                        )}
                      </div>

                      <img
                        src={isFallback ? logoApp : product.foto}
                        alt={product.obyek_retribusi}
                        className={
                          isFallback
                            ? "max-h-20 object-contain opacity-40 transition-transform duration-500 ease-out group-hover:scale-105"
                            : "w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        }
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = logoApp;
                        }}
                      />

                      {/* BLUR OVERLAY JIKA TERSEWA */}
                      {product.is_laku && (
                        <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[1px] flex items-center justify-center">
                          <span className="bg-red-500 text-white px-3 py-1.5 rounded-full text-[11px] font-extrabold shadow-md tracking-wide">
                            TERSEWA
                          </span>
                        </div>
                      )}
                    </div>

                    {/* DETAIL KONTEN */}
                    <div className="p-4 flex flex-col flex-1 bg-white">
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1.5 block">
                        {product.jenis?.jenis_retribusi || "Retribusi"}
                      </span>

                      <h3 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors duration-200">
                        {product.obyek_retribusi}
                      </h3>

                      <div className="flex items-start gap-1 mt-3 flex-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                        <p className="text-[11px] text-slate-500 line-clamp-2 font-medium leading-relaxed">
                          {product.alamat ||
                            product.kecamatan?.kecamatan ||
                            "-"}
                        </p>
                      </div>

                      <div className="mt-4 border-t border-slate-100 pt-3">
                        <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-0.5">
                          Tarif Sewa
                        </p>
                        <p className="text-slate-900 font-black text-sm sm:text-base group-hover:text-blue-600 transition-colors duration-200">
                          Rp{" "}
                          {parseInt(
                            product.tariftbl?.tarif || 0,
                          ).toLocaleString("id-ID")}
                        </p>
                      </div>

                      <div className="flex justify-between items-center mt-3 text-[10px] text-slate-400 border-t border-slate-50 pt-2 font-medium truncate tracking-wide">
                        <span className="truncate">
                          {product.opd?.nama || "-"}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* TOMBOL LOAD MORE */}
          {showLoadMore && (
            <div className="flex justify-center mt-12">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="px-10 py-3.5 rounded-full text-white font-semibold text-sm
                bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700
                shadow-[0_4px_12px_rgba(37,99,235,0.2)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.3)] 
                hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                {loadingMore ? "Memuat..." : "Tampilkan Lebih Banyak"}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 text-slate-400 font-medium text-sm tracking-wide">
          Tidak ada produk ditemukan
        </div>
      )}
    </div>
  );
}
