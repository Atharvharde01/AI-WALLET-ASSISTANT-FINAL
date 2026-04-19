/**
 * Wallet Connection Utility (ethers.js v5 + MetaMask)
 */
import { ethers } from 'ethers';

// HeLa Blockchain Network Configuration
export const HELA_NETWORK = {
  chainId: '0x666E', // 26222 in hex
  chainName: 'HeLa Mainnet',
  nativeCurrency: {
    name: 'HELA',
    symbol: 'HELA',
    decimals: 18,
  },
  rpcUrls: ['https://mainnet-rpc.helachain.com'],
  blockExplorerUrls: ['https://mainnet-blockscout.helachain.com'],
};

export const HELA_TESTNET = {
  chainId: '0x6600', // 26112 in hex  
  chainName: 'HeLa Testnet',
  nativeCurrency: {
    name: 'HELA',
    symbol: 'HELA',
    decimals: 18,
  },
  rpcUrls: ['https://testnet-rpc.helachain.com'],
  blockExplorerUrls: ['https://testnet-blockscout.helachain.com'],
};

/**
 * Check if MetaMask is installed
 */
export function isMetaMaskInstalled() {
  return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
}

/**
 * Connect to MetaMask wallet
 */
export async function connectWallet() {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
  }

  try {
    // Request account access
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const address = accounts[0];
    const balance = await provider.getBalance(address);
    const network = await provider.getNetwork();

    return {
      address,
      balance: ethers.utils.formatEther(balance),
      network: network.name !== 'unknown' ? network.name : `Chain ${network.chainId}`,
      chainId: network.chainId,
      provider,
      signer,
    };
  } catch (error) {
    if (error.code === 4001) {
      throw new Error('Connection rejected. Please approve the MetaMask connection request.');
    }
    throw error;
  }
}

/**
 * Switch to HeLa network
 */
export async function switchToHeLa(useTestnet = true) {
  const network = useTestnet ? HELA_TESTNET : HELA_NETWORK;

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: network.chainId }],
    });
  } catch (switchError) {
    // Network not added — add it
    if (switchError.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [network],
      });
    } else {
      throw switchError;
    }
  }
}

/**
 * Disconnect wallet (clear local state)
 */
export function disconnectWallet() {
  // MetaMask doesn't have a real disconnect — we just clear state
  return true;
}

/**
 * Shorten address for display
 */
export function shortenAddress(address) {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Listen for account/network changes
 */
export function onWalletChange(callback) {
  if (!isMetaMaskInstalled()) return;

  window.ethereum.on('accountsChanged', (accounts) => {
    callback({ type: 'accountsChanged', accounts });
  });

  window.ethereum.on('chainChanged', (chainId) => {
    callback({ type: 'chainChanged', chainId });
  });
}
