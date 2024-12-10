import { VendingMachineService } from "../src/domain/services/vendingmachine.service";
import { VendingMachineRepository } from "../src/infrastructure/repositories/vendingmachine.repository";

describe("VendingMachineService", () => {
  let service: VendingMachineService;
  let repository: VendingMachineRepository;

  beforeEach(() => {
    repository = new VendingMachineRepository();
    service = new VendingMachineService(repository);
  });

  describe("getState", () => {
    it("returns the current state of the vending machine", () => {
      const state = service.getState();
      expect(state).toEqual(repository.getState());
    });
  });

  describe("getProducts", () => {
    it("returns a list of all products", () => {
      const products = service.getProducts();
      expect(products).toEqual(repository.getProducts());
    });
  });

  describe("purchaseProducts", () => {
    it("throws an error if any product is invalid", () => {
      const invalidProduct = { productId: " invalid", quantity: 1 };
      const validProduct = { productId: "1", quantity: 1 };
      expect(() =>
        service.purchaseProducts([invalidProduct, validProduct], {
          cash: 10,
          coins: 10,
        })
      ).toThrowError("Invalid products: invalid");
    });

    it("throws an error if any product has insufficient stock", () => {
      const productWithInsufficientStock = { productId: "1", quantity: 11 };
      const validProduct = { productId: "2", quantity: 1 };
      expect(() =>
        service.purchaseProducts([productWithInsufficientStock, validProduct], {
          cash: 10,
          coins: 10,
        })
      ).toThrowError("Insufficient stock for products: 1");
    });

    it("returns the change if the payment is sufficient", () => {
      const product = { productId: "1", quantity: 1 };
      const payment = { cash: 10, coins: 10 };
      const result = service.purchaseProducts([product], payment);
      expect(result).toEqual({
        message: "Purchase successful",
        change: { cash: 0, coins: 0 },
      });
    });
  });
});
