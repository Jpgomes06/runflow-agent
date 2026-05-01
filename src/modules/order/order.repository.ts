const orders: Order[] = [];

import { Order } from '../../types';
let nextId = 1;

export const orderRepository = {
  findAll(): Order[] {
    return orders;
  },

  findById(id: number): Order | undefined {
    return orders.find((o) => o.id === id);
  },

  save(order: Omit<Order, 'id'>): Order {
    const newOrder: Order = { id: nextId++, ...order };
    orders.push(newOrder);
    return newOrder;
  },
};
