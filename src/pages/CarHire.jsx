import React from 'react';
import VehicleCard from '../components/vehicle/VehicleCard';
import { vehicles } from '../data/vehicles';

const CarHire = () => {
  // Filter only cars marked for hire
  // If no cars have 'forHire: true' in your data yet, this might be empty.
  const hireVehicles = vehicles.filter(v => v.forHire === true);

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-heading font-bold text-brand-primary mb-4">Car Hire Services</h1>
          <p className="text-lg text-slate-600">
            Premium vehicles for weddings, business trips, and off-road adventures. 
            Flexible daily and weekly rates available.
          </p>
        </div>

        {hireVehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hireVehicles.map(vehicle => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
            <h3 className="text-xl font-bold text-slate-400">No vehicles currently available for hire.</h3>
            <p className="text-slate-500 mt-2">Please check back later or contact us directly.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarHire;