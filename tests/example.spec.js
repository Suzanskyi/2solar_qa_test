const {test: baseTest, expect} = require('@playwright/test');
const AntiCaptchaBrowser = require('./utils/AntiCaptchaBrowser');
const fs = require('fs');
const path = require('path');

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
    }
});

test('Funda homepage should load and display search form', async ({page}) => {
    await page.goto('https://www.funda.nl', {waitUntil: 'domcontentloaded'});
});


test('Login test and save state', async ({page, browserContext, antiCaptchaBrowser}) => {
    // Skip if we already have a stored auth state
    if (antiCaptchaBrowser.hasStoredAuthState()) {
        console.log('Using stored authentication state. Skipping login.');
        test.skip();
        return;
    }

    await page.goto('https://www.funda.nl/');
    await page.getByRole('button', {name: 'Alles accepteren'}).click();
    await page.getByRole('button', {name: 'Inloggen'}).click();
    await page.getByRole('textbox', {name: 'E-mailadres'}).click();
    await page.getByRole('textbox', {name: 'E-mailadres'}).fill(process.env.EMAIL);
    await page.getByRole('textbox', {name: 'E-mailadres'}).press('Tab');
    await page.getByRole('textbox', {name: 'Wachtwoord'}).fill(process.env.PASSWORD);
    await page.getByRole('button', {name: 'Log in'}).click();
    await page.locator('#headlessui-menu-button-v-0-34').click();
    await page.getByRole('menuitem', {name: 'Mijn account'}).click();

    await expect(page.locator('h1')).toContainText('Hallo Serhii');
    await expect(page.locator('#main-content')).toContainText(process.env.EMAIL);

    // Save the authentication state for future tests
    await antiCaptchaBrowser.saveAuthState(browserContext);
    console.log('Authentication state saved successfully.');
});

test('Access authenticated page using stored state', async ({page}) => {
    // Go directly to the account page
    await page.goto('https://www.funda.nl/account/');

    // Verify we're logged in by checking for user information
    await expect(page.locator('h1')).toContainText('Hallo Serhii');
    await expect(page.locator('#main-content')).toContainText(process.env.EMAIL);
});
