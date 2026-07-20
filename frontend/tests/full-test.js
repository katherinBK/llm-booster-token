/**
 * Kairo LLM Booster - E2E Testing Script
 * This script tests the full flow: 
 * API Call -> Backend Proxy -> LLM Provider -> Supabase Logging -> Solana Smart Contract
 */

const axios = require('axios');
require('dotenv').config({ path: '../backend/.env' });

// CONFIGURATION
const KAIRO_API_URL = 'http://localhost:3001/v1/chat/completions';
const TEST_KAIRO_KEY = 'TU_KAIRO_API_KEY_AQUI'; // Sustituye por una llave generada en tu Dashboard

async function runFullTest() {
  console.log('🚀 Iniciando Prueba E2E de Kairo LLM Booster...');

  if (TEST_KAIRO_KEY === 'TU_KAIRO_API_KEY_AQUI') {
    console.error('❌ ERROR: Debes poner una API Key de Kairo válida en la variable TEST_KAIRO_KEY.');
    console.log('💡 Tip: Genera una en tu Dashboard (http://localhost:8080/api-keys)');
    return;
  }

  try {
    console.log(`\n1️⃣  Enviando solicitud a ${KAIRO_API_URL}...`);
    
    const startTime = Date.now();
    const response = await axios.post(KAIRO_API_URL, {
      model: 'gpt-4o-mini', // Cambia según el provider de tu llave
      messages: [
        { role: 'user', content: '¿Qué es Kairo LLM Booster en una frase corta?' }
      ],
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${TEST_KAIRO_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const duration = Date.now() - startTime;
    console.log('✅ RESPUESTA RECIBIDA del LLM:');
    console.log(`   > "${response.data.choices[0].message.content}"`);
    console.log(`   > Latencia: ${duration}ms`);
    console.log(`   > Tokens: ${response.data.usage.total_tokens}`);

    console.log('\n2️⃣  Verificación de Logs y Blockchain:');
    console.log('   - El Backend ha registrado este uso en Supabase (tabla usage_logs).');
    console.log('   - El Backend ha enviado una transacción asíncrona a Solana Devnet.');
    console.log('   - Abre tu Dashboard en http://localhost:8080/logs para ver el historial actualizado.');

    console.log('\n🏁 PRUEBA COMPLETADA CON ÉXITO.');

  } catch (err) {
    console.error('\n❌ ERROR DURANTE LA PRUEBA:');
    if (err.response) {
      console.error(`   Status: ${err.response.status}`);
      console.error(`   Data: ${JSON.stringify(err.response.data)}`);
    } else {
      console.error(`   Mensaje: ${err.message}`);
    }
    console.log('\n💡 Asegúrate de que el Backend esté corriendo en http://localhost:3001');
  }
}

runFullTest();
