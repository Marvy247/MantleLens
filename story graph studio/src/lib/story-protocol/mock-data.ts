// Mock data generator for development
import { IPAsset, GraphNode, GraphEdge } from './types';

export function generateMockIPAssets(count: number = 50): IPAsset[] {
  const assets: IPAsset[] = [];
  const now = Math.floor(Date.now() / 1000);
  
  const mediaTypes = ['image', 'audio', 'video', 'text'];
  const names = [
    'Dragon Chronicles', 'Cyber Samurai', 'Neon Dreams', 'Ancient Wisdom',
    'Digital Garden', 'Space Odyssey', 'Time Traveler', 'Ocean Deep',
    'Mountain Peak', 'Desert Storm', 'Forest Spirit', 'Urban Jungle',
    'Crystal Cave', 'Fire Dance', 'Ice Palace', 'Thunder Strike',
  ];

  // Create root IPs (no parents)
  for (let i = 0; i < count * 0.3; i++) {
    const ipId = `0x${Math.random().toString(16).substr(2, 40)}`;
    assets.push({
      id: `ip-${i}`,
      ipId,
      tokenContract: `0x${Math.random().toString(16).substr(2, 40)}`,
      tokenId: String(i),
      chainId: 1513,
      owner: `0x${Math.random().toString(16).substr(2, 40)}`,
      blockNumber: 1000000 + i,
      blockTimestamp: now - Math.floor(Math.random() * 30 * 24 * 3600), // Last 30 days
      metadata: {
        name: names[Math.floor(Math.random() * names.length)] + ` #${i}`,
        description: 'Original IP asset registered on Story Protocol',
        mediaType: mediaTypes[Math.floor(Math.random() * mediaTypes.length)] as any,
        imageUrl: `https://picsum.photos/seed/${i}/400/400`,
      },
      licenseTerms: [{
        id: `license-${i}`,
        licenseTermsId: String(i),
        licenseTemplate: '0x1234567890',
        transferable: true,
        royaltyPolicy: '0xabc123',
        defaultMintingFee: '0',
        currency: '0x0',
        commercialUse: Math.random() > 0.5,
        commercialAttribution: true,
        commercializerChecker: '0x0',
        derivativesAllowed: Math.random() > 0.3,
        derivativesAttribution: true,
        derivativeApprovalRequired: false,
        derivativeRevShare: Math.floor(Math.random() * 20),
      }],
      parents: [],
      children: [],
      totalRevenue: String(Math.random() * 100),
    });
  }

  // Create derivative IPs
  for (let i = Math.floor(count * 0.3); i < count; i++) {
    const ipId = `0x${Math.random().toString(16).substr(2, 40)}`;
    // Pick random parent(s)
    const parentCount = Math.random() > 0.7 ? 2 : 1;
    const parents: string[] = [];
    
    for (let j = 0; j < parentCount; j++) {
      const parentIndex = Math.floor(Math.random() * assets.length);
      const parentId = assets[parentIndex].ipId;
      if (!parents.includes(parentId)) {
        parents.push(parentId);
        // Add this as child to parent
        if (!assets[parentIndex].children) {
          assets[parentIndex].children = [];
        }
        assets[parentIndex].children!.push(ipId);
      }
    }

    assets.push({
      id: `ip-${i}`,
      ipId,
      tokenContract: `0x${Math.random().toString(16).substr(2, 40)}`,
      tokenId: String(i),
      chainId: 1513,
      owner: `0x${Math.random().toString(16).substr(2, 40)}`,
      blockNumber: 1000000 + i,
      blockTimestamp: now - Math.floor(Math.random() * 20 * 24 * 3600), // Last 20 days
      metadata: {
        name: names[Math.floor(Math.random() * names.length)] + ` Remix #${i}`,
        description: 'Derivative work based on parent IP',
        mediaType: mediaTypes[Math.floor(Math.random() * mediaTypes.length)] as any,
        imageUrl: `https://picsum.photos/seed/${i}/400/400`,
      },
      licenseTerms: [{
        id: `license-${i}`,
        licenseTermsId: String(i),
        licenseTemplate: '0x1234567890',
        transferable: true,
        royaltyPolicy: '0xabc123',
        defaultMintingFee: String(Math.random() * 10),
        currency: '0x0',
        commercialUse: Math.random() > 0.6,
        commercialAttribution: true,
        commercializerChecker: '0x0',
        derivativesAllowed: Math.random() > 0.4,
        derivativesAttribution: true,
        derivativeApprovalRequired: false,
        derivativeRevShare: Math.floor(Math.random() * 15),
      }],
      parents,
      children: [],
      totalRevenue: String(Math.random() * 50),
    });
  }

  return assets;
}

// For development, override the fetch functions to use mock data
export const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

let mockAssets: IPAsset[] | null = null;

export function getMockIPAssets(): IPAsset[] {
  if (!mockAssets) {
    mockAssets = generateMockIPAssets(100);
  }
  return mockAssets;
}
