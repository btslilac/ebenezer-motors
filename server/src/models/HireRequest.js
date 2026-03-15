import mongoose from "mongoose";

const hireRequestSchema = new mongoose.Schema(
  {
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    notes: { type: String },
    status: { type: String, enum: ["new", "contacted"], default: "new" }
  },
  { timestamps: true }
);

const HireRequest = mongoose.model("HireRequest", hireRequestSchema);

export default HireRequest;
