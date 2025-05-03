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

    // Browser and context fixtures that use the stored auth state if available
    browserAndContext: [async ({ antiCaptchaBrowserInstance }, use) => {
        const { browser, context } = await antiCaptchaBrowserInstance.createBrowser(true);
        await use({ browser, context });
    }, { scope: 'worker' }],

    browser: [async ({ browserAndContext }, use) => {
        await use(browserAndContext.browser);
    }, { scope: 'worker' }],

    browserContext: [async ({ browserAndContext }, use) => {
        await use(browserAndContext.context);
    }, { scope: 'worker' }],

    // Test fixtures
    antiCaptchaBrowser: async ({ page }, use) => {
        await antiCaptchaBrowserInstance.setupAntiCaptchaScripts(page);
        await antiCaptchaBrowserInstance.simulateHumanBehavior(page);
        await use(antiCaptchaBrowserInstance);
    }
});

test('Funda homepage should load and display search form', async ({page}) => {
    await page.goto('https://www.funda.nl', {waitUntil: 'domcontentloaded'});
});


test('Login test and save state', async ({page, browserContext, antiCaptchaBrowser}) => {

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
});

test('Access authenticated page using stored state', async ({page}) => {
    // Go directly to the account page
    await page.goto('https://www.funda.nl/mijn/account/');
    await page.getByRole('button', {name: 'Alles accepteren'}).click();

    // Verify we're logged in by checking for user information
    await expect(page.locator('h1')).toContainText('Hallo Serhii');
    await expect(page.locator('#main-content')).toContainText(process.env.EMAIL);
});
