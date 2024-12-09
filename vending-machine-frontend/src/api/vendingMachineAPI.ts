import { Balance } from "../models/Balance";
import { Product } from "../models/Product";

export const fetchAllProducts = async () => {
  const response = await fetch(
    "http://localhost:5000/api/v1/vending-machine/products"
  );
  const responseJSON = await response.json();
  const modeledData = Product.mapProducts(responseJSON?.data ?? []);
  console.log("modeledData", modeledData);
  return modeledData;
};

export const getBalanceOfVendingMachine = async () => {
  const response = await fetch(
    "http://localhost:5000/api/v1/vending-machine/balance"
  );
  const responseJSON = await response.json();
  const modeledData = new Balance(responseJSON?.data);
  return modeledData;
};

export const purchaseProduct = async ({
  productId,
  quantity,
  cash,
  coins,
}: {
  productId: string;
  quantity: number;
  cash: number;
  coins: number;
}) => {
  const response = await fetch(
    "http://localhost:5000/api/v1/vending-machine/purchase",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity, cash, coins }),
    }
  );
  const responseJSON = await response.json();
  return responseJSON;
};

export const refundProduct = async (productId: string, quantity: number) => {
  const response = await fetch(
    "http://localhost:5000/api/v1/vending-machine/refund",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity }),
    }
  );
  const responseJSON = await response.json();
  return responseJSON;
};
