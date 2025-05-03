# 2Solar QA Test

This repository contains automated tests for the 2Solar qa test assigment. 

Some notes on my observation: 
1. I was able to solve the captcha problem using AntiCaptcha browser implementation. It is needed at least once pass the captha, the the saved state will be reused
2. Some tests might fail, I haven't spent time polishing it to ideal. The goal was to cover all requirements

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   EMAIL=your_email@example.com
   PASSWORD=your_password
   ```

   Note: The `.env` file is excluded from version control to protect sensitive information.

## Using GitHub Secrets

For CI/CD pipelines, the sensitive information should be stored as GitHub secrets:

1. Go to your GitHub repository
2. Navigate to Settings > Secrets and variables > Actions
3. Add the following secrets:
   - `EMAIL`: Your login email
   - `PASSWORD`: Your login password

4. In your GitHub Actions workflow file, add the following environment variables:
   ```yaml
   env:
     EMAIL: ${{ secrets.EMAIL }}
     PASSWORD: ${{ secrets.PASSWORD }}
   ```

## Running Tests

Run the tests with:
```
npx playwright test
```

## Test Structure

The tests use a custom `AntiCaptchaBrowser` fixture to handle captchas and simulate human behavior automatically.

### Timeout Handling

The tests include a robust timeout handling mechanism that allows them to continue execution even if some operations fail with a timeout:

1. **How it works:**
   - A utility function `tryWithTimeout` wraps Playwright operations in try-catch blocks
   - If an operation times out or fails, the error is logged but the test continues
   - Each operation has a descriptive name for better error reporting
   - Default timeout is 30 seconds but can be customized per operation

2. **Benefits:**
   - Tests don't fail completely if a single operation times out
   - More operations can be attempted even after a timeout occurs
   - Better visibility into which specific operations are timing out
   - Improved test reliability in unstable environments

3. **Usage example:**
   ```javascript
   await tryWithTimeout(
     () => page.getByRole('button', {name: 'Submit'}).click(),
     'Click submit button',
     15000  // Custom timeout of 15 seconds
   );
   ```

### Browser Configuration

All tests run with the following configuration:
- Viewport size: 1920x1080 pixels
- Headed mode in local development, headless in CI environments
- Anti-captcha measures applied automatically

### Authentication State Persistence

The tests support saving and reusing authentication state between test runs:

1. **How it works:**
   - After a successful login, the browser's authentication state (cookies, localStorage) is saved to a file (`auth-state.json`)
   - Subsequent test runs can reuse this saved state to avoid logging in again
   - The login test automatically skips if a valid authentication state is already available

2. **Benefits:**
   - Faster test execution by avoiding repeated logins
   - Reduced risk of login failures due to captchas or rate limiting
   - More reliable tests by eliminating potential login-related flakiness

3. **Implementation:**
   - The `AntiCaptchaBrowser` class handles saving and loading the authentication state
   - A carefully structured fixture hierarchy ensures only one browser instance is created:
     - The `browser` fixture (worker scope) creates a single browser instance shared across all tests
     - The `browserContext` fixture (test scope) creates a context with the stored auth state
     - The default `page` fixture is overridden to use our context and apply anti-captcha measures
   - Tests can directly access authenticated pages without explicit login steps

4. **Managing the saved state:**
   - To force a fresh login, delete the `auth-state.json` file from the project root
   - For CI environments, the authentication state is created for each workflow run

### Page Object Model (POM)

The tests are structured using the Page Object Model pattern, which improves maintainability and reusability:

1. **How it works:**
   - Each page in the application is represented by a class that encapsulates the page's elements and actions
   - Tests interact with pages through these classes instead of directly with page elements
   - Common functionality is shared through a base page class that all page objects extend

2. **Benefits:**
   - Improved code organization and readability
   - Reduced duplication of selectors and actions
   - Easier maintenance when the UI changes
   - Better separation of concerns between test logic and page interactions

3. **Implementation:**
   - `BasePage`: Provides common functionality like navigation, element selection, and timeout handling
   - Page-specific classes:
     - `HomePage`: Handles interactions with the Funda homepage
     - `LoginPage`: Manages login form interactions
     - `AccountPage`: Handles account page interactions and verification
   - Playwright fixtures automatically create and provide page objects to tests

4. **Usage example:**
   ```javascript
   test('Login test', async ({homePage, loginPage, accountPage}) => {
     await homePage.goto();
     await homePage.acceptCookies();
     await homePage.clickLogin();
     await loginPage.login(process.env.EMAIL, process.env.PASSWORD);
     await accountPage.verifyLoggedIn('Username', process.env.EMAIL);
   });
   ```
