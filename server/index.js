import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import Routes
import financingRoutes from './routes/financing.js'; // NEW IMPORT
import Vehicle from './models/Vehicle.js'; // We keep Vehicle logic here or move it later

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve uploaded files publicly
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect Database
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ebenezer_motors')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB Error:', err));

// --- ROUTES ---

// Use the new Financing Route File
app.use('/api/financing', financingRoutes); 

// Keep Vehicle Routes here for now (or create routes/vehicles.js similarly)
app.get('/api/vehicles', async (req, res) => {
  try {
    const vehicles = await Vehicle.find().sort({ createdAt: -1 });
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/vehicles', async (req, res) => {
  try {
    const newVehicle = new Vehicle(req.body);
    await newVehicle.save();
    res.status(201).json(newVehicle);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));