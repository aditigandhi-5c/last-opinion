import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.54a3d8bfe16947549f827cfe291074df',
  appName: 'second-opinion-nexus',
  webDir: 'dist',
  server: {
    url: 'https://54a3d8bf-e169-4754-9f82-7cfe291074df.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  bundledWebRuntime: false
};

export default config;