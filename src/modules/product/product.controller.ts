import { ProductService } from './product.service';
import { Product } from '../../types';

export class ProductController {
  constructor(private readonly productService: ProductService) {}

  listProducts(): Product[] {
    return this.productService.listProducts();
  }

  getProduct(id: number): Product {
    return this.productService.getProduct(id);
  }
}
