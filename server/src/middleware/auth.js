import jwt from "jsonwebtoken";
import config from "../config/env.js";
import Admin from "../models/Admin.js";

export const requireAdmin = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) {
      return res.status(401).json({ message: "Missing auth token" });
    }
    const payload = jwt.verify(token, config.jwtSecret);
    const admin = await Admin.findById(payload.sub).select("_id email name");
    if (!admin) {
      return res.status(401).json({ message: "Invalid auth token" });
    }
    req.admin = admin;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid auth token" });
  }
};
