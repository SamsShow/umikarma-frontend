# WalletConnect Setup for UmiKarma

## Quick Setup (2 minutes)

### 1. Get WalletConnect Project ID

1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Sign up/login with GitHub
3. Click "Create Project"
4. Enter project details:
   - **Name**: UmiKarma
   - **Description**: AI-Enhanced Reputation System for Umi Network
   - **URL**: http://localhost:3000 (for development)
5. Copy the **Project ID**

### 2. Configure Environment

1. Open `umikarma-frontend/.env.local`
2. Replace the empty value with your Project ID:
   ```
   REACT_APP_WALLETCONNECT_PROJECT_ID=your_actual_project_id_here
   ```
3. Save the file

### 3. Restart Development Server

```bash
cd umikarma-frontend
npm start
```

## Umi Network Configuration

The app is configured for **Umi Devnet**:
- **Chain ID**: 42069
- **RPC URL**: https://devnet.moved.network  
- **Currency**: ETH
- **Explorer**: https://devnet.explorer.moved.network

## Getting Test ETH

1. Visit [Umi Faucet](https://faucet.umi.network)
2. Follow the instructions to claim test ETH from Ethereum Devnet
3. Bridge the ETH to Umi Devnet using the faucet's bridge feature

## Recommended Wallets

- **MetaMask**: Most common, good for testing
- **Rabby**: Recommended by Umi docs, better UX
- **WalletConnect**: For mobile wallet connections

## Adding Umi Network to Wallet

The app includes a "Add Umi Network" button that automatically configures your wallet with the correct network settings.

## Troubleshooting

- **403 Errors**: Make sure you have a valid WalletConnect Project ID
- **Wrong Network**: Use the network switcher in the app to switch to Umi Devnet
- **No Funds**: Get test ETH from the Umi faucet before testing transactions 