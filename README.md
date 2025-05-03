# 2Solar QA Test

This repository contains automated tests for the 2Solar project.

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
   - Worker fixtures ensure the browser instance is shared across tests
   - Tests can directly access authenticated pages without explicit login steps

4. **Managing the saved state:**
   - To force a fresh login, delete the `auth-state.json` file from the project root
   - For CI environments, the authentication state is created for each workflow run
