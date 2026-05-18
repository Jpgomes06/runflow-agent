import axios from 'axios';
import { CreateOrderDTO, Order } from '../../types';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

export class OrderApiService {
  async findById(id: number): Promise<Order> {
    const { data } = await axios.get<Order>(`${API_BASE_URL}/orders/${id}`);

    return data;
  }

  async create(dto: CreateOrderDTO): Promise<Order> {
    const { data } = await axios.post<Order>(`${API_BASE_URL}/orders`, dto);

    return data;
  }
}
