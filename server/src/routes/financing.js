import { Router } from "express";
import { requireAdmin } from "../middleware/auth.js";
import {
  createClient,
  listClients,
  updateClient,
  createRecord,
  listRecords,
  updateRecord,
  addPayment
} from "../controllers/financingController.js";

const router = Router();

// Clients
router.post("/clients", createClient);
router.get("/clients", requireAdmin, listClients);
router.patch("/clients/:id", requireAdmin, updateClient);

// Financing records
router.post("/records", requireAdmin, createRecord);
router.get("/records", requireAdmin, listRecords);
router.patch("/records/:id", requireAdmin, updateRecord);

// Payment logging
router.post("/records/:id/payments", requireAdmin, addPayment);

export default router;
