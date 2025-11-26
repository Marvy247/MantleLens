'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, Network, GitBranch, Coins, Users, Zap } from 'lucide-react';

interface StatsCardsProps {
  stats: {
    totalIPs: number;
    totalDerivatives: number;
    totalRevenue: string;
    avgDerivativesPerIP: number;
    commercialIPs: number;
    activeCreators: number;
  };
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Total IP Assets',
      value: stats.totalIPs.toLocaleString(),
      icon: Network,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Total Derivatives',
      value: stats.totalDerivatives.toLocaleString(),
      icon: GitBranch,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Total Revenue',
      value: `${parseFloat(stats.totalRevenue).toFixed(2)} IP`,
      icon: Coins,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Avg Derivatives/IP',
      value: stats.avgDerivativesPerIP.toFixed(1),
      icon: TrendingUp,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
    },
    {
      title: 'Commercial IPs',
      value: stats.commercialIPs.toLocaleString(),
      icon: Zap,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
    },
    {
      title: 'Active Creators',
      value: stats.activeCreators.toLocaleString(),
      icon: Users,
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {cards.map((card, index) => (
        <Card
          key={index}
          className="bg-zinc-900 border-zinc-800 p-6 hover:bg-zinc-800/50 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-zinc-400 mb-2">{card.title}</p>
              <p className="text-3xl font-bold text-white">{card.value}</p>
            </div>
            <div className={`p-3 rounded-lg ${card.bgColor}`}>
              <card.icon className={`h-6 w-6 ${card.color}`} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
