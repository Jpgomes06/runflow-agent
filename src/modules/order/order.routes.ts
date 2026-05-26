import express from 'express';
import { OrderController } from './order.controller';
import { handleError } from '../../helpers/handle-error';

export function createOrderRouter(controller: OrderController) {
  const router = express.Router();
  router.get('/:id', (request, response) => {
    try {
      return response.json(controller.getOrder(Number(request.params.id)));
    } catch (error: unknown) {
      return handleError(error, response);
    }
  });
  router.post('/', (request, response) => {
    try {
      return response.status(201).json(controller.createOrder(request.body));
    } catch (error: unknown) {
      return handleError(error, response);
    }
  });
  return router;
}
