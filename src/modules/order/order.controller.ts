import { Router, Request, Response } from 'express';
import { orderService } from './order.service';

export const orderRouter = Router();

orderRouter.get('/:id', (req: Request, res: Response) => {
  try {
    const order = orderService.getOrder(Number(req.params.id));
    res.json(order);
  } catch (err: unknown) {
    res.status(404).json({ error: (err as Error).message });
  }
});

orderRouter.post('/', (req: Request, res: Response) => {
  try {
    const order = orderService.createOrder(req.body);
    res.status(201).json(order);
  } catch (err: unknown) {
    const message = (err as Error).message;
    const status = message.includes('não encontrado') ? 404 : 400;
    res.status(status).json({ error: message });
  }
});
