export interface LLMModel {
  id: string;
  name: string;
  description: string;
  inputPrice: number;   // per 1M tokens in USD
  outputPrice: number;  // per 1M tokens in USD
  contextWindow: string;
  rTokenMultiplier: number; // e.g. 1.4 = 40% more requests
}

export interface LLMProvider {
  id: string;
  name: string;
  logo: string; // emoji placeholder
  description: string;
  color: string; // tailwind class
  models: LLMModel[];
}

export const providers: LLMProvider[] = [
  {
    id: "gemini",
    name: "Google Gemini",
    logo: "✦",
    description: "Modelos de Google con alto rendimiento multimodal",
    color: "text-blue-400",
    models: [
      {
        id: "gemini-2.5-pro",
        name: "Gemini 2.5 Pro",
        description: "Top-tier reasoning y contexto largo",
        inputPrice: 1.25,
        outputPrice: 10.0,
        contextWindow: "1M tokens",
        rTokenMultiplier: 1.35,
      },
      {
        id: "gemini-2.5-flash",
        name: "Gemini 2.5 Flash",
        description: "Balance entre costo y rendimiento",
        inputPrice: 0.15,
        outputPrice: 0.60,
        contextWindow: "1M tokens",
        rTokenMultiplier: 1.50,
      },
      {
        id: "gemini-2.5-flash-lite",
        name: "Gemini 2.5 Flash Lite",
        description: "Más rápido y económico para tareas simples",
        inputPrice: 0.075,
        outputPrice: 0.30,
        contextWindow: "1M tokens",
        rTokenMultiplier: 1.65,
      },
    ],
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    logo: "◈",
    description: "Agregador multi-modelo: Llama, Claude, Mistral y más",
    color: "text-orange-400",
    models: [
      {
        id: "microsoft/phi-4",
        name: "Microsoft Phi 4",
        description: "Recomendado para pruebas iniciales. Balance perfecto.",
        inputPrice: 0.0,
        outputPrice: 0.0,
        contextWindow: "128K tokens",
        rTokenMultiplier: 1.65,
      },
      {
        id: "meta-llama/llama-3.3-70b-instruct:free",
        name: "Llama 3.3 70B (Free)",
        description: "Modelo potente y gratuito en OpenRouter",
        inputPrice: 0.0,
        outputPrice: 0.0,
        contextWindow: "128K tokens",
        rTokenMultiplier: 1.45,
      },
      {
        id: "google/gemini-2.0-flash-exp:free",
        name: "Gemini 2.0 Flash Free",
        description: "Rápido, multimodal y gratuito (exp)",
        inputPrice: 0.0,
        outputPrice: 0.0,
        contextWindow: "1M tokens",
        rTokenMultiplier: 1.50,
      },
      {
        id: "qwen/qwen-2-7b-instruct:free",
        name: "Qwen 2 7B (Free)",
        description: "Modelo eficiente y gratuito",
        inputPrice: 0.0,
        outputPrice: 0.0,
        contextWindow: "32K tokens",
        rTokenMultiplier: 1.55,
      },
      {
        id: "mistralai/mistral-7b-instruct:free",
        name: "Mistral 7B (Free)",
        description: "Clásico confiable y gratuito",
        inputPrice: 0.0,
        outputPrice: 0.0,
        contextWindow: "32K tokens",
        rTokenMultiplier: 1.50,
      },
      {
        id: "deepseek/deepseek-r1",
        name: "DeepSeek R1",
        description: "Especializado en razonamiento profundo",
        inputPrice: 0.55,
        outputPrice: 2.19,
        contextWindow: "64K tokens",
        rTokenMultiplier: 1.45,
      },
    ],
  },
];

export const getProvider = (id: string) => providers.find((p) => p.id === id);
export const getModel = (providerId: string, modelId: string) =>
  getProvider(providerId)?.models.find((m) => m.id === modelId);
