import { Tool, SchemaType } from '@google/generative-ai';
import { productService } from '../modules/product/product.service';
import { orderService } from '../modules/order/order.service';
import { productRepository } from '../modules/product/product.repository';

function resolveProductId(nameOrId: string | number): number {
  if (typeof nameOrId === 'number') return nameOrId;

  const products = productRepository.findAll();
  const matches = products.filter((p) =>
    p.name.toLowerCase().includes(nameOrId.toLowerCase()),
  );

  if (matches.length === 1) return matches[0].id;
  if (matches.length === 0) throw new Error(`Produto "${nameOrId}" não encontrado`);

  const options = matches.map((p) => `${p.name} (id: ${p.id})`).join(', ');
  throw new Error(`Ambíguo: "${nameOrId}" pode ser ${options}. Informe o id correto.`);
}

export const toolDefinitions: Tool[] = [
  {
    functionDeclarations: [
      {
        name: 'list_products',
        description: 'Lista todos os produtos disponíveis com id, nome, preço e estoque.',
        parameters: { type: SchemaType.OBJECT, properties: {} },
      },
      {
        name: 'get_product',
        description: 'Retorna detalhes de um produto pelo id ou nome.',
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            id: { type: SchemaType.NUMBER, description: 'ID do produto (opcional se name for informado)' },
            name: { type: SchemaType.STRING, description: 'Nome ou parte do nome do produto (opcional se id for informado)' },
          },
        },
      },
      {
        name: 'get_order_status',
        description: 'Retorna o status e detalhes de um pedido pelo id.',
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            id: { type: SchemaType.NUMBER, description: 'ID do pedido' },
          },
          required: ['id'],
        },
      },
      {
        name: 'create_order',
        description: 'Cria um novo pedido. Cada item pode informar productId (número) ou name (texto) junto com quantity.',
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            items: {
              type: SchemaType.ARRAY,
              description: 'Lista de itens do pedido',
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  productId: { type: SchemaType.NUMBER, description: 'ID do produto (use se souber)' },
                  name: { type: SchemaType.STRING, description: 'Nome do produto (alternativa ao productId)' },
                  quantity: { type: SchemaType.NUMBER, description: 'Quantidade' },
                },
                required: ['quantity'],
              },
            },
          },
          required: ['items'],
        },
      },
    ],
  },
];

type RawItem = { productId?: number; name?: string; quantity: number };

export function executeTool(name: string, args: Record<string, unknown>): string {
  try {
    if (name === 'list_products') {
      return JSON.stringify(productService.listProducts());
    }

    if (name === 'get_product') {
      const id = args.id != null
        ? resolveProductId(args.id as number)
        : resolveProductId(args.name as string);
      return JSON.stringify(productService.getProduct(id));
    }

    if (name === 'get_order_status') {
      return JSON.stringify(orderService.getOrder(args.id as number));
    }

    if (name === 'create_order') {
      const rawItems = args.items as RawItem[];
      const items = rawItems.map((item) => {
        const productId = item.productId != null
          ? resolveProductId(item.productId)
          : resolveProductId(item.name as string);
        return { productId, quantity: item.quantity };
      });
      return JSON.stringify(orderService.createOrder({ items }));
    }

    return JSON.stringify({ error: `Tool desconhecida: ${name}` });
  } catch (err: unknown) {
    return JSON.stringify({ error: (err as Error).message });
  }
}
