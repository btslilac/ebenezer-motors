<<<<<<< HEAD
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

=======
import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import VehicleCard from '../components/vehicle/VehicleCard';
import { Search, SlidersHorizontal, PackageOpen } from 'lucide-react';
import { getVehicles } from '../services/vehicleApi';

const SkeletonCard = () => (
  <div className="flex flex-col rounded-2xl border border-brand-muted/60 bg-white shadow-sm overflow-hidden animate-pulse">
    <div className="h-48 w-full bg-slate-200"></div>
    <div className="p-5 flex flex-col gap-3">
      <div className="h-5 w-2/3 bg-slate-200 rounded-md"></div>
      <div className="h-4 w-1/2 bg-slate-200 rounded-md"></div>
      <div className="mt-4 flex justify-between items-center pt-4 border-t border-brand-muted/60">
        <div className="h-6 w-1/3 bg-slate-200 rounded-md"></div>
        <div className="h-8 w-24 bg-brand-surface rounded-full"></div>
      </div>
    </div>
  </div>
);

const Inventory = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // URL State Management
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get('q') || '';
  const selectedBrand = searchParams.get('brand') || 'All';
  const selectedCategory = searchParams.get('category') || 'All';
  const selectedFuel = searchParams.get('fuel') || 'All';
  const sortOption = searchParams.get('sort') || 'newest';

  // Fast typing local state for the search bar
  const [localSearch, setLocalSearch] = useState(searchTerm);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'All' && value !== '') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams, { replace: true });
  };

  // Debounce Local search into URL Search Parameter
  useEffect(() => {
    const handler = setTimeout(() => {
      // Only hit the URL update if it actually changed to avoid infinite loops
      if (localSearch !== searchTerm) {
        updateFilter('q', localSearch);
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [localSearch, searchTerm, searchParams]);

  useEffect(() => {
    let isMounted = true;
    const loadVehicles = async () => {
      try {
        setLoading(true);
        const response = await getVehicles({ limit: 200 });
        if (isMounted) {
          setVehicles(response?.data || []);
          setLoadError("");
        }
      } catch (error) {
        if (isMounted) {
          setLoadError(error.message || "Failed to load vehicles");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadVehicles();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter Data Extract
  const brands = ["All", ...new Set(vehicles.map(v => v.brand).filter(Boolean))];
  const categories = ["All", ...new Set(vehicles.map(v => v.category).filter(Boolean))];
  const fuelTypes = ["All", ...new Set(vehicles.map(v => v.fuelType).filter(Boolean))];

  // Filtering & Sorting Logic
  const filteredVehicles = useMemo(() => {
    return vehicles
      .filter((vehicle) => {
        const query = searchTerm.toLowerCase();
        const matchesSearch = query === "" || 
          (vehicle.name?.toLowerCase() || "").includes(query) ||
          (vehicle.brand?.toLowerCase() || "").includes(query);

        const matchesBrand = selectedBrand === "All" || vehicle.brand === selectedBrand;
        const matchesCategory = selectedCategory === "All" || vehicle.category === selectedCategory;
        const matchesFuel = selectedFuel === "All" || vehicle.fuelType === selectedFuel;

        return matchesSearch && matchesBrand && matchesCategory && matchesFuel;
      })
      .sort((a, b) => {
        if (sortOption === "price-low") return (a.price || 0) - (b.price || 0);
        if (sortOption === "price-high") return (b.price || 0) - (a.price || 0);
        if (sortOption === "newest") return (b.modelYear || 0) - (a.modelYear || 0);
        return 0;
      });
  }, [searchTerm, selectedBrand, selectedCategory, selectedFuel, sortOption, vehicles]);

  // Reset Filters
  const clearFilters = () => {
    setSearchParams({}, { replace: true });
    setLocalSearch('');
  };

  return (
    <div className="min-h-screen bg-brand-surface pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Top Bar: Title & Mobile Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-heading font-semibold text-brand-primary">Inventory</h1>
            <p className="text-sm text-slate-500 mt-1">
              {loading ? "Discover your next vehicle..." : `Showing ${filteredVehicles.length} vehicles`}
            </p>
          </div>
          <button
            className="md:hidden flex items-center justify-center gap-2 border border-brand-muted/60 bg-white px-4 py-2 rounded-xl text-brand-primary text-sm font-semibold hover:bg-slate-50"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            <SlidersHorizontal size={18} /> Filters
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* --- SIDEBAR FILTERS --- */}
          <aside className={`w-full md:w-72 shrink-0 space-y-6 md:sticky md:top-24 ${showMobileFilters ? 'block' : 'hidden md:block'}`}>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-muted/60">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-heading font-semibold text-brand-primary text-lg">Filters</h3>
                <button onClick={clearFilters} className="text-xs font-semibold hover:text-brand-accent text-slate-500 transition-colors">
                  Reset everything
                </button>
              </div>

              {/* Search Input */}
              <div className="mb-6 relative group">
                <label className="sr-only" htmlFor="search-models">Search models</label>
                <input
                  id="search-models"
                  type="text"
                  placeholder="Search models..."
                  className="w-full pl-10 pr-4 py-3 bg-brand-surface border border-transparent rounded-xl text-sm transition-all focus:bg-white focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/10 outline-none placeholder-slate-400 text-brand-primary"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                />
                <Search className="absolute left-3.5 top-3.5 text-slate-400 group-focus-within:text-brand-accent transition-colors" size={18} />
              </div>

              {/* Brand Filter */}
              <div className="mb-5">
                <label htmlFor="brand-filter" className="block text-sm font-semibold mb-2 text-brand-primary">Brand</label>
                <select 
                  id="brand-filter"
                  className="w-full border border-brand-muted/60 bg-white p-3 rounded-xl text-sm outline-none focus:border-brand-accent transition-colors" 
                  value={selectedBrand} 
                  onChange={(e) => updateFilter('brand', e.target.value)}
                >
                  {brands.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              {/* Category Filter */}
              <div className="mb-5">
                <label htmlFor="category-filter" className="block text-sm font-semibold mb-2 text-brand-primary">Body Category</label>
                <select 
                  id="category-filter"
                  className="w-full border border-brand-muted/60 bg-white p-3 rounded-xl text-sm outline-none focus:border-brand-accent transition-colors" 
                  value={selectedCategory} 
                  onChange={(e) => updateFilter('category', e.target.value)}
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Fuel Filter */}
              <div className="mb-2">
                <label htmlFor="fuel-filter" className="block text-sm font-semibold mb-2 text-brand-primary">Fuel Type</label>
                <select 
                  id="fuel-filter"
                  className="w-full border border-brand-muted/60 bg-white p-3 rounded-xl text-sm outline-none focus:border-brand-accent transition-colors" 
                  value={selectedFuel} 
                  onChange={(e) => updateFilter('fuel', e.target.value)}
                >
                  {fuelTypes.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
            </div>
          </aside>

          {/* --- MAIN GRID --- */}
          <div className="flex-1 w-full relative">
            
            {/* Sorting / Top Action Bar */}
            <div className="flex items-center justify-between sm:justify-end mb-6 bg-white p-2 rounded-xl border border-brand-muted/60 shadow-sm">
              <label htmlFor="sort-options" className="text-sm font-semibold text-slate-600 ml-4 sm:hidden">Sort by:</label>
              <select
                id="sort-options"
                className="w-full sm:w-auto border-transparent cursor-pointer p-2 rounded-lg bg-white text-sm font-semibold text-brand-primary outline-none focus:ring-0 active:bg-slate-50 transition-colors"
                value={sortOption}
                onChange={(e) => updateFilter('sort', e.target.value)}
              >
                <option value="newest">Featured First (Newest)</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {loadError && (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-medium text-red-700">
                ⚠️ {loadError}
              </div>
            )}

            {/* Grid Results */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVehicles.map((vehicle) => (
                  <VehicleCard key={vehicle._id || vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && filteredVehicles.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-brand-muted/60 border-dashed text-center px-4">
                <div className="p-4 bg-brand-surface rounded-full mb-4">
                  <PackageOpen className="h-10 w-10 text-brand-primary/40" />
                </div>
                <h3 className="text-xl font-heading font-semibold text-brand-primary">Nothing matches your search</h3>
                <p className="mt-2 text-sm text-slate-500 max-w-sm mb-6">
                  Try adjusting your filters, selecting a different brand, or removing your search term to see more vehicles.
                </p>
                <button 
                  onClick={clearFilters} 
                  className="bg-brand-primary text-white rounded-full px-6 py-2.5 text-sm font-semibold hover:bg-slate-800 transition shadow-sm hover:shadow-md"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

>>>>>>> fd93382 (Updated Version)
export default Inventory;