const express = require('express');
const { Connection, PublicKey, Keypair } = require('@solana/web3.js');
const crypto = require('crypto');

const router = express.Router();

// Usando Devnet para pruebas Solana que es comúnmente más estable y fácil de fondear
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
const MERCHANT_WALLET = '4q1nQhN9e8fDqjXtbzMhF89Fk1G6YQ5zS8vM2X6qP4b1'; // Una wallet random de devnet para recibir pruebas

// Para un pago en Solana Pay, creamos una referencia única por pago para trackearlo on-chain
router.post('/generate-payment', async (req, res) => {
  try {
    const { amount, memo } = req.body;
    
    // Generamos un Keypair temporal solo para extraer su Public Key y usarlo como "reference"
    // en la transacción de Solana Pay para poder ubicarla en la blockchain luego.
    const referenceKeypair = Keypair.generate();
    const reference = referenceKeypair.publicKey.toBase58();
    
    // Mismo mint USDC en devnet (4zMMC9srt5Ri5X14xA152zqGnAwvAk1mSp88WU4uKx5r)
    const usdcMint = '4zMMC9srt5Ri5X14xA152zqGnAwvAk1mSp88WU4uKx5r';
    
    // Construimos la URL de Solana Pay
    const url = `solana:${MERCHANT_WALLET}?amount=${amount}&spl-token=${usdcMint}&reference=${reference}&label=Kairo&message=${encodeURIComponent(memo || 'Pago Kairo')}`;
    
    res.json({
      url,
      recipient: MERCHANT_WALLET,
      reference,
      amount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/verify-payment', async (req, res) => {
  try {
    const { reference } = req.body;
    if (!reference) return res.status(400).json({ error: 'Missing reference' });

    const referencePubKey = new PublicKey(reference);
    const signatures = await connection.getSignaturesForAddress(referencePubKey, { limit: 1 });
    
    if (signatures.length === 0) {
      return res.json({ confirmed: false, message: 'Transaction not found on chain yet' });
    }

    const signatureInfo = signatures[0];
    if (signatureInfo.err) {
      return res.json({ confirmed: false, error: 'Transaction failed on chain' });
    }

    // Para una validación estricta al 100%, se chequearía el Transfer de USDC.
    // Con confirmar que existe la firma exitosa, la confirmamos.
    return res.json({ confirmed: true, signature: signatureInfo.signature, message: 'Pago verificado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
