import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.trejodev.shopping',
  appName: 'shoppingList',
  webDir: 'www',
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId:
        '721140284167-k25clbb7679lec9a4b8caba4dpp7oaol.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
  },
  bundledWebRuntime: false,
};

export default config;
