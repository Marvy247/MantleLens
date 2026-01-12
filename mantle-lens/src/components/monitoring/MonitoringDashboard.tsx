'use client';

import { useMonitoringAlerts } from '@/lib/hooks/useRWAAssets';
import { Card } from '@/components/ui/card';
import { AlertTriangle, AlertCircle, Info, CheckCircle2, Clock, Shield, TrendingUp, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';

export default function MonitoringDashboard() {
  const { alerts, isLoading } = useMonitoringAlerts({ limit: 50 });

  const criticalAlerts = alerts.filter(a => !a.resolved && a.severity === 'critical');
  const highAlerts = alerts.filter(a => !a.resolved && a.severity === 'high');
  const unresolvedCount = alerts.filter(a => !a.resolved).length;
  const resolvedToday = alerts.filter(a => {
    const dayAgo = Date.now() / 1000 - 24 * 60 * 60;
    return a.resolved && a.timestamp > dayAgo;
  }).length;

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'high':
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case 'medium':
        return <Info className="h-5 w-5 text-yellow-500" />;
      default:
        return <CheckCircle2 className="h-5 w-5 text-blue-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/10 border-red-500/20';
      case 'high':
        return 'bg-orange-500/10 border-orange-500/20';
      case 'medium':
        return 'bg-yellow-500/10 border-yellow-500/20';
      default:
        return 'bg-blue-500/10 border-blue-500/20';
    }
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now() / 1000;
    const diff = now - timestamp;
    
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-zinc-800 rounded w-1/4" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-zinc-800 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="p-6 space-y-6"
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Real-Time Monitoring</h2>
          <p className="text-zinc-400 text-sm mt-1">Asset health, compliance & security alerts</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <Activity className="h-4 w-4 animate-pulse text-green-500" />
          <span>Live</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-red-500/10 border-red-500/20 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-400">Critical Alerts</p>
              <p className="text-3xl font-bold text-red-500 mt-1">{criticalAlerts.length}</p>
            </div>
            <AlertTriangle className="h-10 w-10 text-red-500/50" />
          </div>
        </Card>

        <Card className="bg-orange-500/10 border-orange-500/20 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-400">High Priority</p>
              <p className="text-3xl font-bold text-orange-500 mt-1">{highAlerts.length}</p>
            </div>
            <AlertCircle className="h-10 w-10 text-orange-500/50" />
          </div>
        </Card>

        <Card className="bg-yellow-500/10 border-yellow-500/20 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-400">Unresolved</p>
              <p className="text-3xl font-bold text-yellow-500 mt-1">{unresolvedCount}</p>
            </div>
            <Clock className="h-10 w-10 text-yellow-500/50" />
          </div>
        </Card>

        <Card className="bg-green-500/10 border-green-500/20 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-400">Resolved Today</p>
              <p className="text-3xl font-bold text-green-500 mt-1">{resolvedToday}</p>
            </div>
            <CheckCircle2 className="h-10 w-10 text-green-500/50" />
          </div>
        </Card>
      </div>

      {/* Alert List */}
      <Card className="bg-zinc-900/50 border-zinc-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Recent Alerts</h3>
          <select className="bg-zinc-800 border-zinc-700 text-white text-sm rounded px-3 py-1">
            <option>All Alerts</option>
            <option>Critical Only</option>
            <option>Unresolved</option>
            <option>Resolved</option>
          </select>
        </div>

        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {alerts.length === 0 ? (
            <div className="text-center py-12 text-zinc-500">
              <Shield className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>No alerts at this time</p>
              <p className="text-sm mt-1">All systems operational</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <motion.div
                key={alert.id}
                className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)} ${
                  alert.resolved ? 'opacity-50' : ''
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getSeverityIcon(alert.severity)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-white">{alert.assetName}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
                          {alert.type}
                        </span>
                        {alert.resolved && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">
                            Resolved
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-zinc-300 mb-2">{alert.message}</p>
                      <div className="flex items-center gap-4 text-xs text-zinc-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTime(alert.timestamp)}
                        </span>
                        <span>ID: {alert.assetId.slice(0, 12)}...</span>
                      </div>
                    </div>
                  </div>
                  <button className="text-xs text-blue-400 hover:text-blue-300 whitespace-nowrap ml-4">
                    View Details →
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-zinc-900/50 border-zinc-800 p-4 hover:border-blue-500/50 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Shield className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Run Compliance Scan</p>
              <p className="text-xs text-zinc-400">Check all assets</p>
            </div>
          </div>
        </Card>

        <Card className="bg-zinc-900/50 border-zinc-800 p-4 hover:border-green-500/50 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Generate Health Report</p>
              <p className="text-xs text-zinc-400">Export PDF/CSV</p>
            </div>
          </div>
        </Card>

        <Card className="bg-zinc-900/50 border-zinc-800 p-4 hover:border-purple-500/50 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <AlertCircle className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Configure Alerts</p>
              <p className="text-xs text-zinc-400">Set thresholds</p>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
