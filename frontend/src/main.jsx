import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";  // ← This is your root with tabs (App.jsx)

import {
  ConnectionProvider,
  WalletProvider
} from "@solana/wallet-adapter-react";

import {
  WalletModalProvider
} from "@solana/wallet-adapter-react-ui";

import {
  PhantomWalletAdapter
} from "@solana/wallet-adapter-wallets";

import { clusterApiUrl } from "@solana/web3.js";

import "@solana/wallet-adapter-react-ui/styles.css";

// Devnet for testing (change to 'mainnet-beta' later)
const endpoint = clusterApiUrl("devnet");

const wallets = [
  new PhantomWalletAdapter(),
];

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <App />  {/* ← Renders App.jsx which handles tabs and Studio */}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  </React.StrictMode>
);