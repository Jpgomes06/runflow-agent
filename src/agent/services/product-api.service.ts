import axios from 'axios';
import { Product } from '../../types';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

export class ProductApiService {
  async findAll(): Promise<Product[]> {
    const { data } = await axios.get<Product[]>(`${API_BASE_URL}/products`);

    return data;
  }

  async findById(id: number): Promise<Product> {
    const { data } = await axios.get<Product>(`${API_BASE_URL}/products/${id}`);

    return data;
  }
}
