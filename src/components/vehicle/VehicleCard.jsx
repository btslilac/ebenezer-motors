<<<<<<< HEAD
import React from 'react';
import { Fuel, Gauge, Settings, Zap } from 'lucide-react'; // Icons [cite: 8]
import { Link } from 'react-router-dom';

const VehicleCard = ({ vehicle }) => {
  // [cite: 132] Wireframe layout implementation
  const categoryLabel = vehicle.category ?? "Featured";
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-brand-muted/60 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-elevated">
      {/* Image Section  */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
      <Link to= {`/vehicle/${vehicle.id}`}>
        <img
          src={vehicle.images[0]}
          alt={vehicle.name}
          className="h-full w-full object-cover"
        />
        </Link>
        <div className="absolute left-4 top-4 inline-flex items-center rounded-full bg-brand-accent px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-sm">
          {vehicle.condition || "Used"}
        </div>
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <p className="text-xs uppercase tracking-[0.3em] text-white/70"></p>
          <p className="text-2xl font-semibold">Ksh {vehicle.price.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        {/* Title & Price [cite: 134] */}
        <div>
          <h3 className="text-lg font-heading font-semibold text-brand-primary">{vehicle.name}</h3>
          <p className="mt-1 text-sm text-slate-500">
            {vehicle.modelYear} • {categoryLabel}
          </p>
        </div>

        {/* Specs Grid [cite: 135-137] */}
        <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Fuel size={16} className="text-brand-accent" />
            <span>{vehicle.fuelType}</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-brand-accent" />
            <span>{vehicle.ccRating}</span>
          </div>
          <div className="flex items-center gap-2">
            <Settings size={16} className="text-brand-accent" />
            <span>{vehicle.transmission}</span>
          </div>
          <div className="flex items-center gap-2">
            <Gauge size={16} className="text-brand-accent" />
            <span>{vehicle.mileage.toLocaleString()} km</span>
          </div>
        </div>

        {/* Action Buttons [cite: 140] */}
        <div className="mt-auto flex gap-3">
          <Link
            to={`/vehicle/${vehicle.id}`}
            className="flex-1 rounded-full bg-brand-accent px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-brand-accentLight"
          >
            View Details
          </Link>
         
        </div>
      </div>
    </div>
  );
};

=======
import React from 'react';
import { Fuel, Gauge, Settings, Zap } from 'lucide-react'; // Icons [cite: 8]
import { Link } from 'react-router-dom';

const VehicleCard = ({ vehicle }) => {
  // [cite: 132] Wireframe layout implementation
  const categoryLabel = vehicle.category ?? "Featured";
  const imageUrl = vehicle.images?.[0] || "https://via.placeholder.com/800x600?text=No+Image+Available";
  const vehicleId = vehicle._id || vehicle.id;
  const priceLabel = vehicle.price ? vehicle.price.toLocaleString() : "N/A";
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-brand-muted/60 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-elevated">
      {/* Image Section  */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
      <Link to= {`/vehicle/${vehicleId}`}>
        <img
          src={imageUrl}
          alt={vehicle.name}
          className="h-full w-full object-cover"
        />
        </Link>
        <div className="absolute left-4 top-4 inline-flex items-center rounded-full bg-brand-accent px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-sm">
          {vehicle.condition || "Used"}
        </div>
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <p className="text-xs uppercase tracking-[0.3em] text-white/70"></p>
          <p className="text-2xl font-semibold">Ksh {priceLabel}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        {/* Title & Price [cite: 134] */}
        <div>
          <h3 className="text-lg font-heading font-semibold text-brand-primary">{vehicle.name}</h3>
          <p className="mt-1 text-sm text-slate-500">
            {vehicle.modelYear} • {categoryLabel}
          </p>
        </div>

        {/* Specs Grid [cite: 135-137] */}
        <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Fuel size={16} className="text-brand-accent" />
            <span>{vehicle.fuelType}</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-brand-accent" />
            <span>{vehicle.ccRating}</span>
          </div>
          <div className="flex items-center gap-2">
            <Settings size={16} className="text-brand-accent" />
            <span>{vehicle.transmission}</span>
          </div>
          <div className="flex items-center gap-2">
            <Gauge size={16} className="text-brand-accent" />
            <span>{vehicle.mileage ? `${vehicle.mileage.toLocaleString()} km` : "N/A"}</span>
          </div>
        </div>

        {/* Action Buttons [cite: 140] */}
        <div className="mt-auto flex gap-3">
          <Link
            to={`/vehicle/${vehicleId}`}
            className="flex-1 rounded-full bg-brand-accent px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-brand-accentLight"
          >
            View Details
          </Link>
         
        </div>
      </div>
    </div>
  );
};

>>>>>>> fd93382 (Updated Version)
export default VehicleCard;