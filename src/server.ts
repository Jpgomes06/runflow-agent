import express from 'express';
import { productRouter } from './modules/product/product.controller';
import { orderRouter } from './modules/order/order.controller';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/products', productRouter);
app.use('/orders', orderRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
