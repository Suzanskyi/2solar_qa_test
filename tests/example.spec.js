const {test: baseTest, expect} = require('@playwright/test');
const AntiCaptchaBrowser = require('./utils/AntiCaptchaBrowser');

// Define a fixture for AntiCaptchaBrowser
const test = baseTest.extend({
    antiCaptchaBrowser: async ({page}, use) => {
        const antiCaptchaBrowser = new AntiCaptchaBrowser();
        await antiCaptchaBrowser.setupAntiCaptchaScripts(page);
        await antiCaptchaBrowser.simulateHumanBehavior(page);
        await use(antiCaptchaBrowser);
    }
});

test('Funda homepage should load and display search form', async ({page}) => {
    await page.goto('https://www.funda.nl', {waitUntil: 'domcontentloaded'});
});


test('Login test', async ({page, }) => {
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
});
