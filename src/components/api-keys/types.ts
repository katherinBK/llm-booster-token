export interface ApiKey {
  id: string;
  name: string;
  key: string;
  providerId: string;
  modelId: string;
  createdAt: Date;
  lastUsed: Date | null;
  requestCount: number;
  rTokensGenerated: number;
}

export const generateRandomKey = (providerId: string) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const prefixMap: Record<string, string> = {
    gemini: "kairo_gem_",
    openrouter: "kairo_or_",
    openai: "kairo_ai_",
  };
  const prefix = prefixMap[providerId] || "kairo_live_";
  let result = prefix;
  for (let i = 0; i < 48; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const maskKey = (key: string) => {
  return key.slice(0, 10) + "•".repeat(20) + key.slice(-6);
};
