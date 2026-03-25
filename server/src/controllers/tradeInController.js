import TradeInRequest from "../models/TradeInRequest.js";

export const createTradeIn = async (req, res, next) => {
  try {
    const { makeModel, year, mileage, condition, name, phone } = req.body;
    if (!makeModel || !year || !mileage || !condition || !name || !phone) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const tradeIn = await TradeInRequest.create({ makeModel, year, mileage, condition, name, phone });
    return res.status(201).json({ data: tradeIn });
  } catch (error) {
    return next(error);
  }
};

export const listTradeIns = async (req, res, next) => {
  try {
    const requests = await TradeInRequest.find().sort({ createdAt: -1 }).limit(200);
    return res.json({ data: requests });
  } catch (error) {
    return next(error);
  }
};

export const updateTradeIn = async (req, res, next) => {
  try {
    const request = await TradeInRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!request) {
      return res.status(404).json({ message: "Trade-in not found" });
    }
    return res.json({ data: request });
  } catch (error) {
    return next(error);
  }
};
