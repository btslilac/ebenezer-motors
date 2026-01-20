import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Gauge, Fuel, Zap, Settings, Check, Phone, MessageCircle, MapPin, Fingerprint, Info } from 'lucide-react';

const VehicleDetails = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false); // New Error State
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      setLoading(true); // Ensure loading starts true
      try {
        const response = await fetch(`http://localhost:5000/api/vehicles/${id}`);
        if (!response.ok) throw new Error("Vehicle not found");
        const data = await response.json();
        setVehicle(data);
      } catch (error) {
        console.error("Error fetching vehicle:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if(id) fetchVehicleDetails();
  }, [id]);

  // 1. LOADING STATE
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
        <p className="text-brand-primary font-bold animate-pulse">Loading Vehicle Details...</p>
    </div>
  );

  // 2. ERROR / NOT FOUND STATE
  if (error || !vehicle) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <h1 className="text-2xl font-bold text-gray-700">Vehicle Not Found</h1>
        <p className="text-gray-500">The vehicle you are looking for may have been sold or removed.</p>
        <Link to="/inventory" className="px-6 py-2 bg-brand-accent text-white rounded-full hover:bg-brand-accentLight transition">
          Return to Inventory
        </Link>
      </div>
    );
  }

  // 3. SAFE DATA HANDLING
  const images = vehicle.images?.length > 0 
    ? vehicle.images 
    : ["https://via.placeholder.com/800x600?text=No+Image+Available"];

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link to="/inventory" className="inline-flex items-center text-slate-500 hover:text-brand-accent mb-6 transition font-medium">
          <ArrowLeft size={20} className="mr-2" /> Back to Inventory
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN: Images & Description */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Carousel */}
            <div className="space-y-4">
              <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-200 relative">
                <img 
                  src={images[activeImage]} 
                  alt={vehicle.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = "https://via.placeholder.com/800x600?text=Image+Error"; }}
                />
                <div className="absolute top-4 left-4 bg-brand-primary/90 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {vehicle.condition || "Used"}
                </div>
              </div>
              
              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {images.map((img, idx) => (
                    <button 
                      key={idx} onClick={() => setActiveImage(idx)}
                      className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-brand-accent' : 'border-transparent opacity-70'}`}
                    >
                      <img src={img} alt="thumb" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description Card */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-brand-muted/60">
              <h3 className="text-xl font-bold text-brand-primary mb-4 flex items-center gap-2">
                 <Info size={20}/> Vehicle Details
              </h3>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                {vehicle.description || "Contact us for more details about this vehicle."}
              </p>
              
              {/* Features Grid */}
              {vehicle.features?.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-100">
                  <h4 className="font-bold text-brand-primary mb-4">Features</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {vehicle.features.map((feature, i) => (
                      <div key={i} className="flex items-center text-slate-600 bg-gray-50 p-2 rounded-lg">
                        <Check size={16} className="text-green-500 mr-2" /> {feature}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Details & Contact */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-elevated border border-brand-muted/60 lg:sticky lg:top-24">
              <div className="mb-6">
                <h1 className="text-2xl font-heading font-bold text-brand-primary leading-tight">{vehicle.name}</h1>
                <div className="flex items-center gap-2 mt-2 text-slate-500 text-sm">
                    <MapPin size={16}/> Nairobi Showroom
                </div>
              </div>

              <div className="mb-8 p-4 bg-brand-surface rounded-xl border border-brand-accent/20">
                <p className="text-xs uppercase text-slate-500 font-bold tracking-widest mb-1">Cash Price</p>
                <p className="text-3xl font-bold text-brand-accent">
                    {vehicle.price ? `Ksh ${vehicle.price.toLocaleString()}` : "Contact for Price"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                 <div className="flex flex-col"><span className="text-gray-400 text-xs">Year</span><span className="font-semibold">{vehicle.modelYear || "-"}</span></div>
                 <div className="flex flex-col"><span className="text-gray-400 text-xs">Mileage</span><span className="font-semibold">{vehicle.mileage?.toLocaleString() || "-"} km</span></div>
                 <div className="flex flex-col"><span className="text-gray-400 text-xs">Engine</span><span className="font-semibold">{vehicle.ccRating || "-"} CC</span></div>
                 <div className="flex flex-col"><span className="text-gray-400 text-xs">Fuel</span><span className="font-semibold">{vehicle.fuelType || "-"}</span></div>
              </div>

              <div className="space-y-3">
                <a href="https://wa.me/254700000000" target="_blank" rel="noreferrer" className="w-full bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-700 transition flex items-center justify-center gap-2">
                  <MessageCircle size={20} /> WhatsApp
                </a>
                <a href="tel:+254700000000" className="w-full bg-brand-primary text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition flex items-center justify-center gap-2">
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

export default VehicleDetails;