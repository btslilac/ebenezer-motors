<<<<<<< HEAD
<<<<<<< HEAD
import React, { useState } from 'react';
=======
import React, { useState, useEffect } from 'react';
>>>>>>> 7034c1fac89f4f63c0af4e4afea5fd639dbfbe32
import { Link } from 'react-router-dom';
import VehicleCard from '../components/vehicle/VehicleCard';
import { CheckCircle, DollarSign, Shield } from 'lucide-react';
import { getVehicles } from '../services/vehicleApi';

const Home = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  // --- 1. SEARCH STATE MANAGEMENT ---
  const [filters, setFilters] = useState({
    brand: 'All',
    year: 'All',
    maxPrice: 'All'
  });
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

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

  // --- 2. EXTRACT DATA FOR DROPDOWNS ---
  // Get unique brands from your data
  const brands = ['All', ...new Set(vehicles.map(v => v.brand))];
  // Get unique years and sort them descending
  const years = ['All', ...new Set(vehicles.map(v => v.modelYear))].sort((a, b) => b - a);

  // --- 3. HANDLE SEARCH BUTTON CLICK ---
  const filterVehicles = (list) => {
    return list.filter((vehicle) => {
      if (filters.brand !== 'All' && vehicle.brand !== filters.brand) return false;
      if (filters.year !== 'All' && String(vehicle.modelYear) !== filters.year) return false;
      if (filters.maxPrice !== 'All' && vehicle.price > Number(filters.maxPrice)) return false;
      return true;
    });
  };

  const handleSearch = () => {
    const filtered = filterVehicles(vehicles);

    setSearchResults(filtered);
    setHasSearched(true);
  };

  useEffect(() => {
    if (hasSearched) {
      setSearchResults(filterVehicles(vehicles));
    }
  }, [vehicles, filters, hasSearched]);

  // Filter new arrivals based on curated metadata
  const newArrivals = vehicles.filter(v => v.isNewArrival).slice(0, 3);

  return (
    <div className="bg-brand-surface">
      {/* 1. Hero Section */}
      <div className="relative isolate overflow-hidden bg-brand-primary text-white">
        <div className="absolute inset-0">
           <img
            src="src/assets/dealershiphero.jpg"
             alt="Hero"
              className="h-full w-full object-cover"
           />
         <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/80 via-brand-primary/60 to-brand-primary/40" />
      </div>


        <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 py-24 sm:px-6 md:flex-row md:items-end md:justify-between lg:px-8">
          <div className="max-w-2xl text-center md:text-left">
            <span className="inline-flex items-center rounded-full border border-white/20 px-4 py-1 text-sm font-medium uppercase tracking-[0.2em] text-white/80">
              Premium dealership
            </span>
            <h1 className="mt-6 text-4xl font-heading font-semibold leading-tight md:text-6xl">
              "Quality Cars for Cute People"
            </h1>
            <p className="mt-4 text-lg text-white/80 md:text-xl">
              Quality locally sourced used vehicles, and flexible hire options tailored to your lifestyle.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start">
              <Link
                to="/inventory"
                className="inline-flex items-center justify-center rounded-full bg-brand-accent px-8 py-3 text-sm font-semibold text-white shadow-elevated transition hover:bg-brand-accentLight"
              >
                Browse Cars
              </Link>
              <Link
                to="/trade-in"
                className="inline-flex items-center justify-center rounded-full border border-white/40 px-8 py-3 text-sm font-semibold text-white transition hover:border-white"
              >
                Trade In
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 rounded-2xl bg-white/10 p-6 text-left text-white backdrop-blur">
            <div>
              <p className="text-3xl font-semibold">150+</p>
              <p className="text-sm text-white/70">Vehicles sold every quarter</p>
            </div>
            <div>
              <p className="text-3xl font-semibold">10 yrs</p>
              <p className="text-sm text-white/70">Serving Kenyan motorists with trust</p>
            </div>
            <div>
              <p className="text-3xl font-semibold">48 hr</p>
              <p className="text-sm text-white/70">Average financing turn-around</p>
            </div>
            <div>
              <p className="text-3xl font-semibold">98%</p>
              <p className="text-sm text-white/70">Customer satisfaction rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Brands Section */}
      <div className="border-y border-brand-muted/70 bg-white/90">
        <div className="mx-auto flex max-w-6xl items-center gap-12 overflow-x-auto px-4 py-6 text-sm uppercase tracking-[0.25em] text-slate-500 sm:justify-center">
          <span className="whitespace-nowrap">Toyota</span>
          <span className="whitespace-nowrap">Mazda</span>
          <span className="whitespace-nowrap">Nissan</span>
          <span className="whitespace-nowrap">Subaru</span>
          <span className="whitespace-nowrap">Mercedes</span>
          <span className="whitespace-nowrap">BMW</span>
          <span className="whitespace-nowrap">Audi</span>
        </div>
      </div>

      {/* 3. Functional Search Bar */}
      <div className="relative z-10 mx-auto -mt-14 max-w-6xl px-4">
        <div className="grid gap-4 rounded-2xl border border-brand-muted/60 bg-white p-6 shadow-elevated sm:grid-cols-2 md:grid-cols-5">
          
          {/* BRAND SELECT */}
          <select 
            className="w-full rounded-full border border-brand-muted/80 bg-white px-4 py-2 text-sm text-slate-600 focus:border-brand-accent focus:outline-none"
            value={filters.brand}
            onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
          >
            <option value="All">Brand (All)</option>
            {brands.filter(b => b !== 'All').map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>

          {/* MODEL SELECT (Placeholder for now) */}
          <select 
            className="w-full rounded-full border border-brand-muted/80 bg-gray-50 px-4 py-2 text-sm text-slate-400 focus:outline-none cursor-not-allowed"
            disabled
          >
            <option>All Models</option>
          </select>

          {/* YEAR SELECT */}
          <select 
            className="w-full rounded-full border border-brand-muted/80 bg-white px-4 py-2 text-sm text-slate-600 focus:border-brand-accent focus:outline-none"
            value={filters.year}
            onChange={(e) => setFilters({ ...filters, year: e.target.value })}
          >
            <option value="All">Year (Any)</option>
            {years.filter(y => y !== 'All').map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          {/* PRICE SELECT */}
          <select 
            className="w-full rounded-full border border-brand-muted/80 bg-white px-4 py-2 text-sm text-slate-600 focus:border-brand-accent focus:outline-none"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
          >
            <option value="All">Price Max</option>
            <option value="1500000">Under 1.5M</option>
            <option value="3000000">Under 3M</option>
            <option value="5000000">Under 5M</option>
            <option value="10000000">Under 10M</option>
          </select>

          {/* GO BUTTON */}
          <button 
            onClick={handleSearch}
            className="w-full rounded-full bg-brand-accent px-4 py-2 text-sm font-semibold text-black transition hover:bg-brand-accentLight"
          >
            Go
          </button>
        </div>
      </div>

      {loadError && (
        <div className="mx-auto mt-6 max-w-6xl px-4">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {loadError}
          </div>
        </div>
      )}

      {hasSearched && (
        <section className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-heading font-semibold text-brand-primary">Matching Vehicles</h2>
              <p className="text-sm text-slate-500">
                Showing {searchResults.length} option{searchResults.length === 1 ? '' : 's'} based on your filters.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setFilters({ brand: 'All', year: 'All', maxPrice: 'All' });
                setSearchResults([]);
                setHasSearched(false);
              }}
              className="self-start rounded-full border border-brand-muted/80 px-4 py-2 text-sm font-semibold text-brand-primary transition hover:border-brand-accent hover:text-brand-accent"
            >
              Clear filters
            </button>
          </div>

          <div className="mt-8 grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {searchResults.length > 0 ? (
              searchResults.map((vehicle) => (
                <VehicleCard key={vehicle._id || vehicle.id} vehicle={vehicle} />
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-brand-muted/60 bg-white p-8 text-center text-sm text-slate-500">
                No vehicles matched those filters. Try adjusting your selection.
              </div>
            )}
          </div>
        </section>
      )}

      {/* 4. Latest Arrivals */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-heading font-semibold text-brand-primary">Latest Arrivals</h2>
            <p className="mt-2 max-w-xl text-sm text-slate-500">
              Freshly curated vehicles ready for immediate delivery. Explore detailed specs tailored to Kenyan roads.
            </p>
          </div>
          <Link to="/inventory" className="text-sm font-semibold text-brand-accent hover:text-brand-accentLight">
            View full inventory →
          </Link>
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {loading && (
            <div className="rounded-2xl border border-dashed border-brand-muted/60 bg-white p-8 text-center text-sm text-slate-500">
              Loading latest arrivals...
            </div>
          )}
          {!loading && newArrivals.map((vehicle) => (
            <VehicleCard key={vehicle._id || vehicle.id} vehicle={vehicle} />
          ))}
          {!loading && newArrivals.length === 0 && (
            <div className="rounded-2xl border border-dashed border-brand-muted/60 bg-white p-8 text-center text-sm text-slate-500">
              No new arrivals yet.
            </div>
          )}
        </div>
      </section>

      {/* 5. Why Choose Us */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-heading font-semibold text-brand-primary">Why Choose Us</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-slate-500">
            At Ebenezer Car Bazaar & Hire, we deliver trusted vehicles, transparent pricing, and dependable car hire for every journey.
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl border border-brand-muted/60 bg-brand-surface p-8 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-accent/10 text-brand-accent">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-brand-primary">Trusted Dealer</h3>
              <p className="mt-2 text-sm text-slate-500">Serving the you with integrity and prompt after-sales support.</p>
            </div>
            <div className="rounded-2xl border border-brand-muted/60 bg-brand-surface p-8 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-accent/10 text-brand-accent">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-brand-primary">Fully Inspected</h3>
              <p className="mt-2 text-sm text-slate-500">Every car passes a 150-point inspection for peace of mind.</p>
            </div>
            <div className="rounded-2xl border border-brand-muted/60 bg-brand-surface p-8 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-accent/10 text-brand-accent">
                <DollarSign className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-brand-primary">Financing Available</h3>
              <p className="mt-2 text-sm text-slate-500">Competitive rates and flexible repayment options for all budgets.</p>
            </div>
            
          </div>
        </div>
      </section>

     
    </div>
  );
};

