import { type BotConfig, type InsertBotConfig, type MessageLog, type InsertMessageLog, type ActivityStats, type InsertActivityStats } from "@shared/schema";
import { randomUUID } from "crypto";
import fs from "fs";
import path from "path";

export interface IStorage {
  // Bot Config methods
  getBotConfig(): Promise<BotConfig | undefined>;
  createBotConfig(config: InsertBotConfig): Promise<BotConfig>;
  updateBotConfig(config: Partial<InsertBotConfig>): Promise<BotConfig | undefined>;

  // Message Log methods
  createMessageLog(log: InsertMessageLog): Promise<MessageLog>;
  getMessageLogs(limit?: number): Promise<MessageLog[]>;
  getMessageLogsForDay(date: string): Promise<MessageLog[]>;

  // Activity Stats methods
  getActivityStats(date: string): Promise<ActivityStats | undefined>;
  createActivityStats(stats: InsertActivityStats): Promise<ActivityStats>;
  updateActivityStats(date: string, stats: Partial<InsertActivityStats>): Promise<ActivityStats | undefined>;
  getRecentActivityStats(days: number): Promise<ActivityStats[]>;
}

export class MemStorage implements IStorage {
  private botConfigs: Map<string, BotConfig> = new Map();
  private messageLogs: Map<string, MessageLog> = new Map();
  private activityStats: Map<string, ActivityStats> = new Map();
  private currentConfigId: string | null = null;
  private configFile = path.join(process.cwd(), 'config.json');

  constructor() {
    this.loadConfig();
  }

  private loadConfig() {
    try {
      // In production, try to load from environment variables first
      if (process.env.NODE_ENV === 'production') {
        const envConfig = {
          pageAccessToken: process.env.pageAccessToken,
          appSecret: process.env.appSecret,
          pageId: process.env.pageId,
          geminiApiKey: process.env.geminiApiKey,
          verifyToken: process.env.verifyToken || 'my_verify_token_2024',
          geminiModel: process.env.geminiModel || 'gemini-2.0-flash-exp',
          temperature: process.env.temperature || '0.7',
          maxTokens: parseInt(process.env.maxTokens || '1000'),
          safetySettings: process.env.safetySettings || 'BLOCK_MEDIUM_AND_ABOVE',
          systemPrompt: process.env.systemPrompt || 'Bạn là trợ lý AI thông minh cho Facebook Messenger. Hãy trả lời bằng tiếng Việt một cách tự nhiên, thân thiện và hữu ích.'
        };

        if (envConfig.pageAccessToken && envConfig.appSecret && envConfig.geminiApiKey) {
          const id = randomUUID();
          const now = new Date();
          const config: BotConfig = {
            ...envConfig,
            id,
            createdAt: now,
            updatedAt: now,
          };
          this.botConfigs.set(id, config);
          this.currentConfigId = id;
          console.log('Config loaded from environment variables');
          return;
        }
      }

      // Fallback to config file
      if (fs.existsSync(this.configFile)) {
        const configData = JSON.parse(fs.readFileSync(this.configFile, 'utf8'));
        const id = randomUUID();
        const now = new Date();
        const config: BotConfig = {
          ...configData,
          id,
          createdAt: now,
          updatedAt: now,
        };
        this.botConfigs.set(id, config);
        this.currentConfigId = id;
        console.log('Config loaded from file');
      }
    } catch (error) {
      console.log('No persistent config found, starting fresh');
    }
  }

  private saveConfig(config: BotConfig) {
    try {
      const { id, createdAt, updatedAt, ...configToSave } = config;
      fs.writeFileSync(this.configFile, JSON.stringify(configToSave, null, 2));
      console.log('Config saved to file');
    } catch (error) {
      console.error('Failed to save config:', error);
    }
  }

  async getBotConfig(): Promise<BotConfig | undefined> {
    if (this.currentConfigId) {
      return this.botConfigs.get(this.currentConfigId);
    }
    // Return the first config if no specific one is set
    const configs = Array.from(this.botConfigs.values());
    return configs[0];
  }

  async createBotConfig(insertConfig: InsertBotConfig): Promise<BotConfig> {
    const id = randomUUID();
    const now = new Date();
    const config: BotConfig = {
      ...insertConfig,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.botConfigs.set(id, config);
    this.currentConfigId = id;
    this.saveConfig(config);
    return config;
  }

  async updateBotConfig(updates: Partial<InsertBotConfig>): Promise<BotConfig | undefined> {
    const config = await this.getBotConfig();
    if (!config) return undefined;

    const updatedConfig: BotConfig = {
      ...config,
      ...updates,
      updatedAt: new Date(),
    };
    
    this.botConfigs.set(config.id, updatedConfig);
    this.saveConfig(updatedConfig);
    return updatedConfig;
  }

  async createMessageLog(insertLog: InsertMessageLog): Promise<MessageLog> {
    const id = randomUUID();
    const log: MessageLog = {
      ...insertLog,
      id,
      timestamp: new Date(),
    };
    this.messageLogs.set(id, log);
    return log;
  }

  async getMessageLogs(limit: number = 50): Promise<MessageLog[]> {
    const logs = Array.from(this.messageLogs.values())
      .sort((a, b) => (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0));
    return logs.slice(0, limit);
  }

  async getMessageLogsForDay(date: string): Promise<MessageLog[]> {
    const targetDate = new Date(date);
    const nextDate = new Date(targetDate);
    nextDate.setDate(nextDate.getDate() + 1);

    return Array.from(this.messageLogs.values()).filter(log => {
      if (!log.timestamp) return false;
      return log.timestamp >= targetDate && log.timestamp < nextDate;
    });
  }

  async getActivityStats(date: string): Promise<ActivityStats | undefined> {
    return this.activityStats.get(date);
  }

  async createActivityStats(insertStats: InsertActivityStats): Promise<ActivityStats> {
    const id = randomUUID();
    const stats: ActivityStats = {
      ...insertStats,
      id,
    };
    this.activityStats.set(insertStats.date, stats);
    return stats;
  }

  async updateActivityStats(date: string, updates: Partial<InsertActivityStats>): Promise<ActivityStats | undefined> {
    const stats = this.activityStats.get(date);
    if (!stats) return undefined;

    const updatedStats: ActivityStats = {
      ...stats,
      ...updates,
    };
    
    this.activityStats.set(date, updatedStats);
    return updatedStats;
  }

  async getRecentActivityStats(days: number): Promise<ActivityStats[]> {
    const result: ActivityStats[] = [];
    const today = new Date();
    
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const stats = this.activityStats.get(dateStr);
      if (stats) {
        result.push(stats);
      }
    }
    
    return result;
  }
}

export const storage = new MemStorage();
