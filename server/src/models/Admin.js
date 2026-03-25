import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true }
  },
  { timestamps: true }
);

adminSchema.methods.verifyPassword = async function verifyPassword(password) {
  return bcrypt.compare(password, this.passwordHash);
};

adminSchema.statics.hashPassword = async function hashPassword(password) {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
};

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
