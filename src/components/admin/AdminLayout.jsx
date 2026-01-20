import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { LayoutDashboard, Car, LogOut } from 'lucide-react';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-primary text-black flex flex-col">
        <div className="p-6 text-xl font-bold border-b border-gray-700">Admin Panel</div>
        <nav className="flex-1 p-4 space-y-2">
            <Link to="/admin/inventory" className="flex items-center gap-3 p-3 text-white hover:bg-white/20 transition">
              <Car size={20} /> Inventory
            </Link>
            <Link to="/admin/financing" className="flex items-center gap-3 p-3 bg-white/10 rounded hover:bg-white/20 transition">
                <LayoutDashboard size={20} /> Financing
            </Link>
            <Link to="/inventory" className="flex items-center gap-3 p-3 text-gray-400 hover:text-white transition">
                <Car size={20} /> View Live Site
            </Link>
        </nav>
        <div className="p-4 border-t border-gray-700">
            <Link to="/" className="flex items-center gap-3 text-red-400 hover:text-red-300">
                <LogOut size={20} /> Logout
            </Link>
        </div>
      </aside>

      
      {/* Main Content Area */}
      <main className="flex-1 overflow-auto">
        <Outlet /> {/* This is where the dashboard page renders */}
      </main>
    </div>
  );
};

export default AdminLayout;