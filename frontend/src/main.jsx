import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// Import MWA registration
import { 
    createDefaultAuthorizationCache, 
    createDefaultChainSelector, 
    createDefaultWalletNotFoundHandler,
    registerMwa, 
} from '@solana-mobile/wallet-standard-mobile';

// Register Mobile Wallet Adapter (MWA) for Seeker native deep linking
registerMwa({
    appIdentity: {
        name: 'Circuit',
        uri: 'https://circuit.worldlabs.io',  // your live domain or localhost for dev
        icon: '/icon.png',  // relative path to your app icon (must exist in public/)
    },
    authorizationCache: createDefaultAuthorizationCache(),
    chains: ['solana:devnet', 'solana:mainnet-beta'],  // add mainnet when ready
    chainSelector: createDefaultChainSelector(),
    onWalletNotFound: createDefaultWalletNotFoundHandler(),
});

// Your existing providers (ConnectionProvider, WalletProvider, etc.)
import {
    ConnectionProvider,
    WalletProvider
} from "@solana/wallet-adapter-react";

import {
    WalletModalProvider
} from "@solana/wallet-adapter-react-ui";

import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { BackpackWalletAdapter } from "@solana/wallet-adapter-backpack";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";

import { clusterApiUrl } from "@solana/web3.js";

import "@solana/wallet-adapter-react-ui/styles.css";

// Buffer polyfill
import { Buffer } from 'buffer';
window.Buffer = Buffer;

const network = "devnet";
const endpoint = clusterApiUrl(network);

const wallets = [
    new PhantomWalletAdapter(),
    new BackpackWalletAdapter(),
    new SolflareWalletAdapter({ network }),
    // MobileWalletAdapter is now handled by MWA registration above - no need to add it manually
];

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <App />
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    </React.StrictMode>
);