import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { Connection, Keypair, PublicKey, SystemProgram } from '@solana/web3.js';
import pkg from '@coral-xyz/anchor';
const { Program, AnchorProvider, Wallet, BN } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const idl = JSON.parse(fs.readFileSync(path.join(__dirname, 'idl.json'), 'utf-8'));

// Configuración RPC (Devnet por defecto o Localnet)
const connection = new Connection(process.env.SOLANA_RPC || 'https://api.devnet.solana.com', 'confirmed');

// En un entorno de producción seguro, esto vendría de variables de entorno (ej. base58 string)
// Para propósitos de este boilerplate "wallet-less checkout" creamos el admin keypair mockeado (random dummy format)
// o generamos uno si no existe.
const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY 
  ? Uint8Array.from(JSON.parse(process.env.ADMIN_SECRET_KEY)) 
  : Keypair.generate().secretKey;

const adminKeypair = Keypair.fromSecretKey(ADMIN_SECRET);
const wallet = new Wallet(adminKeypair);

// Provider default de Anchor
const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions());

// Program ID extraído de idl.json
const PROGRAM_ID = new PublicKey(idl.address);
const program = new Program(idl, provider);

// Semillas para PDAs
const getGlobalStatePDA = () => {
    // Usar la dirección previamente inicializada si está en el .env
    if (process.env.GLOBAL_STATE_PDA) {
        return new PublicKey(process.env.GLOBAL_STATE_PDA);
    }
    return PublicKey.findProgramAddressSync([Buffer.from("global")], PROGRAM_ID)[0];
};

const getUserStatePDA = (userPubkey) => {
    return PublicKey.findProgramAddressSync([Buffer.from("user"), userPubkey.toBuffer()], PROGRAM_ID)[0];
};

/**
 * Registra el uso de tokens en la blockchain llamando a register_usage
 * @param {string} userWalletPubkey - Pubkey en base58 del usuario
 * @param {number} amount - Cantidad de tokens a registrar
 */
const registerUsageOnChain = async (userWalletPubkey, amount) => {
    try {
        const userPubkey = new PublicKey(userWalletPubkey);
        const globalState = getGlobalStatePDA();
        const userState = getUserStatePDA(userPubkey);
        
        // Ejecutamos la transacción a través de Anchor RPC
        // Como 'admin' es el que firma y paga, Anchor lo detecta usando provider.wallet
        const tx = await program.methods.registerUsage(new BN(amount))
            .accounts({
                globalState,
                userState,
                userPubkey,
                admin: adminKeypair.publicKey,
                systemProgram: SystemProgram.programId
            })
            .rpc();
        
        console.log(`[Smart Contract] Usage registered. TX: ${tx}`);
        return tx;
    } catch (err) {
        console.error(`[Smart Contract] Error registering usage:`, err.message);
        // Si el global_state no ha sido inicializado por el admin, lanzará error de "AccountNotInitialized".
        // Como esto es un backend proxy, no queremos que truene la response_LLM al usuario por culpa de la blockchain.
        // Solo logueamos el fallo on-chain.
        return null;
    }
};

export {
    registerUsageOnChain,
    adminKeypair
};
// Optional: export adminPubkey as a string
export const adminPubkey = adminKeypair.publicKey.toBase58();
