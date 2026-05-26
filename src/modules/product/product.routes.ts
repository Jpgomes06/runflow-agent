import express from 'express';
import { ProductController } from './product.controller';

export function createProductRouter(controller: ProductController) {
  const router = express.Router();
  router.get('/', (request, response) => {
    return response.json(controller.listProducts());
  });
  router.get('/:id', (request, response) => {
    return response.json(controller.getProduct(Number(request.params.id)));
  });
  return router;
}
