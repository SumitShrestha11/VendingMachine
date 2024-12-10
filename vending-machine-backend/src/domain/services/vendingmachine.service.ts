import { VendingMachineRepository } from "../../infrastructure/repositories/vendingmachine.repository";
import {
  Product,
  VendingMachineState,
} from "../../infrastructure/state/vendingmachine.state";

interface IMessage {
  message: string;
  change?: {
    cash: number;
    coins: number;
  };
}

export class VendingMachineService {
  private repository: VendingMachineRepository;

  constructor(repository: VendingMachineRepository) {
    this.repository = repository;
  }

  public getState(): VendingMachineState {
    return this.repository.getState();
  }
  public getProducts(): Product[] {
    return this.repository.getProducts();
  }

  public purchaseProducts(
    items: { productId: string; quantity: number }[],
    payment: { cash: number; coins: number }
  ) {
    const { cash, coins } = payment;

    let totalCost = 0;
    const insufficientStock = [];
    const invalidProducts = [];

    // Validate all products in the purchase list
    for (const { productId, quantity } of items) {
      const product = this.repository.getProductById(productId);

      if (!product) {
        invalidProducts.push(productId);
        continue;
      }

      if (product.stock < quantity) {
        insufficientStock.push(productId);
        continue;
      }

      totalCost += product.price * quantity;
    }

    if (invalidProducts.length > 0) {
      throw new Error(`Invalid products: ${invalidProducts.join(", ")}`);
    }

    if (insufficientStock.length > 0) {
      throw new Error(
        `Insufficient stock for products: ${insufficientStock.join(", ")}`
      );
    }

    const totalPayment = cash + coins;

    if (totalPayment < totalCost) {
      throw new Error("Insufficient payment.");
    }

    // Calculate change
    const change = totalPayment - totalCost;
    if (!this.canProvideChange(change)) {
      throw new Error("Unable to provide change.");
    }

    // Update stock and cash for all items
    for (const { productId, quantity } of items) {
      this.repository.updateProductStock(productId, -quantity);
    }

    this.repository.updateBalance(cash, coins);

    // Deduct change from available cash/coins
    return this.provideChange(change, "PURCHASE");
  }

  public refundProducts(items: { productId: string; quantity: number }[]) {
    let totalRefund = 0;
    const invalidProducts = [];
    const refundDetails = [];

    // Validate products and calculate total refund
    for (const { productId, quantity } of items) {
      const product = this.repository.getProductById(productId);

      if (!product) {
        invalidProducts.push(productId);
        continue;
      }

      // Accumulate refund amount for valid products
      const refundAmount = product.price * quantity;
      totalRefund += refundAmount;

      // Update product stock in-memory (add quantity back to stock)
      refundDetails.push({ productId, quantity });
    }

    if (invalidProducts.length > 0) {
      throw new Error(`Invalid products: ${invalidProducts.join(", ")}`);
    }

    // Check if we can provide the total refund amount
    if (!this.canProvideChange(totalRefund)) {
      throw new Error("Unable to provide change for the refund.");
    }

    // Process the refunds: Update product stock
    for (const { productId, quantity } of refundDetails) {
      this.repository.updateProductStock(productId, quantity);
    }

    // Provide the refund as change
    return this.provideChange(totalRefund, "REFUND");
  }

  private canProvideChange(change: number): boolean {
    const vendingMachineState = this.repository.getState();
    return change <= vendingMachineState.cash + vendingMachineState.coins;
  }

  private provideChange(
    change: number,
    forWhat: "REFUND" | "PURCHASE"
  ): IMessage {
    const vendingMachineState = this.repository.getState();
    if (change <= vendingMachineState.coins) {
      this.repository.updateBalance(0, -change);
      return {
        message:
          forWhat === "PURCHASE" ? "Purchase successful" : "Refund successful",
        change: {
          cash: 0,
          coins: change,
        },
      };
    } else {
      const remainingChange = change - vendingMachineState.coins;
      const inititalVendingMachineCoins = vendingMachineState.coins;

      this.repository.updateBalance(
        -remainingChange,
        -inititalVendingMachineCoins
      );
      return {
        message:
          forWhat === "PURCHASE" ? "Purchase successful" : "Refund successful",
        change: {
          cash: remainingChange,
          coins: inititalVendingMachineCoins,
        },
      };
    }
  }
}
