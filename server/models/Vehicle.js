// server/models/Vehicle.js
import mongoose from 'mongoose';

const VehicleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  modelYear: Number,
  price: { type: Number, required: true },
  
  // Identifiers
  chassisNo: { type: String, required: true }, // Removed 'unique' temporarily to avoid conflicts during testing
  engineNo: String,
  color: String,
  ccRating: String,

  // Specs
  mileage: Number,
  fuelType: String,
  transmission: String,
  category: String,
  power: String,
  
  // Sales Info
  condition: String,
  isNewArrival: { type: Boolean, default: false },
  forHire: { type: Boolean, default: false },
  
  // Media
  images: [String],
  description: String,
  features: [String],

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Vehicle', VehicleSchema);