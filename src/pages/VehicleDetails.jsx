<<<<<<< HEAD
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, Gauge, Fuel, Zap, Settings, 
  Check, Phone, MessageCircle, MapPin, Fingerprint, Info 
} from 'lucide-react';
import { vehicles } from '../data/vehicles'; // Import Local Data

const VehicleDetails = () => {
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
                <p className="text-xs uppercase text-slate-500 font-bold tracking-widest mb-1">Cash Price</p>
                <p className="text-3xl font-bold text-brand-accent">Ksh {vehicle.price?.toLocaleString()}</p>
                
              </div>

              <div className="space-y-3">
                <a 
                    href={`https://wa.me/254704287382?text=Hi, I am interested in the ${vehicle.name} listed for Ksh ${vehicle.price?.toLocaleString()}`}
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

=======
import React, { useState, useEffect, memo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Calendar, Gauge, Fuel, Zap, Settings,
  Check, Phone, MessageCircle, MapPin, Fingerprint, Info, Image as ImageIcon
} from 'lucide-react';
import { getVehicleById } from '../services/vehicleApi';

// 1. Memoized Image Gallery to prevent re-rendering the entire page when swapping images
const ImageGallery = memo(({ images, name, condition }) => {
  const [activeImage, setActiveImage] = useState(0);

  return (
    <div className="space-y-4">
      <div className="aspect-[4/3] w-full overflow-hidden rounded-3xl bg-slate-100 shadow-sm border border-brand-muted/60 relative group">
        <img
          src={images[activeImage]}
          alt={`${name} - Main View`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          fetchPriority="high" // Prioritize the main LCP image
        />
        <div className="absolute top-5 left-5 bg-brand-primary/95 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider backdrop-blur-md shadow-sm">
          {condition || "Used"}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImage(idx)}
              className={`relative flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden snap-start transition-all duration-300 ${activeImage === idx
                ? 'ring-2 ring-brand-accent ring-offset-2 opacity-100'
                : 'border border-brand-muted/60 opacity-60 hover:opacity-100'
                }`}
            >
              <img
                src={img}
                alt={`${name} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
                loading="lazy" // Defer loading offscreen thumbnails
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

// 2. Premium Skeleton Loader to eliminate Cumulative Layout Shift (CLS)
const DetailsSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
    <div className="lg:col-span-2 space-y-8">
      <div className="aspect-[4/3] w-full rounded-3xl bg-slate-200 border border-brand-muted/60 flex items-center justify-center">
        <ImageIcon className="text-slate-300 h-16 w-16" />
      </div>
      <div className="bg-white rounded-3xl p-8 border border-brand-muted/60">
        <div className="h-6 w-1/4 bg-slate-200 rounded-md mb-6"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="h-3 w-1/2 bg-slate-200 rounded-md"></div>
              <div className="h-5 w-3/4 bg-slate-200 rounded-md"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-8 border border-brand-muted/60 h-[400px] flex flex-col">
        <div className="h-8 w-3/4 bg-slate-200 rounded-lg mb-4"></div>
        <div className="h-4 w-1/3 bg-slate-200 rounded-md mb-10"></div>
        <div className="h-12 w-full bg-slate-200 rounded-xl mb-auto"></div>
        <div className="space-y-3 mt-6">
          <div className="h-14 w-full bg-slate-200 rounded-xl"></div>
          <div className="h-14 w-full bg-slate-200 rounded-xl"></div>
        </div>
      </div>
    </div>
  </div>
);

const VehicleDetails = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isMounted = true;
    const loadVehicle = async () => {
      try {
        setLoading(true);
        const response = await getVehicleById(id);
        if (isMounted) {
          setVehicle(response?.data || null);
          setLoadError("");
        }
      } catch (error) {
        if (isMounted) {
          setLoadError(error.message || "Unable to load vehicle");
          setVehicle(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (id) {
      loadVehicle();
    }
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (!loading && !vehicle) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4 bg-brand-surface px-4 text-center">
        <div className="p-4 bg-white rounded-full mb-2 shadow-sm border border-brand-muted/60">
          <Info className="h-10 w-10 text-brand-primary" />
        </div>
        <h1 className="text-2xl font-heading font-bold text-brand-primary">Vehicle Not Found</h1>
        <p className="text-slate-500 max-w-md">
          {loadError || "The vehicle you are looking for has been sold or doesn't exist in our current inventory."}
        </p>
        <Link to="/inventory" className="mt-4 px-8 py-3 bg-brand-primary text-white font-semibold rounded-full hover:bg-slate-800 transition shadow-sm">
          Browse Inventory
        </Link>
      </div>
    );
  }

  const images = vehicle?.images && vehicle.images.length > 0
    ? vehicle.images
    : ["https://placehold.co/800x600/f8fafc/64748b?text=No+Image+Available"];

  return (
    <div className="bg-brand-surface min-h-screen py-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <Link to="/inventory" className="inline-flex items-center text-slate-500 hover:text-brand-accent mb-8 transition font-semibold text-sm group">
          <ArrowLeft size={18} className="mr-2 transform group-hover:-translate-x-1 transition-transform" />
          Back to Inventory
        </Link>

        {loading ? (
          <DetailsSkeleton />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* LEFT COLUMN: Gallery & Details */}
            <div className="lg:col-span-2 space-y-8">

              <ImageGallery images={images} name={vehicle.name} condition={vehicle.condition} />

              {/* --- SPECS GRID --- */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-brand-muted/60">
                <h3 className="text-xl font-heading font-bold text-brand-primary mb-8 flex items-center gap-2">
                  <Info size={22} className="text-brand-accent" /> Core Specifications
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-8 gap-x-6">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-slate-400 text-xs uppercase tracking-wider font-bold">Make & Model</span>
                    <span className="font-semibold text-brand-primary truncate" title={vehicle.name}>{vehicle.name}</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-slate-400 text-xs uppercase tracking-wider font-bold">Year</span>
                    <span className="font-semibold text-brand-primary flex items-center gap-2">
                      <Calendar size={16} className="text-slate-400" /> {vehicle.modelYear}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-slate-400 text-xs uppercase tracking-wider font-bold">Mileage</span>
                    <span className="font-semibold text-brand-primary flex items-center gap-2">
                      <Gauge size={16} className="text-slate-400" /> {vehicle.mileage?.toLocaleString()} km
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-slate-400 text-xs uppercase tracking-wider font-bold">Transmission</span>
                    <span className="font-semibold text-brand-primary flex items-center gap-2 whitespace-nowrap">
                      <Settings size={16} className="text-slate-400" /> {vehicle.transmission}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-slate-400 text-xs uppercase tracking-wider font-bold">Fuel Type</span>
                    <span className="font-semibold text-brand-primary flex items-center gap-2">
                      <Fuel size={16} className="text-slate-400" /> {vehicle.fuelType}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-slate-400 text-xs uppercase tracking-wider font-bold">Engine / CC</span>
                    <span className="font-semibold text-brand-primary flex items-center gap-2">
                      <Zap size={16} className="text-slate-400" /> {vehicle.ccRating || vehicle.power || 'N/A'}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-slate-400 text-xs uppercase tracking-wider font-bold">Color</span>
                    <span className="font-semibold text-brand-primary flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border border-gray-300 shadow-sm" style={{ backgroundColor: vehicle.color?.toLowerCase() || '#f1f5f9' }}></div>
                      <span className="truncate">{vehicle.color || 'N/A'}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* --- DESCRIPTION --- */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-brand-muted/60">
                <h3 className="text-xl font-heading font-bold text-brand-primary mb-6">About this Vehicle</h3>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                  {vehicle.description || "No description provided for this vehicle."}
                </p>

                {/* Features List */}
                {vehicle.features && vehicle.features.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-brand-muted/40">
                    <h4 className="font-bold text-brand-primary mb-5">Features & Options</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {vehicle.features.map((feature, i) => (
                        <div key={i} className="flex items-center text-slate-700 bg-brand-surface py-2.5 px-4 rounded-xl border border-brand-muted/30">
                          <Check size={18} className="text-brand-accent mr-3 flex-shrink-0" />
                          <span className="text-sm font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* --- IDENTIFIERS (Admin View Simulation) --- */}
              <div className="bg-white rounded-3xl p-8 border border-brand-muted/60 shadow-sm">
                <h4 className="font-heading font-bold text-brand-primary mb-5 flex items-center gap-2">
                  <Fingerprint size={20} className="text-slate-400" /> Verification Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                  <div className="flex flex-col border border-brand-muted/60 rounded-xl p-4 bg-brand-surface">
                    <span className="text-slate-500 font-semibold mb-1">Chassis Number</span>
                    <span className="font-mono text-brand-primary font-bold text-base">{vehicle.chassisNo || "Not Disclosed"}</span>
                  </div>
                  <div className="flex flex-col border border-brand-muted/60 rounded-xl p-4 bg-brand-surface">
                    <span className="text-slate-500 font-semibold mb-1">Engine Number</span>
                    <span className="font-mono text-brand-primary font-bold text-base">{vehicle.engineNo || "Not Disclosed"}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Sticky CTA Panel */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-8 shadow-elevated border border-brand-muted/60 lg:sticky lg:top-24">

                <div className="mb-6">
                  <h1 className="text-3xl font-heading font-bold text-brand-primary leading-tight mb-2">{vehicle.name}</h1>
                  <div className="flex items-center gap-2 text-slate-500 text-sm font-semibold">
                    <MapPin size={16} className="text-brand-accent" /> Kisumu, Kenya
                  </div>
                </div>

                <div className="mb-8 p-5 bg-brand-surface rounded-2xl border border-brand-muted/60">
                  <p className="text-xs uppercase text-slate-500 font-bold tracking-widest mb-1">Cash Price</p>
                  <p className="text-4xl font-bold text-brand-accent tracking-tight">Ksh {vehicle.price?.toLocaleString()}</p>
                </div>

                <div className="space-y-3">
                  <a
                    href={`https://wa.me/254704287382?text=Hi, I am interested in the ${vehicle.name} listed for Ksh ${vehicle.price?.toLocaleString()}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-[#25D366] text-white font-semibold py-4 rounded-full shadow-[0_8px_16px_-6px_rgba(37,211,102,0.4)] hover:bg-[#20bd5a] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={20} className="fill-current" /> WhatsApp Now
                  </a>
                  <a
                    href="tel:+254704287382"
                    className="w-full bg-slate-900 !text-white font-semibold py-4 rounded-full shadow-[0_8px_16px_-6px_rgba(15,23,42,0.4)] hover:bg-slate-800 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                  >
                    <Phone size={20} className="fill-current" /> Call Us
                  </a>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

>>>>>>> fd93382 (Updated Version)
export default VehicleDetails;