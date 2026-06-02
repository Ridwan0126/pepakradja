import { Search, Sliders, X } from "lucide-react";
import { useState } from "react";
import { useFilterData } from "../hooks/useFilterData";

export default function ProductFilter({ onFilterChange, onSearch }) {
  const [activeTab, setActiveTab] = useState("obyek");
  const [filters, setFilters] = useState({
    search: "",
    city: "",
    manager: "",
    serviceType: "",
  });
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const { cities, managers, services, loading } = useFilterData();

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleSearch = (value) => {
    handleFilterChange("search", value);
    onSearch?.(value);
  };

  const handleReset = () => {
    const emptyFilters = {
      search: "",
      city: "",
      manager: "",
      serviceType: "",
    };
    setFilters(emptyFilters);
    // Ensure parent is notified of reset
    setTimeout(() => {
      onFilterChange?.(emptyFilters);
    }, 0);
  };

  const tabs = [
    { id: "obyek", label: "Obyek", color: "emerald" },
    { id: "bukti", label: "Bukti Bayar", color: "amber" },
  ];
  const selectClass = `
w-full
h-10
px-3
rounded-xl
bg-slate-100
border
border-slate-200
text-sm
focus:outline-none
focus:ring-2
focus:ring-blue-400
focus:border-blue-400
transition-all
`;

  const FilterContent = () => (
    <div className="space-y-3">
      {/* Filters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        {/* Location */}
        <div>
          <label className="flex items-center text-xs font-semibold text-gray-700 mb-2">
            Lokasi ({managers.length})
          </label>
          <select
            value={filters.city}
            onChange={(e) => handleFilterChange("city", e.target.value)}
            disabled={loading || cities.length === 0}
            className={selectClass}
          >
            <option value="">Pilih Lokasi</option>
            {cities.map((city) => (
              <option key={city.id} value={city.value}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        {/* Manager */}
        <div>
          <label className="flex items-center text-xs font-semibold text-gray-700 mb-2">
            <span>Pengelola ({managers.length})</span>
          </label>
          <select
            value={filters.manager}
            onChange={(e) => handleFilterChange("manager", e.target.value)}
            disabled={loading || managers.length === 0}
            className={selectClass}
          >
            <option value="">Pilih Pengelola</option>
            {managers.map((manager) => (
              <option key={manager.id} value={manager.value}>
                {manager.name}
              </option>
            ))}
          </select>
        </div>

        {/* Service Type */}
        <div>
          <label className="flex items-center text-xs font-semibold text-gray-700 mb-2">
            <span>Jenis Layanan ({services.length})</span>
          </label>
          <select
            value={filters.serviceType}
            onChange={(e) => handleFilterChange("serviceType", e.target.value)}
            className={selectClass}
          >
            <option value="">Pilih Jenis Layanan</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
        </div>

        {/* Category Badge */}
        <div>
          <label className="flex items-center text-xs font-semibold text-gray-700 mb-2">
            <span>Kategori</span>
          </label>
          <div className="relative">
            <select disabled className={selectClass}>
              <option value="">GOLONGAN RETRIBUSI DAERAH</option>
            </select>
            <span className="absolute right-3 top-2.5 bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded pointer-events-none">
              Coming Soon
            </span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-4">
        <button
          onClick={handleReset}
          className="px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-smooth"
        >
          Reset
        </button>
        <button
          onClick={() => {}}
          className="px-4 py-3 bg-gray-400 text-white font-semibold rounded-lg hover:bg-gray-500 transition-smooth"
        >
          Cari
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop/Tablet Filter */}
      <div
        className="
hidden lg:block
bg-white/90
backdrop-blur-xl
rounded-3xl
border border-slate-200/60
shadow-[0_8px_30px_rgb(0,0,0,0.04)]
overflow-hidden
"
      >
        {/* Filter Content */}
        <div className="p-6">
          <FilterContent />
        </div>
      </div>

      {/* Mobile/SM Filter Button */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setShowMobileFilter(!showMobileFilter)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-gray-200 rounded-lg font-semibold text-gray-900 hover:border-green-500 transition-colors"
        >
          <Sliders className="w-5 h-5" />
          Filter
        </button>
      </div>

      {/* Mobile Filter Panel */}
      {showMobileFilter && (
        <div className="lg:hidden fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur"
            onClick={() => setShowMobileFilter(false)}
          />

          {/* Panel */}
          <div className="relative bg-white rounded-t-2xl p-6 mt-20 max-h-[90vh] overflow-y-auto animate-slide-in-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Filter</h3>
              <button
                onClick={() => setShowMobileFilter(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-smooth"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Tabs */}
            <div className="flex gap-2 mb-6 border-b border-gray-200">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-3 py-2 font-semibold text-sm transition-colors ${
                    activeTab === tab.id
                      ? "text-green-600 border-b-2 border-green-500"
                      : "text-gray-600"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <FilterContent />
          </div>
        </div>
      )}
    </>
  );
}
