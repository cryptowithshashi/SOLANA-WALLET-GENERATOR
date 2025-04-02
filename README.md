# SOLANA WALLET GENERATOR GUIDE

A simple and user-friendly Node.js script designed to generate multiple Solana wallets.

It generates and displays the **Public Key** (Address), the **Private Key**, and the **Mnemonic Recovery Phrase** for each wallet in a clean box format in your console. Credentials are also saved locally to a text file.


## FEATURES



 - Instantly create multiple crypto wallets in one go.

 - Neatly organized wallet details (Address, Private Key, and Secret Phrase).

 - Automatically saves all wallet details in a file for easy access.
## PRE REQUISITES

 - Ensure Git, Node.js, and npm are installed. If not, install them using your VPS distribution's package manager.

```bash
  sudo apt update
```
```bash
  sudo apt install git nodejs npm -y
```

## INSTALLATION GUIDE

Install Dependencies
```bash
  sudo apt update && sudo apt upgrade -y
  sudo apt install -y git nodejs npm
```
Clone Repository
```bash
  https://github.com/cryptowithshashi/SOLANA-WALLET-GENERATOR.git
```
```bash
  cd SOLANA-WALLET-GENERATOR
```

Install Packages
```bash
  npm install
```
Execute the code
```bash
  node index.js
```
Use this command to check your wallet's info
```bash
  nano solana_wallet_output.txt
```

- Enter number of wallets when prompted
- Find saved wallets in solana_wallet_output.txt
- DELETE solana_wallet_output.txt from VPS after download
- Store mnemonics in encrypted storage
- Never expose private keys online
- Maintain offline backups

DISCLAIMER -- This tool is provided "as-is" for educational purposes. The developers assume no responsibility for lost funds or security breaches. Always audit generated wallets before mainnet use.


## ABOUT ME

Twitter -- https://x.com/SHASHI522004

Github -- https://github.com/cryptowithshashi


## ABOUT ME

Twitter -- https://x.com/SHASHI522004

Github -- https://github.com/cryptowithshashi

