export interface Product {
  name: string;
  price: number;
  quantity: number;
}

export interface VendingMachineState {
  products: Product[];
  cash: number;
  coins: number;
}

// In-memory data source
export const vendingMachineState: VendingMachineState = {
  products: [
    { name: "Coke", price: 20, quantity: 10 },
    { name: "Pepsi", price: 25, quantity: 10 },
    { name: "Dew", price: 30, quantity: 10 },
  ],
  cash: 200,
  coins: 100,
};
