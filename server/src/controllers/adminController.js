import Admin from "../models/Admin.js";
import config from "../config/env.js";
import { signAdminToken } from "../services/auth/tokenService.js";

export const registerAdmin = async (req, res, next) => {
  try {
    const { name, email, password, registrationKey } = req.body;
    if (!name || !email || !password || !registrationKey) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    if (registrationKey !== config.adminRegistrationKey) {
      return res.status(401).json({ message: "Invalid registration key" });
    }
    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Admin already exists" });
    }
    const passwordHash = await Admin.hashPassword(password);
    const admin = await Admin.create({ name, email, passwordHash });
    const token = signAdminToken(admin);
    return res.status(201).json({ token, admin: { id: admin._id, name, email } });
  } catch (error) {
    return next(error);
  }
};

export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Missing email or password" });
    }
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const ok = await admin.verifyPassword(password);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = signAdminToken(admin);
    return res.json({ token, admin: { id: admin._id, name: admin.name, email } });
  } catch (error) {
    return next(error);
  }
};
