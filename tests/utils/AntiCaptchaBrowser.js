const { chromium } = require('@playwright/test');

class AntiCaptchaBrowser {
  constructor() {
    this.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
      '(KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';
  }

  async createBrowser() {
    const browser = await chromium.launch({
      args: ['--start-maximized'],
    });

    const context = await browser.newContext({
      userAgent: this.userAgent,
      locale: 'en-US',
    });

    const page = await context.newPage();

    await this.setupAntiCaptchaScripts(page);

    return { browser, context, page };
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