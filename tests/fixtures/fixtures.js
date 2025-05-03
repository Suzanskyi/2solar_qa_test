const {test: baseTest, expect} = require('@playwright/test');
const AntiCaptchaBrowser = require('../utils/AntiCaptchaBrowser');

// Import page objects
const HomePage = require('../pages/HomePage');
const LoginPage = require('../pages/LoginPage');
const AccountPage = require('../pages/AccountPage');
const MapSearchPage = require('../pages/MapSearchPage');
const PropertyDetailPage = require('../pages/PropertyDetailPage');

// Create a shared instance of AntiCaptchaBrowser
const antiCaptchaBrowserInstance = new AntiCaptchaBrowser();

// Define worker fixtures (shared across all tests in a worker)
const test = baseTest.extend({
    // Worker fixtures
    antiCaptchaBrowserInstance: [async ({}, use) => {
        await use(antiCaptchaBrowserInstance);
    }, { scope: 'worker' }],

    // Browser fixture that uses the stored auth state if available
    browser: [async ({ antiCaptchaBrowserInstance }, use) => {
        const { browser } = await antiCaptchaBrowserInstance.createBrowser(true);
        await use(browser);
        await browser.close();
    }, { scope: 'worker' }],

    // Context fixture that uses the browser fixture
    browserContext: [async ({ browser, antiCaptchaBrowserInstance }, use) => {
        const contextOptions = {
            userAgent: antiCaptchaBrowserInstance.userAgent,
            locale: 'en-US',
            viewport: { width: 1920, height: 1080 },
            acceptDownloads: true, // Enable file downloads
        };

        // Use stored auth state if available
        if (antiCaptchaBrowserInstance.hasStoredAuthState()) {
            contextOptions.storageState = antiCaptchaBrowserInstance.authStateFile;
        }

        const context = await browser.newContext(contextOptions);
        await use(context);
        await context.close();
    }, { scope: 'test' }],

    // Override the default page fixture to use our browserContext
    page: [async ({ browserContext, antiCaptchaBrowserInstance }, use) => {
        const page = await browserContext.newPage();
        await antiCaptchaBrowserInstance.setupAntiCaptchaScripts(page);
        await antiCaptchaBrowserInstance.simulateHumanBehavior(page);
        await use(page);
    }, { scope: 'test' }],

    // Test fixtures
    antiCaptchaBrowser: async ({ antiCaptchaBrowserInstance }, use) => {
        await use(antiCaptchaBrowserInstance);
    },

    // Page object fixtures
    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    accountPage: async ({ page }, use) => {
        await use(new AccountPage(page));
    },
    mapSearchPage: async ({ page }, use) => {
        await use(new MapSearchPage(page));
    },
    propertyDetailPage: async ({ page }, use) => {
        await use(new PropertyDetailPage(page));
    }
});

module.exports = { test, expect };
