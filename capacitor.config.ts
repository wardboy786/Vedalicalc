import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.verdant.calc',
  appName: 'Verdantcalc',
  webDir: 'out',
  server: {
    androidScheme: 'https',
  },
};

export default config;
