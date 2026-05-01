import { Part } from '@google/generative-ai';
import { geminiModel } from '../infra/geminiClient';
import { toolDefinitions, executeTool } from './tools';

const chat = geminiModel.startChat({ tools: toolDefinitions });

export async function runAgent(userInput: string): Promise<string> {
  let response = await chat.sendMessage(userInput);

  while (true) {
    const candidate = response.response.candidates?.[0];
    if (!candidate) break;

    const functionCalls = candidate.content.parts.filter((p: Part) => p.functionCall);
    if (functionCalls.length === 0) break;

    const functionResponses: Part[] = functionCalls.map((p: Part) => ({
      functionResponse: {
        name: p.functionCall!.name,
        response: {
          result: executeTool(
            p.functionCall!.name,
            (p.functionCall!.args ?? {}) as Record<string, unknown>,
          ),
        },
      },
    }));

    response = await chat.sendMessage(functionResponses);
  }

  return response.response.text();
}
