// Mock RWA Asset Data Generator for Mantle Asset Atlas
import { 
  RWAAsset, 
  RWAAssetType, 
  ComplianceStatus, 
  CustodyStatus,
  ComplianceEvent,
  YieldDistribution,
  MonitoringAlert,
  RWAProtocol
} from './types';

const ASSET_TYPES: RWAAssetType[] = [
  'real-estate',
  'bond',
  'invoice',
  'commodity',
  'equity',
  'fund-share',
  'defi-position',
  'synthetic'
];

const ASSET_NAMES = {
  'real-estate': [
    'Manhattan Apartment Complex',
    'Silicon Valley Office Park', 
    'Miami Luxury Condos',
    'Brooklyn Mixed-Use Building',
    'Austin Student Housing',
    'Seattle Commercial Tower',
    'Chicago Industrial Warehouse',
    'LA Retail Shopping Center'
  ],
  'bond': [
    'US Treasury 10Y Bond',
    'Apple Corporate Bond AAA',
    'NYC Municipal Bond',
    'Tesla Green Bond 2030',
    'Infrastructure Development Bond',
    'California State Bond',
    'Amazon Corporate Debt'
  ],
  'invoice': [
    'Walmart Supply Chain Invoice',
    'Tesla Manufacturing PO',
    'Kaiser Healthcare Receivable',
    'FedEx Logistics Invoice',
    'Construction Contract - Highway 101'
  ],
  'commodity': [
    'COMEX Gold Bullion 100oz',
    'Silver Futures Contract',
    'WTI Crude Oil Allocation',
    'Natural Gas Pipeline Rights',
    'Midwest Corn Harvest Basket'
  ],
  'equity': [
    'SpaceX Series F Shares',
    'Stripe Pre-IPO Equity',
    'OpenAI Series C',
    'Databricks Secondary Market',
    'Coinbase Employee Stock'
  ],
  'fund-share': [
    'Blackstone REIT Fund',
    'Vanguard Private Credit',
    'Bridgewater Hedge Fund LP',
    'KKR Infrastructure Fund III',
    'Sequoia Growth Fund'
  ],
  'defi-position': [
    'Aave USDC Lending Position',
    'Compound ETH Supply',
    'Uniswap V3 WBTC-ETH LP',
    'Curve 3pool Liquidity',
    'Yearn Finance Vault Share'
  ],
  'synthetic': [
    'Synthetic US Treasury',
    'Tokenized Gold ETF',
    'Real Estate Index Token',
    'Global Commodity Basket',
    'Automated Yield Token'
  ]
};

const CUSTODIANS = [
  'BNY Mellon Digital',
  'State Street Custody',
  'Coinbase Custody',
  'Fireblocks Institutional',
  'Copper.co',
  'BitGo Trust'
];

const COMPLIANCE_PROVIDERS = [
  'Chainalysis KYC',
  'Elliptic Compliance',
  'Sumsub Verification',
  'Onfido Identity',
  'Jumio KYC',
  'Civic Pass'
];

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number, decimals: number = 2): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function generateAddress(): string {
  return `0x${Array.from({ length: 40 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('')}`;
}

function generateAssetId(): string {
  return `RWA-${Date.now()}-${randomInt(1000, 9999)}`;
}

/**
 * Generate ONLY featured demo assets - no random generation!
 */
