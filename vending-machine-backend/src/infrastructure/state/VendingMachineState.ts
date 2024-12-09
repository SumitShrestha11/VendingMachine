export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export interface VendingMachineState {
  products: Product[];
  cash: number;
  coins: number;
}

// In-memory data source
export const vendingMachineState: VendingMachineState = {
  products: [
    { id: "1", name: "Coke", price: 20, stock: 10 },
    { id: "2", name: "Pepsi", price: 25, stock: 10 },
    { id: "3", name: "Dew", price: 30, stock: 10 },
  ],
  cash: 200,
  coins: 100,
};
