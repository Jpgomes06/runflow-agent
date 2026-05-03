import { Order, CreateOrderDTO } from '../../types';
import { orderRepository } from './order.repository';
import { productRepository } from '../product/product.repository';

export const orderService = {
  getOrder(id: number): Order {
    const order = orderRepository.findById(id);
    if (!order) throw new Error(`Pedido ${id} não encontrado`);
    return order;
  },

  createOrder(dto: CreateOrderDTO): Order {
    let total = 0;

    for (const item of dto.items) {
      const product = productRepository.findById(item.productId);
      if (!product) throw new Error(`Produto ${item.productId} não encontrado`);
      if (product.stock < item.quantity) {
        throw new Error(
          `Estoque insuficiente para o produto "${product.name}" (disponível: ${product.stock})`,
        );
      }
      total += product.price * item.quantity;
    }

    for (const item of dto.items) {
      productRepository.decreaseStock(item.productId, item.quantity);
    }

    return orderRepository.save({
      items: dto.items,
      total,
      status: 'confirmed',
    });
  },
};
