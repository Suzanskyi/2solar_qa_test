const { test, expect } = require('./fixtures/fixtures');

test('Funda homepage should load and display search form', async ({homePage}) => {
    await homePage.goto();
});


test('Login test and save state', async ({homePage, loginPage, accountPage, browserContext, antiCaptchaBrowser}) => {
    // Skip if we already have a stored auth state
    if (antiCaptchaBrowser.hasStoredAuthState()) {
        console.log('Using stored authentication state. Skipping login.');
        test.skip();
        return;
    }

    await homePage.goto();

    await homePage.acceptCookies();
    await homePage.clickLogin();

    await loginPage.login(process.env.EMAIL, process.env.PASSWORD);

    await accountPage.navigateViaMenu();

    await accountPage.verifyLoggedIn('Serhii', process.env.EMAIL);

    // Save the authentication state for future tests
    try {
        await antiCaptchaBrowser.saveAuthState(browserContext);
        console.log('Authentication state saved successfully.');
    } catch (error) {
        console.error(`Failed to save authentication state: ${error.message}`);
    }
});

test('Access authenticated page using stored state', async ({accountPage}) => {
    await accountPage.goto();

    await accountPage.verifyLoggedIn('Serhii', process.env.EMAIL);
});