import { Router, Request, Response } from 'express';
import { productService } from './product.service';

export const productRouter = Router();

productRouter.get('/', (_req: Request, res: Response) => {
  res.json(productService.listProducts());
});

productRouter.get('/:id', (req: Request, res: Response) => {
  try {
    const product = productService.getProduct(Number(req.params.id));
    res.json(product);
  } catch (err: unknown) {
    res.status(404).json({ error: (err as Error).message });
  }
});
