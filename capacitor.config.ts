import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.worldlabsprotocol.circuit",
  appName: "Circuit",
  webDir: "frontend/dist",
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
      backgroundColor: "#00000000",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
    },
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    backgroundColor: "#000000",
  },
};

export default config;