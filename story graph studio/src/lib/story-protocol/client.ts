// Story Protocol SDK Client Setup
import { StoryClient, StoryConfig } from '@story-protocol/core-sdk';
import { http } from 'viem';
import { odyssey } from 'viem/chains';

// Story Protocol configuration
const config: StoryConfig = {
  account: process.env.NEXT_PUBLIC_WALLET_PRIVATE_KEY as `0x${string}` | undefined,
  transport: http(process.env.NEXT_PUBLIC_RPC_URL || 'https://odyssey.storyrpc.io'),
  chainId: 'odyssey',
};

// Initialize Story Client
export const storyClient = StoryClient.newClient(config);

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
