import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.waterrats',
  appName: 'Water Rats',
  webDir: '../dist',
  server: {
    // For local dev on a device, set this to your dev server URL (e.g. 'http://192.168.1.10:5173')
    url: '',
    cleartext: true
  }
};

export default config;