function generateFeaturedDemoAssets(now: number, oneYear: number): RWAAsset[] {
  const assets: RWAAsset[] = [];
  
  // 1. Manhattan Apartment Complex - THE STAR OF THE DEMO
  assets.push({
    id: 'RWA-MANHATTAN-001',
    address: generateAddress(),
    chainId: 5000,
    name: 'Manhattan Apartment Complex',
    symbol: 'MAC',
    assetType: 'real-estate',
    description: 'Premium residential property in Manhattan, New York',
    owner: generateAddress(),
    custodian: 'BNY Mellon Digital',
    custodyStatus: 'qualified-custodian',
    totalSupply: '1',
    circulatingSupply: '1',
    valuePerToken: '45000000.00',
    totalValue: '45000000.00',
    currency: 'USD',
    yieldRate: 5.2,
    totalYieldGenerated: '2340000',
    lastYieldDistribution: now - (30 * 24 * 60 * 60),
    complianceStatus: 'compliant',
    kycRequired: true,
    kycProvider: 'Chainalysis KYC',
    regulatoryFramework: 'SEC Reg D',
    lastAuditDate: now - (30 * 24 * 60 * 60),
    createdAt: now - (180 * 24 * 60 * 60),
    updatedAt: now,
    blockNumber: 500000,
    riskScore: 15,
    liquidityScore: 75,
    parentAssets: [],
    childAssets: ['RWA-MANHATTAN-SHARES-001'],
    collateralFor: [],
    metadata: { location: 'Manhattan, NY', units: 120, occupancy: '95%' } as any
  });
  
  // 2. Manhattan Apartment Shares - Fractionalized into 1,000 shares
  assets.push({
    id: 'RWA-MANHATTAN-SHARES-001',
    address: generateAddress(),
    chainId: 5000,
    name: 'Manhattan Apartment Shares',
    symbol: 'MAS',
    assetType: 'fund-share',
    description: 'Fractionalized ownership of Manhattan Apartment Complex (1,000 shares)',
    owner: generateAddress(),
    custodian: 'State Street Custody',
    custodyStatus: 'qualified-custodian',
    totalSupply: '1000',
    circulatingSupply: '1000',
    valuePerToken: '45000.00',
    totalValue: '45000000.00',
    currency: 'USD',
    yieldRate: 5.2,
    totalYieldGenerated: '2340000',
    lastYieldDistribution: now - (30 * 24 * 60 * 60),
    complianceStatus: 'compliant',
    kycRequired: true,
    kycProvider: 'Elliptic Compliance',
    regulatoryFramework: 'SEC Reg D',
    lastAuditDate: now - (25 * 24 * 60 * 60),
    createdAt: now - (150 * 24 * 60 * 60),
    updatedAt: now,
    blockNumber: 502000,
    riskScore: 18,
    liquidityScore: 85,
    parentAssets: ['RWA-MANHATTAN-001'],
    childAssets: [],
    collateralFor: ['RWA-AAVE-001'],
    metadata: { totalShares: 1000, sharePrice: '$45,000' } as any
  });
  
  // 3. Aave RWA Lending Pool - Using Manhattan shares as collateral
  assets.push({
    id: 'RWA-AAVE-001',
    address: generateAddress(),
    chainId: 5000,
    name: 'Aave RWA Lending Pool',
    symbol: 'ARWA',
    assetType: 'defi-position',
    description: 'DeFi lending pool accepting RWA as collateral',
    owner: generateAddress(),
    custodian: 'Aave Protocol',
    custodyStatus: 'smart-contract',
    totalSupply: '12500000',
    circulatingSupply: '12500000',
    valuePerToken: '1.00',
    totalValue: '12500000.00',
    currency: 'USD',
    yieldRate: 7.8,
    totalYieldGenerated: '975000',
    lastYieldDistribution: now - (7 * 24 * 60 * 60),
    complianceStatus: 'compliant',
    kycRequired: true,
    kycProvider: 'Chainalysis KYC',
    regulatoryFramework: 'DeFi Protocol',
    lastAuditDate: now - (15 * 24 * 60 * 60),
    createdAt: now - (90 * 24 * 60 * 60),
    updatedAt: now,
    blockNumber: 510000,
    riskScore: 25,
    liquidityScore: 95,
    parentAssets: [],
    childAssets: [],
    collateralFor: [],
    metadata: { protocol: 'Aave V3', collateral: 'Manhattan Apartment Shares', ltv: '65%' } as any
  });
  
  // 4. SpaceX Series F Shares
  assets.push({
    id: 'RWA-SPACEX-001',
    address: generateAddress(),
    chainId: 5000,
    name: 'SpaceX Series F Shares',
    symbol: 'SPXF',
    assetType: 'equity',
    description: 'Tokenized SpaceX Series F private equity shares',
    owner: generateAddress(),
    custodian: 'Coinbase Custody',
    custodyStatus: 'qualified-custodian',
    totalSupply: '10000',
    circulatingSupply: '8500',
    valuePerToken: '8500.00',
    totalValue: '85000000.00',
    currency: 'USD',
    complianceStatus: 'compliant',
    kycRequired: true,
    kycProvider: 'Sumsub Verification',
    regulatoryFramework: 'Reg S',
    lastAuditDate: now - (20 * 24 * 60 * 60),
    createdAt: now - (200 * 24 * 60 * 60),
    updatedAt: now,
    blockNumber: 480000,
    riskScore: 35,
    liquidityScore: 60,
    parentAssets: [],
    childAssets: [],
    collateralFor: [],
    metadata: { company: 'SpaceX', series: 'F', valuation: '$180B' } as any
  });
  
  // 5. US Treasury 10Y Bond
  assets.push({
    id: 'RWA-TREASURY-001',
    address: generateAddress(),
    chainId: 5000,
    name: 'US Treasury 10Y Bond',
    symbol: 'UST10Y',
    assetType: 'bond',
    description: 'Tokenized US Treasury 10-year bond',
    owner: generateAddress(),
    custodian: 'BNY Mellon Digital',
    custodyStatus: 'bank-custody',
    totalSupply: '100000',
    circulatingSupply: '100000',
    valuePerToken: '1000.00',
    totalValue: '100000000.00',
    currency: 'USD',
    yieldRate: 4.2,
    totalYieldGenerated: '4200000',
    lastYieldDistribution: now - (90 * 24 * 60 * 60),
    complianceStatus: 'compliant',
    kycRequired: true,
    kycProvider: 'Chainalysis KYC',
    regulatoryFramework: 'Exempt',
    lastAuditDate: now - (10 * 24 * 60 * 60),
    createdAt: now - (300 * 24 * 60 * 60),
    updatedAt: now,
    blockNumber: 450000,
    riskScore: 5,
    liquidityScore: 98,
    parentAssets: [],
    childAssets: [],
    collateralFor: [],
    metadata: { issuer: 'US Treasury', rating: 'AAA', maturity: '10 years' } as any
  });
  
  // 6-10: Add more recognizable assets using realistic names
  assets.push({
    id: 'RWA-APPLE-BOND-001',
    address: generateAddress(),
    chainId: 5000,
    name: 'Apple Corporate Bond AAA',
    symbol: 'AAPL-B',
    assetType: 'bond',
    description: 'Apple Inc. corporate bond series',
    owner: generateAddress(),
    custodian: 'State Street Custody',
    custodyStatus: 'bank-custody',
    totalSupply: '50000',
    circulatingSupply: '50000',
    valuePerToken: '1200.00',
    totalValue: '60000000.00',
    currency: 'USD',
    yieldRate: 3.8,
    totalYieldGenerated: '2280000',
    lastYieldDistribution: now - (60 * 24 * 60 * 60),
    complianceStatus: 'compliant',
    kycRequired: true,
    kycProvider: 'Elliptic Compliance',
    regulatoryFramework: 'SEC Reg D',
    lastAuditDate: now - (20 * 24 * 60 * 60),
    createdAt: now - (250 * 24 * 60 * 60),
    updatedAt: now,
    blockNumber: 470000,
    riskScore: 8,
    liquidityScore: 92,
    parentAssets: [],
    childAssets: [],
    collateralFor: [],
    metadata: { issuer: 'Apple Inc.', rating: 'AAA', maturity: '5 years' } as any
  });
  
  assets.push({
    id: 'RWA-WALMART-INVOICE-001',
    address: generateAddress(),
    chainId: 5000,
    name: 'Walmart Supply Chain Invoice',
    symbol: 'WMT-INV',
    assetType: 'invoice',
    description: 'Tokenized Walmart supply chain receivable',
    owner: generateAddress(),
    custodian: 'Fireblocks Institutional',
    custodyStatus: 'qualified-custodian',
    totalSupply: '1',
    circulatingSupply: '1',
    valuePerToken: '5500000.00',
    totalValue: '5500000.00',
    currency: 'USD',
    complianceStatus: 'compliant',
    kycRequired: true,
    kycProvider: 'Jumio KYC',
    regulatoryFramework: 'Trade Finance',
    lastAuditDate: now - (15 * 24 * 60 * 60),
    createdAt: now - (45 * 24 * 60 * 60),
    updatedAt: now,
    blockNumber: 515000,
    riskScore: 12,
    liquidityScore: 88,
    parentAssets: [],
    childAssets: [],
    collateralFor: [],
    metadata: { debtor: 'Walmart Inc.', dueDate: '90 days', invoiceNumber: 'WMT-2024-8765' } as any
  });
  
  assets.push({
    id: 'RWA-GOLD-COMEX-001',
    address: generateAddress(),
    chainId: 5000,
    name: 'COMEX Gold Bullion 100oz',
    symbol: 'GOLD',
    assetType: 'commodity',
    description: 'Tokenized COMEX gold bullion bars',
    owner: generateAddress(),
    custodian: 'Copper.co',
    custodyStatus: 'qualified-custodian',
    totalSupply: '500',
    circulatingSupply: '500',
    valuePerToken: '200000.00',
    totalValue: '100000000.00',
    currency: 'USD',
    complianceStatus: 'compliant',
    kycRequired: true,
    kycProvider: 'Civic Pass',
    regulatoryFramework: 'Commodity Trading',
    lastAuditDate: now - (10 * 24 * 60 * 60),
    createdAt: now - (365 * 24 * 60 * 60),
    updatedAt: now,
    blockNumber: 420000,
    riskScore: 10,
    liquidityScore: 95,
    parentAssets: [],
    childAssets: [],
    collateralFor: [],
    metadata: { commodity: 'Gold', exchange: 'COMEX', weight: '100oz bars', purity: '99.99%' } as any
  });
  
  return assets;
}

