const {test, expect} = require('./fixtures/fixtures');

test('Use ‘Search on map’ option and search the below, pass the data via file, use\n' +
    'dynamic data if possible.', async ({mapSearchPage, homePage}) => {
    await mapSearchPage.goto();
    await homePage.acceptCookies();

    await mapSearchPage.clickSearchField();
    await mapSearchPage.fillSearchField("Helmond");
    await mapSearchPage.clickSearchButton();
});