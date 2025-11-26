'use client';

import React from 'react';
import { Card } from '@/components/ui/card';

export default function LegendPanel() {
  const licenseTypes = [
    { name: 'Commercial Remix', color: '#10b981', description: 'Allows commercial use & derivatives' },
    { name: 'Commercial', color: '#3b82f6', description: 'Commercial use only' },
    { name: 'Non-Commercial Remix', color: '#f59e0b', description: 'Free derivatives only' },
    { name: 'Attribution Only', color: '#8b5cf6', description: 'Attribution required' },
    { name: 'None', color: '#6b7280', description: 'No license set' },
  ];

  return (
    <Card className="absolute top-6 left-6 bg-zinc-900 border-zinc-800 text-white z-10 p-4 w-72">
      <h3 className="text-sm font-semibold mb-3 text-zinc-200">License Types</h3>
      <div className="space-y-2">
        {licenseTypes.map((type) => (
          <div key={type.name} className="flex items-start gap-3">
            <div
              className="w-4 h-4 rounded-full mt-0.5 flex-shrink-0"
              style={{ backgroundColor: type.color }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-zinc-200">{type.name}</p>
              <p className="text-xs text-zinc-500">{type.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-zinc-800">
        <h4 className="text-xs font-semibold mb-2 text-zinc-400">Node Size</h4>
        <p className="text-xs text-zinc-500">
          Larger nodes have more derivatives
        </p>
      </div>
    </Card>
  );
}
