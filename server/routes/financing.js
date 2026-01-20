// server/routes/financing.js
import express from 'express';
import Financing from '../models/Financing.js';
import { uploadAgreement } from '../middleware/upload.js';
import fs from 'fs'; // Import FS to delete files if validation fails

const router = express.Router();

// --- GET ALL AGREEMENTS ---
router.get('/', async (req, res) => {
  try {
    const agreements = await Financing.find().sort({ createdAt: -1 });
    res.json(agreements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- CREATE NEW AGREEMENT (Fixed Error Handling) ---
router.post('/', (req, res) => {
  // Wrap upload in a function to catch Multer errors
  const upload = uploadAgreement.single('agreementFile');

  upload(req, res, async (err) => {
    // 1. Handle File Upload Errors (Size, Type)
    if (err) {
      return res.status(400).json({ message: err.message }); 
    }

    try {
      const { totalAmount, deposit } = req.body;

      // 2. Enforce 20% Deposit
      if (Number(deposit) < Number(totalAmount) * 0.2) {
        if (req.file) fs.unlinkSync(req.file.path); // Delete file if logic fails
        return res.status(400).json({ message: 'Minimum 20% deposit required' });
      }

      // 3. Create Record
      const financing = new Financing({
        ...req.body,
        agreementFile: req.file ? `/uploads/agreements/${req.file.filename}` : null,
        paymentHistory: [{
            date: new Date(),
            type: 'Deposit',
            amount: Number(deposit)
        }]
      });

      await financing.save();
      res.status(201).json(financing);

    } catch (error) {
      // Clean up file if database save fails
      if (req.file) fs.unlinkSync(req.file.path);

      // Handle Duplicate Key Error (Unique ID)
      if (error.code === 11000) {
        return res.status(400).json({ message: "A customer with this ID Number already has an active loan." });
      }
      
      res.status(500).json({ message: error.message });
    }
  });
});

// ... Keep your PUT route (pay) as is ...
router.put('/:id/pay', async (req, res) => {
    // (Your existing payment logic here)
    try {
      const { amount } = req.body;
      const agreement = await Financing.findById(req.params.id);
  
      if (!agreement) return res.status(404).json({ message: "Agreement not found" });
  
      agreement.paidAmount += Number(amount);
      agreement.installmentsPaid += 1;
      
      agreement.paymentHistory.push({
          date: new Date(),
          type: 'Installment',
          amount: Number(amount)
      });
  
      if (agreement.paidAmount >= agreement.totalAmount) {
          agreement.status = 'Completed';
          agreement.nextDueDate = null;
      } else {
          const currentDue = new Date(agreement.nextDueDate);
          if (agreement.paymentFrequency === 'weekly') {
              currentDue.setDate(currentDue.getDate() + 7);
          } else {
              currentDue.setMonth(currentDue.getMonth() + 1);
          }
          agreement.nextDueDate = currentDue;
          agreement.status = 'Good'; 
      }
  
      const updatedAgreement = await agreement.save();
      res.json(updatedAgreement);
  
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
});

export default router;