=======
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import VehicleCard from '../components/vehicle/VehicleCard';
import { CheckCircle, DollarSign, Shield, Search, ArrowRight } from 'lucide-react';
import { getVehicles } from '../services/vehicleApi';

const SkeletonCard = () => (
  <div className="flex flex-col rounded-3xl border border-brand-muted/60 bg-white shadow-sm overflow-hidden animate-pulse">
    <div className="h-56 w-full bg-slate-200"></div>
    <div className="p-6 flex flex-col gap-3">
      <div className="h-6 w-3/4 bg-slate-200 rounded-lg"></div>
      <div className="h-4 w-1/2 bg-slate-200 rounded-md"></div>
      <div className="mt-6 flex justify-between items-center pt-5 border-t border-brand-muted/30">
        <div className="h-6 w-1/3 bg-slate-200 rounded-md"></div>
        <div className="h-9 w-24 bg-brand-surface rounded-full"></div>
      </div>
    </div>
  </div>
);

const Home = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // --- 1. SEARCH STATE MANAGEMENT ---
  const [filters, setFilters] = useState({
    brand: 'All',
    year: 'All',
    maxPrice: 'All'
  });
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

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

  // --- 2. EXTRACT DATA FOR DROPDOWNS ---
  const brands = ['All', ...new Set(vehicles.map(v => v.brand).filter(Boolean))];
  const years = ['All', ...new Set(vehicles.map(v => v.modelYear).filter(Boolean))].sort((a, b) => b - a);

  // --- 3. HANDLE SEARCH BUTTON CLICK ---
  const filterVehicles = (list) => {
    return list.filter((vehicle) => {
      if (filters.brand !== 'All' && vehicle.brand !== filters.brand) return false;
      if (filters.year !== 'All' && String(vehicle.modelYear) !== filters.year) return false;
      if (filters.maxPrice !== 'All' && vehicle.price > Number(filters.maxPrice)) return false;
      return true;
    });
  };

  const handleSearch = () => {
    const filtered = filterVehicles(vehicles);
    setSearchResults(filtered);
    setHasSearched(true);
  };

  useEffect(() => {
    if (hasSearched) {
      setSearchResults(filterVehicles(vehicles));
    }
  }, [vehicles, filters, hasSearched]);

  // Filter new arrivals based on curated metadata
  const newArrivals = vehicles.filter(v => v.isNewArrival).slice(0, 3);
  const displayVehicles = newArrivals.length > 0 ? newArrivals : [...vehicles].sort((a, b) => b.modelYear - a.modelYear).slice(0, 3);

  return (
    <div className="bg-brand-surface font-body overflow-x-hidden">

      {/* 1. Hero Section */}
      <div className="relative isolate overflow-hidden bg-brand-primary text-white min-h-[88vh] flex items-center">
        {/* Abstract Top Blur for Luxury Feel */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-accentLight/10 rounded-full blur-[100px] -z-10 mix-blend-screen pointer-events-none"></div>

        <div className="absolute inset-0">
          <img
            src="src/assets/dealershiphero.jpg"
            alt="Luxury Dealership Hero"
            className="h-full w-full object-cover opacity-50"
            fetchPriority="high"
          />
          {/* Seamless gradient fade into the surface color */}
          <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/95 via-brand-primary/60 to-brand-surface" />
        </div>

        <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 pt-32 pb-40 sm:px-6 md:flex-row md:items-end md:justify-between lg:px-8 z-10">
          <div className="max-w-3xl text-center md:text-left">
            <span className="inline-flex items-center rounded-full border border-brand-accentLight/40 bg-brand-accentLight/10 backdrop-blur-md px-5 py-2 text-xs font-bold uppercase tracking-[0.25em] text-brand-accentLight shadow-[0_0_15px_rgba(96,165,250,0.2)]">
              Ebenezar Dealership
            </span>
            <h1 className="mt-8 text-5xl font-heading font-bold leading-[1.15] md:text-7xl text-white drop-shadow-xl tracking-tight">
              Quality Cars for <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accentLight to-[#ffffff]">Cute People.</span>
            </h1>
            <p className="mt-8 text-lg text-slate-300 md:text-xl font-medium max-w-2xl leading-relaxed">
              Locally sourced Quality vehicles and flexible hire options made perfectly for you. Find your match today.
            </p>
            <div className="mt-12 flex flex-col gap-5 sm:flex-row sm:justify-center md:justify-start">
              <Link
                to="/inventory"
                className="inline-flex h-14 items-center justify-center rounded-full bg-brand-accent px-10 text-sm font-bold text-white shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all hover:bg-brand-accentLight hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(37,99,235,0.6)]"
              >
                Browse Inventory
              </Link>
              <Link
                to="/trade-in"
                className="inline-flex h-14 items-center justify-center rounded-full border border-slate-300/30 bg-white/5 backdrop-blur-md px-10 text-sm font-bold text-white transition-all hover:bg-white/10 hover:border-white/50 hover:-translate-y-1"
              >
                Get a Trade-In Value
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Floating Search Bar - Blends Hero and Content */}
      <div className="relative z-20 mx-auto -mt-28 max-w-[90%] md:max-w-6xl">
        <div className="grid gap-3 rounded-[2rem] border border-white/40 bg-white/70 backdrop-blur-2xl p-4 sm:p-5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] sm:grid-cols-2 lg:grid-cols-5 items-center ring-1 ring-brand-muted/30">

          <div className="lg:col-span-4 grid sm:grid-cols-3 gap-3">
            {/* BRAND SELECT */}
            <div className="relative">
              <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 absolute top-3 left-5">Make</label>
              <select
                className="w-full h-[68px] rounded-2xl border border-brand-muted/30 bg-white/80 pt-6 pb-2 px-5 text-sm font-bold text-brand-primary outline-none focus:ring-2 focus:ring-brand-accent cursor-pointer transition-shadow hover:shadow-xs appearance-none"
                value={filters.brand}
                onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
              >
                <option value="All">All Brands</option>
                {brands.filter(b => b !== 'All').map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            {/* YEAR SELECT */}
            <div className="relative">
              <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 absolute top-3 left-5">Year</label>
              <select
                className="w-full h-[68px] rounded-2xl border border-brand-muted/30 bg-white/80 pt-6 pb-2 px-5 text-sm font-bold text-brand-primary outline-none focus:ring-2 focus:ring-brand-accent cursor-pointer transition-shadow hover:shadow-xs appearance-none"
                value={filters.year}
                onChange={(e) => setFilters({ ...filters, year: e.target.value })}
              >
                <option value="All">Any Year</option>
                {years.filter(y => y !== 'All').map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            {/* PRICE SELECT */}
            <div className="relative">
              <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 absolute top-3 left-5">Budget</label>
              <select
                className="w-full h-[68px] rounded-2xl border border-brand-muted/30 bg-white/80 pt-6 pb-2 px-5 text-sm font-bold text-brand-primary outline-none focus:ring-2 focus:ring-brand-accent cursor-pointer transition-shadow hover:shadow-xs appearance-none"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              >
                <option value="All">Any Price</option>
                <option value="1500000">Under 1.5M Ksh</option>
                <option value="3000000">Under 3M Ksh</option>
                <option value="5000000">Under 5M Ksh</option>
                <option value="10000000">Under 10M Ksh</option>
              </select>
            </div>
          </div>

          {/* GO BUTTON */}
          <button
            onClick={handleSearch}
            className="w-full h-[68px] rounded-2xl bg-brand-primary px-4 text-sm font-bold tracking-wide text-white transition-all hover:bg-slate-800 flex items-center justify-center gap-3 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
          >
            <Search size={20} /> Search
          </button>
        </div>
      </div>

      {/* Marquee Brands */}
      <div className="bg-transparent py-14 border-b border-brand-muted/30">
        <div className="mx-auto flex max-w-6xl items-center gap-8 sm:gap-16 overflow-x-auto px-4 text-[13px] font-bold uppercase tracking-[0.25em] text-slate-400 sm:justify-center scrollbar-hide select-none opacity-60">
          <span>Toyota</span>
          <span className="h-1 w-1 rounded-full bg-slate-300 shrink-0"></span>
          <span>Mazda</span>
          <span className="h-1 w-1 rounded-full bg-slate-300 shrink-0"></span>
          <span>Nissan</span>
          <span className="h-1 w-1 rounded-full bg-slate-300 shrink-0"></span>
          <span>Subaru</span>
          <span className="h-1 w-1 rounded-full bg-slate-300 shrink-0"></span>
          <span>Mercedes</span>
          <span className="h-1 w-1 rounded-full bg-slate-300 shrink-0"></span>
          <span>BMW</span>
          <span className="h-1 w-1 rounded-full bg-slate-300 shrink-0"></span>
          <span>Audi</span>
        </div>
      </div>

      {loadError && (
        <div className="mx-auto mt-10 max-w-6xl px-4">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-medium text-red-700">
            ⚠️ {loadError}
          </div>
        </div>
      )}

      {/* 3. Search Results (if active) */}
      {hasSearched && (
        <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8 animate-in fade-in slide-in-from-bottom-8 duration-500 relative">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end justify-between mb-12 bg-white p-8 rounded-3xl border border-brand-accent/20 shadow-[0_10px_30px_-15px_rgba(37,99,235,0.15)]">
            <div>
              <span className="inline-flex items-center gap-2 text-brand-accent font-bold tracking-widest uppercase text-xs mb-3">
                <Search size={14} /> Search Results
              </span>
              <h2 className="text-3xl font-heading font-bold text-brand-primary">Matching Options</h2>
              <p className="mt-2 text-slate-500 font-medium">
                Showing {searchResults.length} vehicle{searchResults.length === 1 ? '' : 's'} based on your filters.
              </p>
            </div>
            <button
              onClick={() => {
                setFilters({ brand: 'All', year: 'All', maxPrice: 'All' });
                setSearchResults([]);
                setHasSearched(false);
              }}
              className="text-sm font-bold text-slate-400 hover:text-red-500 transition-colors bg-brand-surface hover:bg-red-50 px-6 py-2.5 rounded-full"
            >
              Clear filters
            </button>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {searchResults.length > 0 ? (
              searchResults.map((vehicle) => (
                <VehicleCard key={vehicle._id || vehicle.id} vehicle={vehicle} />
              ))
            ) : (
              <div className="col-span-full rounded-3xl border border-brand-muted/60 border-dashed bg-white p-16 text-center shadow-sm">
                <p className="text-slate-500 font-medium">No vehicles matched those specific filters. Try adjusting your selection.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 4. Latest Arrivals */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 relative">
        <div className="absolute top-10 right-0 w-[500px] h-[500px] bg-brand-accent/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-12">
          <div>
            <span className="text-brand-accent font-bold tracking-[0.2em] uppercase text-xs">Premium Collection</span>
            <h2 className="text-4xl font-heading font-bold text-brand-primary mt-3">Latest Arrivals</h2>
            <p className="mt-4 max-w-xl text-slate-500 font-medium leading-relaxed">
              Freshly curated vehicles ready for immediate delivery. Built for Kenyan roads, priced completely transparently.
            </p>
          </div>
          <Link to="/inventory" className="inline-flex items-center text-sm font-bold text-brand-primary hover:text-brand-accent transition group bg-white px-6 py-3 rounded-full shadow-sm border border-brand-muted/60 hover:shadow-md">
            View All Current Stock <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            [...Array(3)].map((_, i) => <SkeletonCard key={i} />)
          ) : (
            displayVehicles.map((vehicle) => (
              <VehicleCard key={vehicle._id || vehicle.id} vehicle={vehicle} />
            ))
          )}

          {!loading && displayVehicles.length === 0 && (
            <div className="col-span-full rounded-3xl border border-brand-muted/60 bg-white p-16 text-center shadow-sm">
              <p className="text-slate-500 font-medium tracking-wide">No new arrivals available right now.</p>
            </div>
          )}
        </div>
      </section>

      {/* 5. Why Choose Us */}
      <section className="bg-white py-32 border-t border-brand-muted/30 relative overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-brand-surface/80 rounded-[100%] blur-[80px] -z-10 pointer-events-none"></div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="text-brand-accent font-bold tracking-[0.2em] uppercase text-xs">The Ebenezar Advantage</span>
            <h2 className="mt-4 text-4xl md:text-5xl font-heading font-bold text-brand-primary">Why Choose Us</h2>
            <p className="mt-6 text-slate-500 font-medium leading-relaxed text-lg">
              Delivering trusted vehicles, perfectly transparent pricing, and completely dependable car hire for every journey you take.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 relative z-10">
            {[
              {
                icon: <CheckCircle className="h-8 w-8" />,
                title: "Trusted Local Dealer",
                desc: "10+ years serving the community with absolute integrity and prompt, exceptional after-sales support."
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: "Fully Inspected",
                desc: "Every single car passes a rigorous 150-point technical engine & body inspection for your peace of mind."
              },
              {
                icon: <DollarSign className="h-8 w-8" />,
                title: "Financing Available",
                desc: "Extremely competitive rates with a 48hr turnaround and highly flexible repayment options."
              }
            ].map((feature, idx) => (
              <div key={idx} className="group relative rounded-[2rem] border border-brand-muted/50 bg-white p-10 shadow-sm hover:shadow-[0_20px_50px_-15px_rgba(37,99,235,0.15)] transition-all duration-500 hover:-translate-y-3 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-surface text-brand-accent group-hover:scale-110 group-hover:bg-brand-accent/10 transition-all duration-500 group-hover:rotate-3 shadow-sm">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-brand-primary mb-4">{feature.title}</h3>
                  <p className="text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

>>>>>>> fd93382 (Updated Version)
export default Home;