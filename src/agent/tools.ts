import { FunctionDeclaration, Type } from '@google/genai';

import { ProductApiService } from './services/product-api.service';
import { OrderApiService } from './services/order-api.service';
import { ProductResolverService } from './services/product-resolver.service';

export const toolDefinitions: FunctionDeclaration[] = [
  {
    name: 'list_products',
    description:
      'Lista todos os produtos disponíveis com id, nome, preço e estoque.',
    parameters: {
      type: Type.OBJECT,
      properties: {},
    },
  },
  {
    name: 'get_product',
    description: 'Retorna detalhes de um produto pelo id ou nome.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        id: {
          type: Type.NUMBER,
          description: 'ID do produto',
        },
        name: {
          type: Type.STRING,
          description: 'Nome do produto',
        },
      },
    },
  },
  {
    name: 'get_order_status',
    description: 'Retorna status e detalhes de um pedido.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        id: {
          type: Type.NUMBER,
          description: 'ID do pedido',
        },
      },
      required: ['id'],
    },
  },
  {
    name: 'create_order',
    description: 'Cria um novo pedido usando nome do produto e quantidade.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        items: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              productId: {
                type: Type.NUMBER,
              },
              name: {
                type: Type.STRING,
              },
              quantity: {
                type: Type.NUMBER,
              },
            },
            required: ['quantity'],
          },
        },
      },
      required: ['items'],
    },
  },
];

const productApi = new ProductApiService();

const orderApi = new OrderApiService();

const productResolver = new ProductResolverService(productApi);

type RawItem = {
  productId?: number;
  name?: string;
  quantity: number;
};

export async function executeTool(
  name: string,
  args: Record<string, unknown>,
): Promise<string> {
  try {
    if (name === 'list_products') {
      const data = await productApi.findAll();

      return JSON.stringify(data);
    }

    if (name === 'get_product') {
      const id =
        args.id != null
          ? await productResolver.resolve(args.id as number)
          : await productResolver.resolve(args.name as string);

      const data = await productApi.findById(id);

      return JSON.stringify(data);
    }

    if (name === 'get_order_status') {
      const data = await orderApi.findById(args.id as number);

      return JSON.stringify(data);
    }

    if (name === 'create_order') {
      const rawItems = args.items as RawItem[];

      const items = await Promise.all(
        rawItems.map(async (item) => {
          const productId =
            item.productId != null
              ? await productResolver.resolve(item.productId)
              : await productResolver.resolve(item.name as string);

          return {
            productId,
            quantity: item.quantity,
          };
        }),
      );

      const data = await orderApi.create({
        items,
      });

      return JSON.stringify(data);
    }

    return JSON.stringify({
      error: 'tool inválida',
    });
  } catch (err) {
    return JSON.stringify({
      error: (err as Error).message,
    });
  }
}
