import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import VehicleCard from '../components/vehicle/VehicleCard';
import { vehicles } from '../data/vehicles';
import { CheckCircle, DollarSign, Shield } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  // --- 1. SEARCH STATE MANAGEMENT ---
  const [filters, setFilters] = useState({
    brand: 'All',
    year: 'All',
    maxPrice: 'All'
  });

  // --- 2. EXTRACT DATA FOR DROPDOWNS ---
  // Get unique brands from your data
  const brands = ['All', ...new Set(vehicles.map(v => v.brand))];
  // Get unique years and sort them descending
  const years = ['All', ...new Set(vehicles.map(v => v.modelYear))].sort((a, b) => b - a);

  // --- 3. HANDLE SEARCH BUTTON CLICK ---
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (filters.brand !== 'All') params.append('brand', filters.brand);
    if (filters.year !== 'All') params.append('year', filters.year);
    if (filters.maxPrice !== 'All') params.append('maxPrice', filters.maxPrice);
    
    // Redirect to inventory with query params
    navigate(`/inventory?${params.toString()}`);
  };

  [cite_start]// Filter new arrivals based on [cite: 109]
  const newArrivals = vehicles.filter(v => v.isNewArrival).slice(0, 3);

  return (
    <div className="bg-brand-surface">
      [cite_start]{/* 1. Hero Section [cite: 100-103] */}
      <div className="relative isolate overflow-hidden bg-brand-primary text-white">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1400"
            alt="Hero"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/90 via-brand-primary/75 to-brand-primary/60" />
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
              <p className="text-sm text-white/70">Average financing turnaround</p>
            </div>
            <div>
              <p className="text-3xl font-semibold">98%</p>
              <p className="text-sm text-white/70">Customer satisfaction rating</p>
            </div>
          </div>
        </div>
      </div>

      [cite_start]{/* 2. Brands Section [cite: 104-105] */}
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

      [cite_start]{/* --- 3. FUNCTIONAL SEARCH BAR [cite: 106-108] --- */}
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

      [cite_start]{/* 4. Latest Arrivals */}
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
          {newArrivals.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </section>

      [cite_start]{/* 5. Why Choose Us  */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-heading font-semibold text-brand-primary">Why Choose Us</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-slate-500">
            From sourcing to support, every touchpoint is designed around transparency and long-term value.
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl border border-brand-muted/60 bg-brand-surface p-8 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-accent/10 text-brand-accent">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-brand-primary">Trusted Dealer</h3>
              <p className="mt-2 text-sm text-slate-500">Serving the community with integrity and prompt after-sales support.</p>
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

export default Home;