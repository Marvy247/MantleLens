// Mantle Network Client & RPC Integration
import { defineChain } from 'viem';

// Define Mantle Networks
export const mantleMainnet = defineChain({
  id: 5000,
  name: 'Mantle',
  nativeCurrency: { name: 'MNT', symbol: 'MNT', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.mantle.xyz'] },
    public: { http: ['https://rpc.mantle.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Mantle Explorer', url: 'https://explorer.mantle.xyz' },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 304717,
    },
  },
});

export const mantleTestnet = defineChain({
  id: 5003,
  name: 'Mantle Sepolia Testnet',
  nativeCurrency: { name: 'MNT', symbol: 'MNT', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.sepolia.mantle.xyz'] },
    public: { http: ['https://rpc.sepolia.mantle.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Mantle Testnet Explorer', url: 'https://explorer.sepolia.mantle.xyz' },
  },
  testnet: true,
});

// API Configuration
export const MANTLE_API_BASE_URL = process.env.NEXT_PUBLIC_MANTLE_API_URL || 'https://api.mantle-atlas.xyz';
export const MANTLE_RPC_URL = process.env.NEXT_PUBLIC_MANTLE_RPC_URL || 'https://rpc.mantle.xyz';
export const MANTLE_CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_MANTLE_CHAIN_ID || '5000');

// Determine if using testnet or mainnet
export const IS_TESTNET = process.env.NEXT_PUBLIC_MANTLE_NETWORK === 'testnet';
export const ACTIVE_CHAIN = IS_TESTNET ? mantleTestnet : mantleMainnet;

// Helper to fetch from Mantle RPC
export async function fetchFromMantleRPC(method: string, params: any[] = []) {
  const response = await fetch(MANTLE_RPC_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method,
      params,
    }),
  });

  if (!response.ok) {
    throw new Error(`Mantle RPC error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  
  if (data.error) {
    throw new Error(`RPC Error: ${data.error.message}`);
  }

  return data.result;
}

// Helper to fetch from Mantle Atlas API (our backend)
export async function fetchFromMantleAPI(endpoint: string, options?: RequestInit) {
  const url = `${MANTLE_API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(process.env.NEXT_PUBLIC_ATLAS_API_KEY && {
      'X-Api-Key': process.env.NEXT_PUBLIC_ATLAS_API_KEY,
    }),
    ...options?.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`Mantle Atlas API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Web3 utilities for Mantle
export async function getBlockNumber(): Promise<number> {
  const result = await fetchFromMantleRPC('eth_blockNumber');
  return parseInt(result, 16);
}

export async function getBalance(address: string): Promise<string> {
  const result = await fetchFromMantleRPC('eth_getBalance', [address, 'latest']);
  return result;
}

export async function getTransaction(txHash: string) {
  return fetchFromMantleRPC('eth_getTransactionByHash', [txHash]);
}

export async function getLogs(params: {
  fromBlock?: string;
  toBlock?: string;
  address?: string;
  topics?: string[];
}) {
  return fetchFromMantleRPC('eth_getLogs', [params]);
}

// Explorer URLs
export const getExplorerUrl = (type: 'tx' | 'address' | 'block', value: string) => {
  const baseUrl = ACTIVE_CHAIN.blockExplorers.default.url;
  switch (type) {
    case 'tx':
      return `${baseUrl}/tx/${value}`;
    case 'address':
      return `${baseUrl}/address/${value}`;
    case 'block':
      return `${baseUrl}/block/${value}`;
    default:
      return baseUrl;
  }
};

// Mantle DA (Data Availability) integration
export const MANTLE_DA_ENDPOINT = 'https://da.mantle.xyz';

export async function storeOnMantleDA(data: any): Promise<string> {
  // This would integrate with Mantle's DA layer
  // For now, return a mock hash
  const dataStr = JSON.stringify(data);
  const hash = `0x${Buffer.from(dataStr).toString('hex').slice(0, 64)}`;
  
  // In production, this would call Mantle DA API
  console.log(`[Mock] Storing ${dataStr.length} bytes on Mantle DA`);
  
  return hash;
}

export async function retrieveFromMantleDA(hash: string): Promise<any> {
  // This would retrieve from Mantle's DA layer
  console.log(`[Mock] Retrieving data from Mantle DA: ${hash}`);
  return null;
}

// Gas estimation utilities
export async function estimateGas(transaction: {
  from: string;
  to: string;
  data?: string;
  value?: string;
}): Promise<string> {
  return fetchFromMantleRPC('eth_estimateGas', [transaction]);
}

export async function getGasPrice(): Promise<string> {
  return fetchFromMantleRPC('eth_gasPrice');
}