export function generateMockRWAAssets(count: number = 200): RWAAsset[] {
  const now = Date.now() / 1000;
  const oneYear = 365 * 24 * 60 * 60;

  // Start with featured assets (8 total)
  const assets = generateFeaturedDemoAssets(now, oneYear);
  
  // Add more realistic assets to reach ~200 total
  const remainingCount = count - assets.length;
  
  for (let i = 0; i < remainingCount; i++) {
    assets.push(generateRootAsset(now, oneYear));
  }
  
  // Add some derivative relationships
  const derivativeCount = Math.floor(remainingCount * 0.2); // 20% derivatives
  for (let i = 0; i < derivativeCount; i++) {
    const parentAsset = assets[Math.floor(Math.random() * assets.length)];
    assets.push(generateDerivativeAsset(parentAsset, now, oneYear));
  }

  return assets;
}

function generateRootAsset(now: number, oneYear: number): RWAAsset {
  const assetType = randomChoice(ASSET_TYPES.filter(t => t !== 'synthetic'));
  const name = randomChoice(ASSET_NAMES[assetType]);
  const createdAt = now - randomInt(0, oneYear);
  const totalSupply = randomInt(1000, 1000000);
  const valuePerToken = randomFloat(10, 10000);
  
  const complianceStatuses: ComplianceStatus[] = ['compliant', 'compliant', 'compliant', 'pending', 'expired'];
  const custodyStatuses: CustodyStatus[] = ['bank-custody', 'qualified-custodian', 'smart-contract', 'multi-sig'];

  return {
    id: generateAssetId(),
    address: generateAddress(),
    chainId: 5000,
    name,
    symbol: name.split(' ').map(w => w[0]).join('').toUpperCase(),
    assetType,
    description: `Tokenized ${assetType.replace('-', ' ')} asset on Mantle Network`,
    owner: generateAddress(),
    custodian: Math.random() < 0.7 ? randomChoice(CUSTODIANS) : undefined,
    custodyStatus: randomChoice(custodyStatuses),
    totalSupply: totalSupply.toString(),
    circulatingSupply: Math.floor(totalSupply * randomFloat(0.5, 1.0)).toString(),
    valuePerToken: valuePerToken.toFixed(2),
    totalValue: (totalSupply * valuePerToken).toFixed(2),
    currency: 'USD',
    yieldRate: assetType === 'bond' || assetType === 'real-estate' ? randomFloat(2, 12) : undefined,
    totalYieldGenerated: randomInt(10000, 1000000).toString(),
    lastYieldDistribution: createdAt + randomInt(0, 30 * 24 * 60 * 60),
    complianceStatus: randomChoice(complianceStatuses),
    kycRequired: true,
    kycProvider: randomChoice(COMPLIANCE_PROVIDERS),
    regulatoryFramework: randomChoice(['SEC Reg D', 'MiFID II', 'Reg S', 'Reg A+', 'Exempt']),
    lastAuditDate: now - randomInt(0, 180 * 24 * 60 * 60),
    createdAt,
    updatedAt: now,
    blockNumber: randomInt(100000, 999999),
    riskScore: randomInt(10, 70),
    liquidityScore: randomInt(30, 95),
    metadata: generateMetadata(assetType),
  };
}

