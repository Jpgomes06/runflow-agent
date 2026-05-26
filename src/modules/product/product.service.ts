import { Product } from '../../types';
import { IProductRepository } from '../contracts/IProductRepository';

export class ProductService {
  constructor(private readonly productRepository: IProductRepository) {}

  listProducts(): Product[] {
    return this.productRepository.findAll();
  }
  getProduct(id: number): Product {
    const product = this.productRepository.findById(id);
    if (!product) {
      throw new Error(`Produto ${id} não encontrado`);
    }
    return product;
  }
}
