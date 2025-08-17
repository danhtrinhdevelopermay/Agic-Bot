import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const botConfigs = pgTable("bot_configs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  pageAccessToken: text("page_access_token").notNull(),
  appSecret: text("app_secret").notNull(),
  verifyToken: text("verify_token").notNull(),
  pageId: text("page_id").notNull(),
  geminiApiKey: text("gemini_api_key").notNull(),
  geminiModel: text("gemini_model").notNull().default("gemini-2.5-flash"),
  temperature: text("temperature").notNull().default("0.7"),
  maxTokens: integer("max_tokens").notNull().default(1000),
  safetySettings: text("safety_settings").notNull().default("BLOCK_MEDIUM_AND_ABOVE"),
  systemPrompt: text("system_prompt").notNull().default("You are a helpful assistant for Facebook Messenger."),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const messageLogs = pgTable("message_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  senderId: text("sender_id").notNull(),
  messageText: text("message_text"),
  responseText: text("response_text"),
  responseTime: integer("response_time"), // in milliseconds
  success: boolean("success").notNull().default(true),
  error: text("error"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const activityStats = pgTable("activity_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: text("date").notNull(), // YYYY-MM-DD format
  messageCount: integer("message_count").notNull().default(0),
  successCount: integer("success_count").notNull().default(0),
  errorCount: integer("error_count").notNull().default(0),
  avgResponseTime: integer("avg_response_time").notNull().default(0),
});

export const insertBotConfigSchema = createInsertSchema(botConfigs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).partial().refine((data) => {
  // At least some configuration must be provided
  return Object.keys(data).length > 0;
}, {
  message: "At least one configuration field must be provided",
});

export const insertMessageLogSchema = createInsertSchema(messageLogs).omit({
  id: true,
  timestamp: true,
});

export const insertActivityStatsSchema = createInsertSchema(activityStats).omit({
  id: true,
});

export type BotConfig = typeof botConfigs.$inferSelect;
export type InsertBotConfig = z.infer<typeof insertBotConfigSchema>;
export type MessageLog = typeof messageLogs.$inferSelect;
export type InsertMessageLog = z.infer<typeof insertMessageLogSchema>;
export type ActivityStats = typeof activityStats.$inferSelect;
export type InsertActivityStats = z.infer<typeof insertActivityStatsSchema>;
