import { Request, Response } from "express";
import { VendingMachineService } from "../../../domain/services/VendingMachineService";
import { VendingMachineRepository } from "../../../infrastructure/repositories/VendingMachineRepository";

const repository = new VendingMachineRepository();
const service = new VendingMachineService(repository);

export class VendingMachineController {
  static getStatus(req: Request, res: Response): void {
    res.status(200).json({
      status: "Vending machine is operational",
      state: service.getState(),
    });
  }
  static getProducts(req: Request, res: Response): void {
    try {
      const products = service.getProducts();
      res.status(200).json(products);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static purchase(req: Request, res: Response): void {
    try {
      const { productName, cash, coins, quantity } = req.body;
      const result = service.purchaseProduct(productName, quantity, {
        cash,
        coins,
      });
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static refund(req: Request, res: Response): void {
    try {
      const { productName, quantity } = req.body;
      const result = service.refundProduct(productName, quantity);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
