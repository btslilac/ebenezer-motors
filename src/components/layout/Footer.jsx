import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: Brand & Slogan */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white">
              <img 
            src="/src/assets/ebenezerlogocolored.jpg" 
            alt="Ebenezer Logo" 
            className="h-10 w-auto object-contain" 
          />
              <span className="font-bold text-xl tracking-tight">EBENEZAR CAR BAZAAR</span>
            </div>
            <p className="text-sm text-gray-400">
              Your trusted partner for quality locally used cars, and reliable car hire services. Experience the difference today.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="hover:text-blue-500 transition"><Facebook size={20} /></a>
              <a href="#" className="hover:text-pink-500 transition"><Instagram size={20} /></a>
              <a href="#" className="hover:text-blue-400 transition"><Twitter size={20} /></a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-blue-500 transition">Home</Link></li>
              <li><Link to="/inventory" className="hover:text-blue-500 transition">Browse Inventory</Link></li>
              <li><Link to="/car-hire" className="hover:text-blue-500 transition">Car Hire</Link></li>
              <li><Link to="/trade-in" className="hover:text-blue-500 transition">Trade In Value</Link></li>
            </ul>
          </div>

          {/* Column 3: Customer Support */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/contact" className="hover:text-blue-500 transition">Contact Us</Link></li>
              <li><a href="#" className="hover:text-blue-500 transition">Financing Application</a></li>
              <li><a href="#" className="hover:text-blue-500 transition">Schedule Service</a></li>
              <li><a href="#" className="hover:text-blue-500 transition">Terms & Conditions</a></li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Visit Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="text-blue-600 mt-1 flex-shrink-0" size={18} />
                <span><a href="https://maps.app.goo.gl/uwXf7mUBFUQb6JaF9" className="hover:text-blue-500 transition">38 Ondiek Highway,</a><br />Kisumu, Kenya</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-blue-600 flex-shrink-0" size={18} />
                <span>+254 722 263 192
                    <br />
                        +254 704 287 382
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-blue-600 flex-shrink-0" size={18} />
                <span>ebenezarent@gmail.com<br />sales@ebenezer.co.ke</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Ebenezer Enterprises. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;