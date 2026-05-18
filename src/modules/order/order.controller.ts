import { CreateOrderDTO, Order } from '../../types';
import { OrderService } from './order.service';

export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  getOrder(id: number): Order {
    return this.orderService.getOrder(id);
  }

  createOrder(dto: CreateOrderDTO): Order {
    return this.orderService.createOrder(dto);
  }
}
