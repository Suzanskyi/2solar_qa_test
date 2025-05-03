const BasePage = require('./BasePage');
const addressData = require('../data/addresses.json');

class MapSearchPage extends BasePage {
    constructor(page) {
        super(page);

        // Selectors for map search functionality
        this.searchInputClick = this.getByText('Zoek op plaats, buurt of')
        this.searchInput = this.getByRole('textbox', {name: 'Zoek op plaats, buurt of'})
        this.firstImage = this.locator('img').first();
        this.allImages = this.locator('img');
        this.listViewButton = this.getByRole('button', { name: 'Lijst' });

        // Selectors for property search results
        this.undefinedMainImage = this.getByRole('link', { name: 'undefined main image' }).first();
        this.propertyLink1 = this.getByRole('link', { name: addressData.properties[0].address });
        this.propertyLink2 = this.getByRole('link', { name: addressData.properties[1].address });

        // Selectors for filters
        this.filtersButton = this.getByRole('button', { name: 'Filters' });
        this.priceMinSelect = this.locator('[data-test-id="price-filter"] [data-test-id="minmax-filter-min"] [data-test-id="ui-select"]');
        this.priceMaxSelect = this.locator('[data-test-id="price-filter"] [data-test-id="minmax-filter-max"] [data-test-id="ui-select"]');
        this.livingAreaMinSelect = this.locator('[data-test-id="floor-area-filter"] [data-test-id="minmax-filter-min"] [data-test-id="ui-select"]');
        this.livingAreaMaxSelect = this.locator('[data-test-id="floor-area-filter"] [data-test-id="minmax-filter-max"] [data-test-id="ui-select"]');
        this.keywordInput = this.getByRole('textbox', { name: 'Bijv. warmtepomp' });
        this.addKeywordButton = this.getByRole('button', { name: 'Voeg toe' });
        this.showResultsButton = this.locator('[data-test-id="show-results"]');
        this.searchResults = this.locator('[data-test-id="search-results"]');
    }

    /**
     * Navigate to the map search page
     * @returns {Promise<void>}
     */
    async goto() {
        return super.goto('zoeken/kaart/');
    }

    /**
     * Navigate to a specific property detail page with map view
     * @param {string} path - The path to the property detail page with map view
     * @returns {Promise<void>}
     */
    async gotoPropertyDetailMap(path) {
        return super.goto(path);
    }

    /**
     * Check if the first image element is visible
     * @returns {Promise<boolean>} - True if the first image is visible, false otherwise
     */
    async checkFirstImage() {
        return this.tryWithTimeout(
            async () => {
                const isVisible = await this.firstImage.isEnabled();
                console.log(`First image is ${isVisible ? 'visible' : 'not visible'}`);
                return isVisible;
            },
            'Check if first image is visible',
            10000
        );
    }

    /**
     * Search for a location on the map
     * @param {string} location - The location to search for
     * @returns {Promise<void>}
     */
    async clickSearchField() {
        await this.tryWithTimeout(
            () => this.searchInputClick.click(),
            `Clicked search field"`
        );
    }

    async fillSearchField(location) {
        await this.tryWithTimeout(
            () => this.searchInput.fill(location),
            `entered location "${location}"`
        );
    }

    async clickSearchButton() {
        await this.tryWithTimeout(
            () => this.searchInput.press('Enter'),
            `clicked search button`
        );
    }

    /**
     * Navigate to a specific search results page
     * @param {string} url - The full URL to navigate to
     * @returns {Promise<void>}
     */
    async gotoSearchResults(url) {
        return this.tryWithTimeout(
            () => this.page.goto(url),
            `Navigate to search results page: ${url}`
        );
    }

    /**
     * Check if the undefined main image link is visible
     * @returns {Promise<boolean>} - True if the link is visible, false otherwise
     */
    async checkUndefinedMainImage() {
        return this.tryWithTimeout(
            async () => {
                const isVisible = await this.undefinedMainImage.isVisible();
                console.log(`Undefined main image link is ${isVisible ? 'visible' : 'not visible'}`);
                return isVisible;
            },
            'Check if undefined main image link is visible',
            10000
        );
    }

