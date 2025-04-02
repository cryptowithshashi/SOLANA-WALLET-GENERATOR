import chalk from 'chalk';
import { Keypair } from '@solana/web3.js';
import { appendFileSync } from 'fs';
import moment from 'moment';
import readlineSync from 'readline-sync';
import * as bip39 from 'bip39'; // For mnemonic generation
import bs58 from 'bs58';        // For Base58 encoding/decoding
import { Buffer } from 'buffer'; // Import Buffer for bip39 entropy
import { banner } from './banner.js';

// --- Configuration ---
const WALLET_FILE = './solana_wallets_output.txt';
// Increased width needed for Base58 Private Key and Mnemonic
const BOX_WIDTH = 130;

// --- Helper Functions ---

/**
 * Creates a new random Solana wallet and derives mnemonic/Base58 private key.
 * @returns {{publicKey: string, privateKey: string, mnemonic: string}} Wallet details.
 */
function generateNewSolanaWallet() {
    const keypair = Keypair.generate();
    const publicKey = keypair.publicKey.toBase58();
    const secretKeyBytes = keypair.secretKey; // Uint8Array(64)

    // 1. Generate Mnemonic from the first 32 bytes (entropy/seed)
    const entropy = secretKeyBytes.slice(0, 32);
    const mnemonic = bip39.entropyToMnemonic(Buffer.from(entropy));

    // 2. Generate Base58 Private Key string from the full 64 bytes
    const privateKeyBase58 = bs58.encode(secretKeyBytes);

    return {
        publicKey,
        privateKey: privateKeyBase58, // Base58 encoded full secret key
        mnemonic,
    };
}

/**
 * Displays wallet details in a formatted box to the console.
 * @param {object} walletData - Wallet data {publicKey, privateKey, mnemonic}.
 * @param {number} walletNumber - The sequential number of the wallet generated.
 */
function displayWalletInfoBox(walletData, walletNumber) {
    const topBorder = '┌' + '─'.repeat(BOX_WIDTH - 2) + '┐';
    const bottomBorder = '└' + '─'.repeat(BOX_WIDTH - 2) + '┘';
    const separator = '├' + '─'.repeat(BOX_WIDTH - 2) + '┤';

    // Helper to format lines, truncating if necessary
    const formatLine = (label, value, color = chalk.white) => {
        const prefix = `│ ${label}: `;
        const maxContentLength = BOX_WIDTH - 4;
        const availableValueWidth = maxContentLength - prefix.length + 2;

        let displayValue = value; // Value is already string

        if (displayValue.length > availableValueWidth) {
             displayValue = displayValue.substring(0, availableValueWidth - 3) + '...';
        }

        const lineContent = prefix + displayValue;
        const paddingCount = Math.max(0, BOX_WIDTH - lineContent.length - 1);
        const padding = ' '.repeat(paddingCount);

        return color(lineContent + padding + '│');
    };

    console.log(chalk.magenta(topBorder));
    console.log(formatLine(`Wallet #${walletNumber}`, `(${moment().format('YYYY-MM-DD HH:mm:ss')})`, chalk.magenta.bold));
    console.log(chalk.magenta(separator));
    console.log(formatLine('Public Key (Address)', walletData.publicKey, chalk.green));
    console.log(formatLine('Private Key (Base58)', walletData.privateKey, chalk.red)); // Changed Label
    console.log(formatLine('Mnemonic Phrase     ', walletData.mnemonic, chalk.cyan));   // Changed Label
    console.log(chalk.magenta(bottomBorder));
    console.log('');
}

/**
 * Saves wallet details (Pubkey, Base58 PrivKey, Mnemonic) to a file.
 * @param {object} walletData - {publicKey, privateKey, mnemonic}.
 */
function saveWalletToFile(walletData) {
    // Updated file content format
    const fileContent = `PublicKey: ${walletData.publicKey} | PrivateKey(Base58): ${walletData.privateKey} | Mnemonic: ${walletData.mnemonic}\n`;
    try {
        appendFileSync(WALLET_FILE, fileContent);
    } catch (writeError) {
        console.error(chalk.red(`Error writing to file ${WALLET_FILE}:`), writeError);
    }
}

// --- Main Execution Logic (Async IIFE) ---
(async () => {
    // 1. Display Banner
    console.log(banner);

    try {
        // 2. Get User Input
        const numberOfWalletsInput = readlineSync.question(
            chalk.yellow('Number of Solana wallets to generate: ')
        );
        const requestedCount = parseInt(numberOfWalletsInput, 10);

        if (isNaN(requestedCount) || requestedCount <= 0) {
            console.log(chalk.red('Invalid input. Please enter a positive number.'));
            return;
        }

        console.log(chalk.cyan(`\nGenerating ${requestedCount} Solana wallet(s)...`));

        // 3. Generate Wallets in a Loop
        for (let i = 1; i <= requestedCount; i++) {
            const newWallet = generateNewSolanaWallet();

            if (newWallet && newWallet.publicKey) {
                displayWalletInfoBox(newWallet, i);
                saveWalletToFile(newWallet);
            } else {
                console.log(chalk.yellow(`[${moment().format('HH:mm:ss')}] Warning: Failed to generate wallet #${i}.`));
            }
        }

        // 4. Final Confirmation Message (Updated)
        console.log(
            chalk.greenBright(
                `\n✅ Success! ${requestedCount} Solana wallet(s) generated.`
            )
        );
        console.log(
            chalk.green(
                `Wallet details (PublicKey, PrivateKey Base58, Mnemonic) saved to ${chalk.bold(WALLET_FILE)}.`
            )
        );
        console.log(chalk.yellow.bold("\n⚠️ IMPORTANT: Secure BOTH your Mnemonic Phrase and your Base58 Private Key. The Mnemonic is typically used for wallet recovery/import."))
        console.log(chalk.yellow.bold("   Treat these like critical passwords. Do not share them!"))


    } catch (error) {
        console.error(chalk.red('\n❌ An unexpected error occurred during wallet generation:'));
        console.error(chalk.red(error.message));
        if (error.stack) {
             console.error(chalk.gray(error.stack));
        }
    }
})(); // End of IIFE
