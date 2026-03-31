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
import VehicleDetailsHire from "./pages/VehicleDetailsHire";
<<<<<<< HEAD
<<<<<<< HEAD
=======
import Admin from "./pages/Admin";
>>>>>>> fd93382 (Updated Version)
=======
import Admin from "./pages/Admin";
>>>>>>> 7034c1fac89f4f63c0af4e4afea5fd639dbfbe32



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
          <Route path="/vehicle/hire/:id" element={<VehicleDetailsHire />} />
          <Route path="/car-hire" element={<CarHire />} />
          <Route path="/trade-in" element={<TradeIn />} />
<<<<<<< HEAD
<<<<<<< HEAD
=======
          <Route path="/admin" element={<Admin />} />
>>>>>>> fd93382 (Updated Version)
=======
          <Route path="/admin" element={<Admin />} />
>>>>>>> 7034c1fac89f4f63c0af4e4afea5fd639dbfbe32
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
