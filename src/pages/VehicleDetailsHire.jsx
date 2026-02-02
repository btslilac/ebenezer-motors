import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, Gauge, Fuel, Zap, Settings, 
  Check, Phone, MessageCircle, MapPin, Fingerprint, Info 
} from 'lucide-react';
import { vehicles } from '../data/vehicles'; // Import Local Data

const VehicleDetailsHire = () => {
  const { id } = useParams();
  const [activeImage, setActiveImage] = useState(0);

  // 1. Find Vehicle Locally
  // We use .toString() to ensure matching works even if IDs are numbers
  const vehicle = vehicles.find((car) => car.id.toString() === id);

  if (!vehicle) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
        <h1 className="text-2xl font-bold text-gray-700">Vehicle Not Found</h1>
        <p className="text-gray-500">The vehicle you are looking for does not exist in our local inventory.</p>
        <Link to="/inventory" className="px-6 py-2 bg-brand-accent text-white rounded-full hover:bg-brand-accentLight transition">
          Return to Inventory
        </Link>
      </div>
    );
  }

  // 2. Safe Image Handling
  const images = vehicle.images && vehicle.images.length > 0 
    ? vehicle.images 
    : ["https://via.placeholder.com/800x600?text=No+Image+Available"];

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation */}
        <Link to="/inventory" className="inline-flex items-center text-slate-500 hover:text-brand-accent mb-6 transition font-medium">
          <ArrowLeft size={20} className="mr-2" /> Back to Inventory
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Gallery & Details */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* --- IMAGE CAROUSEL --- */}
            <div className="space-y-4">
              <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-200 shadow-sm border border-brand-muted/60 relative">
                <img 
                  src={images[activeImage]} 
                  alt={vehicle.name} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-brand-primary/90 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
                  {vehicle.condition || "Used"}
                </div>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {images.map((img, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                        activeImage === idx ? 'border-brand-accent ring-2 ring-brand-accent/20' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* --- SPECS GRID --- */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-brand-muted/60">
              <h3 className="text-xl font-bold text-brand-primary mb-6 flex items-center gap-2">
                <Info size={20} className="text-brand-accent"/> Car Details
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4">
                <div className="flex flex-col gap-1">
                  <span className="text-slate-400 text-xs uppercase tracking-wider font-bold">Make & Model</span>
                  <span className="font-semibold text-slate-700">{vehicle.name}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-slate-400 text-xs uppercase tracking-wider font-bold">Year</span>
                  <span className="font-semibold text-slate-700 flex items-center gap-2">
                    <Calendar size={16} className="text-brand-accent"/> {vehicle.modelYear}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-slate-400 text-xs uppercase tracking-wider font-bold">Mileage</span>
                  <span className="font-semibold text-slate-700 flex items-center gap-2">
                    <Gauge size={16} className="text-brand-accent"/> {vehicle.mileage?.toLocaleString()} km
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-slate-400 text-xs uppercase tracking-wider font-bold">Transmission</span>
                  <span className="font-semibold text-slate-700 flex items-center gap-2">
                    <Settings size={16} className="text-brand-accent"/> {vehicle.transmission}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-slate-400 text-xs uppercase tracking-wider font-bold">Fuel Type</span>
                  <span className="font-semibold text-slate-700 flex items-center gap-2">
                    <Fuel size={16} className="text-brand-accent"/> {vehicle.fuelType}
                  </span>
                </div>
                {/* Check if vehicle has ccRating (from DB schema) or power (from Mock schema) */}
                <div className="flex flex-col gap-1">
                  <span className="text-slate-400 text-xs uppercase tracking-wider font-bold">Engine / Power</span>
                  <span className="font-semibold text-slate-700 flex items-center gap-2">
                    <Zap size={16} className="text-brand-accent"/> {vehicle.ccRating || vehicle.power || 'N/A'}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-slate-400 text-xs uppercase tracking-wider font-bold">Color</span>
                  <span className="font-semibold text-slate-700 flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border border-gray-300 bg-gray-200"></div> {vehicle.color || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* --- DESCRIPTION --- */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-brand-muted/60">
              <h3 className="text-xl font-bold text-brand-primary mb-4">About this Vehicle</h3>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                {vehicle.description || "No description provided for this vehicle."}
              </p>
              
              {/* Features List */}
              {vehicle.features && vehicle.features.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-100">
                  <h4 className="font-bold text-brand-primary mb-4">Features & Options</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {vehicle.features.map((feature, i) => (
                      <div key={i} className="flex items-center text-slate-600 bg-gray-50 p-2 rounded-lg">
                        <Check size={16} className="text-green-500 mr-2 flex-shrink-0" /> 
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* --- IDENTIFIERS (Admin View Simulation) --- */}
            <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100">
                <h4 className="font-bold text-brand-primary mb-3 flex items-center gap-2">
                    <Fingerprint size={18} className="text-blue-500"/> Verification Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between border-b border-blue-100 pb-2">
                        <span className="text-slate-500">Chassis Number</span>
                        <span className="font-mono text-slate-700">{vehicle.chassisNo || "N/A"}</span>
                    </div>
                    <div className="flex justify-between border-b border-blue-100 pb-2">
                        <span className="text-slate-500">Engine Number</span>
                        <span className="font-mono text-slate-700">{vehicle.engineNo || "N/A"}</span>
                    </div>
                </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Sticky CTA Panel */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-elevated border border-brand-muted/60 lg:sticky lg:top-24">
              
              <div className="mb-6">
                <h1 className="text-2xl font-heading font-bold text-brand-primary leading-tight">{vehicle.name}</h1>
                <div className="flex items-center gap-2 mt-2 text-slate-500 text-sm">
                    <MapPin size={16}/> Kisumu 
                </div>
              </div>

              <div className="mb-8 p-4 bg-brand-surface rounded-xl border border-brand-accent/20">
                <p className="text-xs uppercase text-slate-500 font-bold tracking-widest mb-1">One Day Hiring Price</p>
                <p className="text-3xl font-bold text-brand-accent">Ksh {vehicle.hirePrice?.toLocaleString()}</p>
                
              </div>
              <div className="mb-8 p-4 bg-brand-surface rounded-xl border border-brand-accent/20">
                <p className="text-xs uppercase text-slate-500 font-bold tracking-widest mb-1">Weekly Hiring Price</p>
                <p className="text-3xl font-bold text-brand-accent">Ksh {vehicle.hirePriceWeekly?.toLocaleString()}</p>
                
              </div>

              <div className="space-y-3">
                <a 
                    href={`https://wa.me/254704287382?text=Hi, I am interested in the ${vehicle.name} listed for Ksh ${vehicle.hirePrice?.toLocaleString()}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-green-600 text-grey font-bold py-4 rounded-xl hover:bg-green-700 transition flex items-center justify-center gap-2 shadow-lg shadow-green-200"
                >
                  <MessageCircle size={20} /> WhatsApp Now
                </a>
                <a 
                    href="tel:+254704287382"
                    className="w-full bg-brand-primary text-grey font-bold py-4 rounded-xl hover:bg-slate-800 transition flex items-center justify-center gap-2 shadow-lg"
                >
                  <Phone size={20} /> Call Now
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default VehicleDetailsHire;