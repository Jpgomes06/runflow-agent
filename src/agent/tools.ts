import { FunctionDeclaration, Type } from '@google/genai';
import axios from 'axios';
import { CreateOrderDTO, Order, Product } from '../types';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

async function resolveProductId(nameOrId: string | number): Promise<number> {
  if (typeof nameOrId === 'number') return nameOrId;

  const { data: products } = await axios.get<Product[]>(
      `${API_BASE_URL}/products`,
  );
  const matches = products.filter((p) =>
      p.name.toLowerCase().includes(nameOrId.toLowerCase()),
  );

  if (matches.length === 1) return matches[0].id;
  if (matches.length === 0)
    throw new Error(`Produto "${nameOrId}" não encontrado`);

  const options = matches.map((p) => `${p.name} (id: ${p.id})`).join(', ');
  throw new Error(
      `Ambíguo: "${nameOrId}" pode ser ${options}. Informe o id correto.`,
  );
}

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
          description: 'ID do produto (opcional se name for informado)',
        },
        name: {
          type: Type.STRING,
          description:
              'Nome ou parte do nome do produto (opcional se id for informado)',
        },
      },
    },
  },
  {
    name: 'get_order_status',
    description: 'Retorna o status e detalhes de um pedido pelo id.',
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
    description:
        'Cria um novo pedido. Cada item pode informar productId (número) ou name (texto) junto com quantity.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        items: {
          type: Type.ARRAY,
          description: 'Lista de itens do pedido',
          items: {
            type: Type.OBJECT,
            properties: {
              productId: {
                type: Type.NUMBER,
                description: 'ID do produto (use se souber)',
              },
              name: {
                type: Type.STRING,
                description: 'Nome do produto (alternativa ao productId)',
              },
              quantity: {
                type: Type.NUMBER,
                description: 'Quantidade',
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

type RawItem = { productId?: number; name?: string; quantity: number };

export async function executeTool(
    name: string,
    args: Record<string, unknown>,
): Promise<string> {
  try {
    if (name === 'list_products') {
      const { data } = await axios.get<Product[]>(`${API_BASE_URL}/products`);
      return JSON.stringify(data);
    }

    if (name === 'get_product') {
      const id =
          args.id != null
              ? await resolveProductId(args.id as number)
              : await resolveProductId(args.name as string);
      const { data } = await axios.get<Product>(
          `${API_BASE_URL}/products/${id}`,
      );
      return JSON.stringify(data);
    }

    if (name === 'get_order_status') {
      const { data } = await axios.get<Order>(
          `${API_BASE_URL}/orders/${args.id as number}`,
      );
      return JSON.stringify(data);
    }

    if (name === 'create_order') {
      const rawItems = args.items as RawItem[];
      const items = await Promise.all(
          rawItems.map(async (item) => {
            const productId =
                item.productId != null
                    ? await resolveProductId(item.productId)
                    : await resolveProductId(item.name as string);
            return { productId, quantity: item.quantity };
          }),
      );
      const dto: CreateOrderDTO = { items };
      const { data } = await axios.post<Order>(`${API_BASE_URL}/orders`, dto);
      return JSON.stringify(data);
    }

    return JSON.stringify({ error: `Tool desconhecida: ${name}` });
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response?.data?.error) {
      return JSON.stringify({ error: err.response.data.error });
    }
    return JSON.stringify({ error: (err as Error).message });
  }
}