function generateDerivativeAsset(parent: RWAAsset, now: number, oneYear: number): RWAAsset {
  const isTokenized = Math.random() < 0.5;
  const assetType: RWAAssetType = isTokenized ? 'synthetic' : randomChoice(['fund-share', 'defi-position']);
  
  const baseName = parent.name;
  const derivativeNames = [
    `Fractionalized ${baseName}`,
    `${baseName} Yield Token`,
    `${baseName} LP Position`,
    `Synthetic ${baseName}`,
    `${baseName} Tranche A`
  ];
  
  const name = randomChoice(derivativeNames);
  const createdAt = parent.createdAt + randomInt(1, 180 * 24 * 60 * 60);
  const totalSupply = randomInt(1000, 100000);
  const valuePerToken = parseFloat(parent.valuePerToken) * randomFloat(0.1, 0.9);

  return {
    id: generateAssetId(),
    address: generateAddress(),
    chainId: 5000,
    name,
    symbol: `d${parent.symbol}`,
    assetType,
    description: `Derivative asset based on ${baseName}`,
    owner: generateAddress(),
    custodian: randomChoice(CUSTODIANS),
    custodyStatus: 'smart-contract',
    totalSupply: totalSupply.toString(),
    circulatingSupply: Math.floor(totalSupply * randomFloat(0.7, 1.0)).toString(),
    valuePerToken: valuePerToken.toFixed(2),
    totalValue: (totalSupply * valuePerToken).toFixed(2),
    currency: 'USD',
    yieldRate: parent.yieldRate ? parent.yieldRate * randomFloat(0.7, 1.3) : undefined,
    totalYieldGenerated: randomInt(1000, 100000).toString(),
    lastYieldDistribution: createdAt + randomInt(0, 30 * 24 * 60 * 60),
    complianceStatus: 'compliant',
    kycRequired: parent.kycRequired,
    kycProvider: parent.kycProvider,
    regulatoryFramework: parent.regulatoryFramework,
    lastAuditDate: now - randomInt(0, 90 * 24 * 60 * 60),
    parentAssets: [parent.id],
    createdAt,
    updatedAt: now,
    blockNumber: randomInt(100000, 999999),
    riskScore: (parent.riskScore || 50) + randomInt(-10, 20),
    liquidityScore: randomInt(40, 90),
  };
}

