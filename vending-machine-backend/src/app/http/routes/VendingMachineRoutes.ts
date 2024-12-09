import { Router } from "express";
import { VendingMachineController } from "../controllers/VendingMachineController";

const router = Router();

router.get("/status", VendingMachineController.getStatus);

router.get("/products", VendingMachineController.getProducts);
router.post("/purchase", VendingMachineController.purchase);
router.post("/refund", VendingMachineController.refund);

export default router;
