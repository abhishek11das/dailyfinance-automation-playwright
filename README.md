# DailyFinance_Playwright_Automation

### This is a complete project where a DailyFinance site is automated by writing test suites using Playwright as testing framework.
The following key modules/pages are automated:

* Register User implementing different Scenarios
* Log in as admin (pass admin credentials from the terminal) and check if the last registered user is displayed on the admin dashboard. 
* Log in with the last registered user and update their profile image.
* Then login with the user and add random 2 items and assert that 2 items are showing on the item list
* Then go to profile settings and upload a profile photo and logout

For failed test cases it will take a screenshot aswell at the point of failure.

### Module:

* Login (valid & invalid scenarios)
* Add Item (positive & negative scenarios)
* Profile Update (including profile image upload)

### Data Handling:

* Used JSON files to store test data
* Used Faker to generate random user data for testing.

### Automation Flow:

* Tests run sequentially: Register → Login → Add Item → Profile Update → Logout .
* Handled dynamic data (like last registered user) and verified results in the UI.

### Advanced Features:

* Verified toast messages, tooltips, and dynamic content.
* Managed tokens/session for login reuse across tests.
* Included API testing for some endpoints using Playwright’s request context.
* Screenshot & debugging on failure for better visibility

### Technology:

* Tool: Playwright
* IDE: VS Code
* Language: Javascript

### Prerequisite:
* Need to install Node.js v18+ and npm
* (Optional) Install Allure for test reporting
* Configure environment variables if using .env for URL, tokens, or credentials
* Clone this project from GitHub
* Open the project folder in VS Code or your preferred IDE
* Run npm install to install all project dependencies
* Run npx playwright install to install browsers required by Playwright
* Click on Terminal and run the automation scripts using:
 ```bash
  npx playwright test
```
### Run the Automation Script by the following command:
* Playwright will open the browser and start automating.
  
```bash
  npx playwright test
```

### After automation to view allure report , give the following commands:

```bash
npm install -g allure-commandline --save-dev
```
* Check Version:
```bash
allure --version
```
* Generate Allure Report:
```bash
allure generate allure-results --clean
```
* Open Allure Report:
```bash
allure open allure-report
```
* Serve Allure Report Without Generating:
```bash
allure serve allure-results
```


