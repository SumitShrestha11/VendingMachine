import { VendingMachineRepository } from "../../infrastructure/repositories/VendingMachineRepository";
import {
  Product,
  VendingMachineState,
} from "../../infrastructure/state/VendingMachineState";

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

  public purchaseProduct(
    productName: string,
    quantity: number,
    payment: { cash: number; coins: number }
  ) {
    const { cash, coins } = payment;
    const product = this.repository.getProductByName(productName);

    if (!product) {
      throw new Error("Product not found.");
    }
    if (product.quantity < quantity) {
      throw new Error("Product is out of stock.");
    }

    const totalPayment = cash + coins;
    if (totalPayment < product.price * quantity) {
      throw new Error("Insufficient payment.");
    }

    // Calculate change
    const change = totalPayment - product.price * quantity;
    if (!this.canProvideChange(change)) {
      throw new Error("Unable to provide change.");
    }

    // Update stock and cash
    this.repository.updateProductStock(productName, -quantity);
    this.repository.updateBalance(cash, coins);

    // Deduct change from available cash/coins
    return this.provideChange(change);
  }

  public refundProduct(productName: string, quantity: number) {
    const product = this.repository.getProductByName(productName);

    if (!product) {
      throw new Error("Product not found.");
    }

    const refundAmount = product.price * quantity;

    // Calculate change
    if (!this.canProvideChange(refundAmount)) {
      throw new Error("Unable to provide change.");
    }

    this.repository.updateProductStock(productName, quantity);

    return this.provideChange(refundAmount);
  }

  private canProvideChange(change: number): boolean {
    const vendingMachineState = this.repository.getState();
    console.log(change, vendingMachineState);
    return change <= vendingMachineState.cash + vendingMachineState.coins;
  }

  private provideChange(change: number): IMessage {
    const vendingMachineState = this.repository.getState();
    if (change <= vendingMachineState.coins) {
      this.repository.updateBalance(0, -change);
      return {
        message: "Purchase successful",
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
        message: "Purchase successful",
        change: {
          cash: remainingChange,
          coins: inititalVendingMachineCoins,
        },
      };
    }
  }
}
