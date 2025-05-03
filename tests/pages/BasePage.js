const { expect } = require('@playwright/test');

class BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.baseUrl = 'https://www.funda.nl';
  }

  /**
   * Navigate to a specific path
   * @param {string} path - The path to navigate to
   * @param {Object} options - Navigation options
   * @returns {Promise<void>}
   */
  async goto(path = '', options = { waitUntil: 'domcontentloaded' }) {
    const url = path ? `${this.baseUrl}/${path}` : this.baseUrl;
    return this.tryWithTimeout(
      () => this.page.goto(url, options),
      `Navigate to ${url}`
    );
  }

  /**
   * Try an action with a timeout and continue if it fails
   * @param {Function} action - The action to try
   * @param {string} description - Description of the action for logging
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Promise<any>} - The result of the action or null if it failed
   */
  async tryWithTimeout(action, description, timeout = 3000) {
    try {
      return await Promise.race([
        action(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error(`Timeout: ${description}`)), timeout)
        )
      ]);
    } catch (error) {
      console.error(`Error in "${description}": ${error.message}`);
      return null; // Return null to indicate the action failed but we're continuing
    }
  }

  /**
   * Wait for an element to be visible
   * @param {string} selector - The selector to wait for
   * @param {Object} options - Options for waiting
   * @returns {Promise<import('@playwright/test').Locator>}
   */
  async waitForSelector(selector, options = { timeout: 30000 }) {
    const result = await this.tryWithTimeout(
      () => this.page.waitForSelector(selector, options),
      `Wait for selector "${selector}"`
    );

    // If waitForSelector succeeded, return the locator, otherwise return null
    return result !== null ? this.page.locator(selector) : null;
  }

  /**
   * Get a locator for an element
   * @param {string} selector - The selector to get
   * @returns {import('@playwright/test').Locator}
   */
  locator(selector) {
    return this.page.locator(selector);
  }

  /**
   * Get a locator for an element by role
   * @param {string} role - The role to get
   * @param {Object} options - Options for the role
   * @returns {import('@playwright/test').Locator}
   */
  getByRole(role, options) {
    return this.page.getByRole(role, options);
  }

  /**
   * Get a locator for an element by text
   * @param {string} text - The text to get
   * @returns {import('@playwright/test').Locator}
   */
  getByText(text) {
    return this.page.getByText(text);
  }

  getByTestId(testId) {
    return this.page.getByTestId(testId);
  }


  /**
   * Press the Enter key
   * @returns {Promise<void>}
   */
  async pressEnter() {
    return this.tryWithTimeout(
        () => this.page.keyboard.press('Enter'),
        'Press Enter key'
    );
  }

  /**
   * Expect a condition to be true
   * @param {import('@playwright/test').Locator} locator - The locator to check
   * @returns {import('@playwright/test').Expect}
   */
  expect(locator) {
    return expect(locator);
  }
}

module.exports = BasePage;
