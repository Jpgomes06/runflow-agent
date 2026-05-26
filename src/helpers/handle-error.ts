import { Response } from 'express';

export function handleError(error: unknown, response: Response) {
  const message = (error as Error).message;

  const status = message.includes('não encontrado') ? 404 : 400;

  return response.status(status).json({
    error: message,
  });
}
