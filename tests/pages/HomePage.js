const BasePage = require('./BasePage');

class HomePage extends BasePage {
  constructor(page) {
    super(page);
    
    // Selectors
    this.acceptCookiesButton = this.getByRole('button', { name: 'Alles accepteren' });
    this.loginButton = this.getByRole('button', { name: 'Inloggen' });
  }

  /**
   * Navigate to the homepage
   * @returns {Promise<void>}
   */
  async goto() {
    return super.goto();
  }

  /**
   * Accept cookies
   * @returns {Promise<void>}
   */
  async acceptCookies() {
    return this.tryWithTimeout(
      () => this.acceptCookiesButton.click(),
      'Accept cookies'
    );
  }

  /**
   * Click the login button
   * @returns {Promise<void>}
   */
  async clickLogin() {
    return this.tryWithTimeout(
      () => this.loginButton.click(),
      'Click login button'
    );
  }
}

module.exports = HomePage;