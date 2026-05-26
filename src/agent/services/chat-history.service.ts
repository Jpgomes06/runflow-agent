import { Content } from '@google/genai';

export class ChatHistoryService {
  private history: Content[] = [];

  getAll(): Content[] {
    return this.history;
  }

  add(contents: Content[]): void {
    this.history.push(...contents.slice(this.history.length));
  }
}
