import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) throw new Error('GEMINI_API_KEY não definida no .env');

export const genAI = new GoogleGenerativeAI(apiKey);

const SYSTEM_PROMPT = `Você é um assistente de loja virtual.
Regras:
- Use sempre as tools para buscar ou criar dados. Nunca invente.
- Para criar pedidos, passe o campo "name" com o nome do produto — nunca peça o ID ao usuário.
- Se a tool retornar erro de ambiguidade, apresente as opções ao usuário e peça confirmação.
- Se a tool retornar erro de produto não encontrado ou estoque insuficiente, informe claramente.
- Mantenha o contexto da conversa para responder perguntas de acompanhamento.`;

export const geminiModel = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
  systemInstruction: SYSTEM_PROMPT,
});
