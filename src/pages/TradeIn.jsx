import React from 'react';
import { CheckCircle } from 'lucide-react';

const TradeIn = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-brand-primary mb-4">
            Trade Your Car for a Better One
          </h1>
          <p className="text-slate-600">
            Get a competitive valuation for your current vehicle and upgrade to your dream car today.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-elevated border border-brand-muted/60 overflow-hidden">
          <div className="p-8 md:p-12">
            <form className="space-y-6">
              
              {/* Section 1: Vehicle Details */}
              <div>
                <h3 className="text-lg font-bold text-brand-primary mb-4 border-b pb-2">Vehicle Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Make & Model</label>
                    <input type="text" placeholder="e.g. Toyota Prado" className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Year of Manufacture</label>
                    <input type="number" placeholder="e.g. 2018" className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Mileage (km)</label>
                    <input type="number" placeholder="e.g. 65000" className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Condition</label>
                    <select className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none bg-white">
                      <option>Excellent</option>
                      <option>Good</option>
                      <option>Fair</option>
                      <option>Poor</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Contact Info */}
              <div className="pt-4">
                <h3 className="text-lg font-bold text-grey mb-4 border-b pb-2">Your Contact Info</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-grey mb-1">Full Name</label>
                    <input type="text" className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-grey mb-1">Phone Number</label>
                    <input type="tel" className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none" />
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button type="submit" className="w-full bg-brand-accent text-grey font-bold text-lg py-4 rounded-xl hover:bg-brand-accentLight transition shadow-lg hover:shadow-xl">
                  Get Free Valuation
                </button>
              </div>

            </form>
          </div>
          <div className="bg-slate-50 px-8 py-6 border-t border-brand-muted/60 flex flex-col md:flex-row justify-center gap-6 text-sm text-slate-500">
             <span className="flex items-center gap-2"><CheckCircle size={16} className="text-brand-accent"/> Fast Processing</span>
             <span className="flex items-center gap-2"><CheckCircle size={16} className="text-brand-accent"/> Market Rates</span>
             <span className="flex items-center gap-2"><CheckCircle size={16} className="text-brand-accent"/> No Obligation</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeIn;