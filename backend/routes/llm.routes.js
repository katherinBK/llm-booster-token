const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');
const { Keypair } = require('@solana/web3.js');
const { callLLM } = require('../llm-providers');

const router = express.Router();

// Use the standalone Supabase project for data (bypasses Lovable RLS issues)
const supabaseUrl = process.env.SUPABASE_KAIRO_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_KAIRO_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase;
if (supabaseUrl && supabaseServiceKey) {
  supabase = createClient(supabaseUrl, supabaseServiceKey);
  console.log(`✅ Supabase conectado a: ${supabaseUrl}`);
} else {
  console.warn('⚠️  No se encontró SUPABASE_KAIRO_SERVICE_KEY. El backend no puede validar API Keys.');
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
      return res.status(500).json({ error: 'Server improperly configured. Missing Supabase Kairo Service Key.' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid Authorization header. Must be standard Bearer token.' });
    }

    const kairoKey = authHeader.split(' ')[1];
    console.log(`🔑 Validando API Key: ${kairoKey.substring(0, 15)}...`);

    // Direct Supabase query (bypasses RLS with service_role key)
    const { data: keys, error: keyError } = await supabase
      .from('api_keys')
      .select('*')
      .eq('encrypted_key', kairoKey);

    if (keyError) {
      console.error('❌ Error de Supabase al buscar key:', keyError.message);
      return res.status(401).json({ error: 'Invalid API Key (DB Error)' });
    }

    if (!keys || keys.length === 0) {
      console.warn(`⚠️  API Key no encontrada en la BD. Key usada: "${kairoKey.substring(0,20)}..."`);
      return res.status(401).json({ error: 'Invalid API Key' });
    }

    const apiKeyConfig = keys[0];
    console.log(`✅ API Key válida! Provider: ${apiKeyConfig.provider_id}, Model: ${apiKeyConfig.model_id}`);

    const provider = apiKeyConfig.provider_id;
    const userId = apiKeyConfig.user_id;
    const startTime = Date.now();

    // Call the LLM via the provider module
    const { responseData, tokensInput, tokensOutput } = await callLLM(provider, apiKeyConfig.model_id, req.body);

    const latency = Date.now() - startTime;
    const rtokensGenerated = Math.floor((tokensInput + tokensOutput) / 10);
    const { registerUsageOnChain } = require('../solana-client');

    // Wallet-less Flow: generate deterministic pubkey from user ID
    const userWalletPubkey = generateUserDeterministicPubkey(userId);

    // Call smart contract asynchronously (don't block the response)
    registerUsageOnChain(userWalletPubkey, tokensInput + tokensOutput).catch(console.error);

    // Log usage to Supabase
    const { error: logError } = await supabase.from('usage_logs').insert({
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
      latency_ms: latency,
    });

    if (logError) console.error('⚠️  Error guardando log:', logError.message);

    // Update api_key request count
    await supabase.from('api_keys')
      .update({
        request_count: apiKeyConfig.request_count + 1,
        rtokens_generated: apiKeyConfig.rtokens_generated + rtokensGenerated,
        last_used_at: new Date().toISOString(),
      })
      .eq('id', apiKeyConfig.id);

    return res.json(responseData);

  } catch (error) {
    console.error('❌ LLM proxy error:', error.message);
    res.status(500).json({ error: error.message || 'Internal server error while fetching LLM' });
  }
});

module.exports = router;

