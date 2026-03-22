import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:8000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: process.env.CI ? 'npm run build && npm run start' : 'npm run dev',
    timeout: 120 * 1000,
    url: 'http://localhost:8000',
    reuseExistingServer: !process.env.CI,
    env: {
      MEDUSA_BACKEND_URL: process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000',
      NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY:
        process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || 'pk_test_12345',
      NEXT_PUBLIC_MEDUSA_BACKEND_URL:
        process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000',
    },
  },
});
