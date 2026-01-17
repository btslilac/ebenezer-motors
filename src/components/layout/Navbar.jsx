import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Car } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Navigation Links based on [cite: 99]
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'In Stock', path: '/inventory' }, // [cite: 65]
    { name: 'Hire', path: '/car-hire' }, // [cite: 72]
    { name: 'Trade-In', path: '/trade-in' }, // [cite: 74]
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-brand-muted/60 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 text-brand-primary">
          <img 
            src="/src/assets/ebenezerlogo.svg" 
            alt="Ebenezer Logo" 
            className="h-10 w-auto object-contain" 
          />
          <span className="font-heading text-lg font-semibold tracking-tight uppercase">Ebenezer Car Bazaar</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="font-medium text-slate-600 transition hover:text-brand-accent"
            >
              {link.name}
            </Link>
          ))}
          <Link to="/contact" className="rounded-full bg-brand-accent px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-accentLight">
            Contact Us
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center rounded-full border border-brand-muted/80 p-2 text-slate-600 transition hover:bg-brand-muted/60"
            aria-label="Toggle navigation"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="border-t border-brand-muted bg-white md:hidden">
          <div className="space-y-1 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="block rounded-md px-3 py-2 text-base font-medium text-slate-700 transition hover:bg-brand-muted/40"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/contact"
              className="mt-2 block rounded-md bg-brand-accent px-3 py-2 text-center text-base font-semibold text-white transition hover:bg-brand-accentLight"
              onClick={() => setIsOpen(false)}
            >
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;