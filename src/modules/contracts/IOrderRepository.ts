import { Order } from '../../types';

export interface IOrderRepository {
  findById(id: number): Order | undefined;

  save(order: Omit<Order, 'id'>): Order;
}
