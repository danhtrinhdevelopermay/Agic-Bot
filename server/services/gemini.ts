import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface GeminiConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  safetySettings: string;
  systemPrompt: string;
}

export class GeminiService {
  private model: any;
  private config: GeminiConfig;

  constructor(config: GeminiConfig) {
    this.config = config;
    this.model = genAI.models;
  }

  async generateResponse(message: string): Promise<string> {
    try {
      const response = await this.model.generateContent({
        model: this.config.model,
        config: {
          systemInstruction: this.config.systemPrompt,
          temperature: this.config.temperature,
          maxOutputTokens: this.config.maxTokens,
        },
        contents: message,
      });

      return response.text || "I'm sorry, I couldn't generate a response.";
    } catch (error) {
      console.error("Gemini API error:", error);
      throw new Error(`Failed to generate response: ${error}`);
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await this.model.generateContent({
        model: this.config.model,
        contents: "Hello, this is a test message.",
      });
      return !!response.text;
    } catch (error) {
      console.error("Gemini test connection failed:", error);
      return false;
    }
  }
}
