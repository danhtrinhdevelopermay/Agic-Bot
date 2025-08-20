import { GoogleGenAI } from "@google/genai";
import { ImageGeneratorService } from "./image-generator.js";

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
  private imageGenerator: ImageGeneratorService;

  constructor(config: GeminiConfig) {
    this.config = config;
    this.genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
    this.imageGenerator = new ImageGeneratorService({
      geminiApiKey: process.env.GEMINI_API_KEY || "",
      model: config.model
    });
  }

  async generateResponse(message: string): Promise<string> {
    try {
      console.log('Generating response for message:', message.substring(0, 100));
      
      // Kiểm tra nếu tin nhắn là yêu cầu tạo hình ảnh
      if (ImageGeneratorService.detectImageRequest(message)) {
        console.log('🎨 IMAGE GENERATION REQUEST DETECTED');
        const imagePrompt = ImageGeneratorService.extractImagePrompt(message);
        console.log('Extracted image prompt:', imagePrompt);
        
        const result = await this.imageGenerator.generateImage(imagePrompt);
        return result.message;
      }
      
      // Kiểm tra nếu tin nhắn chứa hình ảnh
      const isImageMessage = message.includes('[Hình ảnh đã được gửi]');
      let promptMessage = message;
      
      if (isImageMessage) {
        // Tạo prompt đặc biệt cho hình ảnh
        promptMessage = `Người dùng đã gửi một hình ảnh. Hãy phản hồi một cách thân thiện và hỏi họ muốn bạn giúp gì về hình ảnh này. Bạn có thể đề xuất phân tích, mô tả, hoặc trả lời câu hỏi về hình ảnh. ${message}`;
      }
      
      // Simple fetch-based approach for @google/genai v1.14.0
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.config.model}:generateContent?key=${process.env.GEMINI_API_KEY}`;
      
      const payload = {
        contents: [{
          parts: [{
            text: `${this.config.systemPrompt}\n\nUser: ${promptMessage}\n\nAssistant:`
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
