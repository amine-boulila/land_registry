import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  mainnet,
  sepolia,
  polygon,
  optimism,
  arbitrum,
  base,
} from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Land Registry DApp',
  projectId: 'YOUR_PROJECT_ID', // User might need to replace this, but it works for dev often or I can use a public one if available. 
  // Note: WalletConnect requires a projectId. I'll leave a placeholder or use a generic one if I had one, but standard practice is placeholder.
  chains: [mainnet, sepolia, polygon, optimism, arbitrum, base],
  ssr: true,
});
