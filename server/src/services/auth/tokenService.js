import jwt from "jsonwebtoken";
import config from "../../config/env.js";

export const signAdminToken = (admin) => {
  return jwt.sign(
    { sub: admin._id.toString(), email: admin.email },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
};
