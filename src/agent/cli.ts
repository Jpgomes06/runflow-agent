import * as dotenv from 'dotenv';
dotenv.config();

import { createInterface } from 'readline';
import { runAgent } from './agent';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('=== Agente de Loja Virtual ===');
console.log('Digite sua mensagem ou "sair" para encerrar.\n');

function prompt() {
  rl.question('Você: ', async (input) => {
    const trimmed = input.trim();

    if (!trimmed || trimmed.toLowerCase() === 'sair') {
      console.log('Encerrando...');
      rl.close();
      return;
    }

    try {
      const response = await runAgent(trimmed);
      console.log(`\nAgente RunFlow: ${response}\n`);
    } catch (err: unknown) {
      console.error(`Erro: ${(err as Error).message}\n`);
    }

    prompt();
  });
}

prompt();
