import { createConfig, http } from '@wagmi/core'
import { mantleMainnet, mantleTestnet } from '@/lib/mantle/client'

// Mantle Network configuration
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || 'mantle-asset-atlas'

// Use Mantle networks
export const networks = [mantleMainnet, mantleTestnet]

// Simple Wagmi config for Mantle
export const config = createConfig({
  chains: [mantleMainnet, mantleTestnet],
  transports: {
    [mantleMainnet.id]: http(),
    [mantleTestnet.id]: http(),
  },
  ssr: true,
})