function generateMetadata(assetType: RWAAssetType) {
  const baseMetadata = {
    imageUrl: `https://picsum.photos/seed/${Math.random()}/400/300`,
    documentUrl: `https://docs.example.com/${generateAssetId()}`,
    legalDocuments: [
      `https://legal.example.com/prospectus-${Math.random()}.pdf`,
      `https://legal.example.com/terms-${Math.random()}.pdf`,
    ],
  };

  if (assetType === 'real-estate') {
    return {
      ...baseMetadata,
      propertyAddress: `${randomInt(100, 9999)} ${randomChoice(['Main', 'Oak', 'Park', 'Lake', 'River'])} St, ${randomChoice(['New York', 'San Francisco', 'Miami', 'Austin', 'Seattle'])}`,
      propertyType: randomChoice(['Commercial', 'Residential', 'Mixed-Use', 'Industrial']),
      squareFeet: randomInt(5000, 500000),
    };
  }

  if (assetType === 'bond') {
    return {
      ...baseMetadata,
      issuer: randomChoice(['US Treasury', 'Acme Corp', 'City of Austin', 'Green Energy Inc']),
      maturityDate: Date.now() / 1000 + randomInt(365, 3650) * 24 * 60 * 60,
      couponRate: randomFloat(2, 8),
    };
  }

  if (assetType === 'invoice') {
    return {
      ...baseMetadata,
      invoiceNumber: `INV-${randomInt(10000, 99999)}`,
      paymentDueDate: Date.now() / 1000 + randomInt(30, 180) * 24 * 60 * 60,
      debtor: `Company-${randomInt(100, 999)}`,
    };
  }

  return baseMetadata;
}

export function generateMockComplianceEvents(assetId: string, count: number = 10): ComplianceEvent[] {
  const events: ComplianceEvent[] = [];
  const now = Date.now() / 1000;
  const eventTypes: ComplianceEvent['eventType'][] = [
    'kyc-verification',
    'audit',
    'regulatory-filing',
    'license-renewal',
  ];

  for (let i = 0; i < count; i++) {
    events.push({
      id: `CE-${Date.now()}-${i}`,
      assetId,
      eventType: randomChoice(eventTypes),
      status: 'compliant',
      timestamp: now - randomInt(0, 365 * 24 * 60 * 60),
      details: 'Compliance check completed successfully',
      documentHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
    });
  }

  return events.sort((a, b) => b.timestamp - a.timestamp);
}

