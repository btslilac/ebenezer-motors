import mongoose from "mongoose";

const tradeInRequestSchema = new mongoose.Schema(
  {
    makeModel: { type: String, required: true },
    year: { type: Number, required: true },
    mileage: { type: Number, required: true },
    condition: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    status: { type: String, enum: ["new", "contacted"], default: "new" }
  },
  { timestamps: true }
);

const TradeInRequest = mongoose.model("TradeInRequest", tradeInRequestSchema);

export default TradeInRequest;
