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
        <img
          src={vehicle.images[0]}
          alt={vehicle.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute left-4 top-4 inline-flex items-center rounded-full bg-brand-accent px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-sm">
          {vehicle.condition || "Used"}
        </div>
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <p className="text-xs uppercase tracking-[0.3em] text-white/70">Starting from</p>
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
            <span>{vehicle.power}</span>
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
          <button className="flex-1 rounded-full border border-brand-accent px-4 py-2 text-sm font-semibold text-brand-accent transition hover:bg-brand-accent/10">
            Inquire
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;