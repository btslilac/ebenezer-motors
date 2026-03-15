import { Router } from "express";
import { requireAdmin } from "../middleware/auth.js";
import { registerAdmin, loginAdmin } from "../controllers/adminController.js";

const router = Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

router.get("/me", requireAdmin, (req, res) => {
  res.json({ admin: req.admin });
});

export default router;
