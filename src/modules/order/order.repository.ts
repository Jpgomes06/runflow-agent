import { Order } from '../../types';
import { IOrderRepository } from '../contracts/IOrderRepository';

const orders: Order[] = [];

let nextId = 1;

export class OrderRepository implements IOrderRepository {
  findById(id: number): Order | undefined {
    return orders.find((o) => o.id === id);
  }

  save(order: Omit<Order, 'id'>): Order {
    const newOrder: Order = {
      id: nextId++,
      ...order,
    };

    orders.push(newOrder);

    return newOrder;
  }
}
