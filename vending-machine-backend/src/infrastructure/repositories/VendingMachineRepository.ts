import {
  Product,
  vendingMachineState,
  VendingMachineState,
} from "../state/VendingMachineState";

export class VendingMachineRepository {
  // Get all products
  getProducts(): Product[] {
    return vendingMachineState.products;
  }

  // Get product by name
  getProductByName(name: string): Product | undefined {
    return vendingMachineState.products.find(
      (product) => product.name === name
    );
  }

  // Update product stock
  updateProductStock(name: string, quantity: number): void {
    const product = this.getProductByName(name);
    if (!product) {
      throw new Error("Product not found");
    }
    product.quantity += quantity;
  }

  // Update cash and coins
  updateBalance(cash: number, coins: number): void {
    vendingMachineState.cash += cash;
    vendingMachineState.coins += coins;
  }

  // Get full state (for debugging or admin)
  getState(): VendingMachineState {
    return vendingMachineState;
  }
}
