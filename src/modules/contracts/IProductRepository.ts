import { Product } from '../../types';

export interface IProductRepository {
  findAll(): Product[];

  findById(id: number): Product | undefined;

  decreaseStock(id: number, quantity: number): void;
}
