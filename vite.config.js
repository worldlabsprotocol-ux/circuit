import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  base: './',  // Critical: relative paths for Capacitor APK (prevents black screen in app)

  define: {
    'process.env': {},  // Prevents process.env undefined errors in Solana libs
  },

  resolve: {
    alias: {
      buffer: 'buffer',  // Polyfill for Solana/web3.js Buffer usage
    },
  },

  optimizeDeps: {
    // Force Vite to correctly resolve MobileWalletAdapter named export
    include: ['@solana-mobile/wallet-adapter-mobile'],
    exclude: ['@solana-mobile/wallet-adapter-mobile'],
    esbuildOptions: {
      define: {
        global: 'globalThis',  // Fixes globalThis issues in mobile adapter
      },
    },
  },

  build: {
    outDir: 'dist',          // Matches capacitor.config.json webDir
    assetsDir: 'assets',
    sourcemap: true,         // Helps debug black screens or crashes
    rollupOptions: {
      // Externalize mobile adapter if Vite still chokes (fallback)
      external: ['@solana-mobile/wallet-adapter-mobile'],
    },
  },

  server: {
    host: true,              // Expose to network (Seeker can access via IP)
    port: 5173,
    strictPort: true,        // Don't auto-change port if 5173 busy
    hmr: {
      overlay: false,        // Disable annoying error overlay during dev (prevents black)
    },
    // Allow cleartext for Android emulator/Seeker (required for local dev)
    proxy: {
      '/api': {
        target: 'http://localhost:5173',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  // Optional: better error reporting in console
  css: {
    devSourcemap: true,
  },
});