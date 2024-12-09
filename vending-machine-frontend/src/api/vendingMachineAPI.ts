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
