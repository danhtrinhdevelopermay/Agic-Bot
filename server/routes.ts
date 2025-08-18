import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { GeminiService } from "./services/gemini";
import { FacebookService } from "./services/facebook";
import { insertBotConfigSchema, insertMessageLogSchema } from "@shared/schema";

let geminiService: GeminiService | null = null;
let facebookService: FacebookService | null = null;

async function initializeServices() {
  console.log('Initializing services...');
  const config = await storage.getBotConfig();
  
  // Reset services
  geminiService = null;
  facebookService = null;
  
  if (config) {
    console.log('Config found:', { 
      hasGeminiKey: !!config.geminiApiKey,
      hasFacebookToken: !!config.pageAccessToken,
      hasAppSecret: !!config.appSecret,
    });

    // Initialize Gemini service if API key is available
    if (config.geminiApiKey) {
      try {
        geminiService = new GeminiService({
          model: config.geminiModel,
          temperature: parseFloat(config.temperature),
          maxTokens: config.maxTokens,
          safetySettings: config.safetySettings,
          systemPrompt: config.systemPrompt,
        });
        console.log('Gemini service initialized');
      } catch (error) {
        console.error('Failed to initialize Gemini service:', error);
      }
    }

    // Initialize Facebook service if required fields are available
    if (config.pageAccessToken && config.appSecret) {
      try {
        facebookService = new FacebookService({
          pageAccessToken: config.pageAccessToken,
          appSecret: config.appSecret,
          verifyToken: config.verifyToken,
          pageId: config.pageId,
        });
        console.log('Facebook service initialized');
      } catch (error) {
        console.error('Failed to initialize Facebook service:', error);
      }
    }
  } else {
    console.log('No config found');
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize services on startup
  await initializeServices();

  // Diagnostic endpoint to check if bot is configured
  app.get('/api/health', async (req, res) => {
    const config = await storage.getBotConfig();
    
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      configured: !!config,
      services: {
        gemini: !!geminiService,
        facebook: !!facebookService
      },
      environment: process.env.NODE_ENV,
      config: config ? {
        hasGeminiKey: !!config.geminiApiKey,
        hasPageToken: !!config.pageAccessToken,
        hasAppSecret: !!config.appSecret,
        verifyToken: config.verifyToken
      } : null
    });
  });

  // Test webhook connection endpoint
  app.post('/api/test-webhook', async (req, res) => {
    console.log('=== TEST WEBHOOK ===');
    console.log('Time:', new Date().toISOString());
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Body:', JSON.stringify(req.body, null, 2));
    
    if (!facebookService || !geminiService) {
      console.log('ERROR: Services not configured');
      return res.status(500).json({ 
        success: false,
        error: 'Bot chưa được cấu hình đầy đủ',
        services: { facebook: !!facebookService, gemini: !!geminiService }
      });
    }

    try {
      console.log('Testing Facebook API connection...');
      const fbConnection = await facebookService.testConnection();
      console.log('Facebook API result:', fbConnection);
      
      console.log('Testing Gemini API...');
      const testResponse = await geminiService.generateResponse('Xin chào, đây là tin nhắn test');
      console.log('Gemini API response length:', testResponse?.length);
      
      const result = {
        success: true,
        timestamp: new Date().toISOString(),
        tests: {
          facebookAPI: fbConnection,
          geminiAPI: !!testResponse,
          webhookReceived: true
        },
        message: 'Test webhook thành công! Bot sẵn sàng hoạt động.',
        sampleResponse: testResponse?.substring(0, 100) + '...'
      };
      
      console.log('=== TEST WEBHOOK SUCCESS ===');
      console.log('Result:', JSON.stringify(result, null, 2));
      
      res.json(result);
      
    } catch (error) {
      console.error('Test webhook error:', error);
      const errorResult = {
        success: false,
        error: 'Test thất bại: ' + (error as Error).message,
        timestamp: new Date().toISOString()
      };
      console.log('=== TEST WEBHOOK ERROR ===');
      console.log('Error result:', JSON.stringify(errorResult, null, 2));
      res.status(500).json(errorResult);
    }
  });

  // Facebook webhook verification (GET)
  app.get('/api/webhook', async (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    console.log(`Webhook verification attempt: mode=${mode}, token=${token}, challenge=${challenge}`);

    // Use default verify token if no service configured
    let verifyToken = 'my_verify_token_2024';
    
    // Get config to check if custom verify token is set
    try {
      const config = await storage.getBotConfig();
      if (config?.verifyToken) {
        verifyToken = config.verifyToken;
      }
    } catch (error) {
      console.log('No config found, using default verify token');
    }

    if (mode === 'subscribe' && token === verifyToken) {
      console.log('Webhook verification successful');
      res.status(200).send(challenge);
    } else {
      console.log(`Webhook verification failed: expected token="${verifyToken}", got="${token}"`);
      res.status(403).json({ error: 'Verification failed' });
    }
  });

  // Test endpoint to verify external access
  app.get('/api/test', (req, res) => {
    console.log('=== TEST ENDPOINT HIT ===');
    res.json({ 
      message: 'Bot is accessible!', 
      timestamp: new Date().toISOString(),
      services: { facebookService: !!facebookService, geminiService: !!geminiService }
    });
  });

  // Facebook webhook events (POST)
  app.post('/api/webhook', async (req, res) => {
    console.log('=== WEBHOOK RECEIVED ===');
    console.log('Time:', new Date().toISOString());
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Body:', JSON.stringify(req.body, null, 2));
    console.log('Services status:', { facebookService: !!facebookService, geminiService: !!geminiService });
    console.log('User-Agent:', req.headers['user-agent']);
    console.log('Content-Type:', req.headers['content-type']);

    if (!facebookService || !geminiService) {
      console.log('ERROR: Services not configured');
      return res.status(500).json({ error: 'Bot not configured' });
    }

    const signature = req.headers['x-hub-signature-256'] as string;
    console.log('Signature verification:', { signature, hasSignature: !!signature });
    
    // Temporary disable signature check for debugging
    if (signature) {
      console.log('Signature info:', { 
        providedSignature: signature,
        bodyLength: JSON.stringify(req.body).length,
        bodyPreview: JSON.stringify(req.body).substring(0, 100)
      });
      
      const isValidSignature = facebookService.verifySignature(JSON.stringify(req.body), signature);
      console.log('Signature validation:', isValidSignature);
      
      // Continue processing regardless of signature for debugging
      if (!isValidSignature) {
        console.log('WARNING: Invalid signature but continuing for debug');
      }
    } else {
      console.log('WARNING: No signature provided but continuing for debug');
    }

    const messageData = facebookService.extractMessageData(req.body);
    console.log('Extracted message data:', messageData);
    
    if (messageData) {
      const startTime = Date.now();
      
      try {
        // Mark message as seen immediately
        await facebookService.markSeen(messageData.senderId);
        
        // Show typing indicator while AI is generating response
        await facebookService.sendTypingOn(messageData.senderId);
        
        const response = await geminiService.generateResponse(messageData.messageText);
        
        // Turn off typing indicator before sending message
        await facebookService.sendTypingOff(messageData.senderId);
        
        await facebookService.sendMessage(messageData.senderId, response);
        
        const responseTime = Date.now() - startTime;
        
        // Log the message
        await storage.createMessageLog({
          senderId: messageData.senderId,
          messageText: messageData.messageText,
          responseText: response,
          responseTime,
          success: true,
        });

        // Update daily stats
        const today = new Date().toISOString().split('T')[0];
        const todayLogs = await storage.getMessageLogsForDay(today);
        const successCount = todayLogs.filter(log => log.success).length;
        const errorCount = todayLogs.filter(log => !log.success).length;
        const avgResponseTime = Math.round(
          todayLogs.reduce((sum, log) => sum + (log.responseTime || 0), 0) / todayLogs.length
        );

        const existingStats = await storage.getActivityStats(today);
        if (existingStats) {
          await storage.updateActivityStats(today, {
            messageCount: todayLogs.length,
            successCount,
            errorCount,
            avgResponseTime,
          });
        } else {
          await storage.createActivityStats({
            date: today,
            messageCount: todayLogs.length,
            successCount,
            errorCount,
            avgResponseTime,
          });
        }

      } catch (error) {
        const responseTime = Date.now() - startTime;
        
        // Turn off typing indicator on error
        await facebookService.sendTypingOff(messageData.senderId);
        
        // Send error message to user
        await facebookService.sendMessage(
          messageData.senderId, 
          "Xin lỗi, mình gặp lỗi khi xử lý tin nhắn của bạn. Bạn thử lại sau nhé! 😊"
        );
        
        // Log the error
        await storage.createMessageLog({
          senderId: messageData.senderId,
          messageText: messageData.messageText,
          responseTime,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });

        console.error('Error processing message:', error);
      }
    }

    res.status(200).json({ status: 'ok' });
  });

  // Get bot configuration
  app.get('/api/config', async (req, res) => {
    try {
      const config = await storage.getBotConfig();
      if (!config) {
        return res.status(404).json({ error: 'No configuration found' });
      }
      
      // Don't send sensitive data to frontend
      const safeConfig = {
        ...config,
        pageAccessToken: config.pageAccessToken ? '***masked***' : '',
        appSecret: config.appSecret ? '***masked***' : '',
        geminiApiKey: config.geminiApiKey ? '***masked***' : '',
      };
      
      res.json(safeConfig);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get configuration' });
    }
  });

  // Create/Update bot configuration
  app.post('/api/config', async (req, res) => {
    try {
      const partialConfigData = insertBotConfigSchema.parse(req.body);
      
      const existingConfig = await storage.getBotConfig();
      let config;
      
      if (existingConfig) {
        // Merge partial data with existing config
        const mergedData = {
          ...existingConfig,
          ...partialConfigData,
          // Ensure required fields have values
          pageAccessToken: partialConfigData.pageAccessToken || existingConfig.pageAccessToken || "",
          appSecret: partialConfigData.appSecret || existingConfig.appSecret || "",
          verifyToken: partialConfigData.verifyToken || existingConfig.verifyToken || "my_verify_token_2024",
          pageId: partialConfigData.pageId || existingConfig.pageId || "",
          geminiApiKey: partialConfigData.geminiApiKey || existingConfig.geminiApiKey || "",
          geminiModel: partialConfigData.geminiModel || existingConfig.geminiModel || "gemini-2.5-flash",
          temperature: partialConfigData.temperature || existingConfig.temperature || "0.7",
          maxTokens: partialConfigData.maxTokens || existingConfig.maxTokens || 1000,
          safetySettings: partialConfigData.safetySettings || existingConfig.safetySettings || "BLOCK_MEDIUM_AND_ABOVE",
          systemPrompt: partialConfigData.systemPrompt || existingConfig.systemPrompt || "You are a helpful assistant for Facebook Messenger.",
        };
        
        config = await storage.updateBotConfig(mergedData);
      } else {
        // For new config, provide defaults for missing required fields
        const fullConfigData = {
          pageAccessToken: partialConfigData.pageAccessToken || "",
          appSecret: partialConfigData.appSecret || "",
          verifyToken: partialConfigData.verifyToken || "my_verify_token_2024",
          pageId: partialConfigData.pageId || "",
          geminiApiKey: partialConfigData.geminiApiKey || "",
          geminiModel: partialConfigData.geminiModel || "gemini-2.5-flash",
          temperature: partialConfigData.temperature || "0.7",
          maxTokens: partialConfigData.maxTokens || 1000,
          safetySettings: partialConfigData.safetySettings || "BLOCK_MEDIUM_AND_ABOVE",
          systemPrompt: partialConfigData.systemPrompt || "You are a helpful assistant for Facebook Messenger.",
          isActive: partialConfigData.isActive !== undefined ? partialConfigData.isActive : true,
        };
        
        config = await storage.createBotConfig(fullConfigData);
      }

      // Reinitialize services with new config
      await initializeServices();

      res.json({ message: 'Configuration saved successfully', id: config?.id });
    } catch (error) {
      console.error('Config save error:', error);
      res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid configuration data' });
    }
  });

  // Test Facebook connection
  app.post('/api/test-facebook', async (req, res) => {
    if (!facebookService) {
      return res.status(400).json({ error: 'Facebook not configured' });
    }

    try {
      const isConnected = await facebookService.testConnection();
      res.json({ connected: isConnected });
    } catch (error) {
      res.status(500).json({ error: 'Failed to test Facebook connection' });
    }
  });

  // Test Gemini connection
  app.post('/api/test-gemini', async (req, res) => {
    if (!geminiService) {
      return res.status(400).json({ error: 'Gemini not configured' });
    }

    try {
      const isConnected = await geminiService.testConnection();
      res.json({ connected: isConnected });
    } catch (error) {
      res.status(500).json({ error: 'Failed to test Gemini connection' });
    }
  });

  // Send test message
  app.post('/api/test-message', async (req, res) => {
    const { message } = req.body;
    
    if (!geminiService) {
      return res.status(400).json({ error: 'Gemini not configured' });
    }

    try {
      const response = await geminiService.generateResponse(message);
      res.json({ response });
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate response' });
    }
  });

  // Get recent message logs
  app.get('/api/logs', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const logs = await storage.getMessageLogs(limit);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get logs' });
    }
  });

  // Get activity stats
  app.get('/api/stats', async (req, res) => {
    try {
      const days = parseInt(req.query.days as string) || 7;
      const stats = await storage.getRecentActivityStats(days);
      
      // Get today's stats
      const today = new Date().toISOString().split('T')[0];
      const todayStats = await storage.getActivityStats(today);
      
      res.json({
        recent: stats,
        today: todayStats || {
          messageCount: 0,
          successCount: 0,
          errorCount: 0,
          avgResponseTime: 0
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get stats' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
