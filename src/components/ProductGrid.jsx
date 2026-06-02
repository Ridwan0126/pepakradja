import { useState, useEffect } from "react";
import { Star, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { retributiAPI_Endpoints } from "../services/api";
import SkeletonLoader from "./SkeletonLoader";
import logoApp from "/images/logopepakraja.png"; // 🔥 ganti sesuai path logo kamu

export default function ProductGrid({ filters = {}, searchTerm = "" }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [totalItems, setTotalItems] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setProducts([]);
    setCurrentPage(1);
    setHasMore(true);
    fetchProducts(1, false);
  }, [JSON.stringify(filters), searchTerm, itemsPerPage]);

  const fetchProducts = async (page, append = false) => {
    try {
      append ? setLoadingMore(true) : setLoading(true);

      const filterParams = {
        search: searchTerm || filters.search || "",
      };

      if (filters.city) filterParams.city = filters.city;
      if (filters.manager) filterParams.manager = filters.manager;
      if (filters.serviceType) filterParams.serviceType = filters.serviceType;

      const response = await retributiAPI_Endpoints.getProducts(
        page,
        itemsPerPage,
        filterParams,
      );

      if (response.data.success) {
        const newProducts =
          response.data.data?.data || response.data.data || [];

        const updated = append ? [...products, ...newProducts] : newProducts;

        setProducts(updated);

        const total = response.data.data.total || updated.length;
        setTotalItems(total);

        setHasMore(newProducts.length === itemsPerPage);
      }
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
  const showLoadMore = hasMore;

  return (
    <div className="w-full">
      {/* INFO */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-gray-600">
          Menampilkan <b>{displayedCount}</b> dari <b>{totalItems}</b> produk
        </p>

        <select
          value={itemsPerPage}
          onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
          className="px-3 py-2 border rounded-lg"
        >
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {[...Array(10)].map((_, i) => (
            <SkeletonLoader key={i} />
          ))}
        </div>
      ) : products.length > 0 ? (
        <>
          {/* GRID */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 items-stretch">
            {products.map((product, idx) => {
              const isFallback = !product.foto;

              return (
                <motion.div
                  key={product.id || idx}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link
                    to={`/products/${product.id}`}
                    className={`group flex flex-col h-full rounded-2xl overflow-hidden
backdrop-blur border transition-all duration-300
${
  product.is_laku
    ? "bg-gray-50 border-red-200"
    : "bg-white/70 border-gray-200 hover:shadow-2xl hover:-translate-y-1"
}`}
                  >
                    {/* IMAGE */}
                    <div className="relative h-44 bg-gray-100 flex items-center justify-center">
                      {/* STATUS */}
                      <div className="absolute top-3 left-3 z-10">
                        {product.is_laku ? (
                          <span className="px-3 py-1 rounded-full bg-red-600 text-white text-xs font-semibold shadow-lg">
                            Sudah Disewa
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full bg-green-600 text-white text-xs font-semibold shadow-lg">
                            Tersedia
                          </span>
                        )}
                      </div>
                      <img
                        src={isFallback ? logoApp : product.foto}
                        alt={product.obyek_retribusi}
                        className={
                          isFallback
                            ? "max-h-24 object-contain opacity-80"
                            : "w-full h-full object-cover group-hover:scale-110"
                        }
                        onError={(e) => (e.target.src = logoApp)}
                      />

                      {product.is_laku && (
                        <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                          <span className="bg-red-600 text-white px-4 py-2 rounded-xl font-bold">
                            TERSEWA
                          </span>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>

                    {/* CONTENT */}
                    <div className="p-3 flex flex-col flex-1">
                      <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-600">
                        {product.obyek_retribusi}
                      </h3>

                      <div className="flex items-start gap-1 mt-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <p className="text-xs text-gray-500 line-clamp-2">
                          {product.alamat || product.kecamatan?.kecamatan}
                        </p>
                      </div>

                      <div className="mt-3 border-t pt-2">
                        <p className="text-xs text-gray-400">Tarif</p>
                        <p className="text-blue-600 font-bold">
                          Rp{" "}
                          {parseInt(
                            product.tariftbl?.tarif || 0,
                          ).toLocaleString("id-ID")}
                        </p>
                      </div>

                      <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                        <span className="truncate">{product.opd?.nama}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* LOAD MORE */}
          {showLoadMore && (
            <div className="flex justify-center mt-10">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="px-8 py-3 rounded-2xl text-white font-semibold 
                bg-gradient-to-r from-blue-600 to-indigo-600 
                hover:shadow-xl transition-all"
              >
                {loadingMore ? "Memuat..." : "Tampilkan Lebih Banyak"}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 text-gray-500">
          Tidak ada produk ditemukan
        </div>
      )}
    </div>
  );
}
