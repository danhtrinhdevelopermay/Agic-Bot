import { GoogleGenAI } from "@google/genai";

export interface GeminiConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  safetySettings: string;
  systemPrompt: string;
}

export class GeminiService {
  private genAI: GoogleGenAI;
  private config: GeminiConfig;

  constructor(config: GeminiConfig) {
    this.config = config;
    this.genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
  }

  async generateResponse(message: string): Promise<string> {
    try {
      console.log('Generating response for message:', message.substring(0, 100));
      
      // Simple fetch-based approach for @google/genai v1.14.0
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.config.model}:generateContent?key=${process.env.GEMINI_API_KEY}`;
      
      const payload = {
        contents: [{
          parts: [{
            text: `${this.config.systemPrompt}\n\nUser: ${message}\n\nAssistant:`
          }]
        }],
        generationConfig: {
          temperature: this.config.temperature,
          maxOutputTokens: this.config.maxTokens,
        }
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Xin lỗi, mình không thể tạo phản hồi lúc này.";
      
      console.log('Generated response:', text.substring(0, 100));
      return text;
    } catch (error) {
      console.error("Gemini API error:", error);
      throw new Error(`Failed to generate response: ${error}`);
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.config.model}:generateContent?key=${process.env.GEMINI_API_KEY}`;
      
      const payload = {
        contents: [{
          parts: [{
            text: "Hello, this is a test message."
          }]
        }]
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      return response.ok;
    } catch (error) {
      console.error("Gemini test connection failed:", error);
      return false;
    }
  }
}
