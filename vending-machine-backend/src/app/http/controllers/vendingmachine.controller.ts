import { Request, Response } from "express";
import { VendingMachineService } from "../../../domain/services/vendingmachine.service";
import { VendingMachineRepository } from "../../../infrastructure/repositories/vendingmachine.repository";
import { errorResponse, successResponse } from "../utils/response.util";

const repository = new VendingMachineRepository();
const service = new VendingMachineService(repository);

export class VendingMachineController {
  static getStatus(req: Request, res: Response): void {
    res.status(200).json(
      successResponse({
        status: "Vending machine is operational",
        state: service.getState(),
      })
    );
  }
  static getProducts(req: Request, res: Response): void {
    try {
      const products = service.getProducts();
      res.status(200).json(successResponse(products));
    } catch (error: any) {
      res.status(400).json(errorResponse(error.message));
    }
  }

  static getBalance(req: Request, res: Response): void {
    try {
      const { cash, coins } = service.getState();
      res.status(200).json(successResponse({ cash, coins }));
    } catch (error: any) {
      res.status(400).json(errorResponse(error.message));
    }
  }

  static purchase(req: Request, res: Response): void {
    try {
      const {
        items,
        payment: { cash, coins },
      } = req.body;
      const result = service.purchaseProducts(items, {
        cash,
        coins,
      });
      res.status(200).json(successResponse(result));
    } catch (error: any) {
      res.status(400).json(errorResponse(error.message));
    }
  }

  static refund(req: Request, res: Response): void {
    try {
      const { items } = req.body;
      const result = service.refundProducts(items);
      res.status(200).json(successResponse(result));
    } catch (error: any) {
      res.status(400).json(errorResponse(error.message));
    }
  }
}
