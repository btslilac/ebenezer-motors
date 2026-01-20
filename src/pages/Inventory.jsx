import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import VehicleCard from '../components/vehicle/VehicleCard';
// DELETE THIS LINE: import { vehicles } from '../data/vehicles'; 
import { Search, SlidersHorizontal } from 'lucide-react';

const Inventory = () => {
  // --- NEW: FETCH DATA STATE ---
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Get URL Parameters
  const [searchParams] = useSearchParams();

  // 2. State Management (Filters)
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || "All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedFuel, setSelectedFuel] = useState("All");
  const [selectedYear, setSelectedYear] = useState(searchParams.get('year') || "All");
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : 15000000); 
  const [sortOption, setSortOption] = useState("newest");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // --- NEW: FETCH DATA FROM API ---
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/vehicles');
        const data = await response.json();
        setVehicles(data);
      } catch (error) {
        console.error("Error loading inventory:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  // Sync with URL changes
  useEffect(() => {
    const brandParam = searchParams.get('brand');
    const yearParam = searchParams.get('year');
    const priceParam = searchParams.get('maxPrice');

    if (brandParam) setSelectedBrand(brandParam);
    if (yearParam) setSelectedYear(yearParam);
    if (priceParam) setMaxPrice(Number(priceParam));
  }, [searchParams]);

  // 4. Safe Extraction of Filter Options
  // Note: We check if `vehicles` has data before mapping
  const brands = ["All", ...new Set(vehicles.map(v => v.brand || "Unknown"))];
  const categories = ["All", ...new Set(vehicles.map(v => v.category || "Other"))];
  const fuelTypes = ["All", ...new Set(vehicles.map(v => v.fuelType || "Other"))];
  const years = ["All", ...new Set(vehicles.map(v => v.modelYear?.toString() || "Unknown"))].sort((a, b) => b - a);

  // 5. The Filter Logic
  const filteredVehicles = useMemo(() => {
    if (!vehicles) return []; 

    return vehicles
      .filter((vehicle) => {
        const vName = vehicle.name?.toLowerCase() || "";
        const vBrand = vehicle.brand?.toLowerCase() || "";
        const searchLower = searchTerm.toLowerCase();

        const matchesSearch = vName.includes(searchLower) || vBrand.includes(searchLower);
        const matchesBrand = selectedBrand === "All" || vehicle.brand === selectedBrand;
        const matchesCategory = selectedCategory === "All" || vehicle.category === selectedCategory;
        const matchesFuel = selectedFuel === "All" || vehicle.fuelType === selectedFuel;
        const matchesYear = selectedYear === "All" || vehicle.modelYear?.toString() === selectedYear;
        const matchesPrice = (vehicle.price || 0) <= maxPrice;

        return matchesSearch && matchesBrand && matchesCategory && matchesFuel && matchesYear && matchesPrice;
      })
      .sort((a, b) => {
        if (sortOption === "price-low") return (a.price || 0) - (b.price || 0);
        if (sortOption === "price-high") return (b.price || 0) - (a.price || 0);
        if (sortOption === "newest") return (b.modelYear || 0) - (a.modelYear || 0);
        return 0;
      });
  }, [vehicles, searchTerm, selectedBrand, selectedCategory, selectedFuel, selectedYear, maxPrice, sortOption]);

  // 6. Reset Function
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedBrand("All");
    setSelectedCategory("All");
    setSelectedFuel("All");
    setSelectedYear("All");
    setMaxPrice(15000000);
    setSortOption("newest");
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading Inventory...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* ... (Keep the rest of your UI exactly the same) ... */}
      {/* Just copy the JSX return statement from your previous file starting here */}
      
      {/* Top Bar */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
          <p className="text-gray-500 mt-1">{filteredVehicles.length} vehicles available</p>
        </div>
        <button 
          className="md:hidden flex items-center gap-2 border px-4 py-2 rounded-lg"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
        >
          <SlidersHorizontal size={20} /> Filters
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className={`w-full md:w-64 space-y-6 ${showMobileFilters ? 'block' : 'hidden md:block'}`}>
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Filters</h3>
              <button onClick={clearFilters} className="text-sm text-blue-600 hover:underline">Reset</button>
            </div>

            {/* Keep all your filter inputs (Search, Price Range, Brand Select, etc.) here */}
            {/* ... Paste previous inputs ... */}
             <div className="mb-6 relative">
              <input 
                type="text" 
                placeholder="Search models..." 
                className="w-full pl-9 pr-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">Max Price: {maxPrice.toLocaleString()}</label>
              <input 
                type="range" min="500000" max="15000000" step="100000" 
                value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">Brand</label>
              <select className="w-full border p-2 rounded-md" value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
                {brands.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            {/* Add other selects (Year, Category, Fuel) similarly... */}
          </div>
        </aside>

        {/* Main Grid */}
        <div className="flex-1">
          <div className="flex justify-end mb-6">
            <select 
              className="border p-2 rounded-md bg-white text-sm"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle._id} vehicle={vehicle} /> 
              /* NOTE: MongoDB uses _id, not id */
            ))}
          </div>

          {filteredVehicles.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg border border-dashed">
              <Search className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No vehicles found</h3>
              <button onClick={clearFilters} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Clear Filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inventory;