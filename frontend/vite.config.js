import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const backendUrl = env.VITE_BACKEND_URL || 'http://localhost:8081';
  const campaignProxy = {
    target: backendUrl,
    changeOrigin: true,
  };

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/DigitalMarketingCampaign': campaignProxy,
      },
    },
    preview: {
      proxy: {
        '/DigitalMarketingCampaign': campaignProxy,
      },
    },
  };
});
