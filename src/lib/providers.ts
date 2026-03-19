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
        id: "meta-llama/llama-4-maverick",
        name: "Llama 4 Maverick",
        description: "Modelo open-source de Meta, excelente calidad/precio",
        inputPrice: 0.20,
        outputPrice: 0.60,
        contextWindow: "1M tokens",
        rTokenMultiplier: 1.55,
      },
      {
        id: "anthropic/claude-sonnet-4",
        name: "Claude Sonnet 4",
        description: "Fuerte en razonamiento y código vía OpenRouter",
        inputPrice: 3.00,
        outputPrice: 15.0,
        contextWindow: "200K tokens",
        rTokenMultiplier: 1.30,
      },
      {
        id: "mistralai/mistral-large",
        name: "Mistral Large",
        description: "Modelo europeo de alta calidad",
        inputPrice: 2.00,
        outputPrice: 6.00,
        contextWindow: "128K tokens",
        rTokenMultiplier: 1.40,
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
