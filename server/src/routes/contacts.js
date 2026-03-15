import { Router } from "express";
import { requireAdmin } from "../middleware/auth.js";
import {
  createContact,
  listContacts,
  updateContact
} from "../controllers/contactController.js";

const router = Router();

router.post("/", createContact);
router.get("/", requireAdmin, listContacts);
router.patch("/:id", requireAdmin, updateContact);

export default router;
