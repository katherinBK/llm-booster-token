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
        id: "liquid/lfm-2.5-1.2b-instruct:free",
        name: "Microsoft Phi 4",
        description: "Recomendado para pruebas iniciales. Balance perfecto.",
        inputPrice: 0.0,
        outputPrice: 0.0,
        contextWindow: "128K tokens",
        rTokenMultiplier: 1.65,
      },
      {
        id: "openai/gpt-oss-120b:free",
        name: "GPT OSS 120B",
        description: "Modelo potente y gratuito en OpenRouter",
        inputPrice: 0.0,
        outputPrice: 0.0,
        contextWindow: "128K tokens",
        rTokenMultiplier: 1.45,
      },
      {
        id: "meta-llama/llama-3.2-3b-instruct:free",
        name: "Llama 3.2 3B",
        description: "Rápido, multimodal",
        inputPrice: 0.0,
        outputPrice: 0.0,
        contextWindow: "1M tokens",
        rTokenMultiplier: 1.50,
      },
      {
        id: "qwen/qwen-2-7b-instruct:free",
        name: "Qwen 2 7B",
        description: "Modelo eficiente y gratuito",
        inputPrice: 0.0,
        outputPrice: 0.0,
        contextWindow: "32K tokens",
        rTokenMultiplier: 1.55,
      },
      {
        id: "sourceful/riverflow-v2-pro",
        name: "Riverflow V2 Pro",
        description: "Clásico confiable y gratuito",
        inputPrice: 0.0,
        outputPrice: 0.0,
        contextWindow: "32K tokens",
        rTokenMultiplier: 1.50,
      },
      {
        id: "minimax/minimax-m2.5:free",
        name: "Minimax M2.5",
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
