// server/models/Financing.js
import mongoose from 'mongoose';

const FinancingSchema = new mongoose.Schema({
  customerName: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  
  // New Fields
  identificationNo: { type: String, required: true, trim: true },
  address: { type: String, trim: true },
  occupation: { type: String, trim: true },

  // Link to the Vehicle
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
  vehicleName: String, 
  chassisNo: String,
  engineNo: String,
  color: String,
  ccRating: String,

  // Money
  totalAmount: { type: Number, required: true, min: 0 },
  paidAmount: { type: Number, default: 0, min: 0 },
  deposit: { type: Number, required: true, min: 0 },
  
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
  {
    unique: true,
    partialFilterExpression: {
      identificationNo: { $exists: true, $type: 'string', $gt: '' },
      status: { $in: ['Good', 'Overdue'] }
    }
  }
);

export default mongoose.model('Financing', FinancingSchema);
