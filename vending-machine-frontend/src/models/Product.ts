interface IProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export class Product {
  public id: string;
  public name: string;
  public price: number;
  public stock: number;
  constructor(id: string, name: string, price: number, stock: number) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.stock = stock;
  }

  static mapProducts(products: IProduct[]): Product[] {
    return products.map(
      (product: IProduct) =>
        new Product(product.id, product.name, product.price, product.stock)
    );
  }
}
