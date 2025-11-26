'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useFilterStore } from '@/stores/filterStore';

export default function FilterPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    licenseTypes,
    mediaTypes,
    commercialOnly,
    hasDerivatives,
    setLicenseTypes,
    setMediaTypes,
    setCommercialOnly,
    setHasDerivatives,
    reset,
  } = useFilterStore();

  const licenseOptions = [
    { value: 'Commercial Remix', label: '💼 Commercial Remix', color: '#10b981' },
    { value: 'Commercial', label: '💰 Commercial Only', color: '#3b82f6' },
    { value: 'Non-Commercial Remix', label: '🎨 Non-Commercial Remix', color: '#f59e0b' },
    { value: 'Attribution Only', label: '📝 Attribution Only', color: '#8b5cf6' },
    { value: 'None', label: '⚪ No License', color: '#6b7280' },
  ];

  const mediaOptions = [
    { value: 'image', label: '🖼️ Image', icon: '🖼️' },
    { value: 'audio', label: '🎵 Audio', icon: '🎵' },
    { value: 'video', label: '🎬 Video', icon: '🎬' },
    { value: 'text', label: '📄 Text', icon: '📄' },
    { value: 'other', label: '📦 Other', icon: '📦' },
  ];

  const toggleLicenseType = (value: string) => {
    const currentTypes = licenseTypes || [];
    if (currentTypes.includes(value)) {
      setLicenseTypes(currentTypes.filter((t) => t !== value));
    } else {
      setLicenseTypes([...currentTypes, value]);
    }
  };

  const toggleMediaType = (value: string) => {
    const currentTypes = mediaTypes || [];
    if (currentTypes.includes(value)) {
      setMediaTypes(currentTypes.filter((t) => t !== value));
    } else {
      setMediaTypes([...currentTypes, value]);
    }
  };

  const activeFilterCount =
    (licenseTypes?.length || 0) +
    (mediaTypes?.length || 0) +
    (commercialOnly ? 1 : 0) +
    (hasDerivatives ? 1 : 0);

  return (
    <div className="relative">
      {/* Filter Toggle Button */}
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-zinc-900 border-zinc-800 text-white hover:bg-zinc-800 relative"
      >
        <Filter className="h-4 w-4 mr-2" />
        Filters
        {activeFilterCount > 0 && (
          <span className="ml-2 px-2 py-0.5 text-xs bg-blue-500 text-white rounded-full">
            {activeFilterCount}
          </span>
        )}
        {isOpen ? (
          <ChevronUp className="h-4 w-4 ml-2" />
        ) : (
          <ChevronDown className="h-4 w-4 ml-2" />
        )}
      </Button>

      {/* Filter Panel */}
      {isOpen && (
        <Card className="absolute right-0 top-12 w-96 bg-zinc-900 border-zinc-800 text-white z-50 p-6 max-h-[600px] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Filters</h3>
            <div className="flex gap-2">
              {activeFilterCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={reset}
                  className="text-zinc-400 hover:text-white text-xs"
                >
                  Reset All
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* License Type Filters */}
          <div className="mb-6">
            <Label className="text-sm font-semibold mb-3 block text-zinc-200">
              License Types
            </Label>
            <div className="space-y-2">
              {licenseOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => toggleLicenseType(option.value)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                    licenseTypes?.includes(option.value)
                      ? 'bg-zinc-800 border-2 border-blue-500'
                      : 'bg-zinc-950 border-2 border-transparent hover:bg-zinc-800'
                  }`}
                >
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: option.color }}
                  />
                  <span className="text-sm flex-1 text-left">{option.label}</span>
                  {licenseTypes?.includes(option.value) && (
                    <span className="text-blue-500 text-xs">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Media Type Filters */}
          <div className="mb-6">
            <Label className="text-sm font-semibold mb-3 block text-zinc-200">
              Media Types
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {mediaOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => toggleMediaType(option.value)}
                  className={`flex items-center gap-2 p-3 rounded-lg transition-all ${
                    mediaTypes?.includes(option.value)
                      ? 'bg-zinc-800 border-2 border-blue-500'
                      : 'bg-zinc-950 border-2 border-transparent hover:bg-zinc-800'
                  }`}
                >
                  <span className="text-lg">{option.icon}</span>
                  <span className="text-sm flex-1">{option.label.split(' ')[1]}</span>
                  {mediaTypes?.includes(option.value) && (
                    <span className="text-blue-500 text-xs">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Filters */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold block text-zinc-200">
              Quick Filters
            </Label>
            
            <button
              onClick={() => setCommercialOnly(!commercialOnly)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                commercialOnly
                  ? 'bg-zinc-800 border-2 border-blue-500'
                  : 'bg-zinc-950 border-2 border-transparent hover:bg-zinc-800'
              }`}
            >
              <span className="text-lg">💼</span>
              <span className="text-sm flex-1 text-left">Commercial Use Only</span>
              {commercialOnly && <span className="text-blue-500 text-xs">✓</span>}
            </button>

            <button
              onClick={() => setHasDerivatives(!hasDerivatives)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                hasDerivatives
                  ? 'bg-zinc-800 border-2 border-blue-500'
                  : 'bg-zinc-950 border-2 border-transparent hover:bg-zinc-800'
              }`}
            >
              <span className="text-lg">🌳</span>
              <span className="text-sm flex-1 text-left">Has Derivatives</span>
              {hasDerivatives && <span className="text-blue-500 text-xs">✓</span>}
            </button>
          </div>

          {/* Active Filters Summary */}
          {activeFilterCount > 0 && (
            <div className="mt-6 pt-6 border-t border-zinc-800">
              <p className="text-xs text-zinc-400 mb-2">Active Filters</p>
              <div className="flex flex-wrap gap-2">
                {licenseTypes && licenseTypes.map((type) => (
                  <span
                    key={type}
                    className="px-2 py-1 text-xs bg-zinc-800 rounded-full flex items-center gap-1"
                  >
                    {type}
                    <button
                      onClick={() => toggleLicenseType(type)}
                      className="hover:text-red-400"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {mediaTypes && mediaTypes.map((type) => (
                  <span
                    key={type}
                    className="px-2 py-1 text-xs bg-zinc-800 rounded-full flex items-center gap-1"
                  >
                    {type}
                    <button
                      onClick={() => toggleMediaType(type)}
                      className="hover:text-red-400"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {commercialOnly && (
                  <span className="px-2 py-1 text-xs bg-zinc-800 rounded-full flex items-center gap-1">
                    Commercial Only
                    <button
                      onClick={() => setCommercialOnly(false)}
                      className="hover:text-red-400"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {hasDerivatives && (
                  <span className="px-2 py-1 text-xs bg-zinc-800 rounded-full flex items-center gap-1">
                    Has Derivatives
                    <button
                      onClick={() => setHasDerivatives(false)}
                      className="hover:text-red-400"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
