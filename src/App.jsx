import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Inventory from "./pages/Inventory";
import Contact from "./pages/Contact";
import CarHire from "./pages/CarHire";
import TradeIn from "./pages/TradeIn";
import VehicleDetails from "./pages/VehicleDetails";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/vehicle/:id" element={<VehicleDetails />} />
          <Route path="/car-hire" element={<CarHire />} />
          <Route path="/trade-in" element={<TradeIn />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
