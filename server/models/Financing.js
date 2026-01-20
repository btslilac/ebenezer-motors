// server/models/Financing.js
import mongoose from 'mongoose';

const FinancingSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  
  // New Fields
  identificationNo: String,
  address: String,
  occupation: String,

  // Link to the Vehicle
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
  vehicleName: String, 
  chassisNo: String,
  engineNo: String,
  color: String,
  ccRating: String,

  // Money
  totalAmount: Number,
  paidAmount: { type: Number, default: 0 },
  deposit: Number,
  
  // Terms
  installmentsCount: Number, 
  installmentsPaid: { type: Number, default: 0 },
  paymentFrequency: { type: String, enum: ['weekly', 'monthly'], default: 'monthly' },
  
  nextDueDate: Date,
  status: { type: String, enum: ['Good', 'Overdue', 'Completed'], default: 'Good' },
  
  // Ledger
  paymentHistory: [{
    date: Date,
    type: String, // 'Deposit' or 'Installment'
    amount: Number
  }],

  agreementFile: String,
  createdAt: { type: Date, default: Date.now }
});

// Ensure unique active loans per ID
FinancingSchema.index(
  { identificationNo: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: { $ne: 'Completed' } } }
);

export default mongoose.model('Financing', FinancingSchema);