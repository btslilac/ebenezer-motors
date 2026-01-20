import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";

// --- PUBLIC COMPONENTS ---
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Inventory from "./pages/Inventory";
import Contact from "./pages/Contact";
import CarHire from "./pages/CarHire";
import TradeIn from "./pages/TradeIn";
import VehicleDetails from "./pages/VehicleDetails";

// --- ADMIN COMPONENTS ---
// Make sure these files exist based on the previous step
import AdminLayout from "./components/admin/AdminLayout";
import FinancingDashboard from "./pages/admin/FinancingDashboard";
import InventoryManager from "./pages/admin/InventoryManager";

// Helper Layout to keep Navbar & Footer only on public pages
const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Outlet renders the child route (Home, Inventory, etc.) */}
        <Outlet /> 
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Routes>
      {/* 1. PUBLIC WEBSITE ROUTES (Wrapped in PublicLayout) */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/vehicle/:id" element={<VehicleDetails />} />
        <Route path="/car-hire" element={<CarHire />} />
        <Route path="/trade-in" element={<TradeIn />} />
      </Route>

      {/* 2. SECURE ADMIN ROUTES (Wrapped in AdminLayout) */}
      <Route path="/admin" element={<AdminLayout />}>
        {/* This creates the path: /admin/financing */}
        <Route path="financing" element={<FinancingDashboard />} />
        <Route path="inventory" element={<InventoryManager />} />
      </Route>
    
    </Routes>
  );
}

export default App;