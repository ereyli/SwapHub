import '@rainbow-me/rainbowkit/styles.css';
import SwapInterface from './components/SwapInterface';
import { WagmiProvider } from 'wagmi';
import { base, mainnet, arbitrum, optimism, polygon, bsc, avalanche, mantle, zkSync } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'viem';
import { defineChain } from 'viem';

// Custom chains (not available in wagmi/chains)
const monad = defineChain({
  id: 143,
  name: 'Monad',
  nativeCurrency: { name: 'MON', symbol: 'MON', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.monad.ac'] },
  },
  blockExplorers: {
    default: { name: 'MonadScan', url: 'https://monadscan.com' },
  },
});

const unichain = defineChain({
  id: 130,
  name: 'Unichain',
  nativeCurrency: { name: 'UNI', symbol: 'UNI', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.unichain.io'] },
  },
  blockExplorers: {
    default: { name: 'Unichain Explorer', url: 'https://unichainexplorer.com' },
  },
});

const soneinum = defineChain({
  id: 146,
  name: 'Soneinum',
  nativeCurrency: { name: 'SON', symbol: 'SON', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.soneinum.io'] },
  },
  blockExplorers: {
    default: { name: 'Soneinum Explorer', url: 'https://soneinumexplorer.com' },
  },
});

const ink = defineChain({
  id: 57073,
  name: 'Ink',
  nativeCurrency: { name: 'INK', symbol: 'INK', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.ink.io'] },
  },
  blockExplorers: {
    default: { name: 'Ink Explorer', url: 'https://inkexplorer.com' },
  },
});

const zora = defineChain({
  id: 7777777,
  name: 'Zora',
  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.zora.energy'] },
  },
  blockExplorers: {
    default: { name: 'Zora Explorer', url: 'https://explorer.zora.energy' },
  },
});

const config = getDefaultConfig({
  appName: 'UniMini DEX',
  projectId: '2c9f2a3e8b5d4c1a9e8f7b6c5d4e3f2a',
  chains: [base, mainnet, arbitrum, optimism, polygon, bsc, avalanche, mantle, zkSync, monad, unichain, soneinum, ink, zora],
  transports: {
    [base.id]: http('https://base-mainnet.g.alchemy.com/v2/e_3LRKM0RipM2jfrPRn-CemN5EgByDgA', {
      timeout: 30000, // 30 seconds timeout
      retryCount: 3,
      retryDelay: 1000
    }),
    [mainnet.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
    [polygon.id]: http(),
    [bsc.id]: http(),
    [avalanche.id]: http(),
    [mantle.id]: http(),
    [zkSync.id]: http(),
    [monad.id]: http(),
    [unichain.id]: http(),
    [soneinum.id]: http(),
    [ink.id]: http(),
    [zora.id]: http(),
  },
  ssr: false,
});

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <div style={{ 
            minHeight: '100vh', 
            backgroundColor: '#000000',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <main style={{ flex: 1 }}>
              <SwapInterface />
            </main>
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;

