import { GoogleGenAI } from "@google/genai";
import { FreeImageGeneratorService } from "./free-image-generator.js";

export interface ImageGeneratorConfig {
  geminiApiKey: string;
  model: string;
}

export class ImageGeneratorService {
  private genAI: GoogleGenAI;
  private config: ImageGeneratorConfig;
  private freeImageGenerator: FreeImageGeneratorService;

  constructor(config: ImageGeneratorConfig) {
    this.config = config;
    this.genAI = new GoogleGenAI({ apiKey: config.geminiApiKey });
    this.freeImageGenerator = new FreeImageGeneratorService({ enabled: true });
  }

  async generateImage(prompt: string): Promise<{ success: boolean; message: string; imageUrl?: string }> {
    try {
      console.log('Generating image for prompt:', prompt.substring(0, 100));

      // Thử tạo hình ảnh thật với API miễn phí
      const englishPrompt = await this.freeImageGenerator.translateToEnglish(prompt);
      console.log('Translated prompt:', englishPrompt);
      
      const imageResult = await this.freeImageGenerator.generateImageURL(englishPrompt);
      
      if (imageResult.success && imageResult.imageUrl) {
        // Tạo thành công - trả về thông tin để gửi hình ảnh trực tiếp
        const successMessage = `🎨 Đây là hình ảnh tôi vừa tạo cho bạn dựa trên mô tả "${prompt}"!

✨ Hình ảnh được tạo bằng AI hoàn toàn miễn phí! Nếu bạn muốn tạo thêm hình ảnh khác hoặc điều chỉnh, hãy cho tôi biết nhé! 😊`;

        return {
          success: true,
          message: successMessage,
          imageUrl: imageResult.imageUrl
        };
      } else {
        // Fallback - đưa ra hướng dẫn sử dụng công cụ miễn phí khác
        const fallbackPrompt = `
        Người dùng muốn tạo hình ảnh với mô tả: "${prompt}"
        
        Rất tiếc, dịch vụ tạo hình ảnh tự động hiện tại không hoạt động. Hãy phản hồi bằng tiếng Việt:
        1. Xin lỗi và giải thích tình hình
        2. Mô tả chi tiết hình ảnh họ muốn tạo
        3. Đưa ra prompt tiếng Anh chuyên nghiệp: "${englishPrompt}"
        4. Gợi ý các công cụ AI miễn phí:
           - Bing Image Creator: bing.com/create (miễn phí với tài khoản Microsoft)
           - Leonardo AI: leonardo.ai (15 hình/ngày miễn phí)
           - Playground AI: playgroundai.com (1000 hình/tháng miễn phí)
        5. Hướng dẫn ngắn gọn cách sử dụng Bing Image Creator
        `;

        const response = await this.generateFallbackResponse(fallbackPrompt);
        return {
          success: false,
          message: response
        };
      }
    } catch (error) {
      console.error("Image generation error:", error);
      return {
        success: false,
        message: "Xin lỗi, có lỗi xảy ra khi tạo hình ảnh. Bạn có thể thử lại sau hoặc sử dụng các công cụ AI miễn phí như Bing Image Creator nhé!"
      };
    }
  }

  private async generateFallbackResponse(prompt: string): Promise<string> {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.config.model}:generateContent?key=${this.config.geminiApiKey}`;
      
      const payload = {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
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
      return data?.candidates?.[0]?.content?.parts?.[0]?.text || 
        "Xin lỗi, mình hiện chưa thể tạo hình ảnh. Bạn có thể thử sử dụng Bing Image Creator miễn phí nhé!";
    } catch (error) {
      console.error("Fallback response generation error:", error);
      return "Xin lỗi, mình hiện chưa thể tạo hình ảnh. Bạn có thể thử sử dụng các công cụ AI tạo hình ảnh miễn phí như Bing Image Creator nhé!";
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.config.model}:generateContent?key=${this.config.geminiApiKey}`;
      
      const payload = {
        contents: [{
          parts: [{
            text: "Test connection for image generation service."
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
      console.error("Image generator test connection failed:", error);
      return false;
    }
  }

  // Phương thức để phát hiện yêu cầu tạo hình ảnh từ tin nhắn
  static detectImageRequest(message: string): boolean {
    const imageKeywords = [
      'tạo hình ảnh', 'tạo ảnh', 'vẽ', 'vẽ cho tôi', 'tạo ra ảnh',
      'generate image', 'create image', 'draw', 'make picture',
      'design', 'thiết kế', 'hình minh họa', 'illustration',
      'tạo tranh', 'làm ảnh', 'chụp ảnh', 'tạo hình'
    ];
    
    const lowerMessage = message.toLowerCase();
    return imageKeywords.some(keyword => lowerMessage.includes(keyword.toLowerCase()));
  }

  // Trích xuất prompt từ tin nhắn
  static extractImagePrompt(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    // Loại bỏ các từ khóa yêu cầu tạo hình ảnh
    const cleanKeywords = [
      'tạo hình ảnh', 'tạo ảnh', 'vẽ cho tôi', 'vẽ', 'tạo ra ảnh',
      'generate image', 'create image', 'draw', 'make picture',
      'thiết kế', 'làm ảnh', 'tạo tranh', 'tạo hình'
    ];
    
    let cleanPrompt = message;
    for (const keyword of cleanKeywords) {
      const regex = new RegExp(keyword, 'gi');
      cleanPrompt = cleanPrompt.replace(regex, '').trim();
    }
    
    // Loại bỏ các từ kết nối thừa
    cleanPrompt = cleanPrompt.replace(/^(về|cho|của|một|cho tôi|hãy|giúp tôi)/gi, '').trim();
    
    return cleanPrompt || message;
  }
}