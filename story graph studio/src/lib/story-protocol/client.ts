// Story Protocol SDK Client Setup
import { StoryClient, StoryConfig } from '@story-protocol/core-sdk';
import { http } from 'viem';
import { defineChain } from 'viem';

// Define Story Odyssey chain
export const odyssey = defineChain({
  id: 1513,
  name: 'Story Odyssey Testnet',
  nativeCurrency: { name: 'IP', symbol: 'IP', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://odyssey.storyrpc.io'] },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://odyssey.storyscan.xyz' },
  },
  testnet: true,
});

// Story Protocol configuration
const config: StoryConfig = {
  account: process.env.NEXT_PUBLIC_WALLET_PRIVATE_KEY as `0x${string}` | undefined,
  transport: http(process.env.NEXT_PUBLIC_RPC_URL || 'https://odyssey.storyrpc.io'),
  chainId: 'odyssey' as any, // Odyssey testnet
};

// Initialize Story Client (conditional to avoid build errors if env vars not set)
export const storyClient = typeof window !== 'undefined' ? StoryClient.newClient(config) : null;

// API endpoints
export const STORY_API_BASE_URL = process.env.NEXT_PUBLIC_STORY_API_URL || 'https://api.story.foundation/api/v1';

// Helper to fetch from Story API
export async function fetchFromStoryAPI(endpoint: string, options?: RequestInit) {
  const url = `${STORY_API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(process.env.NEXT_PUBLIC_STORY_API_KEY && {
      'X-Api-Key': process.env.NEXT_PUBLIC_STORY_API_KEY,
    }),
    ...options?.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`Story API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Chain configuration
export const SUPPORTED_CHAIN = odyssey;

// Graph explorer URL
export const EXPLORER_URL = 'https://explorer.story.foundation';
