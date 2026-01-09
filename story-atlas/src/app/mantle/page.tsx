'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRWAGraphData } from '@/lib/hooks/useRWAGraphData';
import { useFilterStore } from '@/stores/filterStore';
import { useGraphStore } from '@/stores/graphStore';
import { useRWAAssets } from '@/lib/hooks/useRWAAssets';
import ForceGraph from '@/components/graph/ForceGraph';
import NodeDetails from '@/components/graph/NodeDetails';
import MonitoringDashboard from '@/components/monitoring/MonitoringDashboard';
import TVLTracker from '@/components/analytics/TVLTracker';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Loader2, 
  Network, 
  Activity, 
  TrendingUp, 
  Shield,
  Search,
  Filter,
  Download,
  Settings
} from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';
import { calculateRWAMetrics } from '@/lib/mantle/graph-builder';

type ViewMode = 'graph' | 'monitoring' | 'analytics';

export default function MantleAssetAtlas() {
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });
  const [viewMode, setViewMode] = useState<ViewMode>('graph');
  const filters = useFilterStore();
  const { selectedNode } = useGraphStore();
  const { assets, isLoading: assetsLoading } = useRWAAssets({ limit: 1000 });
  const { graphData, metrics, isLoading, isError } = useRWAGraphData(filters);

  const rwaMetrics = useMemo(() => {
    if (!assets || assets.length === 0) return null;
    return calculateRWAMetrics(assets);
  }, [assets]);

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight - 200,
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const formatCurrency = (value: string) => {
    const num = parseFloat(value);
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-y-auto">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                MantleLens
              </h1>
              <p className="text-sm text-zinc-400 mt-1">
                Crystal-clear visibility into RWA on Mantle Network
              </p>
            </div>

            <div className="flex items-center gap-4">
              {rwaMetrics && (
                <div className="flex gap-6 text-sm">
                  <div>
                    <span className="text-zinc-500">TVL: </span>
                    <span className="font-semibold text-blue-400">
                      {formatCurrency(rwaMetrics.totalValueLocked)}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500">Assets: </span>
                    <span className="font-semibold">{rwaMetrics.totalAssets}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500">Avg Yield: </span>
                    <span className="font-semibold text-green-400">
                      {rwaMetrics.averageYieldRate.toFixed(2)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500">Health: </span>
                    <span className="font-semibold text-purple-400">
                      {rwaMetrics.avgHealthScore.toFixed(0)}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-green-400 font-medium">Mantle Mainnet</span>
              </div>
            </div>
          </div>

          {/* View Mode Tabs */}
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'graph' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('graph')}
              className={viewMode === 'graph' 
                ? 'bg-blue-500 hover:bg-blue-600' 
                : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700'
              }
            >
              <Network className="h-4 w-4 mr-2" />
              Asset Graph
            </Button>

            <Button
              variant={viewMode === 'monitoring' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('monitoring')}
              className={viewMode === 'monitoring' 
                ? 'bg-orange-500 hover:bg-orange-600' 
                : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700'
              }
            >
              <Activity className="h-4 w-4 mr-2" />
              Monitoring
              {rwaMetrics && rwaMetrics.criticalAlerts > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-red-500 text-white">
                  {rwaMetrics.criticalAlerts}
                </span>
              )}
            </Button>

            <Button
              variant={viewMode === 'analytics' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('analytics')}
              className={viewMode === 'analytics' 
                ? 'bg-green-500 hover:bg-green-600' 
                : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700'
              }
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Analytics
            </Button>

            <div className="flex-1" />

            <Button
              variant="outline"
              size="sm"
              className="bg-zinc-800 hover:bg-zinc-700 border-zinc-700"
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="bg-zinc-800 hover:bg-zinc-700 border-zinc-700"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="bg-zinc-800 hover:bg-zinc-700 border-zinc-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="bg-zinc-800 hover:bg-zinc-700 border-zinc-700"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative">
        {isLoading || assetsLoading ? (
          <motion.div 
            className="flex items-center justify-center h-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Loader2 className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              </motion.div>
              <motion.p 
                className="text-zinc-400"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Loading RWA assets from Mantle Network...
              </motion.p>
              <p className="text-xs text-zinc-600 mt-2">
                Fetching tokenization data, compliance status, and yield information
              </p>
            </div>
          </motion.div>
        ) : isError ? (
          <div className="flex items-center justify-center h-screen">
            <Card className="bg-zinc-900 border-zinc-800 p-8 max-w-md">
              <div className="text-center">
                <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <p className="text-red-400 text-lg mb-2">Failed to load data</p>
                <p className="text-zinc-400 text-sm mb-4">
                  Unable to connect to Mantle Network or Atlas API
                </p>
                <Button className="bg-blue-500 hover:bg-blue-600">
                  Retry Connection
                </Button>
                <p className="text-xs text-zinc-600 mt-4">
                  Tip: Enable mock data mode in .env.local for development
                </p>
              </div>
            </Card>
          </div>
        ) : (
          <motion.div 
            className="relative"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
          >
            {/* Graph View */}
            {viewMode === 'graph' && (
              <div className="relative">
                <ForceGraph 
                  data={graphData} 
                  width={dimensions.width}
                  height={dimensions.height}
                />
                
                {/* Node Details Panel */}
                {selectedNode && <NodeDetails node={selectedNode} />}
                
                {/* Graph Stats Overlay */}
                <div className="absolute top-4 left-4 space-y-2">
                  <Card className="bg-zinc-900/90 backdrop-blur-sm border-zinc-800 p-4 min-w-[200px]">
                    <h3 className="text-sm font-semibold text-zinc-400 mb-3">Graph Metrics</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Nodes:</span>
                        <span className="font-semibold text-purple-400">{metrics.totalNodes}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Edges:</span>
                        <span className="font-semibold text-blue-400">{metrics.totalEdges}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Isolated:</span>
                        <span className="font-semibold text-orange-400">{metrics.isolatedNodes}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Avg Health:</span>
                        <span className="font-semibold text-green-400">
                          {metrics.avgHealthScore?.toFixed(0) || 0}
                        </span>
                      </div>
                    </div>
                  </Card>

                  {/* Legend */}
                  <Card className="bg-zinc-900/90 backdrop-blur-sm border-zinc-800 p-4">
                    <h3 className="text-sm font-semibold text-zinc-400 mb-3">Asset Types</h3>
                    <div className="space-y-2 text-xs">
                      {[
                        { color: 'bg-green-500', label: 'Real Estate' },
                        { color: 'bg-blue-500', label: 'Bonds' },
                        { color: 'bg-amber-500', label: 'Invoices' },
                        { color: 'bg-yellow-500', label: 'Commodities' },
                        { color: 'bg-purple-500', label: 'Equity' },
                        { color: 'bg-cyan-500', label: 'DeFi' },
                        { color: 'bg-pink-500', label: 'Synthetic' },
                      ].map(({ color, label }) => (
                        <div key={label} className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${color}`} />
                          <span className="text-zinc-400">{label}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                {/* Selected Node Details */}
                {selectedNode && (
                  <div className="absolute top-4 right-4">
                    <Card className="bg-zinc-900/95 backdrop-blur-sm border-zinc-800 p-6 w-[400px]">
                      <h3 className="text-lg font-bold text-white mb-4">
                        {(selectedNode as any).name || `Asset ${(selectedNode as any).id?.slice(0, 8)}`}
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div>
                          <span className="text-zinc-500">Type:</span>
                          <span className="ml-2 font-medium">
                            {(selectedNode as any).assetType || (selectedNode as any).licenseType || 'Unknown'}
                          </span>
                        </div>
                        {(selectedNode as any).totalValue && (
                          <div>
                            <span className="text-zinc-500">Value:</span>
                            <span className="ml-2 font-medium text-blue-400">
                              {formatCurrency((selectedNode as any).totalValue.toString())}
                            </span>
                          </div>
                        )}
                        {(selectedNode as any).healthScore !== undefined && (
                          <div>
                            <span className="text-zinc-500">Health Score:</span>
                            <span className="ml-2 font-medium text-green-400">
                              {(selectedNode as any).healthScore}/100
                            </span>
                          </div>
                        )}
                        {(selectedNode as any).complianceStatus && (
                          <div>
                            <span className="text-zinc-500">Compliance:</span>
                            <span className={`ml-2 font-medium ${
                              (selectedNode as any).complianceStatus === 'compliant' ? 'text-green-400' : 'text-orange-400'
                            }`}>
                              {(selectedNode as any).complianceStatus}
                            </span>
                          </div>
                        )}
                      </div>
                    </Card>
                  </div>
                )}
              </div>
            )}

            {/* Monitoring View */}
            {viewMode === 'monitoring' && (
              <div className="container mx-auto px-6 py-6 pb-20">
                <MonitoringDashboard />
              </div>
            )}

            {/* Analytics View */}
            {viewMode === 'analytics' && (
              <div className="container mx-auto px-6 py-6 pb-20">
                <TVLTracker />
              </div>
            )}
          </motion.div>
        )}
      </main>

      {/* Footer Info Bar */}
      <footer className="fixed bottom-0 left-0 right-0 bg-zinc-900/80 backdrop-blur-sm border-t border-zinc-800 px-6 py-2">
        <div className="container mx-auto flex items-center justify-between text-xs text-zinc-500">
          <div className="flex items-center gap-6">
            <span>Powered by Mantle Network</span>
            <span>•</span>
            <span>Built for Mantle Global Hackathon 2025</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Infrastructure & Tooling Track
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-blue-400 transition-colors">Documentation</a>
            <a href="#" className="hover:text-blue-400 transition-colors">SDK</a>
            <a href="#" className="hover:text-blue-400 transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
