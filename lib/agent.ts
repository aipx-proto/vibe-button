export interface AgentChatOptions {
  endpoint: string;
  deployment: string;
  apiKey: string;
  apiVersion: string;
}

export class Agent {
  private threadId: string | undefined;

  async ask(message: string, options: AgentChatOptions): Promise<string> {
    const { AzureOpenAI } = await import("openai");
    const client = new AzureOpenAI({
      dangerouslyAllowBrowser: true,
      endpoint: options.endpoint,
      deployment: options.deployment,
      apiKey: options.apiKey,
      apiVersion: options.apiVersion,
    });

    const response = await client.responses.create({
      previous_response_id: this.threadId,
      model: options.deployment,
      input: message,
      store: true,
    });

    if (response.id) {
      this.threadId = response.id;
    }

    return response.output_text;
  }

  async reset() {
    this.threadId = undefined;
  }
}
