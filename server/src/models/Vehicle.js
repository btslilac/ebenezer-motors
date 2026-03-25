import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    modelYear: { type: Number, required: true },
    price: { type: Number, required: true },
    hirePrice: { type: Number },
    hirePriceWeekly: { type: Number },
    fuelType: { type: String, required: true },
    mileage: { type: Number, required: true },
    transmission: { type: String, required: true },
    power: { type: String },
    ccRating: { type: String },
    color: { type: String },
    chassisNo: { type: String },
    engineNo: { type: String },
    category: { type: String },
    condition: { type: String },
    description: { type: String },
    features: [{ type: String }],
    isNewArrival: { type: Boolean, default: false },
    forHire: { type: Boolean, default: false },
    images: [{ type: String }]
  },
  { timestamps: true }
);

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

export default Vehicle;
