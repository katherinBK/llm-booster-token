const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const { OpenAI } = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const crypto = require('crypto');
const { Keypair } = require('@solana/web3.js');

const router = express.Router();

const supabaseUrl = process.env.SUPABASE_URL;
// Use service role key to securely check standard API keys without needing explicit user JWT
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase;
if (supabaseUrl && supabaseServiceKey) {
  supabase = createClient(supabaseUrl, supabaseServiceKey);
}

// Deterministic wallet generator based on User ID
function generateUserDeterministicPubkey(userId) {
  const hash = crypto.createHash('sha256').update(userId).digest();
  const keypair = Keypair.fromSeed(hash);
  return keypair.publicKey.toBase58();
}

router.post('/chat/completions', async (req, res) => {
  try {
    if (!supabase) {
       console.warn("Backend missing SUPABASE_SERVICE_ROLE_KEY in .env");
       return res.status(500).json({ error: 'Server improperly configured. Missing Service Role Key.' });
    }

    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid Authorization header. Must be standard Bearer token.' });
    }

    const kairoKey = authHeader.split(' ')[1];

    // Fetch API Key from DB using Service Role Key (Bypasses RLS smoothly)
    const { data: keys, error: keyError } = await supabase
      .from('api_keys')
      .select('*')
      .eq('encrypted_key', kairoKey);

    if (keyError || !keys || keys.length === 0) {
      return res.status(401).json({ error: 'Invalid API Key' });
    }

    const apiKeyConfig = keys[0];
    const provider = apiKeyConfig.provider_id.toLowerCase();
    const userId = apiKeyConfig.user_id;
    
    const startTime = Date.now();
    let responseData = null;
    let tokensInput = 0;
    let tokensOutput = 0;

    // Process LLM query
    if (provider === 'openai') {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const completion = await openai.chat.completions.create({
        ...req.body, // Pass through all parameters (temperature, max_tokens, etc)
        model: req.body.model || apiKeyConfig.model_id || 'gpt-4o-mini',
      });
      responseData = completion;
      tokensInput = completion.usage?.prompt_tokens || 0;
      tokensOutput = completion.usage?.completion_tokens || 0;
    
    } else if (provider === 'openrouter') {
      const openai = new OpenAI({ 
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: process.env.OPENROUTER_API_KEY,
        defaultHeaders: {
          "HTTP-Referer": "http://localhost:5173",
          "X-Title": "Kairo LLM Booster"
        }
      });
      const completion = await openai.chat.completions.create({
        ...req.body, // Pass through all parameters for LangChain compatibility
        model: req.body.model || apiKeyConfig.model_id || 'anthropic/claude-3-haiku',
      });
      responseData = completion;
      tokensInput = completion.usage?.prompt_tokens || 0;
      tokensOutput = completion.usage?.completion_tokens || 0;
    
    } else if (provider.includes('gemini') || provider.includes('google')) {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const modelName = req.body.model || apiKeyConfig.model_id || 'gemini-2.5-flash';
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        generationConfig: {
          maxOutputTokens: req.body.max_tokens || req.body.max_output_tokens,
          temperature: req.body.temperature,
          topP: req.body.top_p,
          topK: req.body.top_k,
        }
      });
      
      const prompt = req.body.messages.map(m => `${m.role}: ${m.content}`).join('\n');
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
          finish_reason: 'stop'
        }],
        usage: { prompt_tokens: tokensInput, completion_tokens: tokensOutput, total_tokens: tokensInput + tokensOutput }
      };
    } else {
      return res.status(400).json({ error: 'Unsupported provider configured in this API Key' });
    }

    const latency = Date.now() - startTime;
    const rtokensGenerated = Math.floor((tokensInput + tokensOutput) / 10);
    const { registerUsageOnChain } = require('../solana-client');

    // 100% Wallet-less Flow: Generar Custodial Pubkey Deterministicamente basada en el User ID
    const userWalletPubkey = generateUserDeterministicPubkey(userId);
    
    // Llamar al smart contract ASÍNCRONAMENTE para no bloquear la response de red
    registerUsageOnChain(userWalletPubkey, tokensInput + tokensOutput).catch(console.error);

    // Logging Usage
    await supabase.from('usage_logs').insert({
      user_id: userId,
      api_key_id: apiKeyConfig.id,
      provider_id: apiKeyConfig.provider_id,
      model_id: apiKeyConfig.model_id,
      method: 'POST',
      endpoint: '/v1/chat/completions',
      status_code: 200,
      tokens_input: tokensInput,
      tokens_output: tokensOutput,
      rtokens_generated: rtokensGenerated,
      cost_usd: (tokensInput + tokensOutput) * 0.000002, 
      savings_usd: ((tokensInput + tokensOutput) * 0.000002) * 0.5,
      latency_ms: latency
    });

    // Update API Key Request Count
    await supabase.from('api_keys')
      .update({
        request_count: apiKeyConfig.request_count + 1,
        rtokens_generated: apiKeyConfig.rtokens_generated + rtokensGenerated,
        last_used_at: new Date().toISOString()
      })
      .eq('id', apiKeyConfig.id);

    return res.json(responseData);
  } catch (error) {
    console.error('LLM proxy error:', error);
    res.status(500).json({ error: error.message || 'Internal server error while fetching LLM' });
  }
});

module.exports = router;
