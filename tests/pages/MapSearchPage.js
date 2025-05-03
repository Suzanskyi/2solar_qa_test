const BasePage = require('./BasePage');

class MapSearchPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Selectors for map search functionality
    this.searchInputClick = this.getByText('Zoek op plaats, buurt of')
    this.searchInput = this.getByRole('textbox', { name: 'Zoek op plaats, buurt of' })


  }

  /**
   * Navigate to the map search page
   * @returns {Promise<void>}
   */
  async goto() {
    return super.goto('zoeken/kaart/');
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



}

module.exports = MapSearchPage;