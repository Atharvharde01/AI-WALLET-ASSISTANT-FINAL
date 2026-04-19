/**
 * Smart Contract Interaction Utility
 * Read/write to AIWalletAssistant deployed on HeLa
 */
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './contractConfig';

/**
 * Check if contract address is configured
 */
export function isContractConfigured() {
  return CONTRACT_ADDRESS && !CONTRACT_ADDRESS.includes('YOUR_DEPLOYED');
}

/**
 * Get a read-only contract instance (no signer needed)
 */
export function getReadOnlyContract(provider) {
  if (!isContractConfigured()) {
    throw new Error('Contract address not configured. Deploy the contract first.');
  }
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
}

/**
 * Get a writable contract instance (requires signer)
 */
export function getContract(signer) {
  if (!isContractConfigured()) {
    throw new Error('Contract address not configured. Deploy the contract first.');
  }
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
}

/**
 * Read the current on-chain message
 */
export async function readMessage(provider) {
  const contract = getReadOnlyContract(provider);
  return await contract.getMessage();
}

/**
 * Read the message update count
 */
export async function readMessageCount(provider) {
  const contract = getReadOnlyContract(provider);
  const count = await contract.getMessageCount();
  return count.toNumber();
}

/**
 * Read the contract owner
 */
export async function readOwner(provider) {
  const contract = getReadOnlyContract(provider);
  return await contract.owner();
}

/**
 * Update the on-chain message (requires connected wallet)
 */
export async function updateMessage(signer, newMessage) {
  const contract = getContract(signer);
  const tx = await contract.updateMessage(newMessage);
  const receipt = await tx.wait();
  return {
    hash: tx.hash,
    blockNumber: receipt.blockNumber,
    gasUsed: receipt.gasUsed.toString(),
  };
}
