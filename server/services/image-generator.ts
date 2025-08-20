import { GoogleGenAI } from "@google/genai";

export interface ImageGeneratorConfig {
  geminiApiKey: string;
  model: string;
}

export class ImageGeneratorService {
  private genAI: GoogleGenAI;
  private config: ImageGeneratorConfig;

  constructor(config: ImageGeneratorConfig) {
    this.config = config;
    this.genAI = new GoogleGenAI({ apiKey: config.geminiApiKey });
  }

  async generateImage(prompt: string): Promise<{ success: boolean; message: string; imageUrl?: string }> {
    try {
      console.log('Generating image for prompt:', prompt.substring(0, 100));

      // Vì Gemini hiện tại không hỗ trợ tạo hình ảnh trực tiếp như DALL-E,
      // chúng ta sẽ tạo một phản hồi thông minh và gợi ý sử dụng các dịch vụ khác
      const enhancedPrompt = `
        Người dùng muốn tạo hình ảnh với mô tả: "${prompt}"
        
        Hãy phản hồi bằng tiếng Việt một cách thân thiện và:
        1. Xác nhận bạn hiểu yêu cầu tạo hình ảnh
        2. Mô tả chi tiết hình ảnh mà họ muốn tạo dựa trên prompt
        3. Giải thích rằng hiện tại bot chưa thể tạo hình ảnh trực tiếp
        4. Gợi ý họ có thể sử dụng các công cụ AI tạo hình ảnh như DALL-E, Midjourney, hoặc Stable Diffusion
        5. Đưa ra một prompt tiếng Anh được cải thiện và chi tiết hơn mà họ có thể sử dụng với các công cụ đó
        
        Hãy trả lời một cách hữu ích và khuyến khích.
      `;

      const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.config.model}:generateContent?key=${this.config.geminiApiKey}`;
      
      const payload = {
        contents: [{
          parts: [{
            text: enhancedPrompt
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
      const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text || 
        "Xin lỗi, mình hiện chưa thể tạo hình ảnh trực tiếp. Bạn có thể thử sử dụng các công cụ AI tạo hình ảnh khác nhé!";
      
      console.log('Generated image response:', responseText.substring(0, 100));
      
      return {
        success: true,
        message: responseText
      };
    } catch (error) {
      console.error("Image generation error:", error);
      return {
        success: false,
        message: "Xin lỗi, có lỗi xảy ra khi xử lý yêu cầu tạo hình ảnh của bạn."
      };
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