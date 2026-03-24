// llm-providers.js
// Módulo separado para la lógica de consumo de LLMs.
// Soporta: OpenAI, OpenRouter, Gemini/Google.

import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import crypto from 'crypto';

/**
 * Llama al LLM correspondiente según el provider configurado en la API Key.
 * @param {string} provider - ID del proveedor (openai, openrouter, gemini, google)
 * @param {string} modelId - Modelo preferido desde la API Key
 * @param {object} reqBody - El body completo del request (messages, temperature, etc.)
 * @returns {Promise<{responseData: object, tokensInput: number, tokensOutput: number}>}
 */
async function callLLM(provider, modelId, reqBody) {
  const p = provider.toLowerCase();
  let responseData, tokensInput = 0, tokensOutput = 0;

  if (p === 'openai') {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      ...reqBody,
      model: reqBody.model || modelId || 'gpt-4o-mini',
    });
    responseData = completion;
    tokensInput = completion.usage?.prompt_tokens || 0;
    tokensOutput = completion.usage?.completion_tokens || 0;

  } else if (p === 'openrouter') {
    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error('OPENROUTER_API_KEY is not defined in environment variables');
    }
    const openai = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPENROUTER_API_KEY,
      defaultHeaders: {
        'HTTP-Referer': 'https://kairo-protocol.vercel.app',
        'X-Title': 'Kairo LLM Booster',
      },
    });
    try {
      const completion = await openai.chat.completions.create({
        ...reqBody,
        model: reqBody.model || modelId || 'anthropic/claude-3-haiku',
      });
      responseData = completion;
      tokensInput = completion.usage?.prompt_tokens || 0;
      tokensOutput = completion.usage?.completion_tokens || 0;
    } catch (orError) {
      console.error('--- OPENROUTER API ERROR ---');
      console.error('Status:', orError.status);
      console.error('Message:', orError.message);
      if (orError.response) {
        console.error('Response Data:', JSON.stringify(orError.response.data, null, 2));
      }
      throw orError;
    }

  } else if (p === 'gemini' || p === 'google') {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const modelName = reqBody.model || modelId || 'gemini-2.0-flash';
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        maxOutputTokens: reqBody.max_tokens || reqBody.max_output_tokens,
        temperature: reqBody.temperature,
        topP: reqBody.top_p,
        topK: reqBody.top_k,
      },
    });

    const messages = reqBody.messages || [];
    const prompt = messages.map(m => `${m.role}: ${m.content}`).join('\n');
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    tokensInput = Math.floor(prompt.length / 4);
    tokensOutput = Math.floor(text.length / 4);

    responseData = {
      id: 'chatcmpl-' + crypto.randomUUID(),
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: modelName,
      choices: [{
        index: 0,
        message: { role: 'assistant', content: text },
        finish_reason: 'stop',
      }],
      usage: {
        prompt_tokens: tokensInput,
        completion_tokens: tokensOutput,
        total_tokens: tokensInput + tokensOutput,
      },
    };
  } else {
    throw new Error(`Proveedor no soportado: ${provider}`);
  }

  return { responseData, tokensInput, tokensOutput };
}

export { callLLM };
