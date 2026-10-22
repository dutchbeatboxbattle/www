import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  use: { baseURL: 'http://127.0.0.1:4173', headless: true },
  webServer: {
    command: 'npm run preview',
    url: `http://127.0.0.1:4173${process.env.NEXT_PUBLIC_BASE_PATH || ''}/`,
    reuseExistingServer: true,
  },
  workers: 1,
});
