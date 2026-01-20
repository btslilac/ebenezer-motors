import React from 'react';
import { Fuel, Gauge, Settings, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const VehicleCard = ({ vehicle }) => {
  if (!vehicle) return null; // Safety: Don't render empty cards

  // Handle MongoDB _id or legacy id
  const vehicleId = vehicle._id || vehicle.id;
  
  // Safety: Prevent crash if ID is missing
  if (!vehicleId) return null; 

  const categoryLabel = vehicle.category ?? "Featured";
  
  // Safety: Fallback image if array is empty
  const displayImage = vehicle.images && vehicle.images.length > 0 
    ? vehicle.images[0] 
    : "https://via.placeholder.com/400x300?text=No+Image";

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-brand-muted/60 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-elevated">
      
      {/* Image Section */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <img
          src={displayImage}
          alt={vehicle.name || "Vehicle"}
          className="h-full w-full object-cover"
          onError={(e) => { e.target.src = "https://via.placeholder.com/400x300?text=Error+Loading"; }} // Safety: Handle broken links
        />
        <div className="absolute left-4 top-4 inline-flex items-center rounded-full bg-brand-accent px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-sm">
          {vehicle.condition || "Used"}
        </div>
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <p className="text-xs uppercase tracking-[0.3em] text-white/70">Price</p>
          <p className="text-2xl font-semibold">
             {/* Safety: Checks if price exists before formatting */}
             {vehicle.price ? `Ksh ${vehicle.price.toLocaleString()}` : "Price On Request"}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <h3 className="text-lg font-heading font-semibold text-brand-primary line-clamp-1" title={vehicle.name}>
            {vehicle.name}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {vehicle.modelYear || "N/A"} • {categoryLabel}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Fuel size={16} className="text-brand-accent" />
            <span>{vehicle.fuelType || "N/A"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-brand-accent" />
            <span>{vehicle.ccRating ? `${vehicle.ccRating} CC` : 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Settings size={16} className="text-brand-accent" />
            <span>{vehicle.transmission || "Auto"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Gauge size={16} className="text-brand-accent" />
            <span>{vehicle.mileage ? `${vehicle.mileage.toLocaleString()} km` : "N/A"}</span>
          </div>
        </div>

        <div className="mt-auto flex gap-3 pt-2">
          <Link
            to={`/vehicle/${vehicleId}`}
            className="flex-1 rounded-full bg-brand-accent px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-brand-accentLight"
          >
            View Details
          </Link>
          <button className="flex-1 rounded-full border border-brand-accent px-4 py-2 text-center text-sm font-semibold text-brand-accent transition hover:bg-brand-accent/10">
            Inquire
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;