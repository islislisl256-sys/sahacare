import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sahacare.app',
  appName: 'SahaCare',
  webDir: 'public',
  server: {
    // توجيه التطبيق للاتصال بالسيرفر مباشرة
    url: 'https://sahacare-pi.vercel.app/',
    cleartext: true
  }
};

export default config;
