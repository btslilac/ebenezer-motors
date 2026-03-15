import { Router } from "express";
import { requireAdmin } from "../middleware/auth.js";
import {
  createTradeIn,
  listTradeIns,
  updateTradeIn
} from "../controllers/tradeInController.js";

const router = Router();

router.post("/", createTradeIn);
router.get("/", requireAdmin, listTradeIns);
router.patch("/:id", requireAdmin, updateTradeIn);

export default router;
