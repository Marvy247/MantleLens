// React hooks for RWA asset data fetching
import useSWR from 'swr';
import { RWAAsset, MonitoringAlert, RWAProtocol } from '../mantle/types';
import { fetchRWAAssets, fetchMonitoringAlerts, fetchProtocols } from '../mantle/queries';

export function useRWAAssets(params?: {
  limit?: number;
  offset?: number;
  assetType?: string;
}) {
  const key = params 
    ? `rwa-assets-${JSON.stringify(params)}`
    : 'rwa-assets';

  const { data, error, isLoading, mutate } = useSWR<RWAAsset[]>(
    key,
    () => fetchRWAAssets(params),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0, // Disabled auto-refresh
    }
  );

  return {
    assets: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}

export function useMonitoringAlerts(params?: {
  severity?: string;
  resolved?: boolean;
  limit?: number;
}) {
  const key = params
    ? `monitoring-alerts-${JSON.stringify(params)}`
    : 'monitoring-alerts';

  const { data, error, isLoading, mutate } = useSWR<MonitoringAlert[]>(
    key,
    () => fetchMonitoringAlerts(params),
    {
      revalidateOnFocus: false,
      refreshInterval: 0, // Disabled auto-refresh
    }
  );

  return {
    alerts: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}

export function useRWAProtocols() {
  const { data, error, isLoading, mutate } = useSWR<RWAProtocol[]>(
    'rwa-protocols',
    fetchProtocols,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    protocols: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}
