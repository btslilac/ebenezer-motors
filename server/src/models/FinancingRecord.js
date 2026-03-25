import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    note: { type: String }
  },
  { _id: true }
);

const financingRecordSchema = new mongoose.Schema(
  {
    client: { type: mongoose.Schema.Types.ObjectId, ref: "FinancingClient", required: true },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" },
    vehicleName: { type: String, required: true },
    vehiclePrice: { type: Number, required: true },
    downPayment: { type: Number, default: 0 },
    financedAmount: { type: Number, required: true },
    monthlyInstalment: { type: Number },
    durationMonths: { type: Number },
    status: {
      type: String,
      enum: ["active", "completed", "defaulted"],
      default: "active"
    },
    startDate: { type: Date, default: Date.now },
    notes: { type: String },
    payments: [paymentSchema]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

financingRecordSchema.virtual("amountPaid").get(function () {
  return this.payments.reduce((sum, p) => sum + p.amount, 0);
});

financingRecordSchema.virtual("remainingBalance").get(function () {
  const paid = this.payments.reduce((sum, p) => sum + p.amount, 0);
  return Math.max(0, this.financedAmount - paid);
});

const FinancingRecord = mongoose.model("FinancingRecord", financingRecordSchema);

export default FinancingRecord;
