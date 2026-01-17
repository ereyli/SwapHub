import { createConfig, ChainId, EVM } from '@lifi/sdk';

// LI.FI API Key (Frontend'de kullanıyoruz - production'da environment variable kullanın)
export const LIFI_API_KEY = 'a7da8f13-3bad-4881-8f66-f8d9b92a18ab.5c67063e-cffc-4c37-b34d-d8ac1e7c0884';

// LI.FI SDK'yı yapılandır
// Provider'lar component içinde setup edilecek (wagmi hook'ları için)
createConfig({
  integrator: 'SwapHub',
  apiUrl: 'https://li.quest/v1',
  apiKey: LIFI_API_KEY,
});

// Provider setup fonksiyonu - component içinde çağrılacak
export function setupLifiProviders(getWalletClientFn: () => Promise<any>, switchChainFn: (chainId: number) => Promise<any>) {
  const { config } = require('@lifi/sdk');
  config.setProviders([
    EVM({
      getWalletClient: getWalletClientFn,
      switchChain: switchChainFn,
    }),
  ]);
}

// Chain ID mapping (wagmi chain ID'leri ile LI.FI ChainId'leri arasında)
export const CHAIN_ID_MAPPING: Record<number, number> = {
  8453: ChainId.BAS,   // Base
  1: ChainId.ETH,      // Ethereum
  42161: ChainId.ARB,  // Arbitrum
  10: ChainId.OPT,     // Optimism
  137: ChainId.POL,    // Polygon
  100: ChainId.DAI,    // Gnosis
  56: ChainId.BSC,     // BNB Chain
  43114: ChainId.AVA,  // Avalanche
  250: ChainId.FTM,    // Fantom
  1101: ChainId.PZE,   // Polygon zkEVM
  5000: ChainId.MNT,   // Mantle
  324: ChainId.ERA,    // zkSync Era
  143: ChainId.MON,    // Monad
  130: ChainId.UNI,    // Unichain
  146: ChainId.SON,    // Soneinum
  57073: ChainId.INK,  // Ink
};

// Reverse mapping (LI.FI ChainId -> wagmi chain ID)
export const REVERSE_CHAIN_ID_MAPPING: Record<number, number> = {
  [ChainId.BAS]: 8453,
  [ChainId.ETH]: 1,
  [ChainId.ARB]: 42161,
  [ChainId.OPT]: 10,
  [ChainId.POL]: 137,
  [ChainId.DAI]: 100,
  [ChainId.BSC]: 56,
  [ChainId.AVA]: 43114,
  [ChainId.FTM]: 250,
  [ChainId.PZE]: 1101,
  [ChainId.MNT]: 5000,
  [ChainId.ERA]: 324,
  [ChainId.MON]: 143,
  [ChainId.UNI]: 130,
  [ChainId.SON]: 146,
  [ChainId.INK]: 57073,
};

// Desteklenen chain'ler (Base'den başlayarak popüler olanlar)
export const SUPPORTED_CHAINS = [
  { lifiChainId: ChainId.BAS, wagmiChainId: 8453, name: 'Base', nativeCurrency: 'ETH' },
  { lifiChainId: ChainId.ETH, wagmiChainId: 1, name: 'Ethereum', nativeCurrency: 'ETH' },
  { lifiChainId: ChainId.ARB, wagmiChainId: 42161, name: 'Arbitrum', nativeCurrency: 'ETH' },
  { lifiChainId: ChainId.OPT, wagmiChainId: 10, name: 'Optimism', nativeCurrency: 'ETH' },
  { lifiChainId: ChainId.POL, wagmiChainId: 137, name: 'Polygon', nativeCurrency: 'MATIC' },
  { lifiChainId: ChainId.BSC, wagmiChainId: 56, name: 'BNB Chain', nativeCurrency: 'BNB' },
  { lifiChainId: ChainId.AVA, wagmiChainId: 43114, name: 'Avalanche', nativeCurrency: 'AVAX' },
  { lifiChainId: ChainId.MNT, wagmiChainId: 5000, name: 'Mantle', nativeCurrency: 'MNT' },
  { lifiChainId: ChainId.ERA, wagmiChainId: 324, name: 'zkSync Era', nativeCurrency: 'ETH' },
  { lifiChainId: ChainId.MON, wagmiChainId: 143, name: 'Monad', nativeCurrency: 'MON' },
  { lifiChainId: ChainId.UNI, wagmiChainId: 130, name: 'Unichain', nativeCurrency: 'UNI' },
  { lifiChainId: ChainId.SON, wagmiChainId: 146, name: 'Soneinum', nativeCurrency: 'SON' },
  { lifiChainId: ChainId.INK, wagmiChainId: 57073, name: 'Ink', nativeCurrency: 'INK' },
];

// Native token addresses (her chain için native token address'i 0x0000000000000000000000000000000000000000)
export const NATIVE_TOKEN_ADDRESS = '0x0000000000000000000000000000000000000000';
