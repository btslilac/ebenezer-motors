<<<<<<< HEAD
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

=======
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Listen for scroll events to add a floating shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation Links
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'In Stock', path: '/inventory' },
    { name: 'Hire', path: '/car-hire' },
    { name: 'Trade-In', path: '/trade-in' },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
        ? 'bg-white/95 backdrop-blur-md shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] border-b border-transparent py-1'
        : 'bg-white/80 backdrop-blur-sm border-b border-brand-muted/60 py-2'
        }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* LOGO AREA */}
        <Link to="/" className="flex items-center gap-3 text-brand-primary group">
          <img
            src="/src/assets/ebenezerlogo.svg"
            alt="Ebenezar Logo"
            className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <span className="font-heading text-lg font-bold tracking-tight uppercase group-hover:text-brand-accent transition-colors duration-300">
            Ebenezar Car Bazaar
          </span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden items-center gap-10 md:flex">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`relative font-semibold text-sm transition-colors duration-300 ${isActive ? 'text-brand-accent' : 'text-slate-500 hover:text-brand-primary'
                  } group`}
              >
                {link.name}
                {/* Animated Underline */}
                <span
                  className={`absolute -bottom-1.5 left-0 h-0.5 bg-brand-accent transition-all duration-300 ${isActive ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'
                    }`}
                />
              </Link>
            );
          })}

          <Link
            to="/contact"
            className="rounded-full bg-gray-400 px-6 py-2.5 text-sm font-bold text-white transition-all duration-300 hover:bg-brand-accent hover:-translate-y-0.5 hover:shadow-[0_8px_16px_-6px_rgba(37,99,235,0.4)]"
          >
            Contact Us
          </Link>
        </div>

        {/* MOBILE MENU BUTTON */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center rounded-2xl border border-brand-muted/80 p-2 text-slate-600 transition-colors hover:bg-brand-muted/40 hover:text-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent"
            aria-label="Toggle navigation"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full border-t border-brand-muted/40 bg-white/95 backdrop-blur-md md:hidden shadow-lg animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="flex flex-col space-y-2 px-6 py-6">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`block rounded-xl px-4 py-3 text-base font-bold transition-all duration-200 ${isActive
                    ? 'bg-brand-accent/10 text-brand-accent'
                    : 'text-slate-600 hover:bg-brand-muted/30 hover:text-brand-primary px-5'
                    }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="pt-4 mt-2 border-t border-brand-muted/30">
              <Link
                to="/contact"
                className="block rounded-xl bg-brand-primary px-4 py-3.5 text-center text-base font-bold text-white transition-all hover:bg-brand-accent shadow-sm"
                onClick={() => setIsOpen(false)}
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

>>>>>>> fd93382 (Updated Version)
export default Navbar;