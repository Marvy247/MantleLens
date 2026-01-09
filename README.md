# MantleLens

**Crystal-clear visibility into RWA on Mantle Network**

MantleLens is an enterprise-grade infrastructure tool for tracking, monitoring, and visualizing Real-World Asset (RWA) relationships on Mantle Network. Built for the Mantle Global Hackathon 2025 - Infrastructure & Tooling Track.

![MantleLens](https://img.shields.io/badge/MantleLens-RWA%20Visibility-blue)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/license-MIT-green)

##  Problem Statement

RWA developers on Mantle face critical challenges:
- **No visibility** into tokenization lineage and asset relationships
- **Manual compliance tracking** across multiple protocols
- **Fragmented data** about yield flows and collateral chains
- **No tooling** for real-time monitoring and health assessments
- **Lack of developer SDKs** for integrating RWA analytics

##  Solution

MantleLens provides:

### 1. **Interactive RWA Graph Visualization**
- Force-directed graph showing tokenization relationships
- Real-time visualization of custody chains
- Compliance trail tracking
- Yield distribution flow mapping
- Collateral relationship networks

### 2. **Developer SDK** 
```typescript
import { MantleLens } from '@mantlelens/sdk';

const lens = new MantleLens({
  network: 'mainnet',
  apiKey: 'your-key'
});

// Track RWA relationships
const relationships = await lens.getAssetRelationships('0x123...');

// Monitor compliance
const compliance = await lens.getComplianceStatus('RWA-123');

// Analyze yields
const yields = await lens.getYieldFlows('RWA-456');
```

### 3. **Real-Time Monitoring Dashboard**
- Live alerts for compliance breaches
- Health score calculations (0-100)
- Collateral ratio warnings
- Abnormal transaction detection
- Critical alert prioritization

### 4. **Compliance & Audit Tools**
- Export audit-ready reports (PDF/CSV)
- Compliance timeline visualization
- KYC status tracking
- Automated regulatory reporting

### 5. **TVL & Yield Analytics**
- Total Value Locked tracking across protocols
- Yield distribution analysis
- Asset type breakdown
- Performance metrics

### 6. **Mantle DA Integration** 
- Store graph snapshots on Mantle DA
- Historical state retrieval
- Cost comparison vs traditional storage
- Demonstrating Mantle's low-cost advantage

##  Key Features

### Core Visualization
- **Interactive Force Graph**: D3-powered RWA relationship mapping
- **Smart Node Coloring**: Color-coded by asset type
- **Dynamic Node Sizing**: Based on total value
- **Relationship Types**: Tokenization, fractionalization, collateral, yield flows
- **Click-to-Explore**: Detailed asset information panels
- **Hover Highlighting**: Trace complete relationship chains

### Search & Filter
- **Real-time Search**: Find assets by name, address, or type
- **Multi-Dimension Filters**: 
  - Asset types (real-estate, bonds, invoices, etc.)
  - Compliance status (compliant, pending, expired)
  - Custody status (bank, qualified custodian, smart contract)
  - Value range
  - Yield rate range
  - Health score thresholds
  - Risk score limits

### Monitoring & Alerts
- **Severity Levels**: Critical, High, Medium, Low
- **Alert Types**: Compliance, Collateral, Yield, Custody, Transaction
- **Real-time Updates**: WebSocket-powered live alerts
- **Alert Resolution Tracking**: Mark and track resolved issues
- **Quick Actions**: One-click compliance scans and health reports

### Analytics Dashboard
- **TVL Tracker**: Real-time Total Value Locked across all RWAs
- **Yield Statistics**: APY tracking and distribution analysis
- **Health Scores**: Aggregate health metrics for all assets
- **Asset Type Distribution**: Pie charts and breakdowns
- **Compliance Rate**: Protocol-wide compliance percentages
- **Risk Assessment**: Automated risk scoring

##  Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Blockchain**: Mantle Network (L2)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Visualization**: react-force-graph-2d + D3.js
- **State Management**: Zustand
- **Data Fetching**: SWR (with real-time revalidation)
- **Animation**: Framer Motion
- **Web3**: Viem + Wagmi
- **SDK**: Custom Mantle Asset SDK

##  Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Mantle RPC access (or use mock data mode)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/mantlelens.git
cd mantlelens

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your configuration

# Run in development mode (with mock data)
NEXT_PUBLIC_USE_MOCK_DATA=true npm run dev
```

Visit `http://localhost:3000` to see MantleLens!

### Environment Variables

See `.env.example` for all configuration options.

**Quick Start with Mock Data:**
```bash
NEXT_PUBLIC_USE_MOCK_DATA=true
NEXT_PUBLIC_MANTLE_NETWORK=mainnet
```

**Production with Real Data:**
```bash
NEXT_PUBLIC_USE_MOCK_DATA=false
NEXT_PUBLIC_MANTLE_RPC_URL=https://rpc.mantle.xyz
NEXT_PUBLIC_ATLAS_API_KEY=your_api_key
```

##  SDK Usage

### Installation
```bash
npm install @mantlelens/sdk
```

### Basic Usage

```typescript
import { MantleLens } from '@mantlelens/sdk';

const lens = new MantleLens({
  network: 'mainnet',
  apiKey: process.env.MANTLELENS_API_KEY,
});

// Get all assets
const assets = await lens.getAssets({ limit: 100 });

// Get specific asset
const asset = await tracker.getAsset('RWA-123');

// Get relationships
const { parents, children, collateral } = await tracker.getAssetRelationships('RWA-123');

// Check compliance
const compliance = await tracker.getComplianceStatus('RWA-123');
console.log(compliance.isCompliant); // true/false

// Get yield data
const yields = await tracker.getYieldFlows('RWA-456');

// Get TVL
const tvl = await tracker.getTVL();
console.log(tvl.total); // "$1,234,567,890.00"

// Monitor health
const health = await tracker.getAssetHealth('RWA-789');
console.log(health.healthScore); // 0-100

// Subscribe to updates
const unsubscribe = tracker.subscribeToAsset('RWA-123', (asset) => {
  console.log('Asset updated:', asset);
});

// Export data
const jsonData = await tracker.exportGraph('json');
const csvData = await tracker.exportGraph('csv');
```

### Advanced Usage

```typescript
// Get assets with filters
const filteredAssets = await tracker.getGraphData({
  assetTypes: ['real-estate', 'bond'],
  minYieldRate: 5.0,
  complianceStatuses: ['compliant'],
  minHealthScore: 70,
});

// Get tokenization lineage
const lineage = await tracker.getTokenizationLineage('RWA-123');
// Returns: [rootAsset, intermediateAsset, currentAsset]

// Get critical alerts
const alerts = await tracker.getCriticalAlerts();

// Get comprehensive metrics
const metrics = await tracker.getMetrics();
```

##  Project Structure

```
mantlelens/
├── src/
│   ├── app/                      # Next.js pages
│   │   ├── page.tsx             # Main graph view
│   │   ├── analytics/           # Analytics dashboard
│   │   └── monitoring/          # Monitoring dashboard
│   │
│   ├── components/
│   │   ├── graph/               # Graph visualization
│   │   │   ├── ForceGraph.tsx
│   │   │   ├── NodeDetails.tsx
│   │   │   └── GraphControls.tsx
│   │   ├── monitoring/          # Monitoring components
│   │   │   └── MonitoringDashboard.tsx
│   │   ├── analytics/           # Analytics components
│   │   │   └── TVLTracker.tsx
│   │   └── ui/                  # shadcn/ui components
│   │
│   ├── lib/
│   │   ├── mantle/              # Mantle integration
│   │   │   ├── types.ts         # RWA type definitions
│   │   │   ├── client.ts        # Mantle RPC client
│   │   │   ├── queries.ts       # API queries
│   │   │   ├── graph-builder.ts # Graph construction
│   │   │   ├── mock-data.ts     # Mock RWA data
│   │   │   └── sdk.ts           # Mantle Asset SDK
│   │   │
│   │   └── hooks/               # React hooks
│   │       ├── useRWAAssets.ts
│   │       └── useRWAGraphData.ts
│   │
│   └── stores/                  # Zustand stores
│       ├── graphStore.ts
│       └── filterStore.ts
│
├── .env.example                 # Environment template
└── README.md                    # This file
```

##  Graph Visualization

### Node Colors (Asset Types)
- 🟢 **Green**: Real Estate
- 🔵 **Blue**: Bonds
- 🟠 **Orange**: Invoices
- 🟡 **Yellow**: Commodities
- 🟣 **Purple**: Equity
- 🔷 **Indigo**: Fund Shares
- 🩵 **Cyan**: DeFi Positions
- 🌸 **Pink**: Synthetic Assets

### Node Sizes
- Size represents total asset value (logarithmic scale)
- Larger nodes = higher value

### Edge Types
- **Green**: Tokenization (RWA → digital token)
- **Blue**: Fractionalization (whole → fractional shares)
- **Orange**: Collateral (asset → DeFi position)
- **Purple**: Yield Flow (distribution path)
- **Gray**: Custody Chain

##  Analytics & Metrics

### Health Score Calculation
```
Health Score = 100 
  - (compliance penalty × 0.3)
  - (risk score × 0.3)
  - (liquidity penalty × 0.2)
  - (audit recency penalty × 0.1)
  - (custody status penalty × 0.1)
```

### Risk Factors
- Compliance status (expired, failed)
- Liquidity score
- Collateralization ratio
- Audit recency
- Custody method

### Compliance Tracking
- KYC verification status
- Regulatory framework compliance
- Audit report recency
- License renewals
- Document attestations

##  Security & Compliance

- **KYC Integration**: Support for major KYC providers
- **Compliance Events**: Full audit trail
- **Document Hashing**: On-chain attestations
- **Regulatory Frameworks**: SEC Reg D, MiFID II, Reg S, Reg A+
- **Custody Standards**: Bank custody, qualified custodians

## 🌐 Mantle Integration

### Why Mantle?
- **Low Gas Fees**: Efficient for frequent updates
- **High Throughput**: Handle large asset graphs
- **EVM Compatible**: Easy smart contract integration
- **Mantle DA**: Cost-effective data availability for snapshots
- **Modular Architecture**: Scalable for enterprise use

### Mantle DA Usage
```typescript
import { storeOnMantleDA, retrieveFromMantleDA } from '@/lib/mantle/client';

// Store graph snapshot
const hash = await storeOnMantleDA(graphData);

// Retrieve historical state
const historicalData = await retrieveFromMantleDA(hash);
```

##  Roadmap

### Phase 1 (Hackathon) ✅
- [x] Core RWA type system
- [x] Graph visualization
- [x] Monitoring dashboard
- [x] Developer SDK
- [x] TVL analytics
- [x] Mock data system

### Phase 2 (Post-Hackathon)
- [ ] Multi-protocol integration
- [ ] Advanced compliance automation
- [ ] Testing framework CLI
- [ ] Embeddable widgets
- [ ] Mobile app
- [ ] API marketplace

### Phase 3 (Production)
- [ ] Enterprise features
- [ ] White-label solutions
- [ ] Advanced AI analytics
- [ ] Predicted yield opportunities
- [ ] Risk prediction models

##  Contributing

We welcome contributions! Please see our contributing guidelines.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

##  License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file.

##  Built For

**Mantle Global Hackathon 2025**
- Track: Infrastructure & Tooling
- Theme: Real Assets. Real Yield. Real Builders.
- Network: Mantle Layer 2


##  Acknowledgments

- Mantle Network team for the amazing L2 infrastructure
- Mantle Global Hackathon organizers
- D3.js and react-force-graph communities
- The entire Mantle ecosystem

---

**Star  this repo if you find it useful!**
