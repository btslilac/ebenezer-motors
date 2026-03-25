import mongoose from "mongoose";

const financingClientSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    idNumber: { type: String },
    address: { type: String },
    notes: { type: String }
  },
  { timestamps: true }
);

const FinancingClient = mongoose.model("FinancingClient", financingClientSchema);

export default FinancingClient;
