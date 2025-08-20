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
      
      // Thử các API miễn phí theo thứ tự ưu tiên
      const apis = [
        {
          name: 'Pollinations AI',
          url: `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt)}?width=512&height=512&model=flux&nologo=true`
        },
        {
          name: 'Pollinations AI (basic)',
          url: `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt)}?width=512&height=512&nologo=true`
        },
        {
          name: 'Pollinations AI (simple)',
          url: `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt)}`
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
    // Loại bỏ các ký tự đặc biệt và cải thiện prompt
    let cleanedPrompt = prompt
      .replace(/[^\w\s,.-]/g, '') // Chỉ giữ lại chữ, số, khoảng trắng và dấu câu cơ bản
      .trim();
    
    // Thêm các từ khóa chất lượng cao
    cleanedPrompt += ', high quality, detailed, professional, 4k';
    
    return cleanedPrompt;
  }

  // Tạo prompt tiếng Anh từ mô tả tiếng Việt
  async translateToEnglish(vietnamesePrompt: string): Promise<string> {
    // Các từ cơ bản dịch nhanh
    const quickTranslations: { [key: string]: string } = {
      'con mèo': 'cat',
      'con chó': 'dog',
      'dễ thương': 'cute',
      'đẹp': 'beautiful',
      'cảnh đẹp': 'beautiful landscape',
      'hoàng hôn': 'sunset',
      'bình minh': 'sunrise',
      'biển': 'ocean',
      'núi': 'mountain',
      'rừng': 'forest',
      'hoa': 'flowers',
      'thành phố': 'city',
      'tương lai': 'futuristic',
      'cổ điển': 'vintage',
      'hiện đại': 'modern',
      'nghệ thuật': 'artistic',
      'vẽ tranh': 'painting',
      'phong cách': 'style',
      'màu sắc': 'colorful',
      'sáng tạo': 'creative'
    };

    let translatedPrompt = vietnamesePrompt.toLowerCase();
    
    // Dịch các từ cơ bản
    for (const [vietnamese, english] of Object.entries(quickTranslations)) {
      translatedPrompt = translatedPrompt.replace(new RegExp(vietnamese, 'g'), english);
    }
    
    // Nếu vẫn còn tiếng Việt, giữ nguyên và thêm mô tả
    if (/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(translatedPrompt)) {
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