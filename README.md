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