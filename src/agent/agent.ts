import { Content, Part } from '@google/genai';
import { readFileSync } from 'fs';
import { ai } from '../infra/geminiClient';
import { toolDefinitions, executeTool } from './tools';
import path from 'path';

const systemPrompt = readFileSync(
  path.resolve(__dirname, './system-prompt.txt'),'utf-8',
);

const history: Content[] = [];

export async function runAgent(userInput: string): Promise<string> {
  const contents: Content[] = [
    ...history,
    { role: 'user', parts: [{ text: userInput }] },
  ];

  let finalText = '';

  while (true) {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction: systemPrompt,
        tools: [{ functionDeclarations: toolDefinitions }],
      },
    });

    const functionCalls = response.functionCalls;

    if (!functionCalls || functionCalls.length === 0) {
      finalText = response.text ?? '';
      contents.push({ role: 'model', parts: [{ text: finalText }] });
      break;
    }

    const modelParts: Part[] = functionCalls.map((fc) => ({
      functionCall: fc,
    }));
    contents.push({ role: 'model', parts: modelParts });

    const responseParts: Part[] = functionCalls.map((fc) => ({
      functionResponse: {
        name: fc.name!,
        response: { result: executeTool(fc.name!, fc.args ?? {}) },
      },
    }));
    contents.push({ role: 'user', parts: responseParts });
  }

  history.push(...contents.slice(history.length));

  return finalText;
}
