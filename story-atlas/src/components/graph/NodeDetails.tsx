'use client';

import React from 'react';
import { RWAGraphNode } from '@/lib/mantle/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, ExternalLink, Copy, Check } from 'lucide-react';
import { useGraphStore } from '@/stores/graphStore';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { slideInRight } from '@/lib/animations';

interface NodeDetailsProps {
  node: RWAGraphNode | null;
  onClose: () => void;
}

export default function NodeDetails({ node, onClose }: NodeDetailsProps) {
  const { setSelectedNode } = useGraphStore();
  const [copied, setCopied] = useState(false);

  if (!node) return null;

  const nodeId = node.address;
  const derivativeCount = node.childCount;
  const parentCount = node.parentCount;
  const licenseType = node.assetType;
  const commercialUse = node.complianceStatus === 'compliant';
  const revenue = node.totalValue;

  const handleCopyAddress = async () => {
    await navigator.clipboard.writeText(nodeId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <AnimatePresence>
      <motion.div
        variants={slideInRight}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className="fixed right-6 top-6 w-96 max-h-[80vh] overflow-y-auto z-50"
      >
        <Card className="bg-zinc-900 border-zinc-800 text-white">
          <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-1">{node.name}</h2>
            <p className="text-sm text-zinc-400">
              {node.assetType}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedNode(null)}
            className="text-zinc-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Asset Address/ID */}
        <div className="mb-4">
          <label className="text-xs text-zinc-500 uppercase tracking-wide mb-1 block">
            Contract Address
          </label>
          <div className="flex items-center gap-2">
            <code className="text-sm bg-zinc-800 px-3 py-1.5 rounded flex-1 overflow-hidden text-ellipsis">
              {formatAddress(nodeId)}
            </code>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyAddress}
              className="text-zinc-400 hover:text-white"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-zinc-400 hover:text-white"
            >
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-zinc-800 p-3 rounded">
            <p className="text-xs text-zinc-500 mb-1">Children</p>
            <p className="text-2xl font-bold">{derivativeCount}</p>
          </div>
          <div className="bg-zinc-800 p-3 rounded">
            <p className="text-xs text-zinc-500 mb-1">Parents</p>
            <p className="text-2xl font-bold">{parentCount}</p>
          </div>
        </div>

        {/* Asset Type / Compliance */}
        <div className="mb-4">
          <label className="text-xs text-zinc-500 uppercase tracking-wide mb-2 block">
            Asset Type
          </label>
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: commercialUse ? '#10b981' : '#f59e0b' }}
            />
            <span className="text-sm capitalize">{licenseType.replace('-', ' ')}</span>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            {commercialUse ? '✓ Compliance verified' : '⚠ Compliance pending'}
          </p>
        </div>

        {/* Owner */}
        <div className="mb-4">
          <label className="text-xs text-zinc-500 uppercase tracking-wide mb-1 block">
            Owner
          </label>
          <code className="text-sm bg-zinc-800 px-3 py-1.5 rounded block overflow-hidden text-ellipsis">
            {formatAddress(node.owner)}
          </code>
        </div>

        {/* Created Date - removed for RWA assets */}

        {/* Revenue / Total Value */}
        {revenue && (
          <div className="mb-4">
            <label className="text-xs text-zinc-500 uppercase tracking-wide mb-1 block">
              Total Value
            </label>
            <p className="text-lg font-bold">
              {revenue}
            </p>
          </div>
        )}

        {/* RWA-Specific Details */}
        {true && (
          <>
            {/* Compliance Status */}
            {node.complianceStatus && (
              <div className="mb-4">
                <label className="text-xs text-zinc-500 uppercase tracking-wide mb-1 block">
                  Compliance Status
                </label>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    node.complianceStatus === 'compliant' 
                      ? 'bg-green-500/20 text-green-400'
                      : node.complianceStatus === 'pending'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {node.complianceStatus.toUpperCase()}
                  </span>
                </div>
              </div>
            )}

            {/* Custody Info */}
            {node.custodian && (
              <div className="mb-4">
                <label className="text-xs text-zinc-500 uppercase tracking-wide mb-1 block">
                  Custodian
                </label>
                <p className="text-sm">{node.custodian}</p>
                {node.custodyStatus && (
                  <p className="text-xs text-zinc-500 capitalize">{node.custodyStatus.replace('-', ' ')}</p>
                )}
              </div>
            )}

            {/* Yield Rate */}
            {node.yieldRate && node.yieldRate > 0 && (
              <div className="mb-4">
                <label className="text-xs text-zinc-500 uppercase tracking-wide mb-1 block">
                  Yield Rate
                </label>
                <p className="text-lg font-bold text-green-400">{node.yieldRate.toFixed(2)}% APY</p>
              </div>
            )}

            {/* Risk & Liquidity Scores */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {node.riskScore !== undefined && (
                <div className="bg-zinc-800 p-3 rounded">
                  <p className="text-xs text-zinc-500 mb-1">Risk Score</p>
                  <p className={`text-xl font-bold ${
                    node.riskScore < 30 ? 'text-green-400' : 
                    node.riskScore < 60 ? 'text-yellow-400' : 
                    'text-red-400'
                  }`}>
                    {node.riskScore}/100
                  </p>
                </div>
              )}
              {node.liquidityScore !== undefined && (
                <div className="bg-zinc-800 p-3 rounded">
                  <p className="text-xs text-zinc-500 mb-1">Liquidity</p>
                  <p className={`text-xl font-bold ${
                    node.liquidityScore > 70 ? 'text-green-400' : 
                    node.liquidityScore > 40 ? 'text-yellow-400' : 
                    'text-red-400'
                  }`}>
                    {node.liquidityScore}/100
                  </p>
                </div>
              )}
            </div>

            {/* Collateral Usage */}
            {node.collateralFor && node.collateralFor.length > 0 && (
              <div className="mb-4">
                <label className="text-xs text-zinc-500 uppercase tracking-wide mb-1 block">
                  Used as Collateral
                </label>
                <div className="bg-zinc-800 p-3 rounded">
                  <p className="text-sm text-zinc-300">
                    ✓ Collateralizing {node.collateralFor.length} DeFi position{node.collateralFor.length > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-zinc-800">
          <Button
            variant="outline"
            className="flex-1 bg-zinc-800 hover:bg-zinc-700 border-zinc-700"
            onClick={() => window.open(`https://explorer.mantle.xyz/address/${nodeId}`, '_blank')}
          >
            View on Mantle Explorer
          </Button>
        </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
