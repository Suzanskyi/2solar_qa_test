const BasePage = require('./BasePage');

class AccountPage extends BasePage {
  constructor(page) {
    super(page);

    // Selectors
    this.accountMenuButton = this.locator('#headlessui-menu-button-v-0-34');
    this.myAccountMenuItem = this.getByRole('menuitem', { name: 'Mijn account' });
    this.welcomeHeader = this.locator('h1');
    this.accountContent = this.locator('#main-content');
  }

  /**
   * Navigate to the account page
   * @returns {Promise<void>}
   */
  async goto() {
    return super.goto('account');
  }

  /**
   * Navigate to the account page through the menu
   * @returns {Promise<void>}
   */
  async navigateViaMenu() {
    await this.tryWithTimeout(
      () => this.accountMenuButton.click(),
      'Click account menu button'
    );

    return this.tryWithTimeout(
      () => this.myAccountMenuItem.click(),
      'Click My Account menu item'
    );
  }

  /**
   * Verify that the user is logged in
   * @param {string} name - The expected name in the welcome message
   * @param {string} email - The expected email in the account content
   * @returns {Promise<boolean>} - True if verification passed, false otherwise
   */
  async verifyLoggedIn(name, email) {
    // Check for welcome header with name
    const welcomeResult = await this.tryWithTimeout(
      async () => {
        await this.expect(this.welcomeHeader).toContainText(`Hallo ${name}`);
        return true;
      },
      `Verify welcome header contains "Hallo ${name}"`
    );

    // Check for email in account content
    const emailResult = await this.tryWithTimeout(
      async () => {
        await this.expect(this.accountContent).toContainText(email);
        return true;
      },
      `Verify account content contains "${email}"`
    );

    // Both checks must pass for verification to be successful
    const isVerified = welcomeResult && emailResult;

    if (isVerified) {
      console.log('Authentication verification successful');
    } else {
      console.log('Authentication verification failed, but continuing test');
    }

    return isVerified;
  }
}

module.exports = AccountPage;
