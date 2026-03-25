import FinancingClient from "../models/FinancingClient.js";
import FinancingRecord from "../models/FinancingRecord.js";

// ── Clients ──────────────────────────────────────────────────────────────────

export const createClient = async (req, res, next) => {
  try {
    const { fullName, phone, email, idNumber, address, notes } = req.body;
    if (!fullName || !phone) {
      return res.status(400).json({ message: "fullName and phone are required" });
    }
    const client = await FinancingClient.create({ fullName, phone, email, idNumber, address, notes });
    return res.status(201).json({ data: client });
  } catch (error) {
    return next(error);
  }
};

export const listClients = async (req, res, next) => {
  try {
    const clients = await FinancingClient.find().sort({ createdAt: -1 }).limit(500);
    return res.json({ data: clients });
  } catch (error) {
    return next(error);
  }
};

export const updateClient = async (req, res, next) => {
  try {
    const client = await FinancingClient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!client) return res.status(404).json({ message: "Client not found" });
    return res.json({ data: client });
  } catch (error) {
    return next(error);
  }
};

// ── Financing Records ─────────────────────────────────────────────────────────

export const createRecord = async (req, res, next) => {
  try {
    const {
      client,
      vehicle,
      vehicleName,
      vehiclePrice,
      downPayment,
      financedAmount,
      monthlyInstalment,
      durationMonths,
      startDate,
      notes
    } = req.body;

    if (!client || !vehicleName || !vehiclePrice || !financedAmount) {
      return res.status(400).json({ message: "client, vehicleName, vehiclePrice, and financedAmount are required" });
    }

    const record = await FinancingRecord.create({
      client,
      vehicle,
      vehicleName,
      vehiclePrice,
      downPayment: downPayment || 0,
      financedAmount,
      monthlyInstalment,
      durationMonths,
      startDate,
      notes
    });

    const populated = await FinancingRecord.findById(record._id).populate("client").populate("vehicle");
    return res.status(201).json({ data: populated });
  } catch (error) {
    return next(error);
  }
};

export const listRecords = async (req, res, next) => {
  try {
    const records = await FinancingRecord.find()
      .sort({ createdAt: -1 })
      .populate("client")
      .populate("vehicle")
      .limit(500);
    return res.json({ data: records });
  } catch (error) {
    return next(error);
  }
};

export const updateRecord = async (req, res, next) => {
  try {
    const record = await FinancingRecord.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("client")
      .populate("vehicle");
    if (!record) return res.status(404).json({ message: "Record not found" });
    return res.json({ data: record });
  } catch (error) {
    return next(error);
  }
};

// ── Payment logging ───────────────────────────────────────────────────────────

export const addPayment = async (req, res, next) => {
  try {
    const { amount, note, date } = req.body;
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({ message: "A positive amount is required" });
    }

    const record = await FinancingRecord.findById(req.params.id);
    if (!record) return res.status(404).json({ message: "Record not found" });

    record.payments.push({ amount: Number(amount), note, date: date || new Date() });

    // Auto-complete when balance hits zero
    const totalPaid = record.payments.reduce((sum, p) => sum + p.amount, 0);
    if (totalPaid >= record.financedAmount && record.status === "active") {
      record.status = "completed";
    }

    await record.save();

    const populated = await FinancingRecord.findById(record._id).populate("client").populate("vehicle");
    return res.json({ data: populated });
  } catch (error) {
    return next(error);
  }
};
