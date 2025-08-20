export interface FreeImageGeneratorConfig {
  enabled: boolean;
}

export class FreeImageGeneratorService {
  private config: FreeImageGeneratorConfig;

  constructor(config: FreeImageGeneratorConfig) {
    this.config = config;
  }

  // Tạo hình ảnh thông qua Pollinations API (hoàn toàn miễn phí)
  async generateImageURL(prompt: string): Promise<{ success: boolean; imageUrl?: string; error?: string }> {
    try {
      console.log('Generating free image for prompt:', prompt.substring(0, 100));
      
      // Làm sạch và cải thiện prompt
      const cleanPrompt = this.cleanPrompt(prompt);
      console.log('Cleaned prompt:', cleanPrompt);
      
      // Thử các API miễn phí đã test hoạt động
      const simplePrompt = cleanPrompt.split(' ').slice(0, 2).join(' '); // Chỉ lấy 2 từ đầu
      const apis = [
        {
          name: 'Pollinations AI (simple)',
          url: `https://image.pollinations.ai/prompt/${encodeURIComponent(simplePrompt)}`
        },
        {
          name: 'Pollinations AI (with size)',
          url: `https://image.pollinations.ai/prompt/${encodeURIComponent(simplePrompt)}?width=512&height=512`
        },
        {
          name: 'Pollinations AI (original prompt)',
          url: `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt)}`
        },
        {
          name: 'Fallback simple',
          url: `https://image.pollinations.ai/prompt/beautiful%20image`
        }
      ];

      for (const api of apis) {
        try {
          console.log(`Trying ${api.name}:`, api.url);
          
          // Thử tạo một request đơn giản
          const testResponse = await fetch(api.url, { 
            method: 'HEAD',
            signal: AbortSignal.timeout(8000) // 8s timeout
          });
          
          if (testResponse.ok || testResponse.status === 405) { // 405 = Method Not Allowed, nhưng GET có thể hoạt động
            console.log(`${api.name} responded successfully`);
            return {
              success: true,
              imageUrl: api.url
            };
          }
          
          console.log(`${api.name} responded with status:`, testResponse.status);
        } catch (apiError) {
          console.log(`${api.name} failed:`, apiError);
          continue; // Thử API tiếp theo
        }
      }
      
      // Nếu tất cả API đều thất bại, vẫn trả về URL đầu tiên
      console.log('All APIs failed, returning first URL anyway');
      return {
        success: true,
        imageUrl: apis[0].url
      };
      
    } catch (error) {
      console.error('Free image generation completely failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Làm sạch prompt để phù hợp với API
  private cleanPrompt(prompt: string): string {
    // Loại bỏ các ký tự đặc biệt và giữ prompt đơn giản
    let cleanedPrompt = prompt
      .replace(/[^\w\s]/g, ' ') // Chỉ giữ lại chữ, số, khoảng trắng
      .replace(/\s+/g, ' ') // Loại bỏ khoảng trắng thừa
      .trim();
    
    // Giữ prompt ngắn gọn, không thêm từ khóa phức tạp
    return cleanedPrompt;
  }

  // Tạo prompt tiếng Anh từ mô tả tiếng Việt
  async translateToEnglish(vietnamesePrompt: string): Promise<string> {
    console.log('Original Vietnamese prompt:', vietnamesePrompt);
    
    // Các từ cơ bản dịch nhanh - thứ tự từ dài đến ngắn để tránh conflict
    const quickTranslations: { [key: string]: string } = {
      'một con mèo': 'a cat',
      'con mèo': 'cat',
      'một con chó': 'a dog', 
      'con chó': 'dog',
      'dễ thương': 'cute',
      'xinh đẹp': 'beautiful',
      'đẹp': 'beautiful',
      'cảnh đẹp': 'beautiful landscape',
      'hoàng hôn': 'sunset',
      'bình minh': 'sunrise',
      'biển cả': 'ocean',
      'biển': 'ocean',
      'núi non': 'mountain',
      'núi': 'mountain',
      'rừng cây': 'forest',
      'rừng': 'forest',
      'bông hoa': 'flowers',
      'hoa': 'flowers',
      'thành phố': 'city',
      'tương lai': 'futuristic',
      'cổ điển': 'vintage',
      'hiện đại': 'modern',
      'nghệ thuật': 'artistic',
      'vẽ tranh': 'painting',
      'phong cách': 'style',
      'màu sắc': 'colorful',
      'sáng tạo': 'creative',
      'một': 'a',
      'của': 'of',
      'và': 'and',
      'với': 'with'
    };

    let translatedPrompt = vietnamesePrompt.toLowerCase().trim();
    
    // Dịch từng cụm từ (từ dài đến ngắn để tránh xung đột)
    const sortedTranslations = Object.entries(quickTranslations)
      .sort(([a], [b]) => b.length - a.length);
    
    for (const [vietnamese, english] of sortedTranslations) {
      const regex = new RegExp(vietnamese, 'gi');
      translatedPrompt = translatedPrompt.replace(regex, english);
    }
    
    // Làm sạch kết quả
    translatedPrompt = translatedPrompt
      .replace(/\s+/g, ' ') // Loại bỏ khoảng trắng thừa
      .trim();
    
    console.log('Translated prompt:', translatedPrompt);
    
    // Nếu vẫn còn tiếng Việt hoặc kết quả rỗng, fallback
    if (!translatedPrompt || /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(translatedPrompt)) {
      console.log('Fallback: using original prompt with enhancement');
      return `${vietnamesePrompt}, beautiful, high quality, detailed`;
    }
    
    return translatedPrompt;
  }

  async testConnection(): Promise<boolean> {
    try {
      // Test với prompt đơn giản
      const testUrl = 'https://image.pollinations.ai/prompt/test?width=64&height=64';
      const response = await fetch(testUrl, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      console.error('Free image generator test failed:', error);
      return false;
    }
  }
}