import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.worldlabsprotocol.circuit',
  appName: 'Circuit',
  webDir: 'frontend/dist',           // your build output folder – keep this

  plugins: {
    SplashScreen: {
      launchShowDuration: 0,         // hide splash immediately after load
      launchAutoHide: true,
      backgroundColor: '#00000000',  // transparent/black to avoid flash
      androidScaleType: 'CENTER_CROP',
      showSpinner: false
    }
  },

  server: {
    hostname: 'localhost',           // helps with dev tools & debugging
    cleartext: true                  // allow http for local testing (safe in dev)
  },

  android: {
    allowMixedContent: true,         // critical – lets external audio URLs load
    captureInput: true,              // improves touch/pointer event capture on grid
    webContentsDebuggingEnabled: true, // enables Chrome DevTools for WebView
    backgroundColor: '#000000'       // solid black background
  }
};

export default config;