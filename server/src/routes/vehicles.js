import { Router } from "express";
import multer from "multer";
import Vehicle from "../models/Vehicle.js";
import { requireAdmin } from "../middleware/auth.js";
import { saveFile } from "../services/storage/index.js";
import {
  listVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle
} from "../controllers/vehicleController.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } });

router.get("/", listVehicles);
router.get("/:id", getVehicle);
router.post("/", requireAdmin, createVehicle);
router.put("/:id", requireAdmin, updateVehicle);
router.delete("/:id", requireAdmin, deleteVehicle);

router.post("/:id/images", requireAdmin, upload.array("images", 6), async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }
    const uploads = await Promise.all(req.files.map((file) => saveFile(file)));
    const urls = uploads.map((upload) => upload.url);
    vehicle.images = [...vehicle.images, ...urls];
    await vehicle.save();
    return res.json({ data: vehicle });
  } catch (error) {
    return next(error);
  }
});

export default router;
