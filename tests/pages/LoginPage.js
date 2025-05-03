const BasePage = require('./BasePage');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Selectors
    this.emailField = this.getByRole('textbox', { name: 'E-mailadres' });
    this.passwordField = this.getByRole('textbox', { name: 'Wachtwoord' });
    this.loginButton = this.getByRole('button', { name: 'Log in' });
  }

  /**
   * Fill in the email field
   * @param {string} email - The email to fill in
   * @returns {Promise<void>}
   */
  async fillEmail(email) {
    await this.tryWithTimeout(
      () => this.emailField.click(),
      'Click email field'
    );
    
    await this.tryWithTimeout(
      () => this.emailField.fill(email),
      'Fill email field'
    );
    
    return this.tryWithTimeout(
      () => this.emailField.press('Tab'),
      'Press Tab after email'
    );
  }

  /**
   * Fill in the password field
   * @param {string} password - The password to fill in
   * @returns {Promise<void>}
   */
  async fillPassword(password) {
    return this.tryWithTimeout(
      () => this.passwordField.fill(password),
      'Fill password field'
    );
  }

  /**
   * Click the login button
   * @returns {Promise<void>}
   */
  async clickLogin() {
    return this.tryWithTimeout(
      () => this.loginButton.click(),
      'Submit login form'
    );
  }

  /**
   * Login with the given credentials
   * @param {string} email - The email to login with
   * @param {string} password - The password to login with
   * @returns {Promise<void>}
   */
  async login(email, password) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    return this.clickLogin();
  }
}

module.exports = LoginPage;