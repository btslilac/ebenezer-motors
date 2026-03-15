import { Router } from "express";
import { requireAdmin } from "../middleware/auth.js";
import {
  createHireRequest,
  listHireRequests,
  updateHireRequest
} from "../controllers/hireRequestController.js";

const router = Router();

router.post("/", createHireRequest);
router.get("/", requireAdmin, listHireRequests);
router.patch("/:id", requireAdmin, updateHireRequest);

export default router;
