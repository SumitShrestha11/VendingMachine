import { Router } from "express";
import { VendingMachineController } from "../controllers/vendingmachine.controller";

const router = Router();

router.get("/status", VendingMachineController.getStatus);

router.get("/balance", VendingMachineController.getBalance);
router.get("/products", VendingMachineController.getProducts);
router.post("/purchase", VendingMachineController.purchase);
router.post("/refund", VendingMachineController.refund);

export default router;
