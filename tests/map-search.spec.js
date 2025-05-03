const {test, expect} = require('./fixtures/fixtures');
const addressData = require('./data/addresses.json');

test('Use ‘Search on map’ option and search the below test', async ({mapSearchPage}) => {
    await mapSearchPage.goto();
    await mapSearchPage.clickSearchField();
    await mapSearchPage.fillSearchField("Helmond");
    await mapSearchPage.clickSearchButton();
});

test('Open property detail page with map view and check for first image test', async ({mapSearchPage, page}) => {
    // Navigate to the specific property detail page with map view
    await mapSearchPage.gotoPropertyDetailMap('detail/koop/afferden-ge/bouwgrond-koningstraat/89045139/kaart/');

    // Check if the first image element is visible
    const isImageVisible = await mapSearchPage.checkFirstImage();

    expect(isImageVisible).toBeTruthy();
});

test('Check property listings on Kasteel-Traverse search results test', async ({mapSearchPage, homePage}) => {
    await mapSearchPage.gotoSearchResults(addressData.searchUrls.byStreet);

    await homePage.acceptCookies();

    const isUndefinedMainImageVisible = await mapSearchPage.checkUndefinedMainImage();
    expect(isUndefinedMainImageVisible).toBeTruthy();

    const isPropertyLink1Visible = await mapSearchPage.checkPropertyLink1();
    expect(isPropertyLink1Visible).toBeTruthy();

    const isPropertyLink2Visible = await mapSearchPage.checkPropertyLink2();
    expect(isPropertyLink2Visible).toBeTruthy();
});

test('Check property listings by postcode 5701nr test', async ({mapSearchPage, homePage}) => {
    await mapSearchPage.gotoSearchResults(addressData.searchUrls.byPostcode);

    // Accept cookies if needed
    await homePage.acceptCookies();

    // Check if the property links are visible
    const isPropertyLink1Visible = await mapSearchPage.checkPropertyLink1();
    expect(isPropertyLink1Visible).toBeTruthy();

    const isPropertyLink2Visible = await mapSearchPage.checkPropertyLink2();
    expect(isPropertyLink2Visible).toBeTruthy();
});

test('Compare image count between map view and list view test', async ({mapSearchPage, homePage}) => {
    await mapSearchPage.gotoMapSearchWithPostcode();

    await homePage.acceptCookies();

    const mapViewImageCount = await mapSearchPage.countAllImages();
    console.log(`Number of images in map view: ${mapViewImageCount}`);

    await mapSearchPage.clickListViewButton();


    const listViewImageCount = await mapSearchPage.countAllImages();
    console.log(`Number of images in list view: ${listViewImageCount}`);

    expect(listViewImageCount).toEqual(mapViewImageCount);
});

test('Check filters Price, Living area, keyword test', async ({mapSearchPage, homePage}) => {
    await mapSearchPage.goto();

    await mapSearchPage.clickFiltersButton();
    
    await mapSearchPage.setPriceRange('400000', '5000000');
    
    await mapSearchPage.setLivingAreaRange('100', '250');
    
    await mapSearchPage.addKeyword('Serhii keyword');
    
    // Show results
    await mapSearchPage.showResults();
    
    // Verify that results are displayed
    const hasResults = await mapSearchPage.hasSearchResults();
    expect(hasResults).toBeTruthy();
});