import crypto from 'crypto';

export interface FacebookConfig {
  pageAccessToken: string;
  appSecret: string;
  verifyToken: string;
  pageId: string;
}

export class FacebookService {
  private config: FacebookConfig;

  constructor(config: FacebookConfig) {
    this.config = config;
  }

  verifyWebhook(mode: string, token: string, challenge: string): string | null {
    if (mode === 'subscribe' && token === this.config.verifyToken) {
      return challenge;
    }
    return null;
  }

  verifySignature(body: string, signature: string): boolean {
    try {
      const expectedSignature = crypto
        .createHmac('sha256', this.config.appSecret)
        .update(body)
        .digest('hex');
      
      const signatureHash = signature.replace('sha256=', '');
      
      // Check if both signatures have the same length before comparing
      if (expectedSignature.length !== signatureHash.length) {
        console.log(`Signature length mismatch: expected ${expectedSignature.length}, got ${signatureHash.length}`);
        return false;
      }
      
      return crypto.timingSafeEqual(
        Buffer.from(expectedSignature, 'hex'),
        Buffer.from(signatureHash, 'hex')
      );
    } catch (error) {
      console.error('Signature verification error:', error);
      return false;
    }
  }

  async sendTypingOn(recipientId: string): Promise<void> {
    const url = `https://graph.facebook.com/v18.0/me/messages?access_token=${this.config.pageAccessToken}`;
    
    const typingData = {
      recipient: { id: recipientId },
      sender_action: 'typing_on',
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(typingData),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('Failed to send typing indicator:', error);
      }
    } catch (error) {
      console.error('Failed to send typing indicator:', error);
    }
  }

  async sendTypingOff(recipientId: string): Promise<void> {
    const url = `https://graph.facebook.com/v18.0/me/messages?access_token=${this.config.pageAccessToken}`;
    
    const typingData = {
      recipient: { id: recipientId },
      sender_action: 'typing_off',
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(typingData),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('Failed to turn off typing indicator:', error);
      }
    } catch (error) {
      console.error('Failed to turn off typing indicator:', error);
    }
  }

  async markSeen(recipientId: string): Promise<void> {
    const url = `https://graph.facebook.com/v18.0/me/messages?access_token=${this.config.pageAccessToken}`;
    
    const seenData = {
      recipient: { id: recipientId },
      sender_action: 'mark_seen',
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(seenData),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('Failed to mark message as seen:', error);
      }
    } catch (error) {
      console.error('Failed to mark message as seen:', error);
    }
  }

  async sendMessage(recipientId: string, message: string): Promise<void> {
    const url = `https://graph.facebook.com/v18.0/me/messages?access_token=${this.config.pageAccessToken}`;
    
    const messageData = {
      recipient: { id: recipientId },
      message: { text: message }
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Facebook API error: ${error}`);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }

  async sendImageMessage(recipientId: string, imageUrl: string, caption?: string): Promise<void> {
    const url = `https://graph.facebook.com/v18.0/me/messages?access_token=${this.config.pageAccessToken}`;
    
    console.log('📸 Facebook API: Attempting to send image');
    console.log('Recipient ID:', recipientId);
    console.log('Image URL:', imageUrl);
    
    // Validate URL trước khi gửi
    try {
      console.log('🔍 Pre-validating image URL...');
      const testResponse = await fetch(imageUrl, { method: 'HEAD', signal: AbortSignal.timeout(10000) });
      console.log('URL validation result:', { status: testResponse.status, contentType: testResponse.headers.get('content-type') });
      
      if (!testResponse.ok) {
        throw new Error(`Image URL validation failed: ${testResponse.status}`);
      }
      
      const contentType = testResponse.headers.get('content-type');
      if (!contentType?.startsWith('image/')) {
        throw new Error(`URL does not return image content: ${contentType}`);
      }
    } catch (urlError) {
      console.error('❌ Image URL validation failed:', urlError);
      throw new Error(`Invalid image URL: ${urlError instanceof Error ? urlError.message : String(urlError)}`);
    }
    
    const messageData = {
      recipient: { id: recipientId },
      message: {
        attachment: {
          type: "image",
          payload: {
            url: imageUrl,
            is_reusable: false
          }
        }
      }
    };

    try {
      // Thêm timeout cho request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout
      
      console.log('Sending image message data:', JSON.stringify(messageData, null, 2));
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.text();
        console.error('Facebook image API error response:', {
          status: response.status,
          statusText: response.statusText,
          error: error
        });
        throw new Error(`Facebook API error: ${response.status} - ${error}`);
      }

      const result = await response.json();
      console.log('Image sent successfully:', result);

      // Nếu có caption, gửi thêm tin nhắn văn bản
      if (caption) {
        console.log('Sending caption:', caption.substring(0, 100));
        await this.sendMessage(recipientId, caption);
      }
    } catch (error) {
      console.error('Failed to send image:', error);
      throw error;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const url = `https://graph.facebook.com/v18.0/${this.config.pageId}?access_token=${this.config.pageAccessToken}`;
      const response = await fetch(url);
      return response.ok;
    } catch (error) {
      console.error('Facebook test connection failed:', error);
      return false;
    }
  }

  extractMessageData(webhookEvent: any): { senderId: string; messageText: string } | null {
    if (webhookEvent.object === 'page') {
      for (const entry of webhookEvent.entry) {
        for (const event of entry.messaging) {
          if (event.message) {
            // Xử lý tin nhắn văn bản
            if (event.message.text) {
              return {
                senderId: event.sender.id,
                messageText: event.message.text
              };
            }
            // Xử lý tin nhắn hình ảnh
            else if (event.message.attachments && event.message.attachments.length > 0) {
              console.log('📎 Attachments detected:', event.message.attachments);
              const attachment = event.message.attachments[0];
              console.log('🔍 Processing attachment:', { type: attachment.type, payloadUrl: attachment.payload?.url });
              
              if (attachment.type === 'image') {
                console.log('🖼️ Image attachment found, processing...');
                return {
                  senderId: event.sender.id,
                  messageText: `[Hình ảnh đã được gửi] - ${attachment.payload?.url || 'Không thể lấy URL hình ảnh'}`
                };
              }
              // Xử lý các loại attachment khác
              else {
                console.log(`📁 Non-image attachment: ${attachment.type}`);
                return {
                  senderId: event.sender.id,
                  messageText: `[Đã gửi ${attachment.type}]`
                };
              }
            }
          }
        }
      }
    }
    return null;
  }
}
