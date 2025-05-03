const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

class AntiCaptchaBrowser {
  constructor() {
    this.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
      '(KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';
    this.authStateFile = path.join(__dirname, '../../auth-state.json');
  }

  async createBrowser(useStoredState = true) {
    const browser = await chromium.launch({
      args: ['--start-maximized'],
    });

    return { browser };
  }

  hasStoredAuthState() {
    return fs.existsSync(this.authStateFile);
  }

  async saveAuthState(context) {
    await context.storageState({ path: this.authStateFile });
    console.log(`Authentication state saved to ${this.authStateFile}`);
  }

  async setupAntiCaptchaScripts(page) {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => false,
      });

      // Mimic real plugins
      Object.defineProperty(navigator, 'plugins', {
        get: () => [1, 2, 3, 4, 5],
      });

      // Mimic languages
      Object.defineProperty(navigator, 'languages', {
        get: () => ['en-US', 'en'],
      });

      // Spoof Chrome runtime
      window.chrome = {
        runtime: {},
      };
    });
  }

  async simulateHumanBehavior(page) {
    // Simulate human-like wait
    await page.waitForTimeout(Math.random() * 2000 + 1000);
  }
}

module.exports = AntiCaptchaBrowser; 