    /**
     * Check if the property link 1 is visible
     * @returns {Promise<boolean>} - True if the link is visible, false otherwise
     */
    async checkPropertyLink1() {
        return this.tryWithTimeout(
            async () => {
                const isVisible = await this.propertyLink1.isVisible();
                console.log(`Property link 1 is ${isVisible ? 'visible' : 'not visible'}`);
                return isVisible;
            },
            'Check if property link 1 is visible',
            10000
        );
    }

    /**
     * Check if the property link 2 is visible
     * @returns {Promise<boolean>} - True if the link is visible, false otherwise
     */
    async checkPropertyLink2() {
        return this.tryWithTimeout(
            async () => {
                const isVisible = await this.propertyLink2.isVisible();
                console.log(`Property link 2 is ${isVisible ? 'visible' : 'not visible'}`);
                return isVisible;
            },
            'Check if property link 2 is visible',
            10000
        );
    }

    /**
     * Navigate to the map search page with postcode filter
     * @returns {Promise<void>}
     */
    async gotoMapSearchWithPostcode() {
        return this.tryWithTimeout(
            () => this.page.goto('https://www.funda.nl/zoeken/kaart/koop?selected_area=%5B%225701nr%22%5D'),
            'Navigate to map search page with postcode filter'
        );
    }

    /**
     * Count all image elements on the page
     * @returns {Promise<number>} - The number of image elements
     */
    async countAllImages() {
        return this.tryWithTimeout(
            async () => {
                const count = await this.allImages.count();
                console.log(`Found ${count} image elements on the page`);
                return count;
            },
            'Count all image elements',
            10000
        );
    }

    /**
     * Click the "Lijst" button to switch to list view
     * @returns {Promise<void>}
     */
    async clickListViewButton() {
        return this.tryWithTimeout(
            () => this.listViewButton.click(),
            'Click list view button',
            10000
        );
    }

    /**
     * Click the Filters button
     * @returns {Promise<void>}
     */
    async clickFiltersButton() {
        return this.tryWithTimeout(
            () => this.filtersButton.click(),
            'Click filters button'
        );
    }

    /**
     * Set the price range filter
     * @param {string} minPrice - Minimum price
     * @param {string} maxPrice - Maximum price
     * @returns {Promise<void>}
     */
    async setPriceRange(minPrice, maxPrice) {
        await this.tryWithTimeout(
            () => this.priceMinSelect.selectOption(minPrice),
            `Set minimum price to ${minPrice}`
        );
        await this.tryWithTimeout(
            () => this.priceMaxSelect.selectOption(maxPrice),
            `Set maximum price to ${maxPrice}`
        );
    }

    /**
     * Set the living area range filter
     * @param {string} minArea - Minimum living area
     * @param {string} maxArea - Maximum living area
     * @returns {Promise<void>}
     */
    async setLivingAreaRange(minArea, maxArea) {
        await this.tryWithTimeout(
            () => this.livingAreaMinSelect.selectOption(minArea),
            `Set minimum living area to ${minArea}`
        );
        await this.tryWithTimeout(
            () => this.livingAreaMaxSelect.selectOption(maxArea),
            `Set maximum living area to ${maxArea}`
        );
    }

    /**
     * Add a keyword to the search
     * @param {string} keyword - The keyword to add
     * @returns {Promise<void>}
     */
    async addKeyword(keyword) {
        await this.tryWithTimeout(
            () => this.keywordInput.click(),
            'Click keyword input'
        );
        await this.tryWithTimeout(
            () => this.keywordInput.fill(keyword),
            `Fill keyword with ${keyword}`
        );
        await this.tryWithTimeout(
            () => this.addKeywordButton.click(),
            'Click add keyword button'
        );
    }

    /**
     * Click the show results button
     * @returns {Promise<void>}
     */
    async showResults() {
        return this.tryWithTimeout(
            () => this.showResultsButton.click(),
            'Click show results button'
        );
    }

    /**
     * Check if search results are displayed
     * @returns {Promise<boolean>} - True if results are visible, false otherwise
     */
    async hasSearchResults() {
        return this.tryWithTimeout(
            async () => {
                const isVisible = await this.searchResults.isEnabled();
                console.log(`Search results are ${isVisible ? 'visible' : 'not visible'}`);
                return isVisible;
            },
            'Check if search results are visible',
            10000
        );
    }
}

module.exports = MapSearchPage;
