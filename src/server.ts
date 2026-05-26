import express from 'express';

import { ProductRepository } from './modules/product/product.repository';
import { ProductService } from './modules/product/product.service';
import { ProductController } from './modules/product/product.controller';
import { createProductRouter } from './modules/product/product.routes';

import { OrderRepository } from './modules/order/order.repository';
import { OrderService } from './modules/order/order.service';
import { OrderController } from './modules/order/order.controller';
import { createOrderRouter } from './modules/order/order.routes';

const app = express();
const PORT = process.env.PORT || 3000;
const productRepository = new ProductRepository();
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

const orderRepository = new OrderRepository();
const orderService = new OrderService(orderRepository, productRepository);
const orderController = new OrderController(orderService);

app.use(express.json());
app.use('/products', createProductRouter(productController));
app.use('/orders', createOrderRouter(orderController));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
