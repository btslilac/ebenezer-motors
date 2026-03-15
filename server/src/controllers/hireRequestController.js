import HireRequest from "../models/HireRequest.js";

export const createHireRequest = async (req, res, next) => {
  try {
    const { vehicleId, name, phone, email, startDate, endDate, notes } = req.body;
    if (!vehicleId || !name || !phone) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const request = await HireRequest.create({
      vehicle: vehicleId,
      name,
      phone,
      email,
      startDate,
      endDate,
      notes
    });
    return res.status(201).json({ data: request });
  } catch (error) {
    return next(error);
  }
};

export const listHireRequests = async (req, res, next) => {
  try {
    const requests = await HireRequest.find()
      .populate("vehicle", "name brand modelYear")
      .sort({ createdAt: -1 })
      .limit(200);
    return res.json({ data: requests });
  } catch (error) {
    return next(error);
  }
};

export const updateHireRequest = async (req, res, next) => {
  try {
    const request = await HireRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!request) {
      return res.status(404).json({ message: "Hire request not found" });
    }
    return res.json({ data: request });
  } catch (error) {
    return next(error);
  }
};
