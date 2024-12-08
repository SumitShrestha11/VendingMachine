import { PaymentMethod } from "../enums/PaymentMethod";
import { Product } from "./Product";

export class VendingMachine {
  private products: Product[];
  private coinBalance: number;
  private cashBalance: number;

  constructor() {
    this.products = [
      new Product("Coke", 20, 10),
      new Product("Pepsi", 25, 10),
      new Product("Dew", 30, 10),
    ];
    this.coinBalance = 100;
    this.cashBalance = 200;
  }

  public purchase(
    productName: string,
    amount: number,
    paymentMethod: PaymentMethod
  ): string {
    const product = this.products.find(
      (p) => p.name.toLowerCase() === productName.toLowerCase()
    );

    if (!product) {
      return "Product not found.";
    }

    if (product.stock === 0) {
      return "Product out of stock.";
    }

    if (amount < product.price) {
      return "Insufficient funds.";
    }

    const change = amount - product.price;

    if (paymentMethod === PaymentMethod.COIN && change > this.coinBalance) {
      return "Not enough coins for change.";
    }

    if (paymentMethod === PaymentMethod.CASH && change > this.cashBalance) {
      return "Not enough cash for change.";
    }

    product.stock--;

    if (paymentMethod === PaymentMethod.COIN) {
      this.coinBalance += product.price;
      this.coinBalance -= change;
    } else {
      this.cashBalance += product.price;
      this.cashBalance -= change;
    }

    return `Dispensing ${
      product.name
    }. Your change is ${change} ${paymentMethod.toLowerCase()}.`;
  }

  public refund(productName: string): string {
    const product = this.products.find(
      (p) => p.name.toLowerCase() === productName.toLowerCase()
    );

    if (!product) {
      return "Product not found.";
    }

    product.stock++;
    this.coinBalance -= product.price; // Assuming refunds are always given in coins

    return `Refunded ${product.name}. ${product.price} coins returned.`;
  }

  public purchaseWithMixedPayment(
    productName: string,
    cashAmount: number,
    coinAmount: number
  ): string {
    const product = this.products.find(
      (p) => p.name.toLowerCase() === productName.toLowerCase()
    );

    if (!product) {
      return "Product not found.";
    }

    if (product.stock === 0) {
      return "Product out of stock.";
    }

    const totalAmount = cashAmount + coinAmount;

    if (totalAmount < product.price) {
      return "Insufficient funds.";
    }

    const change = totalAmount - product.price;

    if (change > this.coinBalance + this.cashBalance) {
      return "Not enough change available.";
    }

    product.stock--;
    this.cashBalance += cashAmount;
    this.coinBalance += coinAmount;

    const cashChange = Math.min(change, this.cashBalance);
    const coinChange = change - cashChange;

    this.cashBalance -= cashChange;
    this.coinBalance -= coinChange;

    return `Dispensing ${product.name}. Your change is ${cashChange} cash and ${coinChange} coins.`;
  }

  public getStatus(): string {
    return `
      Stock:
      ${this.products.map((p) => `${p.name}: ${p.stock}`).join(", ")}
      
      Balance:
      Coins: ${this.coinBalance}
      Cash: ${this.cashBalance}
    `;
  }
}
