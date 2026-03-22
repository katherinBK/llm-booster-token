/**
 * INITIALIZE KAIRO PROTOCOL (Devnet/Localnet)
 * Run this script ONCE after deploying the smart contract.
 * It creates a reward mint (SPL Token) and calls the initialize instruction.
 */

const { Connection, Keypair, PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } = require('@solana/web3.js');
const { Program, AnchorProvider, Wallet, BN } = require('@coral-xyz/anchor');
const { createMint, TOKEN_PROGRAM_ID } = require('@solana/spl-token');
const idl = require('../idl.json');
require('dotenv').config({ path: '../.env' });

// 1. CONFIGURATION
const RPC_URL = process.env.SOLANA_RPC || 'https://api.devnet.solana.com';
const PROGRAM_ID_STR = 'J3Fh7HnipJc86C54hf7QNd7Pgqhj7m4b1VHq1CyaB8pp'; // <--- CAMBIA ESTO CON TU PROGRAM ID DE PG
const REWARD_RATE = new BN(100); // Tokens generados por segundo globalmente (ajustable)

async function initialize() {
    console.log('🚀 Iniciando configuración del protocolo Kairo...');

    const connection = new Connection(RPC_URL, 'confirmed');

    // Usamos el ADMIN_SECRET_KEY del .env (debe ser el mismo que desplegó el contrato)
    if (!process.env.ADMIN_SECRET_KEY) {
        console.error('❌ ERROR: Falta ADMIN_SECRET_KEY en el .env');
        return;
    }
    const adminSecret = Uint8Array.from(JSON.parse(process.env.ADMIN_SECRET_KEY));
    const adminKeypair = Keypair.fromSecretKey(adminSecret);
    const wallet = new Wallet(adminKeypair);

    const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions());
    const programId = new PublicKey(PROGRAM_ID_STR);
    const program = new Program(idl, programId, provider);

    console.log(`📡 Conectado a: ${RPC_URL}`);
    console.log(`🔑 Admin Pubkey: ${adminKeypair.publicKey.toBase58()}`);

    try {
        // 2. CREAR EL TOKEN DE RECOMPENSA (rToken)
        console.log('\n🪙 Creando el Token de Recompensa (rToken)...');
        const rewardMint = await createMint(
            connection,
            adminKeypair,
            adminKeypair.publicKey,
            null,
            9 // Decimals
        );
        console.log(`✅ Reward Mint creado: ${rewardMint.toBase58()}`);

        // 3. DERIVAR PDAs
        const [globalState] = PublicKey.findProgramAddressSync([Buffer.from("global")], programId);
        const [rewardVault] = PublicKey.findProgramAddressSync([Buffer.from("reward_vault")], programId);

        console.log('\n🛠️ Llamando a la instrucción "initialize"...');
        const tx = await program.methods.initialize(REWARD_RATE)
            .accounts({
                globalState,
                rewardMint,
                rewardVault,
                admin: adminKeypair.publicKey,
                systemProgram: SystemProgram.programId,
                tokenProgram: TOKEN_PROGRAM_ID,
                rent: SYSVAR_RENT_PUBKEY,
            })
            .rpc();

        console.log(`\n🎉 PROTOCOLO INICIALIZADO CON ÉXITO!`);
        console.log(`🔗 Transaction Signature: ${tx}`);
        console.log('\n--- GUARDAR ESTOS DATOS ---');
        console.log(`PROGRAM_ID: ${programId.toBase58()}`);
        console.log(`GLOBAL_STATE_PDA: ${globalState.toBase58()}`);
        console.log(`REWARD_VAULT_PDA: ${rewardVault.toBase58()}`);
        console.log(`REWARD_MINT_ADDR: ${rewardMint.toBase58()}`);
        console.log('---------------------------');

    } catch (err) {
        console.error('\n❌ ERROR DURANTE LA INICIALIZACIÓN:');
        console.error(err);
    }
}

initialize();
