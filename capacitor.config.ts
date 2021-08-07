/// <reference types="@capacitor/splash-screen" />
import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "org.toastbrot.maskmanager",
  appName: "Mask manager",
  webDir: "build",
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
    },
  },
};

export default config;
