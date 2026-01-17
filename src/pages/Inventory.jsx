import React, { useState, useMemo } from 'react';
import VehicleCard from '../components/vehicle/VehicleCard';
import { vehicles } from '../data/vehicles';
import { Search, SlidersHorizontal, X } from 'lucide-react';

const Inventory = () => {
  // 1. State Management
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedFuel, setSelectedFuel] = useState("All");
  const [sortOption, setSortOption] = useState("newest"); // 'price-low', 'price-high', 'newest'
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // 2. Extract unique options dynamically from data
  const brands = ["All", ...new Set(vehicles.map(v => v.brand))];
  const categories = ["All", ...new Set(vehicles.map(v => v.category))];
  const fuelTypes = ["All", ...new Set(vehicles.map(v => v.fuelType))];

  // 3. The Filter Logic
  const filteredVehicles = useMemo(() => {
    return vehicles
      .filter((vehicle) => {
        // Search Logic (Name or Brand)
        const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Filter Logic
        const matchesBrand = selectedBrand === "All" || vehicle.brand === selectedBrand;
        const matchesCategory = selectedCategory === "All" || vehicle.category === selectedCategory;
        const matchesFuel = selectedFuel === "All" || vehicle.fuelType === selectedFuel;

        return matchesSearch && matchesBrand && matchesCategory && matchesFuel;
      })
      .sort((a, b) => {
        // Sorting Logic
        if (sortOption === "price-low") return a.price - b.price;
        if (sortOption === "price-high") return b.price - a.price;
        if (sortOption === "newest") return b.modelYear - a.modelYear;
        return 0;
      });
  }, [searchTerm, selectedBrand, selectedCategory, selectedFuel, sortOption]);

  // 4. Reset Function
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedBrand("All");
    setSelectedCategory("All");
    setSelectedFuel("All");
    setSortOption("newest");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Top Bar: Title & Mobile Toggle */}
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
        
        {/* --- SIDEBAR FILTERS --- */}
        <aside className={`w-full md:w-64 space-y-6 ${showMobileFilters ? 'block' : 'hidden md:block'}`}>
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Filters</h3>
              <button onClick={clearFilters} className="text-sm text-blue-600 hover:underline">Reset</button>
            </div>

            {/* Search Input */}
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

            {/* Brand Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">Brand</label>
              <select className="w-full border p-2 rounded-md" value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
                {brands.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            {/* Category Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">Category</label>
              <select className="w-full border p-2 rounded-md" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Fuel Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">Fuel Type</label>
              <select className="w-full border p-2 rounded-md" value={selectedFuel} onChange={(e) => setSelectedFuel(e.target.value)}>
                {fuelTypes.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>
        </aside>

        {/* --- MAIN GRID --- */}
        <div className="flex-1">
          {/* Sorting Bar */}
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

          {/* Grid Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>

          {/* Empty State */}
          {filteredVehicles.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg border border-dashed">
              <Search className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No vehicles found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or search term.</p>
              <button onClick={clearFilters} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Clear Filters
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Inventory;