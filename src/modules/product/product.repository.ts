import { Product } from '../../types';
import { IProductRepository } from '../contracts/IProductRepository';

const products: Product[] = [
  { id: 1, name: 'Notebook', price: 3500, stock: 10 },
  { id: 2, name: 'Mouse', price: 150, stock: 50 },
  { id: 3, name: 'Teclado', price: 300, stock: 30 },
  { id: 4, name: 'Monitor', price: 1200, stock: 8 },
  { id: 5, name: 'Headset', price: 250, stock: 20 },
];

export class ProductRepository implements IProductRepository {
  findAll(): Product[] {
    return products;
  }

  findById(id: number): Product | undefined {
    return products.find((p) => p.id === id);
  }

  decreaseStock(id: number, quantity: number): void {
    const product = products.find((p) => p.id === id);

    if (product) {
      product.stock -= quantity;
    }
  }
}
