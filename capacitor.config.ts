import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.worldlabsprotocol.circuit",
  appName: "Circuit",
  webDir: "frontend/dist",
  server: {
    androidScheme: "capacitor",
    hostname: "localhost",
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
      launchAutoHide: true,
      fadeOutDuration: 0,
      showSpinner: false,
      backgroundColor: "#00000000",
      androidScaleType: "CENTER_CROP"
    }
  },
  android: {
    allowMixedContent: true,
    captureInput: false,
    backgroundColor: "#000000"
  }
};

export default config;