import { Balance } from "../models/Balance";
import { Product } from "../models/Product";

interface IResponse {
  success: boolean;
  message: string;
  data: {
    message: string;
    change: {
      cash: number;
      coins: number;
    };
  };
}

export const fetchAllProducts = async () => {
  const response = await fetch(
    "http://localhost:5000/api/v1/vending-machine/products"
  );
  const responseJSON = await response.json();
  const modeledData = Product.mapProducts(responseJSON?.data ?? []);
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

export const purchaseProducts = async ({
  items,
  payment,
}: {
  items: { productId: string; quantity: number }[];
  payment: { cash: number; coins: number };
}): Promise<IResponse> => {
  const response = await fetch(
    "http://localhost:5000/api/v1/vending-machine/purchase",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items, payment }),
    }
  );
  const responseJSON = await response.json();
  return responseJSON;
};

export const refundProducts = async ({
  items,
}: {
  items: { productId: string; quantity: number }[];
}): Promise<IResponse> => {
  const response = await fetch(
    "http://localhost:5000/api/v1/vending-machine/refund",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    }
  );
  const responseJSON = await response.json();
  return responseJSON;
};
