interface IProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export class Product {
  constructor(
    public id: string,
    public name: string,
    public price: number,
    public stock: number
  ) {}

  static mapProducts(products: IProduct[]): Product[] {
    return products.map(
      (product: IProduct) =>
        new Product(product.id, product.name, product.price, product.stock)
    );
  }
}