export function generateMockYieldDistributions(assetId: string, count: number = 20): YieldDistribution[] {
  const distributions: YieldDistribution[] = [];
  const now = Date.now() / 1000;

  for (let i = 0; i < count; i++) {
    distributions.push({
      id: `YD-${Date.now()}-${i}`,
      assetId,
      amount: randomInt(1000, 100000).toString(),
      currency: 'USD',
      recipients: randomInt(10, 1000),
      timestamp: now - i * 30 * 24 * 60 * 60, // Monthly distributions
      txHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
    });
  }

  return distributions.sort((a, b) => b.timestamp - a.timestamp);
}

export function generateMockAlerts(count: number = 15): MonitoringAlert[] {
  const alerts: MonitoringAlert[] = [];
  const now = Date.now() / 1000;
  
  const alertMessages = {
    critical: [
      'Compliance certificate expired',
      'Collateral ratio below threshold',
      'Custody transfer detected without authorization',
    ],
    high: [
      'KYC verification pending for 30+ days',
      'Yield distribution delayed',
      'Unusual transaction pattern detected',
    ],
    medium: [
      'Audit report due within 7 days',
      'Asset value deviation >10%',
      'Low liquidity warning',
    ],
    low: [
      'Routine compliance check scheduled',
      'Minor metadata update required',
      'Documentation refresh recommended',
    ],
  };

  const severities: ('critical' | 'high' | 'medium' | 'low')[] = ['critical', 'high', 'medium', 'low'];
  const types: MonitoringAlert['type'][] = ['compliance', 'collateral', 'yield', 'custody', 'transaction'];

  for (let i = 0; i < count; i++) {
    const severity = randomChoice(severities);
    const type = randomChoice(types);
    
    alerts.push({
      id: `ALERT-${Date.now()}-${i}`,
      severity,
      type,
      assetId: generateAssetId(),
      assetName: 'Sample Asset ' + i,
      message: randomChoice(alertMessages[severity]),
      timestamp: now - randomInt(0, 7 * 24 * 60 * 60),
      resolved: Math.random() < 0.6,
    });
  }

  return alerts.sort((a, b) => b.timestamp - a.timestamp);
}

export function generateMockProtocols(): RWAProtocol[] {
  return [
    {
      id: 'protocol-1',
      name: 'MantleRealEstate',
      address: generateAddress(),
      type: 'tokenization',
      tvl: (randomInt(10, 500) * 1000000).toString(),
      assetCount: randomInt(50, 200),
      healthScore: randomInt(75, 98),
    },
    {
      id: 'protocol-2',
      name: 'BondVault',
      address: generateAddress(),
      type: 'lending',
      tvl: (randomInt(50, 800) * 1000000).toString(),
      assetCount: randomInt(100, 300),
      healthScore: randomInt(80, 95),
    },
    {
      id: 'protocol-3',
      name: 'YieldMax',
      address: generateAddress(),
      type: 'yield',
      tvl: (randomInt(20, 400) * 1000000).toString(),
      assetCount: randomInt(30, 150),
      healthScore: randomInt(70, 90),
    },
    {
      id: 'protocol-4',
      name: 'RWA Swap',
      address: generateAddress(),
      type: 'dex',
      tvl: (randomInt(15, 300) * 1000000).toString(),
      assetCount: randomInt(40, 100),
      healthScore: randomInt(75, 92),
    },
    {
      id: 'protocol-5',
      name: 'Synthetic Assets',
      address: generateAddress(),
      type: 'synthetic',
      tvl: (randomInt(25, 350) * 1000000).toString(),
      assetCount: randomInt(20, 80),
      healthScore: randomInt(78, 94),
    },
  ];
}

// Export a singleton instance for consistent mock data
// CACHE DISABLED FOR DEVELOPMENT - Always regenerate to see latest changes
let cachedMockAssets: RWAAsset[] | null = null;

export function getMockRWAAssets(): RWAAsset[] {
  // ALWAYS return fresh data - NO CACHING AT ALL
  return generateMockRWAAssets();
}

export function clearMockCache() {
  cachedMockAssets = null;
}
