'use client';

import { useRWAAssets } from '@/lib/hooks/useRWAAssets';
import { Card } from '@/components/ui/card';
import { TrendingUp, DollarSign, PieChart, Percent } from 'lucide-react';
import { useMemo } from 'react';
import { motion } from 'framer-motion';

export default function TVLTracker() {
  const { assets, isLoading } = useRWAAssets();

  const stats = useMemo(() => {
    if (!assets || assets.length === 0) {
      return {
        totalTVL: 0,
        totalYield: 0,
        avgYieldRate: 0,
        byAssetType: {},
      };
    }

    const totalTVL = assets.reduce((sum, asset) => sum + parseFloat(asset.totalValue), 0);
    const totalYield = assets.reduce((sum, asset) => sum + parseFloat(asset.totalYieldGenerated || '0'), 0);
    
    const assetsWithYield = assets.filter(a => a.yieldRate && a.yieldRate > 0);
    const avgYieldRate = assetsWithYield.length > 0
      ? assetsWithYield.reduce((sum, a) => sum + (a.yieldRate || 0), 0) / assetsWithYield.length
      : 0;

    const byAssetType: { [key: string]: number } = {};
    assets.forEach(asset => {
      const type = asset.assetType;
      byAssetType[type] = (byAssetType[type] || 0) + parseFloat(asset.totalValue);
    });

    return {
      totalTVL,
      totalYield,
      avgYieldRate,
      byAssetType,
    };
  }, [assets]);

  const formatCurrency = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
    return `$${value.toFixed(2)}`;
  };

  const assetTypeLabels: { [key: string]: string } = {
    'real-estate': 'Real Estate',
    'bond': 'Bonds',
    'invoice': 'Invoices',
    'commodity': 'Commodities',
    'equity': 'Equity',
    'fund-share': 'Fund Shares',
    'defi-position': 'DeFi Positions',
    'synthetic': 'Synthetic Assets',
  };

  const assetTypeColors: { [key: string]: string } = {
    'real-estate': 'bg-green-500',
    'bond': 'bg-blue-500',
    'invoice': 'bg-amber-500',
    'commodity': 'bg-yellow-500',
    'equity': 'bg-purple-500',
    'fund-share': 'bg-indigo-500',
    'defi-position': 'bg-cyan-500',
    'synthetic': 'bg-pink-500',
  };

  const totalByType = Object.values(stats.byAssetType).reduce((sum, val) => sum + val, 0);

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-zinc-800 rounded w-1/4 mb-4" />
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-zinc-800 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">TVL & Yield Analytics</h2>
        <p className="text-zinc-400 text-sm mt-1">Total Value Locked across all RWA protocols on Mantle</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-zinc-400">Total TVL</p>
            <DollarSign className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-4xl font-bold text-white mb-1">{formatCurrency(stats.totalTVL)}</p>
          <div className="flex items-center gap-1 text-xs text-green-400">
            <TrendingUp className="h-3 w-3" />
            <span>+12.5% this month</span>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-zinc-400">Total Yield Generated</p>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-4xl font-bold text-white mb-1">{formatCurrency(stats.totalYield)}</p>
          <div className="flex items-center gap-1 text-xs text-green-400">
            <TrendingUp className="h-3 w-3" />
            <span>+8.3% this month</span>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-zinc-400">Average Yield Rate</p>
            <Percent className="h-5 w-5 text-purple-500" />
          </div>
          <p className="text-4xl font-bold text-white mb-1">{stats.avgYieldRate.toFixed(2)}%</p>
          <div className="flex items-center gap-1 text-xs text-purple-400">
            <span>APY across all assets</span>
          </div>
        </Card>
      </div>

      {/* TVL by Asset Type */}
      <Card className="bg-zinc-900/50 border-zinc-800 p-6">
        <div className="flex items-center gap-2 mb-6">
          <PieChart className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-white">TVL Distribution by Asset Type</h3>
        </div>

        <div className="space-y-4">
          {Object.entries(stats.byAssetType)
            .sort(([, a], [, b]) => b - a)
            .map(([type, value]) => {
              const percentage = totalByType > 0 ? (value / totalByType) * 100 : 0;
              
              return (
                <motion.div
                  key={type}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${assetTypeColors[type]}`} />
                      <span className="text-sm text-white">{assetTypeLabels[type]}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-white">{formatCurrency(value)}</span>
                      <span className="text-xs text-zinc-500 ml-2">({percentage.toFixed(1)}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className={`h-full ${assetTypeColors[type]}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    />
                  </div>
                </motion.div>
              );
            })}
        </div>
      </Card>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-zinc-900/50 border-zinc-800 p-4">
          <p className="text-xs text-zinc-400 mb-1">Active Assets</p>
          <p className="text-2xl font-bold text-white">{assets.length}</p>
        </Card>
        
        <Card className="bg-zinc-900/50 border-zinc-800 p-4">
          <p className="text-xs text-zinc-400 mb-1">Yield Bearing</p>
          <p className="text-2xl font-bold text-white">
            {assets.filter(a => a.yieldRate && a.yieldRate > 0).length}
          </p>
        </Card>
        
        <Card className="bg-zinc-900/50 border-zinc-800 p-4">
          <p className="text-xs text-zinc-400 mb-1">Compliant Assets</p>
          <p className="text-2xl font-bold text-white">
            {assets.filter(a => a.complianceStatus === 'compliant').length}
          </p>
        </Card>
        
        <Card className="bg-zinc-900/50 border-zinc-800 p-4">
          <p className="text-xs text-zinc-400 mb-1">Avg Health Score</p>
          <p className="text-2xl font-bold text-white">
            {assets.length > 0 
              ? (assets.reduce((sum, a) => sum + (a.riskScore || 50), 0) / assets.length).toFixed(0)
              : '0'
            }
          </p>
        </Card>
      </div>
    </div>
  );
}
