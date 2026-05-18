import { ProductApiService } from './product-api.service';

export class ProductResolverService {
  constructor(private readonly productApi: ProductApiService) {}

  async resolve(nameOrId: string | number): Promise<number> {
    if (typeof nameOrId === 'number') {
      return nameOrId;
    }

    const match = nameOrId.match(/produto\s*(\d+)/i);

    if (match) {
      return Number(match[1]);
    }

    const products = await this.productApi.findAll();

    const matches = products.filter((p) =>
      p.name.toLowerCase().includes(nameOrId.toLowerCase()),
    );

    if (matches.length === 1) {
      return matches[0].id;
    }

    if (matches.length === 0) {
      throw new Error(`Produto "${nameOrId}" não encontrado`);
    }

    const options = matches.map((p) => `${p.name} (id:${p.id})`).join(',');

    throw new Error(`Ambíguo: ${options}`);
  }
}
