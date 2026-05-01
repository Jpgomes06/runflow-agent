import { Product } from '../../types';
import { productRepository } from './product.repository';

export const productService = {
  listProducts(): Product[] {
    return productRepository.findAll();
  },

  getProduct(id: number): Product {
    const product = productRepository.findById(id);
    if (!product) throw new Error(`Produto ${id} não encontrado`);
    return product;
  },
};
