import { CreateOrderDTO, Order } from '../../types';

import { IOrderRepository } from '../contracts/IOrderRepository';
import { IProductRepository } from '../contracts/IProductRepository';

export class OrderService {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly productRepository: IProductRepository,
  ) {}

  getOrder(id: number): Order {
    const order = this.orderRepository.findById(id);
    if (!order) {
      throw new Error(`Pedido ${id} não encontrado`);
    }
    return order;
  }

  createOrder(dto: CreateOrderDTO): Order {
    let total = 0;
    for (const item of dto.items) {
      const product = this.productRepository.findById(item.productId);
      if (!product) {
        throw new Error(`Produto ${item.productId} não encontrado`);
      }
      if (product.stock < item.quantity) {
        throw new Error(
          `Estoque insuficiente para o produto "${product.name}"`,
        );
      }
      total += product.price * item.quantity;
    }
    for (const item of dto.items) {
      this.productRepository.decreaseStock(item.productId, item.quantity);
    }
    return this.orderRepository.save({
      items: dto.items,
      total,
      status: 'confirmed',
    });
  }
}
