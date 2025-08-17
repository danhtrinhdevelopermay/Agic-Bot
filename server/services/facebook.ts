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
    const expectedSignature = crypto
      .createHmac('sha256', this.config.appSecret)
      .update(body)
      .digest('hex');
    
    const signatureHash = signature.replace('sha256=', '');
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'hex'),
      Buffer.from(signatureHash, 'hex')
    );
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
          if (event.message && event.message.text) {
            return {
              senderId: event.sender.id,
              messageText: event.message.text
            };
          }
        }
      }
    }
    return null;
  }
}
